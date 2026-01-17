package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicamentDTO {
    private Long id;
    private String nom;
    private String description;
    private String posologie;
    private String categorie;
    private String fabricant;
}
