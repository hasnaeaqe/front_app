import api from './api';

const rendezVousService = {
  getAll: () => api.get('/rendez-vous'),
  
  getById: (id) => api.get(`/rendez-vous/${id}`),
  
  create: (rendezVous) => api.post('/rendez-vous', rendezVous),
  
  update: (id, rendezVous) => api.put(`/rendez-vous/${id}`, rendezVous),
  
  delete: (id) => api.delete(`/rendez-vous/${id}`),
  
  getByMedecin: (medecinId, date) => {
    const params = date ? `?date=${date}` : '';
    return api.get(`/rendez-vous/medecin/${medecinId}${params}`);
  },
  
  getByPatient: (patientId) => api.get(`/rendez-vous/patient/${patientId}`)
};

export default rendezVousService;
