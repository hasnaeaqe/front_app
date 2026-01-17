import api from './api';

const medecinService = {
  // Statistics
  getStats: (medecinId) => {
    return api.get(`/api/medecin/stats?medecinId=${medecinId}`);
  },

  // Patient search
  searchPatients: (type, query) => {
    return api.get(`/api/medecin/patients/search?type=${type}&q=${query}`);
  },

  getPatientProfilComplet: (patientId) => {
    return api.get(`/api/medecin/patients/${patientId}/profil-complet`);
  },

  // Consultations
  createConsultation: (consultationData) => {
    return api.post('/api/consultations', consultationData);
  },

  getConsultationsByPatient: (patientId) => {
    return api.get(`/api/consultations/patient/${patientId}`);
  },

  getConsultationsByMedecinToday: (medecinId) => {
    return api.get(`/api/consultations/medecin/${medecinId}/today`);
  },

  // Ordonnances
  createOrdonnance: (ordonnanceData) => {
    return api.post('/api/ordonnances', ordonnanceData);
  },

  getOrdonnancesByPatient: (patientId) => {
    return api.get(`/api/ordonnances/patient/${patientId}`);
  },

  getOrdonnanceWithDetails: (ordonnanceId) => {
    return api.get(`/api/ordonnances/${ordonnanceId}/details`);
  },

  // Dossier Medical
  getDossierMedicalByPatient: (patientId) => {
    return api.get(`/api/dossiers-medicaux/patient/${patientId}`);
  },

  createDossierMedical: (patientId, medecinId, dossierData) => {
    return api.post(`/api/dossiers-medicaux?patientId=${patientId}&medecinId=${medecinId}`, dossierData);
  },

  updateDossierMedical: (dossierId, dossierData) => {
    return api.put(`/api/dossiers-medicaux/${dossierId}`, dossierData);
  },

  // Notifications
  sendPatientToMedecin: (patientId, medecinId) => {
    return api.post(`/api/notifications/send-patient-to-medecin?patientId=${patientId}&medecinId=${medecinId}`);
  },

  getPatientEnCours: (medecinId) => {
    return api.get(`/api/notifications/medecin/${medecinId}/patient-encours`);
  },

  clearPatientEnCours: (medecinId) => {
    return api.delete(`/api/notifications/medecin/${medecinId}/clear-patient-encours`);
  },

  // Medicaments (for autocomplete)
  searchMedicaments: (query) => {
    return api.get(`/api/medicaments/search?q=${query}`);
  },

  getAllMedicaments: () => {
    return api.get('/api/medicaments');
  },
  
  // PDF download
  downloadOrdonnancePDF: (ordonnanceId) => {
    return api.get(`/api/ordonnances/${ordonnanceId}/pdf`, {
      responseType: 'blob'
    });
  },
};

export default medecinService;
