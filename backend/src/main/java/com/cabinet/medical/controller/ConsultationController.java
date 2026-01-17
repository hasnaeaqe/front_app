package com.cabinet.medical.controller;

import com.cabinet.medical.dto.ConsultationDTO;
import com.cabinet.medical.dto.request.ConsultationRequest;
import com.cabinet.medical.entity.Consultation;
import com.cabinet.medical.service.ConsultationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConsultationController {

    private final ConsultationService consultationService;

    @GetMapping
    public List<Consultation> getAllConsultations() {
        return consultationService.findAll();
    }

    @GetMapping("/{id}")
    public Consultation getConsultationById(@PathVariable Long id) {
        return consultationService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Consultation createConsultation(@Valid @RequestBody ConsultationRequest request) {
        return consultationService.create(request);
    }

    @GetMapping("/patient/{patientId}")
    public List<Consultation> getConsultationsByPatient(@PathVariable Long patientId) {
        return consultationService.findByPatient(patientId);
    }
    
    /**
     * New endpoints for Medecin module
     */
    @GetMapping("/medecin/{medecinId}/today")
    public List<ConsultationDTO> getConsultationsByMedecinToday(@PathVariable Long medecinId) {
        return consultationService.findByMedecinToday(medecinId);
    }
}
