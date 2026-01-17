package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationDTO {
    private Long id;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private Long medecinId;
    private String medecinNom;
    private String medecinPrenom;
    private String diagnostic;
    private String traitement;
    private String observations;
    private LocalDateTime dateConsultation;
    private Integer duree;
}
