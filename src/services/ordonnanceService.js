import api from './api';

const ordonnanceService = {
  getAll: () => api.get('/ordonnances'),
  
  getById: (id) => api.get(`/ordonnances/${id}`),
  
  create: (ordonnance) => api.post('/ordonnances', ordonnance),
  
  getByPatient: (patientId) => api.get(`/ordonnances/patient/${patientId}`)
};

export default ordonnanceService;
