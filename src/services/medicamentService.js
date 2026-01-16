import api from './api';

const medicamentService = {
  getAll: () => api.get('/medicaments'),
  
  getById: (id) => api.get(`/medicaments/${id}`),
  
  search: (query) => api.get(`/medicaments/search?q=${encodeURIComponent(query)}`)
};

export default medicamentService;
