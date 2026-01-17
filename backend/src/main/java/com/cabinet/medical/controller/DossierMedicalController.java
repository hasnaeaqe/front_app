package com.cabinet.medical.controller;

import com.cabinet.medical.dto.DossierMedicalDTO;
import com.cabinet.medical.service.DossierMedicalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dossiers-medicaux")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DossierMedicalController {

    private final DossierMedicalService dossierMedicalService;

    /**
     * GET /api/dossiers-medicaux
     * Récupérer tous les dossiers médicaux
     */
    @GetMapping
    public ResponseEntity<java.util.List<DossierMedicalDTO>> getAllDossiersMedicaux() {
        java.util.List<DossierMedicalDTO> dossiers = dossierMedicalService.getAllDossiersMedicaux();
        return ResponseEntity.ok(dossiers);
    }

    /**
     * GET /api/dossiers-medicaux/patient/{patientId}
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<DossierMedicalDTO> getDossierMedicalByPatientId(@PathVariable Long patientId) {
        DossierMedicalDTO dossier = dossierMedicalService.getDossierMedicalByPatientId(patientId);
        if (dossier != null) {
            return ResponseEntity.ok(dossier);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * POST /api/dossiers-medicaux
     */
    @PostMapping
    public DossierMedicalDTO createDossierMedical(
            @RequestParam Long patientId,
            @RequestParam Long medecinId,
            @RequestBody DossierMedicalDTO dossierDTO) {
        return dossierMedicalService.createDossierMedical(patientId, medecinId, dossierDTO);
    }

    /**
     * PUT /api/dossiers-medicaux/{id}
     */
    @PutMapping("/{id}")
    public DossierMedicalDTO updateDossierMedical(
            @PathVariable Long id,
            @RequestBody DossierMedicalDTO dossierDTO) {
        return dossierMedicalService.updateDossierMedical(id, dossierDTO);
    }
}
