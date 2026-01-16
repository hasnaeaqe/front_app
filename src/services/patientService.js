import api from './api';

const patientService = {
  getAll: () => api.get('/patients'),
  
  getById: (id) => api.get(`/patients/${id}`),
  
  create: (patient) => api.post('/patients', patient),
  
  update: (id, patient) => api.put(`/patients/${id}`, patient),
  
  delete: (id) => api.delete(`/patients/${id}`),
  
  search: (query) => api.get(`/patients/search?query=${query}`),
  
  sendToDoctor: (id) => api.post(`/patients/${id}/send-to-medecin`)
};

export default patientService;
