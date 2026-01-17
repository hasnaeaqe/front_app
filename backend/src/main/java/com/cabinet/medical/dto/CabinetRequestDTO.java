package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CabinetRequestDTO {
    private String nom;
    private String adresse;
    private String numTel;
    private String email;
    private Boolean actif;
}
