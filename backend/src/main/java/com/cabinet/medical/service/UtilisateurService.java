package com.cabinet.medical.service;

import com.cabinet.medical.dto.response.LoginResponse;
import com.cabinet.medical.entity.Utilisateur;
import com.cabinet.medical.exception.InvalidCredentialsException;
import com.cabinet.medical.exception.ResourceNotFoundException;
import com.cabinet.medical.repository.UtilisateurRepository;
import com.cabinet.medical.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    public LoginResponse authenticate(String email, String password) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Email ou mot de passe incorrect"));

        if (!PasswordUtil.verifyPassword(password, utilisateur.getMotDePasse())) {
            throw new InvalidCredentialsException("Email ou mot de passe incorrect");
        }

        if (!utilisateur.getActif()) {
            throw new InvalidCredentialsException("Ce compte est désactivé");
        }

        String token = UUID.randomUUID().toString();

        return new LoginResponse(
                utilisateur.getId(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail(),
                utilisateur.getRole().name(),
                token
        );
    }

    public Utilisateur findById(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'id: " + id));
    }

    public List<Utilisateur> findAll() {
        return utilisateurRepository.findAll();
    }

    public List<Utilisateur> findMedecins() {
        return utilisateurRepository.findByRole(Utilisateur.Role.MEDECIN);
    }
}
