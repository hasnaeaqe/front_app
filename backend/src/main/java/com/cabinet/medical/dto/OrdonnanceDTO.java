package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdonnanceDTO {
    private Long id;
    private Long consultationId;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private Long medecinId;
    private String medecinNom;
    private String medecinPrenom;
    private String instructions;
    private LocalDateTime dateCreation;
    private LocalDate valideJusquA;
    private List<OrdonnanceMedicamentDTO> medicaments;
}
