package com.cabinet.medical.repository;

import com.cabinet.medical.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByPatientIdOrderByDateConsultationDesc(Long patientId);
    List<Consultation> findByMedecinId(Long medecinId);
    Optional<Consultation> findByRendezVousId(Long rendezVousId);
    
    // New methods for Medecin module
    @Query("SELECT COUNT(DISTINCT c.patient.id) FROM Consultation c WHERE c.medecin.id = :medecinId")
    Long countDistinctPatientsByMedecinId(@Param("medecinId") Long medecinId);
    
    @Query("SELECT COUNT(c) FROM Consultation c WHERE c.medecin.id = :medecinId AND DATE(c.dateConsultation) = :date")
    Long countByMedecinIdAndDate(@Param("medecinId") Long medecinId, @Param("date") LocalDate date);
    
    List<Consultation> findByMedecinIdAndDateConsultationBetween(Long medecinId, LocalDateTime start, LocalDateTime end);
}
