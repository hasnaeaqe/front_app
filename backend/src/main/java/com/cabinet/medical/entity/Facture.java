package com.cabinet.medical.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "facture")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String numero;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consultation_id")
    private Consultation consultation;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut_paiement", columnDefinition = "VARCHAR(50) DEFAULT 'EN_ATTENTE'")
    private StatutPaiement statutPaiement = StatutPaiement.EN_ATTENTE;

    @Column(name = "date_emission", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime dateEmission;

    @Column(name = "date_paiement")
    private LocalDateTime datePaiement;

    @Column(name = "date_echeance")
    private LocalDate dateEcheance;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @PrePersist
    protected void onCreate() {
        if (dateEmission == null) {
            dateEmission = LocalDateTime.now();
        }
    }

    public enum StatutPaiement {
        EN_ATTENTE, PAYE, REMBOURSE
    }
}
