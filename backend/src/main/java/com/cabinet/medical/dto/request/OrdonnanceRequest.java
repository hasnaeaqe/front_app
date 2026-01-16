package com.cabinet.medical.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdonnanceRequest {

    private Long consultationId;

    @NotNull(message = "L'identifiant du patient est obligatoire")
    private Long patientId;

    @NotNull(message = "L'identifiant du médecin est obligatoire")
    private Long medecinId;

    private String instructions;

    private LocalDate valideJusquA;

    @NotEmpty(message = "Au moins un médicament est requis")
    private List<OrdonnanceMedicamentRequest> medicaments;
}
