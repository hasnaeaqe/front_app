package com.cabinet.medical.controller;

import com.cabinet.medical.dto.request.PatientRequest;
import com.cabinet.medical.entity.Patient;
import com.cabinet.medical.service.NotificationService;
import com.cabinet.medical.service.PatientService;
import com.cabinet.medical.service.UtilisateurService;
import com.cabinet.medical.entity.Utilisateur;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService patientService;
    private final NotificationService notificationService;
    private final UtilisateurService utilisateurService;

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.findAll();
    }

    @GetMapping("/{id}")
    public Patient getPatientById(@PathVariable Long id) {
        return patientService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Patient createPatient(@Valid @RequestBody PatientRequest request) {
        return patientService.create(request);
    }

    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable Long id, @Valid @RequestBody PatientRequest request) {
        return patientService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<Patient> searchPatients(@RequestParam String query) {
        return patientService.search(query);
    }

    /**
     * POST /api/patients/{id}/send-to-medecin - Send patient to doctor
     */
    @PostMapping("/{id}/send-to-medecin")
    public ResponseEntity<Map<String, String>> sendPatientToMedecin(@PathVariable Long id) {
        try {
            // Verify patient exists
            Patient patient = patientService.findById(id);
            
            // Get first available doctor (médecin)
            List<Utilisateur> medecins = utilisateurService.findMedecins();
            if (medecins.isEmpty()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Aucun médecin disponible");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            // Send notification to first available doctor
            Utilisateur medecin = medecins.get(0);
            notificationService.sendPatientToMedecin(id, medecin.getId());
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Patient envoyé au médecin avec succès");
            response.put("medecinNom", medecin.getNom() + " " + medecin.getPrenom());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Erreur lors de l'envoi au médecin: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
