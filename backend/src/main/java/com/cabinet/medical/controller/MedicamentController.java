package com.cabinet.medical.controller;

import com.cabinet.medical.entity.Medicament;
import com.cabinet.medical.service.MedicamentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicaments")
@RequiredArgsConstructor
public class MedicamentController {

    private final MedicamentService medicamentService;

    @GetMapping
    public List<Medicament> getAllMedicaments() {
        return medicamentService.findAll();
    }

    @GetMapping("/{id}")
    public Medicament getMedicamentById(@PathVariable Long id) {
        return medicamentService.findById(id);
    }
}
