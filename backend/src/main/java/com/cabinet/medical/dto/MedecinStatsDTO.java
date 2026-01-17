package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedecinStatsDTO {
    private Long patientsTotal;
    private Long consultationsAujourdhui;
    private Long consultationsEnCours;
    private Double revenuAujourdhui;
}
