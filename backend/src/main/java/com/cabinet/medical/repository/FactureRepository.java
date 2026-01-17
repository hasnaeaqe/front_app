package com.cabinet.medical.repository;

import com.cabinet.medical.entity.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    Optional<Facture> findByNumero(String numero);
    List<Facture> findByPatientId(Long patientId);
    List<Facture> findByStatutPaiement(Facture.StatutPaiement statut);
    
    /**
     * Calculate total revenue for a medecin on a specific date
     */
    @Query("SELECT COALESCE(SUM(f.montant), 0.0) FROM Facture f " +
           "JOIN f.consultation c " +
           "WHERE c.medecin.id = :medecinId " +
           "AND DATE(f.dateEmission) = :date")
    Double sumRevenuByMedecinIdAndDate(@Param("medecinId") Long medecinId, @Param("date") LocalDate date);
    
    /**
     * Count factures by statut paiement
     */
    Long countByStatutPaiement(Facture.StatutPaiement statut);
    
    /**
     * Calculate total revenue for current month by statut
     */
    @Query("SELECT COALESCE(SUM(f.montant), 0.0) FROM Facture f " +
           "WHERE f.dateEmission BETWEEN :startDate AND :endDate " +
           "AND f.statutPaiement = :statut")
    Double findMonthlyRevenue(@Param("startDate") LocalDate startDate, 
                              @Param("endDate") LocalDate endDate,
                              @Param("statut") Facture.StatutPaiement statut);
    
    /**
     * Helper method - get total revenue for current month (paid invoices only)
     */
    default Double getMonthlyRevenue(LocalDate startDate, LocalDate endDate) {
        return findMonthlyRevenue(startDate, endDate, Facture.StatutPaiement.PAYE);
    }
}
