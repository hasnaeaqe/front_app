package com.cabinet.medical.service;

import com.cabinet.medical.dto.request.OrdonnanceMedicamentRequest;
import com.cabinet.medical.dto.request.OrdonnanceRequest;
import com.cabinet.medical.entity.*;
import com.cabinet.medical.exception.ResourceNotFoundException;
import com.cabinet.medical.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
}
