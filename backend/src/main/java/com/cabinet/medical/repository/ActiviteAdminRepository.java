package com.cabinet.medical.repository;

import com.cabinet.medical.entity.ActiviteAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActiviteAdminRepository extends JpaRepository<ActiviteAdmin, Long> {
    List<ActiviteAdmin> findTop10ByOrderByDateCreationDesc();
}
