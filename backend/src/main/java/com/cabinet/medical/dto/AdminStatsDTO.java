package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDTO {
    private long cabinetsActifs;
    private long cabinetsTotal;
    private long comptesUtilisateurs;
    private long medicaments;
    private int servicesActifs;
}
