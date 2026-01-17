package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FactureStatsDTO {
    private Long totalEnAttente;
    private Long totalPayeesMois;
    private Double montantEnAttente;
    private Double montantEncaisseMois;
}
