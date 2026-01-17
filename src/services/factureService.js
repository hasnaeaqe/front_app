import api from './api';

const factureService = {
  // Get all factures or filter by status
  getAll: async (statut = null) => {
    try {
      const url = statut ? `/api/factures?statut=${statut}` : '/api/factures';
      const response = await api.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching factures:', error);
      throw error;
    }
  },

  // Get facture by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/api/factures/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching facture:', error);
      throw error;
    }
  },

  // Get factures by patient
  getByPatient: async (patientId) => {
    try {
      const response = await api.get(`/api/factures/patient/${patientId}`);
      return response;
    } catch (error) {
      console.error('Error fetching patient factures:', error);
      throw error;
    }
  },

  // Get facture statistics
  getStats: async () => {
    try {
      const response = await api.get('/api/factures/stats');
      return response;
    } catch (error) {
      console.error('Error fetching facture stats:', error);
      throw error;
    }
  },

  // Create new facture
  create: async (factureData) => {
    try {
      const response = await api.post('/api/factures', factureData);
      return response;
    } catch (error) {
      console.error('Error creating facture:', error);
      throw error;
    }
  },

  // Mark facture as paid
  payer: async (id) => {
    try {
      const response = await api.put(`/api/factures/${id}/payer`);
      return response;
    } catch (error) {
      console.error('Error marking facture as paid:', error);
      throw error;
    }
  }
};

export default factureService;
