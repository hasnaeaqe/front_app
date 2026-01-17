package com.cabinet.medical.service;

import com.cabinet.medical.dto.MedecinStatsDTO;
import com.cabinet.medical.repository.ConsultationRepository;
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
        
        // TODO: Calculer le revenu (nécessite une table facture liée)
        // Pour l'instant, on retourne un calcul simple: nombre de consultations * prix moyen
        Double revenuAujourdhui = consultationsAujourdhui * 200.0; // Prix moyen de 200 DH
        
        return new MedecinStatsDTO(patientsTotal, consultationsAujourdhui, consultationsEnCours, revenuAujourdhui);
    }
}
