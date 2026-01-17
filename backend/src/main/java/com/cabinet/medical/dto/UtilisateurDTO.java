package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UtilisateurDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String role;
    private String numTel;
    private Long cabinetId;
    private String cabinetNom;
    private Long specialiteId;
    private String specialiteNom;
    private Boolean actif;
}
