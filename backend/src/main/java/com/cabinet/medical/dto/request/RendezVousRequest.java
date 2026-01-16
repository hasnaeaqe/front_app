package com.cabinet.medical.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RendezVousRequest {

    @NotNull(message = "L'identifiant du patient est obligatoire")
    private Long patientId;

    @NotNull(message = "L'identifiant du médecin est obligatoire")
    private Long medecinId;

    @NotNull(message = "La date du rendez-vous est obligatoire")
    private LocalDate dateRdv;

    @NotNull(message = "L'heure du rendez-vous est obligatoire")
    private LocalTime heureRdv;

    private String motif;

    private String statut;

    private String notes;
}
