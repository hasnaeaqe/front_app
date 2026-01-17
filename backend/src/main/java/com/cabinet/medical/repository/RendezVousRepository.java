package com.cabinet.medical.repository;

import com.cabinet.medical.entity.RendezVous;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {
    List<RendezVous> findByMedecinIdAndDateRdv(Long medecinId, LocalDate dateRdv);
    List<RendezVous> findByMedecinIdOrderByDateRdvDesc(Long medecinId);
    List<RendezVous> findByPatientIdOrderByDateRdvDesc(Long patientId);
    List<RendezVous> findByDateRdvBetween(LocalDate startDate, LocalDate endDate);
    List<RendezVous> findByStatut(RendezVous.Statut statut);
    
    /**
     * Count rendez-vous for a specific date
     */
    Long countByDateRdv(LocalDate dateRdv);
    
    /**
     * Find rendez-vous for today ordered by time
     */
    List<RendezVous> findByDateRdvOrderByHeureRdvAsc(LocalDate dateRdv);
}
