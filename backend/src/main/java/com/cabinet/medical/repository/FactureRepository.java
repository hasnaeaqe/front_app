package com.cabinet.medical.repository;

import com.cabinet.medical.entity.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    Optional<Facture> findByNumero(String numero);
    List<Facture> findByPatientId(Long patientId);
    List<Facture> findByStatutPaiement(Facture.StatutPaiement statut);
}
