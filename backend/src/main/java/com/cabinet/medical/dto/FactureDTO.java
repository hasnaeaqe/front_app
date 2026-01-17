package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FactureDTO {
    private Long id;
    private String numero;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private String patientCin;
    private Long consultationId;
    private BigDecimal montant;
    private String statutPaiement;
    private LocalDateTime dateEmission;
    private LocalDateTime datePaiement;
    private LocalDate dateEcheance;
    private String notes;
}
