package com.cabinet.medical.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdonnanceMedicamentRequest {

    @NotNull(message = "L'identifiant du médicament est obligatoire")
    private Long medicamentId;

    private String posologie;

    private String duree;

    private Integer quantite;
}
