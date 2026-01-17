package com.cabinet.medical.controller;

import com.cabinet.medical.dto.PatientProfilCompletDTO;
import com.cabinet.medical.entity.Patient;
import com.cabinet.medical.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medecin/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedecinPatientController {

    private final PatientService patientService;

    /**
     * GET /api/medecin/patients/search?type=nom&q=alami
     */
    @GetMapping("/search")
    public List<Patient> searchPatients(@RequestParam String type, @RequestParam String q) {
        if ("cin".equalsIgnoreCase(type)) {
            try {
                Patient patient = patientService.searchByCin(q);
                return List.of(patient);
            } catch (Exception e) {
                return List.of();
            }
        } else {
            return patientService.searchByNom(q);
        }
    }

    /**
     * GET /api/medecin/patients/{id}/profil-complet
     */
    @GetMapping("/{id}/profil-complet")
    public PatientProfilCompletDTO getProfilComplet(@PathVariable Long id) {
        return patientService.getProfilComplet(id);
    }
}
