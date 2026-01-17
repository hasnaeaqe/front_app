package com.cabinet.medical.service;

import com.cabinet.medical.dto.FactureDTO;
import com.cabinet.medical.dto.FactureStatsDTO;
import com.cabinet.medical.dto.request.FactureRequest;
import com.cabinet.medical.entity.Consultation;
import com.cabinet.medical.entity.Facture;
import com.cabinet.medical.entity.Patient;
import com.cabinet.medical.exception.ResourceNotFoundException;
import com.cabinet.medical.repository.ConsultationRepository;
import com.cabinet.medical.repository.FactureRepository;
import com.cabinet.medical.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FactureService {

    private final FactureRepository factureRepository;
    private final PatientRepository patientRepository;
    private final ConsultationRepository consultationRepository;

    /**
     * Get all factures
     */
    @Transactional(readOnly = true)
    public List<FactureDTO> getAllFactures() {
        return factureRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get facture by ID
     */
    @Transactional(readOnly = true)
    public FactureDTO getFactureById(Long id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée avec l'ID: " + id));
        return convertToDTO(facture);
    }

    /**
     * Get factures by patient
     */
    @Transactional(readOnly = true)
    public List<FactureDTO> getFacturesByPatient(Long patientId) {
        return factureRepository.findByPatientId(patientId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get factures by status
     */
    @Transactional(readOnly = true)
    public List<FactureDTO> getFacturesByStatut(String statut) {
        Facture.StatutPaiement statutPaiement = Facture.StatutPaiement.valueOf(statut);
        return factureRepository.findByStatutPaiement(statutPaiement).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create a new facture
     */
    public FactureDTO createFacture(FactureRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'ID: " + request.getPatientId()));

        Facture facture = new Facture();
        facture.setNumero(generateFactureNumero());
        facture.setPatient(patient);
        
        if (request.getConsultationId() != null) {
            Consultation consultation = consultationRepository.findById(request.getConsultationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Consultation non trouvée avec l'ID: " + request.getConsultationId()));
            facture.setConsultation(consultation);
        }
        
        facture.setMontant(request.getMontant());
        facture.setDateEcheance(request.getDateEcheance());
        facture.setNotes(request.getNotes());
        facture.setStatutPaiement(Facture.StatutPaiement.EN_ATTENTE);
        facture.setDateEmission(LocalDateTime.now());

        Facture savedFacture = factureRepository.save(facture);
        return convertToDTO(savedFacture);
    }

    /**
     * Mark facture as paid
     */
    public FactureDTO payerFacture(Long id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée avec l'ID: " + id));

        facture.setStatutPaiement(Facture.StatutPaiement.PAYE);
        facture.setDatePaiement(LocalDateTime.now());

        Facture updatedFacture = factureRepository.save(facture);
        return convertToDTO(updatedFacture);
    }

    /**
     * Get facture statistics
     */
    @Transactional(readOnly = true)
    public FactureStatsDTO getFactureStats() {
        // Count unpaid invoices
        Long totalEnAttente = factureRepository.countByStatutPaiement(Facture.StatutPaiement.EN_ATTENTE);
        
        // Count paid invoices this month
        YearMonth currentMonth = YearMonth.now();
        LocalDate startOfMonth = currentMonth.atDay(1);
        LocalDate endOfMonth = currentMonth.atEndOfMonth();
        
        List<Facture> facturesPayeesMois = factureRepository.findByStatutPaiement(Facture.StatutPaiement.PAYE)
                .stream()
                .filter(f -> f.getDatePaiement() != null && 
                        !f.getDatePaiement().toLocalDate().isBefore(startOfMonth) && 
                        !f.getDatePaiement().toLocalDate().isAfter(endOfMonth))
                .collect(Collectors.toList());
        
        Long totalPayeesMois = (long) facturesPayeesMois.size();
        
        // Calculate amount waiting
        Double montantEnAttente = factureRepository.findByStatutPaiement(Facture.StatutPaiement.EN_ATTENTE)
                .stream()
                .mapToDouble(f -> f.getMontant().doubleValue())
                .sum();
        
        // Calculate amount collected this month
        Double montantEncaisseMois = facturesPayeesMois.stream()
                .mapToDouble(f -> f.getMontant().doubleValue())
                .sum();
        
        return new FactureStatsDTO(totalEnAttente, totalPayeesMois, montantEnAttente, montantEncaisseMois);
    }

    /**
     * Generate unique facture number
     */
    private String generateFactureNumero() {
        String prefix = "FACT-";
        String timestamp = String.valueOf(System.currentTimeMillis());
        String uniqueId = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return prefix + timestamp + "-" + uniqueId;
    }

    /**
     * Convert entity to DTO
     */
    private FactureDTO convertToDTO(Facture facture) {
        FactureDTO dto = new FactureDTO();
        dto.setId(facture.getId());
        dto.setNumero(facture.getNumero());
        
        if (facture.getPatient() != null) {
            dto.setPatientId(facture.getPatient().getId());
            dto.setPatientNom(facture.getPatient().getNom());
            dto.setPatientPrenom(facture.getPatient().getPrenom());
            dto.setPatientCin(facture.getPatient().getCin());
        }
        
        if (facture.getConsultation() != null) {
            dto.setConsultationId(facture.getConsultation().getId());
        }
        
        dto.setMontant(facture.getMontant());
        dto.setStatutPaiement(facture.getStatutPaiement().name());
        dto.setDateEmission(facture.getDateEmission());
        dto.setDatePaiement(facture.getDatePaiement());
        dto.setDateEcheance(facture.getDateEcheance());
        dto.setNotes(facture.getNotes());
        
        return dto;
    }
}
