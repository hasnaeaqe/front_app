package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SecretaireStatsDTO {
    private Long patientsTotal;
    private Long rdvAujourdhui;
    private Long facturesEnAttente;
    private Double revenuTotal;
}
