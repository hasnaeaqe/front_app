package com.cabinet.medical.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String role;
    private String token;
}
