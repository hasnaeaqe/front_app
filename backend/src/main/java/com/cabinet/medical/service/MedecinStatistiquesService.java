package com.cabinet.medical.service;

import com.cabinet.medical.dto.MedecinStatsDTO;
import com.cabinet.medical.repository.ConsultationRepository;
import com.cabinet.medical.repository.FactureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MedecinStatistiquesService {

    private final ConsultationRepository consultationRepository;
    private final FactureRepository factureRepository;

    /**
     * Calculer toutes les statistiques du dashboard médecin
     */
    public MedecinStatsDTO getStatistiques(Long medecinId) {
        // Compter tous les patients distincts du médecin
        Long patientsTotal = consultationRepository.countDistinctPatientsByMedecinId(medecinId);
        
        // Compter les consultations d'aujourd'hui
        LocalDate today = LocalDate.now();
        Long consultationsAujourdhui = consultationRepository.countByMedecinIdAndDate(medecinId, today);
        
        // Compter les consultations en cours (aujourd'hui)
        LocalDateTime startOfDay = LocalDateTime.of(today, LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(today, LocalTime.MAX);
        Long consultationsEnCours = (long) consultationRepository
            .findByMedecinIdAndDateConsultationBetween(medecinId, startOfDay, endOfDay)
            .size();
        
        // Calculer le revenu d'aujourd'hui depuis la table facture
        Double revenuAujourdhui = factureRepository.sumRevenuByMedecinIdAndDate(medecinId, today);
        if (revenuAujourdhui == null) {
            revenuAujourdhui = 0.0;
        }
        
        return new MedecinStatsDTO(patientsTotal, consultationsAujourdhui, consultationsEnCours, revenuAujourdhui);
    }
}
