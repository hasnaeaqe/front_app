package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdonnanceMedicamentDTO {
    private Long id;
    private String nomMedicament;
    private String dosage;
    private String frequence;
    private String duree;
    private String instructions;
}
