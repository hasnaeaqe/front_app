package com.cabinet.medical.service;

import com.cabinet.medical.dto.ConsultationDTO;
import com.cabinet.medical.dto.request.ConsultationRequest;
import com.cabinet.medical.entity.Consultation;
import com.cabinet.medical.entity.Patient;
import com.cabinet.medical.entity.RendezVous;
import com.cabinet.medical.entity.Utilisateur;
import com.cabinet.medical.exception.ResourceNotFoundException;
import com.cabinet.medical.repository.ConsultationRepository;
import com.cabinet.medical.repository.PatientRepository;
import com.cabinet.medical.repository.RendezVousRepository;
import com.cabinet.medical.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final PatientRepository patientRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final RendezVousRepository rendezVousRepository;

    public List<Consultation> findAll() {
        return consultationRepository.findAll();
    }

    public Consultation findById(Long id) {
        return consultationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consultation non trouvée avec l'id: " + id));
    }

    @Transactional
    public Consultation create(ConsultationRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'id: " + request.getPatientId()));

        Utilisateur medecin = utilisateurRepository.findById(request.getMedecinId())
                .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'id: " + request.getMedecinId()));

        Consultation consultation = new Consultation();
        consultation.setPatient(patient);
        consultation.setMedecin(medecin);
        consultation.setDiagnostic(request.getDiagnostic());
        consultation.setTraitement(request.getTraitement());
        consultation.setObservations(request.getObservations());
        consultation.setDuree(request.getDuree());

        if (request.getRendezVousId() != null) {
            RendezVous rendezVous = rendezVousRepository.findById(request.getRendezVousId())
                    .orElseThrow(() -> new ResourceNotFoundException("Rendez-vous non trouvé avec l'id: " + request.getRendezVousId()));
            consultation.setRendezVous(rendezVous);
        }

        return consultationRepository.save(consultation);
    }

    public List<Consultation> findByPatient(Long patientId) {
        return consultationRepository.findByPatientIdOrderByDateConsultationDesc(patientId);
    }
    
    /**
     * New methods for Medecin module
     */
    public List<ConsultationDTO> findByPatientAsDTO(Long patientId) {
        return consultationRepository.findByPatientIdOrderByDateConsultationDesc(patientId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public List<ConsultationDTO> findByMedecinToday(Long medecinId) {
        return consultationRepository.findByMedecinId(medecinId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public ConsultationDTO convertToDTO(Consultation consultation) {
        return new ConsultationDTO(
            consultation.getId(),
            consultation.getPatient().getId(),
            consultation.getPatient().getNom(),
            consultation.getPatient().getPrenom(),
            consultation.getMedecin().getId(),
            consultation.getMedecin().getNom(),
            consultation.getMedecin().getPrenom(),
            consultation.getDiagnostic(),
            consultation.getTraitement(),
            consultation.getObservations(),
            consultation.getDateConsultation(),
            consultation.getDuree()
        );
    }
}
