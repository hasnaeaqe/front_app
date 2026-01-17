package com.cabinet.medical.controller;

import com.cabinet.medical.dto.RendezVousSecretaireDTO;
import com.cabinet.medical.dto.SecretaireStatsDTO;
import com.cabinet.medical.service.SecretaireStatistiquesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/secretaire")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SecretaireStatistiquesController {

    private final SecretaireStatistiquesService secretaireStatistiquesService;

    /**
     * GET /api/secretaire/stats - Get dashboard statistics for secretaire
     */
    @GetMapping("/stats")
    public SecretaireStatsDTO getStatistiques() {
        return secretaireStatistiquesService.getStatistiques();
    }
    
    /**
     * GET /api/secretaire/rendez-vous/aujourdhui - Get today's appointments
     */
    @GetMapping("/rendez-vous/aujourdhui")
    public List<RendezVousSecretaireDTO> getRendezVousAujourdhui() {
        return secretaireStatistiquesService.getRendezVousAujourdhui();
    }
}
