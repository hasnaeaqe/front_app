import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification et l'ID utilisateur
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData.id) {
        config.headers['X-User-Id'] = userData.id;
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  }
  
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Déconnecter l'utilisateur si non authentifié
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Note: En production, utiliser React Router pour la navigation
      // Pour le moment, rechargement simple de la page
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
