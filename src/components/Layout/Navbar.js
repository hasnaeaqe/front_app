import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, RefreshCw, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Fermer le panneau de notifications quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Titres de page basés sur la route
  const pageTitles = {
    '/admin/dashboard': 'Tableau de bord',
    '/admin/cabinets': 'Gestion des Cabinets',
    '/admin/comptes': 'Gestion des Comptes',
    '/admin/medicaments': 'Gestion des Médicaments',
    '/secretaire/dashboard': 'Tableau de bord',
    '/secretaire/patients': 'Gestion des Patients',
    '/secretaire/rendez-vous': 'Gestion des Rendez-vous',
    '/secretaire/facturation': 'Facturation',
    '/medecin/dashboard': 'Tableau de bord',
    '/medecin/recherche-patients': 'Recherche de Patients',
    '/medecin/consultations': 'Mes Consultations',
    '/medecin/dossier-medical': 'Dossier Médical',
  };

  const pageTitle = pageTitles[location.pathname] || 'Cabinet Médical';

  const handleRefresh = () => {
    fetchNotifications();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = async (notification) => {
    await markAsRead(notification.id);
    setShowNotifications(false);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>

          {/* Page title */}
          <h2 className="text-xl font-semibold text-gray-800">{pageTitle}</h2>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Welcome message */}
          <div className="hidden md:block text-sm text-gray-600">
            Bienvenue, <span className="font-semibold text-gray-800">{user?.nom || 'Utilisateur'}</span>
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Rafraîchir"
          >
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Tout marquer lu
                    </button>
                  )}
                </div>

                <div className="overflow-y-auto flex-1">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Aucune notification
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-sm text-gray-800 flex-1">{notification.message}</p>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {notification.dateCreation && (
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.dateCreation).toLocaleString('fr-FR')}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </button>

          {/* Mobile logout button */}
          <button
            onClick={handleLogout}
            className="sm:hidden p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
            aria-label="Déconnexion"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
