package com.cabinet.medical.controller;

import com.cabinet.medical.dto.request.RendezVousRequest;
import com.cabinet.medical.entity.RendezVous;
import com.cabinet.medical.service.RendezVousService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rendez-vous")
@RequiredArgsConstructor
public class RendezVousController {

    private final RendezVousService rendezVousService;

    @GetMapping
    public List<RendezVous> getAllRendezVous() {
        return rendezVousService.findAll();
    }

    @GetMapping("/{id}")
    public RendezVous getRendezVousById(@PathVariable Long id) {
        return rendezVousService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RendezVous createRendezVous(@Valid @RequestBody RendezVousRequest request) {
        return rendezVousService.create(request);
    }

    @PutMapping("/{id}")
    public RendezVous updateRendezVous(@PathVariable Long id, @Valid @RequestBody RendezVousRequest request) {
        return rendezVousService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRendezVous(@PathVariable Long id) {
        rendezVousService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/medecin/{medecinId}")
    public List<RendezVous> getRendezVousByMedecinAndDate(
            @PathVariable Long medecinId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return rendezVousService.findByMedecinAndDate(medecinId, date);
    }

    @GetMapping("/patient/{patientId}")
    public List<RendezVous> getRendezVousByPatient(@PathVariable Long patientId) {
        return rendezVousService.findByPatient(patientId);
    }
}
