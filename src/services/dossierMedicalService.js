import api from './api';

const dossierMedicalService = {
  getAll: () => api.get('/dossiers-medicaux'),
  
  getById: (id) => api.get(`/dossiers-medicaux/${id}`),
  
  getByPatient: (patientId) => api.get(`/dossiers-medicaux/patient/${patientId}`),
  
  create: (dossier) => api.post('/dossiers-medicaux', dossier),
  
  update: (id, dossier) => api.put(`/dossiers-medicaux/${id}`, dossier)
};

export default dossierMedicalService;
