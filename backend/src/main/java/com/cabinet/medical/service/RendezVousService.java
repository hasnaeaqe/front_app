package com.cabinet.medical.service;

import com.cabinet.medical.dto.request.RendezVousRequest;
import com.cabinet.medical.entity.Patient;
import com.cabinet.medical.entity.RendezVous;
import com.cabinet.medical.entity.Utilisateur;
import com.cabinet.medical.exception.ResourceNotFoundException;
import com.cabinet.medical.repository.PatientRepository;
import com.cabinet.medical.repository.RendezVousRepository;
import com.cabinet.medical.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RendezVousService {

    private final RendezVousRepository rendezVousRepository;
    private final PatientRepository patientRepository;
    private final UtilisateurRepository utilisateurRepository;

    public List<RendezVous> findAll() {
        return rendezVousRepository.findAll();
    }

    public RendezVous findById(Long id) {
        return rendezVousRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rendez-vous non trouvé avec l'id: " + id));
    }

    @Transactional
    public RendezVous create(RendezVousRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'id: " + request.getPatientId()));

        Utilisateur medecin = utilisateurRepository.findById(request.getMedecinId())
                .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'id: " + request.getMedecinId()));

        RendezVous rendezVous = new RendezVous();
        rendezVous.setPatient(patient);
        rendezVous.setMedecin(medecin);
        rendezVous.setDateRdv(request.getDateRdv());
        rendezVous.setHeureRdv(request.getHeureRdv());
        rendezVous.setMotif(request.getMotif());
        rendezVous.setNotes(request.getNotes());

        if (request.getStatut() != null) {
            rendezVous.setStatut(RendezVous.Statut.valueOf(request.getStatut()));
        }

        return rendezVousRepository.save(rendezVous);
    }

    @Transactional
    public RendezVous update(Long id, RendezVousRequest request) {
        RendezVous rendezVous = findById(id);

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'id: " + request.getPatientId()));

        Utilisateur medecin = utilisateurRepository.findById(request.getMedecinId())
                .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'id: " + request.getMedecinId()));

        rendezVous.setPatient(patient);
        rendezVous.setMedecin(medecin);
        rendezVous.setDateRdv(request.getDateRdv());
        rendezVous.setHeureRdv(request.getHeureRdv());
        rendezVous.setMotif(request.getMotif());
        rendezVous.setNotes(request.getNotes());

        if (request.getStatut() != null) {
            rendezVous.setStatut(RendezVous.Statut.valueOf(request.getStatut()));
        }

        return rendezVousRepository.save(rendezVous);
    }

    @Transactional
    public void delete(Long id) {
        RendezVous rendezVous = findById(id);
        rendezVousRepository.delete(rendezVous);
    }

    public List<RendezVous> findByMedecinAndDate(Long medecinId, LocalDate date) {
        return rendezVousRepository.findByMedecinIdAndDateRdv(medecinId, date);
    }

    public List<RendezVous> findByPatient(Long patientId) {
        return rendezVousRepository.findByPatientIdOrderByDateRdvDesc(patientId);
    }
}
