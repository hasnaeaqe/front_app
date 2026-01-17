package com.cabinet.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActiviteAdminDTO {
    private Long id;
    private String type;
    private String titre;
    private String description;
    private LocalDateTime dateCreation;
}
