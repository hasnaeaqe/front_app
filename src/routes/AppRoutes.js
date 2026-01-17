import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Auth/Login';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import CabinetList from '../pages/Admin/CabinetList';
import CompteList from '../pages/Admin/CompteList';
import MedicamentList from '../pages/Admin/MedicamentList';
import SecretaireDashboard from '../pages/Secretaire/SecretaireDashboard';
import MedecinDashboard from '../pages/Medecin/MedecinDashboard';
import RendezVousList from '../pages/RendezVous/RendezVousList';

// Placeholder components - will be created later
const PatientList = () => <div className="p-6"><h1 className="text-2xl font-bold">Gestion des Patients</h1></div>;
const PatientProfile = () => <div className="p-6"><h1 className="text-2xl font-bold">Profil Patient</h1></div>;
const FactureList = () => <div className="p-6"><h1 className="text-2xl font-bold">Facturation</h1></div>;

const RecherchePatients = () => <div className="p-6"><h1 className="text-2xl font-bold">Recherche Patients</h1></div>;
const ConsultationList = () => <div className="p-6"><h1 className="text-2xl font-bold">Consultations</h1></div>;
const ConsultationForm = () => <div className="p-6"><h1 className="text-2xl font-bold">Nouvelle Consultation</h1></div>;
const DossierMedicalForm = () => <div className="p-6"><h1 className="text-2xl font-bold">Dossier Médical</h1></div>;

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Route publique */}
            <Route path="/login" element={<Login />} />

            {/* Routes ADMINISTRATEUR */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMINISTRATEUR']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/cabinets"
              element={
                <ProtectedRoute allowedRoles={['ADMINISTRATEUR']}>
                  <CabinetList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/comptes"
              element={
                <ProtectedRoute allowedRoles={['ADMINISTRATEUR']}>
                  <CompteList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/medicaments"
              element={
                <ProtectedRoute allowedRoles={['ADMINISTRATEUR']}>
                  <MedicamentList />
                </ProtectedRoute>
              }
            />

            {/* Routes SECRETAIRE */}
            <Route
              path="/secretaire/dashboard"
              element={
                <ProtectedRoute allowedRoles={['SECRETAIRE']}>
                  <SecretaireDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/secretaire/patients"
              element={
                <ProtectedRoute allowedRoles={['SECRETAIRE']}>
                  <PatientList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/secretaire/patients/:id"
              element={
                <ProtectedRoute allowedRoles={['SECRETAIRE']}>
                  <PatientProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/secretaire/rendez-vous"
              element={
                <ProtectedRoute allowedRoles={['SECRETAIRE']}>
                  <RendezVousList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/secretaire/facturation"
              element={
                <ProtectedRoute allowedRoles={['SECRETAIRE']}>
                  <FactureList />
                </ProtectedRoute>
              }
            />

            {/* Routes MEDECIN */}
            <Route
              path="/medecin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['MEDECIN']}>
                  <MedecinDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/recherche-patients"
              element={
                <ProtectedRoute allowedRoles={['MEDECIN']}>
                  <RecherchePatients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/patients/:id"
              element={
                <ProtectedRoute allowedRoles={['MEDECIN']}>
                  <PatientProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/consultations"
              element={
                <ProtectedRoute allowedRoles={['MEDECIN']}>
                  <ConsultationList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/consultations/nouvelle/:patientId"
              element={
                <ProtectedRoute allowedRoles={['MEDECIN']}>
                  <ConsultationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/dossier-medical/:patientId"
              element={
                <ProtectedRoute allowedRoles={['MEDECIN']}>
                  <DossierMedicalForm />
                </ProtectedRoute>
              }
            />

            {/* Redirection par défaut */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
