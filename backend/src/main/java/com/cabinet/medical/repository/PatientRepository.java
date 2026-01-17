package com.cabinet.medical.repository;

import com.cabinet.medical.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByCin(String cin);
    List<Patient> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);
    List<Patient> findByTypeMutuelle(String typeMutuelle);
    
    /**
     * Search patients by name (nom or prenom)
     */
    @Query("SELECT p FROM Patient p WHERE LOWER(p.nom) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(p.prenom) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Patient> searchByNom(@Param("q") String q);
    
    /**
     * Search patients by CIN
     */
    @Query("SELECT p FROM Patient p WHERE p.cin LIKE CONCAT('%', :q, '%')")
    List<Patient> searchByCin(@Param("q") String q);
}
