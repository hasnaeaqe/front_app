package com.cabinet.medical.controller;

import com.cabinet.medical.dto.ActiviteAdminDTO;
import com.cabinet.medical.dto.AdminStatsDTO;
import com.cabinet.medical.dto.CabinetRecentDTO;
import com.cabinet.medical.entity.ActiviteAdmin;
import com.cabinet.medical.service.ActiviteAdminService;
import com.cabinet.medical.service.AdminStatistiquesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminStatistiquesController {

    private final AdminStatistiquesService adminStatistiquesService;
    private final ActiviteAdminService activiteAdminService;

    /**
     * GET /api/admin/stats - Récupérer les statistiques du dashboard
     */
    @GetMapping("/stats")
    public AdminStatsDTO getStatistiques() {
        return adminStatistiquesService.getStatistiques();
    }

    /**
     * GET /api/admin/cabinets-recents - Récupérer les 5 cabinets les plus récents
     */
    @GetMapping("/cabinets-recents")
    public List<CabinetRecentDTO> getCabinetsRecents() {
        return adminStatistiquesService.getCabinetsRecents();
    }

    /**
     * GET /api/admin/activite-recente - Récupérer les 10 dernières activités
     */
    @GetMapping("/activite-recente")
    public List<ActiviteAdminDTO> getActiviteRecente() {
        return activiteAdminService.getRecentActivities().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ActiviteAdminDTO convertToDTO(ActiviteAdmin activite) {
        return new ActiviteAdminDTO(
            activite.getId(),
            activite.getType(),
            activite.getTitre(),
            activite.getDescription(),
            activite.getDateCreation()
        );
    }
}
