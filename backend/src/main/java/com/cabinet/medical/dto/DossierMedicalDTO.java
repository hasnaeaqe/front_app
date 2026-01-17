package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DossierMedicalDTO {
    private Long id;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private String patientCin;
    private Long medecinId;
    private String medecinNom;
    private String medecinPrenom;
    private String diagnostic;
    private String traitement;
    private String observations;
    private String antMedicaux;
    private String antChirurgicaux;
    private String allergies;
    private String habitudes;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
