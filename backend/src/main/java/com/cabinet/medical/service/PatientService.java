package com.cabinet.medical.service;

import com.cabinet.medical.dto.PatientProfilCompletDTO;
import com.cabinet.medical.dto.request.PatientRequest;
import com.cabinet.medical.entity.Patient;
import com.cabinet.medical.exception.DuplicateResourceException;
import com.cabinet.medical.exception.ResourceNotFoundException;
import com.cabinet.medical.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PatientService {

    private final PatientRepository patientRepository;
    private final DossierMedicalService dossierMedicalService;
    private final ConsultationService consultationService;
    private final OrdonnanceService ordonnanceService;

    public List<Patient> findAll() {
        return patientRepository.findAll();
    }

    public Patient findById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'id: " + id));
    }

    @Transactional
    public Patient create(PatientRequest request) {
        if (patientRepository.findByCin(request.getCin()).isPresent()) {
            throw new DuplicateResourceException("Un patient avec ce CIN existe déjà");
        }

        Patient patient = new Patient();
        patient.setCin(request.getCin());
        patient.setNom(request.getNom());
        patient.setPrenom(request.getPrenom());
        patient.setDateNaissance(request.getDateNaissance());
        patient.setSexe(request.getSexe());
        patient.setNumTel(request.getNumTel());
        patient.setEmail(request.getEmail());
        patient.setAdresse(request.getAdresse());
        patient.setTypeMutuelle(request.getTypeMutuelle());

        return patientRepository.save(patient);
    }

    @Transactional
    public Patient update(Long id, PatientRequest request) {
        Patient patient = findById(id);

        if (!patient.getCin().equals(request.getCin()) && 
            patientRepository.findByCin(request.getCin()).isPresent()) {
            throw new DuplicateResourceException("Un patient avec ce CIN existe déjà");
        }

        patient.setCin(request.getCin());
        patient.setNom(request.getNom());
        patient.setPrenom(request.getPrenom());
        patient.setDateNaissance(request.getDateNaissance());
        patient.setSexe(request.getSexe());
        patient.setNumTel(request.getNumTel());
        patient.setEmail(request.getEmail());
        patient.setAdresse(request.getAdresse());
        patient.setTypeMutuelle(request.getTypeMutuelle());

        return patientRepository.save(patient);
    }

    @Transactional
    public void delete(Long id) {
        Patient patient = findById(id);
        patientRepository.delete(patient);
    }

    public List<Patient> search(String query) {
        return patientRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(query, query);
    }
    
    /**
     * New methods for Medecin module
     */
    public List<Patient> searchByNom(String nom) {
        return patientRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(nom, nom);
    }
    
    public Patient searchByCin(String cin) {
        return patientRepository.findByCin(cin)
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec le CIN: " + cin));
    }
    
    public PatientProfilCompletDTO getProfilComplet(Long patientId) {
        Patient patient = findById(patientId);
        
        PatientProfilCompletDTO dto = new PatientProfilCompletDTO();
        dto.setId(patient.getId());
        dto.setCin(patient.getCin());
        dto.setNom(patient.getNom());
        dto.setPrenom(patient.getPrenom());
        dto.setDateNaissance(patient.getDateNaissance());
        dto.setSexe(patient.getSexe());
        dto.setNumTel(patient.getNumTel());
        dto.setEmail(patient.getEmail());
        dto.setAdresse(patient.getAdresse());
        dto.setTypeMutuelle(patient.getTypeMutuelle());
        
        // Get dossier medical
        dto.setDossierMedical(dossierMedicalService.getDossierMedicalByPatientId(patientId));
        
        // Get consultations
        dto.setConsultations(consultationService.findByPatientAsDTO(patientId));
        
        // Get ordonnances
        dto.setOrdonnances(ordonnanceService.findByPatientAsDTO(patientId));
        
        return dto;
    }
}
