package com.cabinet.medical.controller;

import com.cabinet.medical.dto.PatientEnCoursDTO;
import com.cabinet.medical.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

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
