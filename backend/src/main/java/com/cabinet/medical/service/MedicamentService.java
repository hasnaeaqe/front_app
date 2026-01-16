package com.cabinet.medical.service;

import com.cabinet.medical.entity.Medicament;
import com.cabinet.medical.exception.ResourceNotFoundException;
import com.cabinet.medical.repository.MedicamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MedicamentService {

    private final MedicamentRepository medicamentRepository;

    public List<Medicament> findAll() {
        return medicamentRepository.findAll();
    }

    public Medicament findById(Long id) {
        return medicamentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Médicament non trouvé avec l'id: " + id));
    }
}
