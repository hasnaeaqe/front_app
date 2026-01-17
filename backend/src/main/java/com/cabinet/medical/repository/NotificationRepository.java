package com.cabinet.medical.repository;

import com.cabinet.medical.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByDestinataireIdAndLuFalseOrderByDateCreationDesc(Long destinataireId);
    List<Notification> findByDestinataireIdOrderByDateCreationDesc(Long destinataireId);
    
    // New methods for Medecin module
    void deleteByDestinataireIdAndType(Long destinataireId, Notification.Type type);
    Optional<Notification> findFirstByDestinataireIdAndTypeOrderByDateCreationDesc(Long destinataireId, Notification.Type type);
}
