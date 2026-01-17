package com.cabinet.medical.controller;

import com.cabinet.medical.dto.NotificationDTO;
import com.cabinet.medical.dto.PatientEnCoursDTO;
import com.cabinet.medical.service.NotificationService;
import com.cabinet.medical.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;
    private final SecurityUtils securityUtils;

    /**
     * GET /api/notifications?lu=false - Get unread notifications for current user
     */
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getNotifications(
            @RequestParam(defaultValue = "false") Boolean lu) {
        Long userId = securityUtils.getCurrentUserId();
        List<NotificationDTO> notifications;
        
        if (!lu) {
            notifications = notificationService.getUnreadNotifications(userId);
        } else {
            notifications = notificationService.getAllNotifications(userId);
        }
        
        return ResponseEntity.ok(notifications);
    }

    /**
     * POST /api/notifications/send-patient-to-medecin
     */
    @PostMapping("/send-patient-to-medecin")
    public ResponseEntity<String> sendPatientToMedecin(
            @RequestParam Long patientId,
            @RequestParam Long medecinId) {
        notificationService.sendPatientToMedecin(patientId, medecinId);
        return ResponseEntity.ok("Patient envoyé au médecin avec succès");
    }

    /**
     * GET /api/notifications/medecin/{medecinId}/patient-encours
     */
    @GetMapping("/medecin/{medecinId}/patient-encours")
    public ResponseEntity<PatientEnCoursDTO> getPatientEnCours(@PathVariable Long medecinId) {
        PatientEnCoursDTO patientEnCours = notificationService.getPatientEnCours(medecinId);
        if (patientEnCours != null) {
            return ResponseEntity.ok(patientEnCours);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * DELETE /api/notifications/medecin/{medecinId}/clear-patient-encours
     */
    @DeleteMapping("/medecin/{medecinId}/clear-patient-encours")
    public ResponseEntity<String> clearPatientEnCours(@PathVariable Long medecinId) {
        notificationService.clearPatientEnCours(medecinId);
        return ResponseEntity.ok("Notification supprimée avec succès");
    }
}
