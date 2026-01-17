package com.cabinet.medical.service;

import com.cabinet.medical.dto.UtilisateurDTO;
import com.cabinet.medical.dto.UtilisateurRequestDTO;
import com.cabinet.medical.entity.Cabinet;
import com.cabinet.medical.entity.Specialite;
import com.cabinet.medical.entity.Utilisateur;
import com.cabinet.medical.exception.DuplicateResourceException;
import com.cabinet.medical.exception.ResourceNotFoundException;
import com.cabinet.medical.repository.CabinetRepository;
import com.cabinet.medical.repository.SpecialiteRepository;
import com.cabinet.medical.repository.UtilisateurRepository;
import com.cabinet.medical.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UtilisateurAdminService {

    private final UtilisateurRepository utilisateurRepository;
    private final CabinetRepository cabinetRepository;
    private final SpecialiteRepository specialiteRepository;
    private final ActiviteAdminService activiteAdminService;

    /**
     * Récupérer tous les utilisateurs (médecins et secrétaires) avec recherche optionnelle
     */
    public List<UtilisateurDTO> getAllUtilisateurs(String search) {
        List<Utilisateur.Role> roles = Arrays.asList(Utilisateur.Role.MEDECIN, Utilisateur.Role.SECRETAIRE);
        List<Utilisateur> utilisateurs;
        
        if (search != null && !search.trim().isEmpty()) {
            utilisateurs = utilisateurRepository.searchByRolesAndKeyword(roles, search);
        } else {
            utilisateurs = utilisateurRepository.findByRoleInOrderByDateCreationDesc(roles);
        }
        
        return utilisateurs.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer un utilisateur par ID
     */
    public UtilisateurDTO getUtilisateurById(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'id: " + id));
        return convertToDTO(utilisateur);
    }

    /**
     * Créer un nouvel utilisateur
     */
    @Transactional
    public UtilisateurDTO createUtilisateur(UtilisateurRequestDTO request) {
        // Vérifier si l'email existe déjà
        Optional<Utilisateur> existingUser = utilisateurRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new DuplicateResourceException("Un utilisateur avec cet email existe déjà");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setEmail(request.getEmail());
        
        // Hacher le mot de passe avec SHA-256
        String hashedPassword = PasswordUtil.hashPassword(request.getMotDePasse());
        utilisateur.setMotDePasse(hashedPassword);
        
        utilisateur.setRole(Utilisateur.Role.valueOf(request.getRole()));
        utilisateur.setNumTel(request.getNumTel());
        utilisateur.setActif(request.getActif() != null ? request.getActif() : true);

        // Associer le cabinet si fourni
        if (request.getCabinetId() != null) {
            Cabinet cabinet = cabinetRepository.findById(request.getCabinetId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cabinet non trouvé avec l'id: " + request.getCabinetId()));
            utilisateur.setCabinet(cabinet);
        }

        // Associer la spécialité si fournie (pour médecins)
        if (request.getSpecialiteId() != null) {
            Specialite specialite = specialiteRepository.findById(request.getSpecialiteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Spécialité non trouvée avec l'id: " + request.getSpecialiteId()));
            utilisateur.setSpecialite(specialite);
        }

        Utilisateur savedUtilisateur = utilisateurRepository.save(utilisateur);
        
        // Logger l'activité
        activiteAdminService.logActivite(
            "CREATION_COMPTE",
            "Nouveau compte créé",
            "Compte créé: " + savedUtilisateur.getPrenom() + " " + savedUtilisateur.getNom() + " (" + savedUtilisateur.getRole() + ")"
        );

        return convertToDTO(savedUtilisateur);
    }

    /**
     * Mettre à jour un utilisateur
     */
    @Transactional
    public UtilisateurDTO updateUtilisateur(Long id, UtilisateurRequestDTO request) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'id: " + id));

        // Vérifier si l'email est déjà utilisé par un autre utilisateur
        Optional<Utilisateur> existingUser = utilisateurRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
            throw new DuplicateResourceException("Un utilisateur avec cet email existe déjà");
        }

        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setEmail(request.getEmail());
        
        // Mettre à jour le mot de passe seulement s'il est fourni
        if (request.getMotDePasse() != null && !request.getMotDePasse().trim().isEmpty()) {
            String hashedPassword = PasswordUtil.hashPassword(request.getMotDePasse());
            utilisateur.setMotDePasse(hashedPassword);
        }
        
        utilisateur.setRole(Utilisateur.Role.valueOf(request.getRole()));
        utilisateur.setNumTel(request.getNumTel());
        
        if (request.getActif() != null) {
            utilisateur.setActif(request.getActif());
        }

        // Mettre à jour le cabinet
        if (request.getCabinetId() != null) {
            Cabinet cabinet = cabinetRepository.findById(request.getCabinetId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cabinet non trouvé avec l'id: " + request.getCabinetId()));
            utilisateur.setCabinet(cabinet);
        } else {
            utilisateur.setCabinet(null);
        }

        // Mettre à jour la spécialité
        if (request.getSpecialiteId() != null) {
            Specialite specialite = specialiteRepository.findById(request.getSpecialiteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Spécialité non trouvée avec l'id: " + request.getSpecialiteId()));
            utilisateur.setSpecialite(specialite);
        } else {
            utilisateur.setSpecialite(null);
        }

        Utilisateur updatedUtilisateur = utilisateurRepository.save(utilisateur);
        
        // Logger l'activité
        activiteAdminService.logActivite(
            "MODIFICATION_COMPTE",
            "Compte modifié",
            "Compte modifié: " + updatedUtilisateur.getPrenom() + " " + updatedUtilisateur.getNom()
        );

        return convertToDTO(updatedUtilisateur);
    }

    /**
     * Supprimer un utilisateur
     */
    @Transactional
    public void deleteUtilisateur(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'id: " + id));

        String utilisateurNom = utilisateur.getPrenom() + " " + utilisateur.getNom();
        utilisateurRepository.delete(utilisateur);
        
        // Logger l'activité
        activiteAdminService.logActivite(
            "SUPPRESSION_COMPTE",
            "Compte supprimé",
            "Compte supprimé: " + utilisateurNom
        );
    }

    /**
     * Activer/Désactiver un utilisateur
     */
    @Transactional
    public UtilisateurDTO toggleActif(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'id: " + id));

        utilisateur.setActif(!utilisateur.getActif());
        Utilisateur updatedUtilisateur = utilisateurRepository.save(utilisateur);
        
        // Logger l'activité
        String statut = updatedUtilisateur.getActif() ? "activé" : "désactivé";
        activiteAdminService.logActivite(
            "TOGGLE_COMPTE",
            "Statut compte modifié",
            "Compte " + statut + ": " + updatedUtilisateur.getPrenom() + " " + updatedUtilisateur.getNom()
        );

        return convertToDTO(updatedUtilisateur);
    }

    /**
     * Convertir Utilisateur entity vers DTO
     */
    private UtilisateurDTO convertToDTO(Utilisateur utilisateur) {
        UtilisateurDTO dto = new UtilisateurDTO();
        dto.setId(utilisateur.getId());
        dto.setNom(utilisateur.getNom());
        dto.setPrenom(utilisateur.getPrenom());
        dto.setEmail(utilisateur.getEmail());
        dto.setRole(utilisateur.getRole().name());
        dto.setNumTel(utilisateur.getNumTel());
        dto.setActif(utilisateur.getActif());
        
        if (utilisateur.getCabinet() != null) {
            dto.setCabinetId(utilisateur.getCabinet().getId());
            dto.setCabinetNom(utilisateur.getCabinet().getNom());
        }
        
        if (utilisateur.getSpecialite() != null) {
            dto.setSpecialiteId(utilisateur.getSpecialite().getId());
            dto.setSpecialiteNom(utilisateur.getSpecialite().getNom());
        }
        
        return dto;
    }
}
