package com.cabinet.medical.service;

import com.cabinet.medical.dto.DossierMedicalDTO;
import com.cabinet.medical.entity.DossierMedical;
import com.cabinet.medical.entity.Patient;
import com.cabinet.medical.entity.Utilisateur;
import com.cabinet.medical.exception.ResourceNotFoundException;
import com.cabinet.medical.repository.DossierMedicalRepository;
import com.cabinet.medical.repository.PatientRepository;
import com.cabinet.medical.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DossierMedicalService {

    private final DossierMedicalRepository dossierMedicalRepository;
    private final PatientRepository patientRepository;
    private final UtilisateurRepository utilisateurRepository;

    /**
     * Récupérer le dossier médical d'un patient
     */
    @Transactional(readOnly = true)
    public DossierMedicalDTO getDossierMedicalByPatientId(Long patientId) {
        DossierMedical dossier = dossierMedicalRepository.findByPatientId(patientId)
            .orElse(null);
        
        return dossier != null ? convertToDTO(dossier) : null;
    }

    /**
     * Créer un nouveau dossier médical
     */
    public DossierMedicalDTO createDossierMedical(Long patientId, Long medecinId, DossierMedicalDTO dossierDTO) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'ID: " + patientId));
        
        Utilisateur medecin = utilisateurRepository.findById(medecinId)
            .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'ID: " + medecinId));
        
        DossierMedical dossier = new DossierMedical();
        dossier.setPatient(patient);
        dossier.setMedecin(medecin);
        dossier.setDiagnostic(dossierDTO.getDiagnostic());
        dossier.setTraitement(dossierDTO.getTraitement());
        dossier.setObservations(dossierDTO.getObservations());
        dossier.setAntMedicaux(dossierDTO.getAntMedicaux());
        dossier.setAntChirurgicaux(dossierDTO.getAntChirurgicaux());
        dossier.setAllergies(dossierDTO.getAllergies());
        dossier.setHabitudes(dossierDTO.getHabitudes());
        
        DossierMedical savedDossier = dossierMedicalRepository.save(dossier);
        return convertToDTO(savedDossier);
    }

    /**
     * Mettre à jour un dossier médical existant
     */
    public DossierMedicalDTO updateDossierMedical(Long dossierId, DossierMedicalDTO dossierDTO) {
        DossierMedical dossier = dossierMedicalRepository.findById(dossierId)
            .orElseThrow(() -> new ResourceNotFoundException("Dossier médical non trouvé avec l'ID: " + dossierId));
        
        dossier.setDiagnostic(dossierDTO.getDiagnostic());
        dossier.setTraitement(dossierDTO.getTraitement());
        dossier.setObservations(dossierDTO.getObservations());
        dossier.setAntMedicaux(dossierDTO.getAntMedicaux());
        dossier.setAntChirurgicaux(dossierDTO.getAntChirurgicaux());
        dossier.setAllergies(dossierDTO.getAllergies());
        dossier.setHabitudes(dossierDTO.getHabitudes());
        
        DossierMedical updatedDossier = dossierMedicalRepository.save(dossier);
        return convertToDTO(updatedDossier);
    }

    private DossierMedicalDTO convertToDTO(DossierMedical dossier) {
        return new DossierMedicalDTO(
            dossier.getId(),
            dossier.getPatient().getId(),
            dossier.getMedecin().getId(),
            dossier.getMedecin().getNom(),
            dossier.getMedecin().getPrenom(),
            dossier.getDiagnostic(),
            dossier.getTraitement(),
            dossier.getObservations(),
            dossier.getAntMedicaux(),
            dossier.getAntChirurgicaux(),
            dossier.getAllergies(),
            dossier.getHabitudes(),
            dossier.getDateCreation(),
            dossier.getDateModification()
        );
    }
}
