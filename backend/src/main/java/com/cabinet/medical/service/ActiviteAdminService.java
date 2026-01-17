package com.cabinet.medical.service;

import com.cabinet.medical.entity.ActiviteAdmin;
import com.cabinet.medical.repository.ActiviteAdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ActiviteAdminService {

    private final ActiviteAdminRepository activiteAdminRepository;

    /**
     * Enregistrer une nouvelle activité administrative
     */
    @Transactional
    public void logActivite(String type, String titre, String description) {
        ActiviteAdmin activite = new ActiviteAdmin();
        activite.setType(type);
        activite.setTitre(titre);
        activite.setDescription(description);
        activiteAdminRepository.save(activite);
    }

    /**
     * Récupérer les 10 dernières activités
     */
    public List<ActiviteAdmin> getRecentActivities() {
        return activiteAdminRepository.findTop10ByOrderByDateCreationDesc();
    }
}
