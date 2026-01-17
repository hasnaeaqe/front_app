import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { Card, Button } from '../../components/UI';
import { Save, ArrowLeft } from 'lucide-react';
import medecinService from '../../services/medecinService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const DossierMedicalForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    antMedicaux: '',
    antChirurgicaux: '',
    allergies: '',
    habitudes: '',
    diagnostic: '',
    traitement: '',
    observations: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [existingDossier, setExistingDossier] = useState(null);

  useEffect(() => {
    fetchDossierMedical();
  }, [patientId]);

  const fetchDossierMedical = async () => {
    try {
      const response = await medecinService.getDossierMedicalByPatient(patientId);
      if (response.data) {
        setExistingDossier(response.data);
        setFormData({
          antMedicaux: response.data.antMedicaux || '',
          antChirurgicaux: response.data.antChirurgicaux || '',
          allergies: response.data.allergies || '',
          habitudes: response.data.habitudes || '',
          diagnostic: response.data.diagnostic || '',
          traitement: response.data.traitement || '',
          observations: response.data.observations || ''
        });
      }
    } catch (error) {
      // No dossier exists yet, that's okay
      console.log('Aucun dossier médical trouvé, création d\'un nouveau');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      
      if (existingDossier) {
        // Update existing dossier
        await medecinService.updateDossierMedical(existingDossier.id, formData);
        toast.success('Dossier médical mis à jour avec succès');
      } else {
        // Create new dossier
        await medecinService.createDossierMedical(patientId, user.id, formData);
        toast.success('Dossier médical créé avec succès');
      }
      
      navigate(`/medecin/patients/${patientId}`);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast.error('Erreur lors de l\'enregistrement du dossier médical');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {existingDossier ? 'Modifier' : 'Créer'} le Dossier Médical
            </h1>
            <p className="text-gray-600 mt-1">
              Renseignez les informations médicales du patient
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(`/medecin/patients/${patientId}`)}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
        </div>

        {/* Dossier Medical Form */}
        <Card borderColor="violet">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Antécédents Médicaux */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Antécédents Médicaux
                </label>
                <textarea
                  name="antMedicaux"
                  value={formData.antMedicaux}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Maladies, traitements en cours, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              {/* Antécédents Chirurgicaux */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Antécédents Chirurgicaux
                </label>
                <textarea
                  name="antChirurgicaux"
                  value={formData.antChirurgicaux}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Opérations, interventions chirurgicales, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergies
                </label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Allergies médicamenteuses, alimentaires, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              {/* Habitudes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habitudes
                </label>
                <textarea
                  name="habitudes"
                  value={formData.habitudes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tabac, alcool, sport, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Diagnostic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnostic Général
              </label>
              <textarea
                name="diagnostic"
                value={formData.diagnostic}
                onChange={handleChange}
                rows={3}
                placeholder="Diagnostic général du patient..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Traitement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Traitement de Fond
              </label>
              <textarea
                name="traitement"
                value={formData.traitement}
                onChange={handleChange}
                rows={3}
                placeholder="Traitement habituel du patient..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Observations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observations
              </label>
              <textarea
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                rows={3}
                placeholder="Notes et observations supplémentaires..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/medecin/patients/${patientId}`)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Enregistrement...' : existingDossier ? 'Mettre à jour' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DossierMedicalForm;
