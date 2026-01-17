package com.cabinet.medical.service;

import com.cabinet.medical.dto.OrdonnanceDTO;
import com.cabinet.medical.dto.OrdonnanceMedicamentDTO;
import com.cabinet.medical.dto.request.OrdonnanceMedicamentRequest;
import com.cabinet.medical.dto.request.OrdonnanceRequest;
import com.cabinet.medical.entity.*;
import com.cabinet.medical.exception.ResourceNotFoundException;
import com.cabinet.medical.repository.*;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrdonnanceService {

    private final OrdonnanceRepository ordonnanceRepository;
    private final PatientRepository patientRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ConsultationRepository consultationRepository;
    private final MedicamentRepository medicamentRepository;
    private final OrdonnanceMedicamentRepository ordonnanceMedicamentRepository;

    public List<Ordonnance> findAll() {
        return ordonnanceRepository.findAll();
    }

    public Ordonnance findById(Long id) {
        return ordonnanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ordonnance non trouvée avec l'id: " + id));
    }

    @Transactional
    public Ordonnance create(OrdonnanceRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé avec l'id: " + request.getPatientId()));

        Utilisateur medecin = utilisateurRepository.findById(request.getMedecinId())
                .orElseThrow(() -> new ResourceNotFoundException("Médecin non trouvé avec l'id: " + request.getMedecinId()));

        Ordonnance ordonnance = new Ordonnance();
        ordonnance.setPatient(patient);
        ordonnance.setMedecin(medecin);
        ordonnance.setInstructions(request.getInstructions());
        ordonnance.setValideJusquA(request.getValideJusquA());

        if (request.getConsultationId() != null) {
            Consultation consultation = consultationRepository.findById(request.getConsultationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Consultation non trouvée avec l'id: " + request.getConsultationId()));
            ordonnance.setConsultation(consultation);
        }

        Ordonnance savedOrdonnance = ordonnanceRepository.save(ordonnance);

        // TODO: Consider using saveAll() for batch insert optimization for large medication lists
        for (OrdonnanceMedicamentRequest medicamentRequest : request.getMedicaments()) {
            Medicament medicament = medicamentRepository.findById(medicamentRequest.getMedicamentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Médicament non trouvé avec l'id: " + medicamentRequest.getMedicamentId()));

            OrdonnanceMedicament ordonnanceMedicament = new OrdonnanceMedicament();
            ordonnanceMedicament.setOrdonnance(savedOrdonnance);
            ordonnanceMedicament.setMedicament(medicament);
            ordonnanceMedicament.setPosologie(medicamentRequest.getPosologie());
            ordonnanceMedicament.setDuree(medicamentRequest.getDuree());
            ordonnanceMedicament.setQuantite(medicamentRequest.getQuantite());

            ordonnanceMedicamentRepository.save(ordonnanceMedicament);
        }

        return savedOrdonnance;
    }

    public List<Ordonnance> findByPatient(Long patientId) {
        return ordonnanceRepository.findByPatientId(patientId);
    }
    
    /**
     * New methods for Medecin module
     */
    public List<OrdonnanceDTO> findByPatientAsDTO(Long patientId) {
        return ordonnanceRepository.findByPatientIdOrderByDateCreationDesc(patientId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }
    
    public OrdonnanceDTO getOrdonnanceWithMedicaments(Long ordonnanceId) {
        Ordonnance ordonnance = findById(ordonnanceId);
        return convertToDTO(ordonnance);
    }
    
    private OrdonnanceDTO convertToDTO(Ordonnance ordonnance) {
        // Get medicaments for this ordonnance
        List<OrdonnanceMedicamentDTO> medicaments = ordonnanceMedicamentRepository
            .findByOrdonnanceId(ordonnance.getId())
            .stream()
            .map(om -> new OrdonnanceMedicamentDTO(
                om.getId(),
                om.getMedicament().getNom(),
                om.getPosologie(),
                om.getMedicament().getPosologie(), // Using medicament posologie as frequence
                om.getDuree(),
                null // instructions - not available in entity
            ))
            .collect(Collectors.toList());
        
        return new OrdonnanceDTO(
            ordonnance.getId(),
            ordonnance.getConsultation() != null ? ordonnance.getConsultation().getId() : null,
            ordonnance.getPatient().getId(),
            ordonnance.getPatient().getNom(),
            ordonnance.getPatient().getPrenom(),
            ordonnance.getMedecin().getId(),
            ordonnance.getMedecin().getNom(),
            ordonnance.getMedecin().getPrenom(),
            ordonnance.getInstructions(),
            ordonnance.getDateCreation(),
            ordonnance.getValideJusquA(),
            medicaments
        );
    }
    
    /**
     * Generate PDF for ordonnance medicaments
     */
    public byte[] generateOrdonnanceMedicamentsPDF(Long ordonnanceId) {
        Ordonnance ordonnance = findById(ordonnanceId);
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            // En-tête - Cabinet info
            if (ordonnance.getMedecin().getCabinet() != null) {
                document.add(new Paragraph("CABINET MÉDICAL " + ordonnance.getMedecin().getCabinet().getNom())
                    .setFontSize(16).setBold());
                if (ordonnance.getMedecin().getCabinet().getAdresse() != null) {
                    document.add(new Paragraph(ordonnance.getMedecin().getCabinet().getAdresse()));
                }
                if (ordonnance.getMedecin().getCabinet().getNumTel() != null) {
                    document.add(new Paragraph("Tél: " + ordonnance.getMedecin().getCabinet().getNumTel()));
                }
                document.add(new Paragraph("\n"));
            }
            
            // Médecin info
            document.add(new Paragraph("Dr " + ordonnance.getMedecin().getNom() + " " + ordonnance.getMedecin().getPrenom())
                .setFontSize(14).setBold());
            if (ordonnance.getMedecin().getSpecialite() != null) {
                document.add(new Paragraph(ordonnance.getMedecin().getSpecialite().getNom()));
            }
            document.add(new Paragraph("Date : " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
            document.add(new Paragraph("\n"));
            
            // Titre
            document.add(new Paragraph("ORDONNANCE MÉDICALE")
                .setFontSize(18).setBold().setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("\n"));
            
            // Infos patient
            Patient patient = ordonnance.getPatient();
            document.add(new Paragraph("Patient : " + patient.getNom() + " " + patient.getPrenom()).setBold());
            
            if (patient.getDateNaissance() != null) {
                int age = Period.between(patient.getDateNaissance(), LocalDate.now()).getYears();
                document.add(new Paragraph("Âge : " + age + " ans"));
            }
            document.add(new Paragraph("Mutuelle : " + (patient.getTypeMutuelle() != null ? patient.getTypeMutuelle() : "Aucune")));
            document.add(new Paragraph("\n"));
            
            // Liste médicaments
            List<OrdonnanceMedicament> medicaments = ordonnanceMedicamentRepository.findByOrdonnanceId(ordonnance.getId());
            
            for (int index = 0; index < medicaments.size(); index++) {
                OrdonnanceMedicament om = medicaments.get(index);
                document.add(new Paragraph((index + 1) + ". " + om.getMedicament().getNom()).setBold());
                document.add(new Paragraph("   Posologie : " + om.getPosologie()));
                document.add(new Paragraph("   Durée : " + om.getDuree()));
                document.add(new Paragraph("   Quantité : " + om.getQuantite()));
                document.add(new Paragraph("\n"));
            }
            
            // Pied
            document.add(new Paragraph("\n\n"));
            if (ordonnance.getValideJusquA() != null) {
                document.add(new Paragraph("Valide jusqu'au : " + ordonnance.getValideJusquA().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
                document.add(new Paragraph("\n"));
            }
            
            // Signature
            if (ordonnance.getMedecin().getSignature() != null && !ordonnance.getMedecin().getSignature().isEmpty()) {
                document.add(new Paragraph("Signature : " + ordonnance.getMedecin().getSignature())
                    .setTextAlignment(TextAlignment.RIGHT));
            } else {
                document.add(new Paragraph("Dr " + ordonnance.getMedecin().getNom())
                    .setTextAlignment(TextAlignment.RIGHT));
            }
            
            document.close();
            return baos.toByteArray();
        } catch (RuntimeException e) {
            throw new RuntimeException("Erreur lors de la génération du PDF: " + e.getMessage(), e);
        }
    }
}
