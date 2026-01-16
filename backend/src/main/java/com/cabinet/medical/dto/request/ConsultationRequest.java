package com.cabinet.medical.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationRequest {

    private Long rendezVousId;

    @NotNull(message = "L'identifiant du patient est obligatoire")
    private Long patientId;

    @NotNull(message = "L'identifiant du médecin est obligatoire")
    private Long medecinId;

    private String diagnostic;

    private String traitement;

    private String observations;

    private Integer duree;
}
