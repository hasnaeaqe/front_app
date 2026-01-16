import api from './api';

const consultationService = {
  getAll: () => api.get('/consultations'),
  
  getById: (id) => api.get(`/consultations/${id}`),
  
  create: (consultation) => api.post('/consultations', consultation),
  
  getByPatient: (patientId) => api.get(`/consultations/patient/${patientId}`)
};

export default consultationService;
