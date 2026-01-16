package com.cabinet.medical.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RendezVousResponse {

    private Long id;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private Long medecinId;
    private String medecinNom;
    private String medecinPrenom;
    private LocalDate dateRdv;
    private LocalTime heureRdv;
    private String motif;
    private String statut;
    private String notes;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
