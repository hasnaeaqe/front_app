package com.cabinet.medical.repository;

import com.cabinet.medical.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByPatientId(Long patientId);
    List<Document> findByDossierId(Long dossierId);
}
