import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import dossierMedicalService from '../../services/dossierMedicalService';
import patientService from '../../services/patientService';
import { useAuth } from '../../context/AuthContext';
import toast from '../../utils/toast';
import { 
  FileText, 
  Save, 
  Edit,
  ArrowLeft,
  User,
  AlertTriangle,
  Loader
} from 'lucide-react';

const DossierMedicalForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  
  // State
  const [patient, setPatient] = useState(null);
  const [dossierMedical, setDossierMedical] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    antecedentsMedicaux: '',
    antecedentsChirurgicaux: '',
    allergies: '',
    habitudes: '',
    diagnosticActuel: '',
    traitementActuel: '',
    observations: ''
  });

  useEffect(() => {
    if (patientId) {
      fetchData();
    }
  }, [patientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API calls when backend is ready
      // const patientResponse = await patientService.getById(patientId);
      // const dossierResponse = await dossierMedicalService.getByPatient(patientId);
      
      // Mock data for development
      const mockPatient = {
        id: patientId,
        nom: 'Alami',
        prenom: 'Mohammed',
        cin: 'AB123456',
        dateNaissance: '1985-05-15',
        age: 38
      };
      
      const mockDossier = {
        id: 1,
        patientId: patientId,
        antecedentsMedicaux: 'Hypertension artérielle depuis 2018\nDiabète de type 2 diagnostiqué en 2020',
        antecedentsChirurgicaux: 'Appendicectomie en 2005\nChirurgie du genou en 2019',
        allergies: 'Pénicilline\nPollen',
        habitudes: 'Non fumeur\nConsommation d\'alcool occasionnelle\nPratique du sport 2 fois par semaine',
        diagnosticActuel: 'Suivi régulier pour hypertension et diabète',
        traitementActuel: 'Amlodipine 5mg - 1cp/jour\nMetformine 850mg - 2cp/jour',
        observations: 'Patient compliant au traitement\nContrôle régulier des paramètres nécessaire'
      };
      
      setPatient(mockPatient);
      setDossierMedical(mockDossier);
      
      if (mockDossier) {
        setFormData({
          antecedentsMedicaux: mockDossier.antecedentsMedicaux || '',
          antecedentsChirurgicaux: mockDossier.antecedentsChirurgicaux || '',
          allergies: mockDossier.allergies || '',
          habitudes: mockDossier.habitudes || '',
          diagnosticActuel: mockDossier.diagnosticActuel || '',
          traitementActuel: mockDossier.traitementActuel || '',
          observations: mockDossier.observations || ''
        });
        setIsEditing(true);
      } else {
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erreur lors du chargement des données');
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    // All fields are optional, but we can add specific validations if needed
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      const dossierData = {
        patientId: patientId,
        ...formData
      };
      
      // TODO: Replace with actual API calls
      if (isEditing && dossierMedical) {
        // await dossierMedicalService.update(dossierMedical.id, dossierData);
        toast.success('Dossier médical mis à jour avec succès');
      } else {
        // await dossierMedicalService.create(dossierData);
        toast.success('Dossier médical créé avec succès');
      }
      
      // Navigate back to patient profile
      navigate(`/medecin/patients/${patientId}`);
    } catch (err) {
      console.error('Error saving dossier medical:', err);
      toast.error('Erreur lors de l\'enregistrement du dossier médical');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/medecin/patients/${patientId}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Chargement...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !patient) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-red-600">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p>{error || 'Patient non trouvé'}</p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => navigate('/medecin/patients')}
          >
            Retour
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={handleCancel}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Modifier le Dossier Médical' : 'Créer un Dossier Médical'}
            </h1>
          </div>
          <Button
            variant="secondary"
            onClick={handleCancel}
          >
            Retour au profil
          </Button>
        </div>

        {/* Patient Info Card */}
        <Card>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {patient.nom} {patient.prenom}
              </h2>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                <span>CIN: {patient.cin}</span>
                <span>•</span>
                <span>{patient.age} ans</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <div className="space-y-6">
              {/* Antécédents Médicaux */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Antécédents médicaux
                </label>
                <textarea
                  name="antecedentsMedicaux"
                  value={formData.antecedentsMedicaux}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Listez les antécédents médicaux du patient (maladies chroniques, hospitalisations, etc.)..."
                />
              </div>

              {/* Antécédents Chirurgicaux */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Antécédents chirurgicaux
                </label>
                <textarea
                  name="antecedentsChirurgicaux"
                  value={formData.antecedentsChirurgicaux}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Listez les interventions chirurgicales antérieures avec dates si possible..."
                />
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                  Allergies
                </label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-red-50"
                  placeholder="Listez toutes les allergies connues (médicaments, aliments, substances, etc.)..."
                />
                <p className="mt-1 text-sm text-red-600">
                  ⚠️ Information critique - Vérifier attentivement
                </p>
              </div>

              {/* Habitudes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habitudes de vie
                </label>
                <textarea
                  name="habitudes"
                  value={formData.habitudes}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tabac, alcool, activité sportive, alimentation, etc..."
                />
              </div>

              {/* Diagnostic Actuel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnostic actuel
                </label>
                <textarea
                  name="diagnosticActuel"
                  value={formData.diagnosticActuel}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Diagnostic médical actuel, pathologies en cours de traitement..."
                />
              </div>

              {/* Traitement Actuel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Traitement actuel
                </label>
                <textarea
                  name="traitementActuel"
                  value={formData.traitementActuel}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Médicaments en cours, posologie, durée..."
                />
              </div>

              {/* Observations Générales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observations générales
                </label>
                <textarea
                  name="observations"
                  value={formData.observations}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Observations générales, notes importantes, compliance au traitement..."
                />
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <Card>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Mettre à jour' : 'Enregistrer'}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default DossierMedicalForm;
