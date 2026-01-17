import api from './api';

export const adminService = {
  // Statistiques
  getStats: () => api.get('/admin/stats'),
  getCabinetsRecents: () => api.get('/admin/cabinets-recents'),
  getActiviteRecente: () => api.get('/admin/activite-recente'),
  
  // Gestion Cabinets
  getCabinets: (search) => api.get('/cabinets', { params: { search } }),
  getCabinetById: (id) => api.get(`/cabinets/${id}`),
  createCabinet: (data) => api.post('/cabinets', data),
  updateCabinet: (id, data) => api.put(`/cabinets/${id}`, data),
  deleteCabinet: (id) => api.delete(`/cabinets/${id}`),
  toggleCabinetActif: (id) => api.put(`/cabinets/${id}/toggle-actif`),
  
  // Gestion Comptes Utilisateurs
  getUtilisateurs: (search) => api.get('/utilisateurs', { params: { search } }),
  getUtilisateurById: (id) => api.get(`/utilisateurs/${id}`),
  createUtilisateur: (data) => api.post('/utilisateurs', data),
  updateUtilisateur: (id, data) => api.put(`/utilisateurs/${id}`, data),
  deleteUtilisateur: (id) => api.delete(`/utilisateurs/${id}`),
  toggleUtilisateurActif: (id) => api.put(`/utilisateurs/${id}/toggle-actif`),
  
  // Gestion Médicaments
  getMedicaments: (search) => api.get('/medicaments', { params: { search } }),
  getMedicamentById: (id) => api.get(`/medicaments/${id}`),
  searchMedicaments: (query) => api.get('/medicaments/search', { params: { q: query } }),
  createMedicament: (data) => api.post('/medicaments', data),
  updateMedicament: (id, data) => api.put(`/medicaments/${id}`, data),
  deleteMedicament: (id) => api.delete(`/medicaments/${id}`)
};

export default adminService;
