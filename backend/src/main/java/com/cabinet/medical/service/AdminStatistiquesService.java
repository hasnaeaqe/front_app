package com.cabinet.medical.service;

import com.cabinet.medical.dto.AdminStatsDTO;
import com.cabinet.medical.dto.CabinetRecentDTO;
import com.cabinet.medical.entity.Utilisateur;
import com.cabinet.medical.repository.CabinetRepository;
import com.cabinet.medical.repository.MedicamentRepository;
import com.cabinet.medical.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminStatistiquesService {

    private final CabinetRepository cabinetRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final MedicamentRepository medicamentRepository;

    /**
     * Calculer toutes les statistiques du dashboard admin
     */
    public AdminStatsDTO getStatistiques() {
        long cabinetsActifs = cabinetRepository.countByActif(true);
        long cabinetsTotal = cabinetRepository.count();
        
        // Compter uniquement les médecins et secrétaires (pas les administrateurs)
        List<Utilisateur.Role> roles = Arrays.asList(Utilisateur.Role.MEDECIN, Utilisateur.Role.SECRETAIRE);
        long comptesUtilisateurs = utilisateurRepository.countByRoleIn(roles);
        
        long medicaments = medicamentRepository.count();
        
        // Services actifs - peut être configuré selon les besoins (pour l'instant fixe)
        int servicesActifs = 8;

        return new AdminStatsDTO(cabinetsActifs, cabinetsTotal, comptesUtilisateurs, medicaments, servicesActifs);
    }

    /**
     * Récupérer les 5 cabinets les plus récents avec le nombre de médecins
     */
    public List<CabinetRecentDTO> getCabinetsRecents() {
        return cabinetRepository.findTop5ByOrderByDateCreationDesc().stream()
                .map(cabinet -> {
                    long nombreMedecins = utilisateurRepository.countByCabinetIdAndRole(
                        cabinet.getId(), 
                        Utilisateur.Role.MEDECIN
                    );
                    return new CabinetRecentDTO(
                        cabinet.getId(),
                        cabinet.getNom(),
                        cabinet.getAdresse(),
                        nombreMedecins,
                        cabinet.getActif()
                    );
                })
                .collect(Collectors.toList());
    }
}
