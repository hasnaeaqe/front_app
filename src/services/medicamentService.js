import api from './api';

const medicamentService = {
  getAll: () => api.get('/medicaments'),
  
  getById: (id) => api.get(`/medicaments/${id}`)
};

export default medicamentService;
