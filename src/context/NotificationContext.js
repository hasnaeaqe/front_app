import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [patientEnCours, setPatientEnCours] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Fonction pour récupérer les notifications
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await api.get('/notifications?lu=false');
      setNotifications(response.data);
      setUnreadCount(response.data.length);
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    }
  }, [isAuthenticated]);

  // Fonction pour récupérer le patient en cours (pour médecin)
  const fetchPatientEnCours = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'MEDECIN') return;
    
    try {
      const response = await api.get(`/api/notifications/medecin/${user.id}/patient-encours`);
      if (response.data) {
        setPatientEnCours(response.data);
      }
    } catch (error) {
      // Pas de patient en cours, c'est normal
      setPatientEnCours(null);
    }
  }, [isAuthenticated, user]);

  // Polling toutes les 10 secondes pour les notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchNotifications();
    fetchPatientEnCours();

    const interval = setInterval(() => {
      fetchNotifications();
      fetchPatientEnCours();
    }, 10000); // 10 secondes

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications, fetchPatientEnCours]);

  // Marquer une notification comme lue
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/marquer-lu`);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/marquer-toutes-lues');
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
    }
  };

  // Effacer le patient en cours
  const clearPatientEnCours = () => {
    setPatientEnCours(null);
  };

  const value = {
    notifications,
    unreadCount,
    patientEnCours,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearPatientEnCours,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications doit être utilisé dans un NotificationProvider');
  }
  return context;
};

export default NotificationContext;
