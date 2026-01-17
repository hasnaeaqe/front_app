import jsPDF from 'jspdf';

/**
 * Generate PDF for medication prescription (Ordonnance Médicaments)
 * @param {Object} data - Prescription data
 * @param {Object} data.doctor - Doctor information
 * @param {Object} data.patient - Patient information
 * @param {Array} data.medicaments - List of medications
 * @param {Date} data.date - Prescription date
 */
export const generateOrdonnanceMedicaments = (data) => {
  const { doctor, patient, medicaments, date } = data;
  
  const doc = new jsPDF();
  let yPos = 20;
  
  // Header - Doctor Info
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Cabinet Médical', 105, yPos, { align: 'center' });
  yPos += 7;
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Dr. ${doctor.nom} ${doctor.prenom}`, 105, yPos, { align: 'center' });
  yPos += 5;
  doc.text(`${doctor.specialite || 'Médecin Généraliste'}`, 105, yPos, { align: 'center' });
  yPos += 5;
  doc.text(`Tél: ${doctor.telephone || ''}`, 105, yPos, { align: 'center' });
  yPos += 10;
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  // Date
  doc.setFontSize(10);
  const dateStr = new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Le ${dateStr}`, 20, yPos);
  yPos += 15;
  
  // Title
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('ORDONNANCE MÉDICAMENTS', 105, yPos, { align: 'center' });
  yPos += 15;
  
  // Patient Info
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Patient: ${patient.nom} ${patient.prenom}`, 20, yPos);
  yPos += 6;
  doc.text(`CIN: ${patient.cin || 'N/A'}`, 20, yPos);
  yPos += 6;
  doc.text(`Âge: ${patient.age || 'N/A'} ans`, 20, yPos);
  yPos += 6;
  if (patient.mutuelle) {
    doc.text(`Mutuelle: ${patient.mutuelle}`, 20, yPos);
    yPos += 6;
  }
  yPos += 10;
  
  // Medications
  doc.setFont(undefined, 'bold');
  doc.text('Prescription:', 20, yPos);
  yPos += 8;
  
  doc.setFont(undefined, 'normal');
  medicaments.forEach((med, index) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Medication number
    doc.setFont(undefined, 'bold');
    doc.text(`${index + 1}. ${med.nom}`, 25, yPos);
    yPos += 6;
    
    // Details
    doc.setFont(undefined, 'normal');
    if (med.posologie) {
      doc.text(`   Posologie: ${med.posologie}`, 25, yPos);
      yPos += 5;
    }
    if (med.duree) {
      doc.text(`   Durée: ${med.duree}`, 25, yPos);
      yPos += 5;
    }
    if (med.quantite) {
      doc.text(`   Quantité: ${med.quantite}`, 25, yPos);
      yPos += 5;
    }
    yPos += 5;
  });
  
  // Footer
  yPos = 260;
  doc.setFontSize(9);
  doc.setFont(undefined, 'italic');
  doc.text('Signature et cachet du médecin', 140, yPos);
  yPos += 10;
  doc.text(`Ordonnance valable 3 mois`, 20, yPos);
  
  // Save PDF
  const fileName = `ordonnance_medicaments_${patient.nom}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
  
  return fileName;
};

/**
 * Generate PDF for medical examination prescription (Ordonnance Examens)
 * @param {Object} data - Prescription data
 * @param {Object} data.doctor - Doctor information
 * @param {Object} data.patient - Patient information
 * @param {Array} data.examens - List of requested examinations
 * @param {string} data.notes - Additional notes
 * @param {Date} data.date - Prescription date
 */
export const generateOrdonnanceExamens = (data) => {
  const { doctor, patient, examens, notes, date } = data;
  
  const doc = new jsPDF();
  let yPos = 20;
  
  // Header - Doctor Info
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Cabinet Médical', 105, yPos, { align: 'center' });
  yPos += 7;
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Dr. ${doctor.nom} ${doctor.prenom}`, 105, yPos, { align: 'center' });
  yPos += 5;
  doc.text(`${doctor.specialite || 'Médecin Généraliste'}`, 105, yPos, { align: 'center' });
  yPos += 5;
  doc.text(`Tél: ${doctor.telephone || ''}`, 105, yPos, { align: 'center' });
  yPos += 10;
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  // Date
  doc.setFontSize(10);
  const dateStr = new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Le ${dateStr}`, 20, yPos);
  yPos += 15;
  
  // Title
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('ORDONNANCE EXAMENS MÉDICAUX', 105, yPos, { align: 'center' });
  yPos += 15;
  
  // Patient Info
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Patient: ${patient.nom} ${patient.prenom}`, 20, yPos);
  yPos += 6;
  doc.text(`CIN: ${patient.cin || 'N/A'}`, 20, yPos);
  yPos += 6;
  doc.text(`Âge: ${patient.age || 'N/A'} ans`, 20, yPos);
  yPos += 6;
  if (patient.mutuelle) {
    doc.text(`Mutuelle: ${patient.mutuelle}`, 20, yPos);
    yPos += 6;
  }
  yPos += 10;
  
  // Examinations
  doc.setFont(undefined, 'bold');
  doc.text('Examens demandés:', 20, yPos);
  yPos += 8;
  
  doc.setFont(undefined, 'normal');
  examens.forEach((exam, index) => {
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text(`${index + 1}. ${exam}`, 25, yPos);
    yPos += 7;
  });
  
  // Additional notes
  if (notes && notes.trim()) {
    yPos += 10;
    doc.setFont(undefined, 'bold');
    doc.text('Notes supplémentaires:', 20, yPos);
    yPos += 7;
    
    doc.setFont(undefined, 'normal');
    const splitNotes = doc.splitTextToSize(notes, 170);
    splitNotes.forEach(line => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 25, yPos);
      yPos += 6;
    });
  }
  
  // Footer
  yPos = 260;
  doc.setFontSize(9);
  doc.setFont(undefined, 'italic');
  doc.text('Signature et cachet du médecin', 140, yPos);
  yPos += 10;
  doc.text(`Ordonnance valable 3 mois`, 20, yPos);
  
  // Save PDF
  const fileName = `ordonnance_examens_${patient.nom}_${new Date().getTime()}.pdf`;
  doc.save(fileName);
  
  return fileName;
};
