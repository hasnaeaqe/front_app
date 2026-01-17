package com.cabinet.medical.service;

import com.cabinet.medical.dto.NotificationDTO;
import com.cabinet.medical.dto.PatientEnCoursDTO;
import com.cabinet.medical.entity.Notification;
import com.cabinet.medical.entity.Patient;
import com.cabinet.medical.entity.Utilisateur;
import com.cabinet.medical.exception.ResourceNotFoundException;
import com.cabinet.medical.repository.NotificationRepository;
import com.cabinet.medical.repository.PatientRepository;
import com.cabinet.medical.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final PatientRepository patientRepository;
    private final UtilisateurRepository utilisateurRepository;

    /**
     * Envoyer un patient au médecin (secrétaire -> médecin)
     */
    public void sendPatientToMedecin(Long patientId, Long medecinId) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'ID: " + patientId));
        
        Utilisateur medecin = utilisateurRepository.findById(medecinId)
            .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'ID: " + medecinId));
        
        // Supprimer les anciennes notifications du même type
        notificationRepository.deleteByDestinataireIdAndType(medecinId, Notification.Type.INFO);
        
        // Créer la nouvelle notification
        Notification notification = new Notification();
        notification.setTitre("Patient en attente");
        notification.setMessage(patient.getNom() + " " + patient.getPrenom() + " (CIN: " + patient.getCin() + ") est en attente de consultation.");
        notification.setType(Notification.Type.INFO);
        notification.setDestinataire(medecin);
        notification.setLu(false);
        
        notificationRepository.save(notification);
    }

    /**
     * Récupérer le patient en cours pour un médecin
     */
    @Transactional(readOnly = true)
    public PatientEnCoursDTO getPatientEnCours(Long medecinId) {
        return notificationRepository.findFirstByDestinataireIdAndTypeOrderByDateCreationDesc(medecinId, Notification.Type.INFO)
            .map(notification -> {
                // Extraire l'ID du patient du message (format: "Nom Prenom (CIN: xxx)")
                String message = notification.getMessage();
                String cin = extractCinFromMessage(message);
                
                if (cin != null) {
                    return patientRepository.findByCin(cin)
                        .map(patient -> new PatientEnCoursDTO(
                            patient.getId(),
                            patient.getNom(),
                            patient.getPrenom(),
                            patient.getCin(),
                            notification.getId(),
                            notification.getDateCreation()
                        ))
                        .orElse(null);
                }
                return null;
            })
            .orElse(null);
    }

    /**
     * Supprimer la notification de patient en cours
     */
    public void clearPatientEnCours(Long medecinId) {
        notificationRepository.deleteByDestinataireIdAndType(medecinId, Notification.Type.INFO);
    }

    /**
     * Get unread notifications for a user
     */
    @Transactional(readOnly = true)
    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        return notificationRepository.findByDestinataireIdAndLuFalseOrderByDateCreationDesc(userId)
            .stream()
            .map(NotificationDTO::fromEntity)
            .collect(Collectors.toList());
    }

    /**
     * Get all notifications for a user
     */
    @Transactional(readOnly = true)
    public List<NotificationDTO> getAllNotifications(Long userId) {
        return notificationRepository.findByDestinataireIdOrderByDateCreationDesc(userId)
            .stream()
            .map(NotificationDTO::fromEntity)
            .collect(Collectors.toList());
    }

    private String extractCinFromMessage(String message) {
        try {
            int cinStart = message.indexOf("CIN: ") + 5;
            int cinEnd = message.indexOf(")", cinStart);
            return message.substring(cinStart, cinEnd);
        } catch (Exception e) {
            return null;
        }
    }
}
