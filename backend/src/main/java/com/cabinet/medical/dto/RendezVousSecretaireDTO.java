package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RendezVousSecretaireDTO {
    private Long id;
    private LocalDate dateRdv;
    private LocalTime heureRdv;
    private String patientNom;
    private String patientPrenom;
    private String medecinNom;
    private String medecinPrenom;
    private String motif;
    private String statut;
}
