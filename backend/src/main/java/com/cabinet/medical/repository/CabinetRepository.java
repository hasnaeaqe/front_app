package com.cabinet.medical.repository;

import com.cabinet.medical.entity.Cabinet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CabinetRepository extends JpaRepository<Cabinet, Long> {
    long countByActif(Boolean actif);
    List<Cabinet> findByNomContainingIgnoreCase(String nom);
    List<Cabinet> findTop5ByOrderByDateCreationDesc();
    
    @Query("SELECT c FROM Cabinet c ORDER BY c.dateCreation DESC")
    List<Cabinet> findAllOrderByDateCreationDesc();
}
