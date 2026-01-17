package com.cabinet.medical.controller;

import com.cabinet.medical.dto.UtilisateurDTO;
import com.cabinet.medical.dto.UtilisateurRequestDTO;
import com.cabinet.medical.dto.response.MessageResponse;
import com.cabinet.medical.service.UtilisateurAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UtilisateurAdminController {

    private final UtilisateurAdminService utilisateurAdminService;

    /**
     * GET /api/utilisateurs - Récupérer tous les utilisateurs (avec recherche optionnelle)
     */
    @GetMapping
    public List<UtilisateurDTO> getAllUtilisateurs(@RequestParam(required = false) String search) {
        return utilisateurAdminService.getAllUtilisateurs(search);
    }

    /**
     * GET /api/utilisateurs/{id} - Récupérer un utilisateur par ID
     */
    @GetMapping("/{id}")
    public UtilisateurDTO getUtilisateurById(@PathVariable Long id) {
        return utilisateurAdminService.getUtilisateurById(id);
    }

    /**
     * POST /api/utilisateurs - Créer un nouvel utilisateur
     */
    @PostMapping
    public ResponseEntity<UtilisateurDTO> createUtilisateur(@RequestBody UtilisateurRequestDTO request) {
        UtilisateurDTO created = utilisateurAdminService.createUtilisateur(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/utilisateurs/{id} - Mettre à jour un utilisateur
     */
    @PutMapping("/{id}")
    public UtilisateurDTO updateUtilisateur(@PathVariable Long id, @RequestBody UtilisateurRequestDTO request) {
        return utilisateurAdminService.updateUtilisateur(id, request);
    }

    /**
     * DELETE /api/utilisateurs/{id} - Supprimer un utilisateur
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteUtilisateur(@PathVariable Long id) {
        utilisateurAdminService.deleteUtilisateur(id);
        return ResponseEntity.ok(new MessageResponse("Utilisateur supprimé avec succès"));
    }

    /**
     * PUT /api/utilisateurs/{id}/toggle-actif - Activer/Désactiver un utilisateur
     */
    @PutMapping("/{id}/toggle-actif")
    public UtilisateurDTO toggleActif(@PathVariable Long id) {
        return utilisateurAdminService.toggleActif(id);
    }
}
