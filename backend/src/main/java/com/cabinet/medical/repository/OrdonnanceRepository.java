package com.cabinet.medical.repository;

import com.cabinet.medical.entity.Ordonnance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrdonnanceRepository extends JpaRepository<Ordonnance, Long> {
    List<Ordonnance> findByPatientId(Long patientId);
    List<Ordonnance> findByMedecinId(Long medecinId);
    Optional<Ordonnance> findByConsultationId(Long consultationId);
    
    // New method for Medecin module
    List<Ordonnance> findByPatientIdOrderByDateCreationDesc(Long patientId);
}
