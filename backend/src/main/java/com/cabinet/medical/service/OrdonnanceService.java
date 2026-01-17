package com.cabinet.medical.service;

import com.cabinet.medical.dto.OrdonnanceDTO;
import com.cabinet.medical.dto.OrdonnanceMedicamentDTO;
import com.cabinet.medical.dto.request.OrdonnanceMedicamentRequest;
import com.cabinet.medical.dto.request.OrdonnanceRequest;
import com.cabinet.medical.entity.*;
import com.cabinet.medical.exception.ResourceNotFoundException;
import com.cabinet.medical.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrdonnanceService {

    private final OrdonnanceRepository ordonnanceRepository;
    private final PatientRepository patientRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ConsultationRepository consultationRepository;
    private final MedicamentRepository medicamentRepository;
    private final OrdonnanceMedicamentRepository ordonnanceMedicamentRepository;

    public List<Ordonnance> findAll() {
        return ordonnanceRepository.findAll();
    }

    public Ordonnance findById(Long id) {
        return ordonnanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ordonnance non trouvée avec l'id: " + id));
    }

    @Transactional
    public Ordonnance create(OrdonnanceRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'id: " + request.getPatientId()));

        Utilisateur medecin = utilisateurRepository.findById(request.getMedecinId())
                .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'id: " + request.getMedecinId()));

        Ordonnance ordonnance = new Ordonnance();
        ordonnance.setPatient(patient);
        ordonnance.setMedecin(medecin);
        ordonnance.setInstructions(request.getInstructions());
        ordonnance.setValideJusquA(request.getValideJusquA());

        if (request.getConsultationId() != null) {
            Consultation consultation = consultationRepository.findById(request.getConsultationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Consultation non trouvée avec l'id: " + request.getConsultationId()));
            ordonnance.setConsultation(consultation);
        }

        Ordonnance savedOrdonnance = ordonnanceRepository.save(ordonnance);

        // TODO: Consider using saveAll() for batch insert optimization for large medication lists
        for (OrdonnanceMedicamentRequest medicamentRequest : request.getMedicaments()) {
            Medicament medicament = medicamentRepository.findById(medicamentRequest.getMedicamentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Médicament non trouvé avec l'id: " + medicamentRequest.getMedicamentId()));

            OrdonnanceMedicament ordonnanceMedicament = new OrdonnanceMedicament();
            ordonnanceMedicament.setOrdonnance(savedOrdonnance);
            ordonnanceMedicament.setMedicament(medicament);
            ordonnanceMedicament.setPosologie(medicamentRequest.getPosologie());
            ordonnanceMedicament.setDuree(medicamentRequest.getDuree());
            ordonnanceMedicament.setQuantite(medicamentRequest.getQuantite());

            ordonnanceMedicamentRepository.save(ordonnanceMedicament);
        }

        return savedOrdonnance;
    }

    public List<Ordonnance> findByPatient(Long patientId) {
        return ordonnanceRepository.findByPatientId(patientId);
    }
    
    /**
     * New methods for Medecin module
     */
    public List<OrdonnanceDTO> findByPatientAsDTO(Long patientId) {
        return ordonnanceRepository.findByPatientIdOrderByDateCreationDesc(patientId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public OrdonnanceDTO getOrdonnanceWithMedicaments(Long ordonnanceId) {
        Ordonnance ordonnance = findById(ordonnanceId);
        return convertToDTO(ordonnance);
    }
    
    private OrdonnanceDTO convertToDTO(Ordonnance ordonnance) {
        // Get medicaments for this ordonnance
        List<OrdonnanceMedicamentDTO> medicaments = ordonnanceMedicamentRepository
            .findByOrdonnanceId(ordonnance.getId())
            .stream()
            .map(om -> new OrdonnanceMedicamentDTO(
                om.getId(),
                om.getMedicament().getNom(),
                om.getPosologie(),
                om.getMedicament().getForme(), // Using forme as frequence
                om.getDuree(),
                null // instructions - not available in entity
            ))
            .collect(Collectors.toList());
        
        return new OrdonnanceDTO(
            ordonnance.getId(),
            ordonnance.getConsultation() != null ? ordonnance.getConsultation().getId() : null,
            ordonnance.getPatient().getId(),
            ordonnance.getPatient().getNom(),
            ordonnance.getPatient().getPrenom(),
            ordonnance.getMedecin().getId(),
            ordonnance.getMedecin().getNom(),
            ordonnance.getMedecin().getPrenom(),
            ordonnance.getInstructions(),
            ordonnance.getDateCreation(),
            ordonnance.getValideJusquA(),
            medicaments
        );
    }
}
