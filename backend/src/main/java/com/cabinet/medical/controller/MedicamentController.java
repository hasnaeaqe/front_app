package com.cabinet.medical.controller;

import com.cabinet.medical.dto.MedicamentDTO;
import com.cabinet.medical.dto.MedicamentRequestDTO;
import com.cabinet.medical.dto.response.MessageResponse;
import com.cabinet.medical.entity.Medicament;
import com.cabinet.medical.service.MedicamentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicaments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedicamentController {

    private final MedicamentService medicamentService;

    /**
     * GET /api/medicaments - Récupérer tous les médicaments (avec recherche optionnelle)
     */
    @GetMapping
    public List<MedicamentDTO> getAllMedicaments(@RequestParam(required = false) String search) {
        return medicamentService.findAll(search);
    }

    /**
     * GET /api/medicaments/{id} - Récupérer un médicament par ID
     */
    @GetMapping("/{id}")
    public Medicament getMedicamentById(@PathVariable Long id) {
        return medicamentService.findById(id);
    }

    /**
     * GET /api/medicaments/search - Recherche pour autocomplete
     */
    @GetMapping("/search")
    public List<MedicamentDTO> searchMedicaments(@RequestParam String q) {
        return medicamentService.searchMedicaments(q);
    }

    /**
     * POST /api/medicaments - Créer un nouveau médicament
     */
    @PostMapping
    public ResponseEntity<MedicamentDTO> createMedicament(@RequestBody MedicamentRequestDTO request) {
        MedicamentDTO created = medicamentService.createMedicament(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/medicaments/{id} - Mettre à jour un médicament
     */
    @PutMapping("/{id}")
    public MedicamentDTO updateMedicament(@PathVariable Long id, @RequestBody MedicamentRequestDTO request) {
        return medicamentService.updateMedicament(id, request);
    }

    /**
     * DELETE /api/medicaments/{id} - Supprimer un médicament
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteMedicament(@PathVariable Long id) {
        medicamentService.deleteMedicament(id);
        return ResponseEntity.ok(new MessageResponse("Médicament supprimé avec succès"));
    }
}
