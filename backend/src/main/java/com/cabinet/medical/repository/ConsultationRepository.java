package com.cabinet.medical.repository;

import com.cabinet.medical.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByPatientIdOrderByDateConsultationDesc(Long patientId);
    List<Consultation> findByMedecinId(Long medecinId);
    Optional<Consultation> findByRendezVousId(Long rendezVousId);
}
