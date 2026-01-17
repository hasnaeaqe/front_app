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
      // Only redirect to login if the error is from /auth endpoints
      // or if token is actually invalid/expired
      const requestUrl = error.config?.url || '';
      
      // Don't redirect if it's just a "not found" or "forbidden" for a specific resource
      if (requestUrl.includes('/auth/') || requestUrl.includes('/login')) {
        // Déconnecter l'utilisateur si non authentifié
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page
        window.location.href = '/login';
      } else {
        // For other 401 errors, check if we have a token
        const token = localStorage.getItem('token');
        if (!token) {
          // No token at all, redirect to login
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        // If we have a token, just reject the promise without redirect
        // The component will handle the error
      }
    }
    return Promise.reject(error);
  }
);

export default api;
