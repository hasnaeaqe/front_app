package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientEnCoursDTO {
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private String patientCin;
    private Long notificationId;
    private LocalDateTime dateEnvoi;
}
