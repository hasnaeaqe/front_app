import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Rediriger vers le dashboard approprié selon le rôle
    const roleDashboards = {
      ADMINISTRATEUR: '/admin/dashboard',
      SECRETAIRE: '/secretaire/dashboard',
      MEDECIN: '/medecin/dashboard',
    };
    return <Navigate to={roleDashboards[user.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
