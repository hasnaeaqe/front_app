package com.cabinet.medical.repository;

import com.cabinet.medical.entity.OrdonnanceMedicament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdonnanceMedicamentRepository extends JpaRepository<OrdonnanceMedicament, Long> {
    List<OrdonnanceMedicament> findByOrdonnanceId(Long ordonnanceId);
}
