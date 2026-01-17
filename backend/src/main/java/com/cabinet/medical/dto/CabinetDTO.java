package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CabinetDTO {
    private Long id;
    private String nom;
    private String adresse;
    private String numTel;
    private String email;
    private Boolean actif;
    private long nombreMedecins;
    private LocalDateTime dateCreation;
}
