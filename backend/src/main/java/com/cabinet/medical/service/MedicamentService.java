package com.cabinet.medical.service;

import com.cabinet.medical.dto.MedicamentDTO;
import com.cabinet.medical.dto.MedicamentRequestDTO;
import com.cabinet.medical.entity.Medicament;
import com.cabinet.medical.exception.ResourceNotFoundException;
import com.cabinet.medical.repository.MedicamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MedicamentService {

    private final MedicamentRepository medicamentRepository;
    private final ActiviteAdminService activiteAdminService;

    /**
     * Récupérer tous les médicaments avec option de recherche
     */
    public List<MedicamentDTO> findAll(String search) {
        List<Medicament> medicaments;
        
        if (search != null && !search.trim().isEmpty()) {
            medicaments = medicamentRepository.findByNomContainingIgnoreCaseOrCategorieContainingIgnoreCase(search, search);
        } else {
            medicaments = medicamentRepository.findAll();
        }
        
        return medicaments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer un médicament par ID
     */
    public Medicament findById(Long id) {
        return medicamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Médicament non trouvé avec l'id: " + id));
    }

    /**
     * Recherche de médicaments pour autocomplete
     */
    public List<MedicamentDTO> searchMedicaments(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }
        
        return medicamentRepository.findByNomContainingIgnoreCase(query).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Créer un nouveau médicament
     */
    @Transactional
    public MedicamentDTO createMedicament(MedicamentRequestDTO request) {
        Medicament medicament = new Medicament();
        medicament.setNom(request.getNom());
        medicament.setDescription(request.getDescription());
        medicament.setPosologie(request.getPosologie());
        medicament.setCategorie(request.getCategorie());
        medicament.setFabricant(request.getFabricant());

        Medicament savedMedicament = medicamentRepository.save(medicament);
        
        // Logger l'activité
        activiteAdminService.logActivite(
            "CREATION_MEDICAMENT",
            "Nouveau médicament créé",
            "Médicament créé: " + savedMedicament.getNom()
        );

        return convertToDTO(savedMedicament);
    }

    /**
     * Mettre à jour un médicament
     */
    @Transactional
    public MedicamentDTO updateMedicament(Long id, MedicamentRequestDTO request) {
        Medicament medicament = medicamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Médicament non trouvé avec l'id: " + id));

        medicament.setNom(request.getNom());
        medicament.setDescription(request.getDescription());
        medicament.setPosologie(request.getPosologie());
        medicament.setCategorie(request.getCategorie());
        medicament.setFabricant(request.getFabricant());

        Medicament updatedMedicament = medicamentRepository.save(medicament);
        
        // Logger l'activité
        activiteAdminService.logActivite(
            "MODIFICATION_MEDICAMENT",
            "Médicament modifié",
            "Médicament modifié: " + updatedMedicament.getNom()
        );

        return convertToDTO(updatedMedicament);
    }

    /**
     * Supprimer un médicament
     */
    @Transactional
    public void deleteMedicament(Long id) {
        Medicament medicament = medicamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Médicament non trouvé avec l'id: " + id));

        String medicamentNom = medicament.getNom();
        medicamentRepository.delete(medicament);
        
        // Logger l'activité
        activiteAdminService.logActivite(
            "SUPPRESSION_MEDICAMENT",
            "Médicament supprimé",
            "Médicament supprimé: " + medicamentNom
        );
    }

    /**
     * Convertir Medicament entity vers DTO
     */
    private MedicamentDTO convertToDTO(Medicament medicament) {
        return new MedicamentDTO(
            medicament.getId(),
            medicament.getNom(),
            medicament.getDescription(),
            medicament.getPosologie(),
            medicament.getCategorie(),
            medicament.getFabricant()
        );
    }
}
