package com.cabinet.medical.controller;

import com.cabinet.medical.dto.FactureDTO;
import com.cabinet.medical.dto.FactureStatsDTO;
import com.cabinet.medical.dto.request.FactureRequest;
import com.cabinet.medical.service.FactureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/factures")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FactureController {

    private final FactureService factureService;

    /**
     * GET /api/factures - Get all factures
     */
    @GetMapping
    public ResponseEntity<List<FactureDTO>> getAllFactures(@RequestParam(required = false) String statut) {
        List<FactureDTO> factures;
        if (statut != null && !statut.isEmpty()) {
            factures = factureService.getFacturesByStatut(statut);
        } else {
            factures = factureService.getAllFactures();
        }
        return ResponseEntity.ok(factures);
    }

    /**
     * GET /api/factures/{id} - Get facture by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<FactureDTO> getFactureById(@PathVariable Long id) {
        FactureDTO facture = factureService.getFactureById(id);
        return ResponseEntity.ok(facture);
    }

    /**
     * GET /api/factures/patient/{patientId} - Get factures by patient
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<FactureDTO>> getFacturesByPatient(@PathVariable Long patientId) {
        List<FactureDTO> factures = factureService.getFacturesByPatient(patientId);
        return ResponseEntity.ok(factures);
    }

    /**
     * GET /api/factures/stats - Get facture statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<FactureStatsDTO> getFactureStats() {
        FactureStatsDTO stats = factureService.getFactureStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * POST /api/factures - Create a new facture
     */
    @PostMapping
    public ResponseEntity<FactureDTO> createFacture(@RequestBody FactureRequest request) {
        FactureDTO facture = factureService.createFacture(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(facture);
    }

    /**
     * PUT /api/factures/{id}/payer - Mark facture as paid
     */
    @PutMapping("/{id}/payer")
    public ResponseEntity<FactureDTO> payerFacture(@PathVariable Long id) {
        FactureDTO facture = factureService.payerFacture(id);
        return ResponseEntity.ok(facture);
    }
}
