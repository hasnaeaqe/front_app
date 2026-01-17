package com.cabinet.medical.controller;

import com.cabinet.medical.dto.CabinetDTO;
import com.cabinet.medical.dto.CabinetRequestDTO;
import com.cabinet.medical.dto.response.MessageResponse;
import com.cabinet.medical.service.CabinetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cabinets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CabinetController {

    private final CabinetService cabinetService;

    /**
     * GET /api/cabinets - Récupérer tous les cabinets (avec recherche optionnelle)
     */
    @GetMapping
    public List<CabinetDTO> getAllCabinets(@RequestParam(required = false) String search) {
        return cabinetService.getAllCabinets(search);
    }

    /**
     * GET /api/cabinets/{id} - Récupérer un cabinet par ID
     */
    @GetMapping("/{id}")
    public CabinetDTO getCabinetById(@PathVariable Long id) {
        return cabinetService.getCabinetById(id);
    }

    /**
     * POST /api/cabinets - Créer un nouveau cabinet
     */
    @PostMapping
    public ResponseEntity<CabinetDTO> createCabinet(@RequestBody CabinetRequestDTO request) {
        CabinetDTO created = cabinetService.createCabinet(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/cabinets/{id} - Mettre à jour un cabinet
     */
    @PutMapping("/{id}")
    public CabinetDTO updateCabinet(@PathVariable Long id, @RequestBody CabinetRequestDTO request) {
        return cabinetService.updateCabinet(id, request);
    }

    /**
     * DELETE /api/cabinets/{id} - Supprimer un cabinet
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteCabinet(@PathVariable Long id) {
        cabinetService.deleteCabinet(id);
        return ResponseEntity.ok(new MessageResponse("Cabinet supprimé avec succès"));
    }

    /**
     * PUT /api/cabinets/{id}/toggle-actif - Activer/Désactiver un cabinet
     */
    @PutMapping("/{id}/toggle-actif")
    public CabinetDTO toggleActif(@PathVariable Long id) {
        return cabinetService.toggleActif(id);
    }
}
