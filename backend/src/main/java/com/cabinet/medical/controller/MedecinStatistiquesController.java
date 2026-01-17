package com.cabinet.medical.controller;

import com.cabinet.medical.dto.MedecinStatsDTO;
import com.cabinet.medical.service.MedecinStatistiquesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/medecin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedecinStatistiquesController {

    private final MedecinStatistiquesService medecinStatistiquesService;

    /**
     * GET /api/medecin/stats?medecinId={id} - Récupérer les statistiques du dashboard médecin
     */
    @GetMapping("/stats")
    public MedecinStatsDTO getStatistiques(@RequestParam Long medecinId) {
        return medecinStatistiquesService.getStatistiques(medecinId);
    }
}
