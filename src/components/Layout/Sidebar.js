import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Users, 
  Pill, 
  UserSearch, 
  Calendar, 
  DollarSign, 
  Search, 
  Stethoscope, 
  FileText, 
  LogOut,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout, userRole } = useAuth();

  const navigationByRole = {
    ADMINISTRATEUR: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
      { name: 'Cabinets', path: '/admin/cabinets', icon: Building2 },
      { name: 'Comptes', path: '/admin/comptes', icon: Users },
      { name: 'Médicaments', path: '/admin/medicaments', icon: Pill },
    ],
    SECRETAIRE: [
      { name: 'Dashboard', path: '/secretaire/dashboard', icon: Home },
      { name: 'Gestion des Patients', path: '/secretaire/patients', icon: UserSearch },
      { name: 'Rendez-vous', path: '/secretaire/rendez-vous', icon: Calendar },
      { name: 'Facturation', path: '/secretaire/facturation', icon: DollarSign },
    ],
    MEDECIN: [
      { name: 'Dashboard', path: '/medecin/dashboard', icon: Home },
      { name: 'Recherche Patients', path: '/medecin/recherche-patients', icon: Search },
      { name: 'Consultations', path: '/medecin/consultations', icon: Stethoscope },
      { name: 'Dossier Médical', path: '/medecin/dossier-medical', icon: FileText },
    ],
  };

  const navigation = navigationByRole[userRole] || [];

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-[#5B4FED] to-[#4338CA] text-white w-64 flex flex-col z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8" />
            <h1 className="text-xl font-bold">Cabinet Médical</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive
                    ? 'bg-white/20 border-r-4 border-white font-semibold'
                    : 'hover:bg-white/10'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info & Logout */}
        <div className="border-t border-white/20 p-4">
          <div className="mb-3 px-2">
            <p className="text-sm text-white/70">Connecté en tant que</p>
            <p className="font-semibold truncate">{user?.nom || 'Utilisateur'}</p>
            <p className="text-xs text-white/60">{userRole}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
