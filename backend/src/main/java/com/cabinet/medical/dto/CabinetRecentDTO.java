package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CabinetRecentDTO {
    private Long id;
    private String nom;
    private String adresse;
    private long nombreMedecins;
    private Boolean actif;
}
