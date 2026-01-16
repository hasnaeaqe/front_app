package com.cabinet.medical.controller;

import com.cabinet.medical.dto.request.OrdonnanceRequest;
import com.cabinet.medical.entity.Ordonnance;
import com.cabinet.medical.service.OrdonnanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordonnances")
@RequiredArgsConstructor
public class OrdonnanceController {

    private final OrdonnanceService ordonnanceService;

    @GetMapping
    public List<Ordonnance> getAllOrdonnances() {
        return ordonnanceService.findAll();
    }

    @GetMapping("/{id}")
    public Ordonnance getOrdonnanceById(@PathVariable Long id) {
        return ordonnanceService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Ordonnance createOrdonnance(@Valid @RequestBody OrdonnanceRequest request) {
        return ordonnanceService.create(request);
    }

    @GetMapping("/patient/{patientId}")
    public List<Ordonnance> getOrdonnancesByPatient(@PathVariable Long patientId) {
        return ordonnanceService.findByPatient(patientId);
    }
}
