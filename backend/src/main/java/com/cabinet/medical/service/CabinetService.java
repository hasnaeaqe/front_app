package com.cabinet.medical.service;

import com.cabinet.medical.dto.CabinetDTO;
import com.cabinet.medical.dto.CabinetRequestDTO;
import com.cabinet.medical.entity.Cabinet;
import com.cabinet.medical.entity.Utilisateur;
import com.cabinet.medical.exception.ResourceNotFoundException;
import com.cabinet.medical.repository.CabinetRepository;
import com.cabinet.medical.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CabinetService {

    private final CabinetRepository cabinetRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ActiviteAdminService activiteAdminService;

    /**
     * Récupérer tous les cabinets avec option de recherche
     */
    public List<CabinetDTO> getAllCabinets(String search) {
        List<Cabinet> cabinets;
        
        if (search != null && !search.trim().isEmpty()) {
            cabinets = cabinetRepository.findByNomContainingIgnoreCase(search);
        } else {
            cabinets = cabinetRepository.findAllOrderByDateCreationDesc();
        }
        
        return cabinets.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer un cabinet par ID
     */
    public CabinetDTO getCabinetById(Long id) {
        Cabinet cabinet = cabinetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cabinet non trouvé avec l'id: " + id));
        return convertToDTO(cabinet);
    }

    /**
     * Créer un nouveau cabinet
     */
    @Transactional
    public CabinetDTO createCabinet(CabinetRequestDTO request) {
        Cabinet cabinet = new Cabinet();
        cabinet.setNom(request.getNom());
        cabinet.setAdresse(request.getAdresse());
        cabinet.setNumTel(request.getNumTel());
        cabinet.setEmail(request.getEmail());
        cabinet.setActif(request.getActif() != null ? request.getActif() : true);

        Cabinet savedCabinet = cabinetRepository.save(cabinet);
        
        // Logger l'activité
        activiteAdminService.logActivite(
            "CREATION_CABINET",
            "Nouveau cabinet créé",
            "Cabinet créé: " + savedCabinet.getNom()
        );

        return convertToDTO(savedCabinet);
    }

    /**
     * Mettre à jour un cabinet
     */
    @Transactional
    public CabinetDTO updateCabinet(Long id, CabinetRequestDTO request) {
        Cabinet cabinet = cabinetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cabinet non trouvé avec l'id: " + id));

        cabinet.setNom(request.getNom());
        cabinet.setAdresse(request.getAdresse());
        cabinet.setNumTel(request.getNumTel());
        cabinet.setEmail(request.getEmail());
        if (request.getActif() != null) {
            cabinet.setActif(request.getActif());
        }

        Cabinet updatedCabinet = cabinetRepository.save(cabinet);
        
        // Logger l'activité
        activiteAdminService.logActivite(
            "MODIFICATION_CABINET",
            "Cabinet modifié",
            "Cabinet modifié: " + updatedCabinet.getNom()
        );

        return convertToDTO(updatedCabinet);
    }

    /**
     * Supprimer un cabinet
     */
    @Transactional
    public void deleteCabinet(Long id) {
        Cabinet cabinet = cabinetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cabinet non trouvé avec l'id: " + id));

        String cabinetNom = cabinet.getNom();
        cabinetRepository.delete(cabinet);
        
        // Logger l'activité
        activiteAdminService.logActivite(
            "SUPPRESSION_CABINET",
            "Cabinet supprimé",
            "Cabinet supprimé: " + cabinetNom
        );
    }

    /**
     * Activer/Désactiver un cabinet
     */
    @Transactional
    public CabinetDTO toggleActif(Long id) {
        Cabinet cabinet = cabinetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cabinet non trouvé avec l'id: " + id));

        cabinet.setActif(!cabinet.getActif());
        Cabinet updatedCabinet = cabinetRepository.save(cabinet);
        
        // Logger l'activité
        String statut = updatedCabinet.getActif() ? "activé" : "désactivé";
        activiteAdminService.logActivite(
            "TOGGLE_CABINET",
            "Statut cabinet modifié",
            "Cabinet " + statut + ": " + updatedCabinet.getNom()
        );

        return convertToDTO(updatedCabinet);
    }

    /**
     * Convertir Cabinet entity vers DTO
     */
    private CabinetDTO convertToDTO(Cabinet cabinet) {
        long nombreMedecins = utilisateurRepository.countByCabinetIdAndRole(
            cabinet.getId(), 
            Utilisateur.Role.MEDECIN
        );
        
        return new CabinetDTO(
            cabinet.getId(),
            cabinet.getNom(),
            cabinet.getAdresse(),
            cabinet.getNumTel(),
            cabinet.getEmail(),
            cabinet.getActif(),
            nombreMedecins,
            cabinet.getDateCreation()
        );
    }
}
