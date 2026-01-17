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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConsultationController {

    private final ConsultationService consultationService;

    @GetMapping
    public List<ConsultationDTO> getAllConsultations() {
        return consultationService.findAll()
                .stream()
                .map(consultationService::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ConsultationDTO getConsultationById(@PathVariable Long id) {
        return consultationService.convertToDTO(consultationService.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConsultationDTO createConsultation(@Valid @RequestBody ConsultationRequest request) {
        return consultationService.convertToDTO(consultationService.create(request));
    }

    @GetMapping("/patient/{patientId}")
    public List<ConsultationDTO> getConsultationsByPatient(@PathVariable Long patientId) {
        return consultationService.findByPatientAsDTO(patientId);
    }
    
    /**
     * New endpoints for Medecin module
     */
    @GetMapping("/medecin/{medecinId}/today")
    public List<ConsultationDTO> getConsultationsByMedecinToday(@PathVariable Long medecinId) {
        return consultationService.findByMedecinToday(medecinId);
    }
}
