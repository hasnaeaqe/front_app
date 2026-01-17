package com.cabinet.medical.service;

import com.cabinet.medical.dto.RendezVousSecretaireDTO;
import com.cabinet.medical.dto.SecretaireStatsDTO;
import com.cabinet.medical.entity.Facture;
import com.cabinet.medical.entity.RendezVous;
import com.cabinet.medical.repository.FactureRepository;
import com.cabinet.medical.repository.PatientRepository;
import com.cabinet.medical.repository.RendezVousRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SecretaireStatistiquesService {

    private final PatientRepository patientRepository;
    private final RendezVousRepository rendezVousRepository;
    private final FactureRepository factureRepository;

    /**
     * Calculate all statistics for secretaire dashboard
     */
    public SecretaireStatsDTO getStatistiques() {
        // Total patients in database
        Long patientsTotal = patientRepository.count();
        
        // Count appointments for today
        LocalDate today = LocalDate.now();
        Long rdvAujourdhui = rendezVousRepository.countByDateRdv(today);
        
        // Count unpaid invoices
        Long facturesEnAttente = factureRepository.countByStatutPaiement(Facture.StatutPaiement.EN_ATTENTE);
        
        // Calculate total revenue for current month (only paid invoices)
        YearMonth currentMonth = YearMonth.now();
        LocalDate startOfMonth = currentMonth.atDay(1);
        LocalDate endOfMonth = currentMonth.atEndOfMonth();
        Double revenuTotal = factureRepository.sumRevenuByMonth(startOfMonth, endOfMonth);
        
        // Ensure revenuTotal is not null
        if (revenuTotal == null) {
            revenuTotal = 0.0;
        }
        
        return new SecretaireStatsDTO(patientsTotal, rdvAujourdhui, facturesEnAttente, revenuTotal);
    }
    
    /**
     * Get today's appointments ordered by time
     */
    public List<RendezVousSecretaireDTO> getRendezVousAujourdhui() {
        LocalDate today = LocalDate.now();
        List<RendezVous> rendezVous = rendezVousRepository.findByDateRdvOrderByHeureRdvAsc(today);
        
        return rendezVous.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Convert RendezVous entity to DTO
     */
    private RendezVousSecretaireDTO convertToDTO(RendezVous rdv) {
        RendezVousSecretaireDTO dto = new RendezVousSecretaireDTO();
        dto.setId(rdv.getId());
        dto.setDateRdv(rdv.getDateRdv());
        dto.setHeureRdv(rdv.getHeureRdv());
        dto.setMotif(rdv.getMotif());
        dto.setStatut(rdv.getStatut().name());
        
        if (rdv.getPatient() != null) {
            dto.setPatientNom(rdv.getPatient().getNom());
            dto.setPatientPrenom(rdv.getPatient().getPrenom());
        }
        
        if (rdv.getMedecin() != null) {
            dto.setMedecinNom(rdv.getMedecin().getNom());
            dto.setMedecinPrenom(rdv.getMedecin().getPrenom());
        }
        
        return dto;
    }
}
