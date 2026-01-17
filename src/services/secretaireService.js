import api from './api';

const secretaireService = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get('/api/secretaire/stats');
      return response;
    } catch (error) {
      console.error('Error fetching secretaire stats:', error);
      throw error;
    }
  },

  // Get today's appointments
  getRendezVousAujourdhui: async () => {
    try {
      const response = await api.get('/api/secretaire/rendez-vous/aujourdhui');
      return response;
    } catch (error) {
      console.error('Error fetching today\'s appointments:', error);
      throw error;
    }
  }
};

export default secretaireService;
