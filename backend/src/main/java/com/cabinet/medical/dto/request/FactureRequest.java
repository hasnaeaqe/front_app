package com.cabinet.medical.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FactureRequest {
    private Long patientId;
    private Long consultationId;
    private BigDecimal montant;
    private LocalDate dateEcheance;
    private String notes;
}
