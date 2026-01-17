package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientProfilCompletDTO {
    private Long id;
    private String cin;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String sexe;
    private String numTel;
    private String email;
    private String adresse;
    private String typeMutuelle;
    private DossierMedicalDTO dossierMedical;
    private List<ConsultationDTO> consultations;
    private List<OrdonnanceDTO> ordonnances;
}
