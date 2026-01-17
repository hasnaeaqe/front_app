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
import RecherchePatients from '../pages/Medecin/RecherchePatients';
import PatientProfil from '../pages/Medecin/PatientProfil';
import DossierMedicalForm from '../pages/DossierMedical/DossierMedicalForm';
import DossierMedicalList from '../pages/Medecin/DossierMedicalList';
import ConsultationForm from '../pages/Consultations/ConsultationForm';
import ConsultationList from '../pages/Consultations/ConsultationList';
import RendezVousList from '../pages/RendezVous/RendezVousList';
import { FactureList } from '../pages/Factures';
import PatientList from '../pages/Patients/PatientList';
import PatientProfile from '../pages/Patients/PatientProfile';

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
              path="/medecin/dossiers-medicaux"
              element={
                <ProtectedRoute allowedRoles={['MEDECIN']}>
                  <DossierMedicalList />
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
                  <PatientProfil />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/patients/:patientId"
              element={
                <ProtectedRoute allowedRoles={['MEDECIN']}>
                  <PatientProfil />
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
            <Route
              path="/medecin/dossier-medical/:patientId/modifier"
              element={
                <ProtectedRoute allowedRoles={['MEDECIN']}>
                  <DossierMedicalForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/medecin/dossier-medical/:patientId/nouveau"
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
