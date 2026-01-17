import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { Card, Button } from '../../components/UI';
import { Save, ArrowLeft } from 'lucide-react';
import medecinService from '../../services/medecinService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ConsultationForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    diagnostic: '',
    traitement: '',
    observations: '',
    duree: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.diagnostic.trim()) {
      toast.error('Le diagnostic est requis');
      return;
    }

    try {
      setLoading(true);
      
      const consultationData = {
        patientId: parseInt(patientId),
        medecinId: user.id,
        diagnostic: formData.diagnostic,
        traitement: formData.traitement,
        observations: formData.observations,
        duree: formData.duree ? parseInt(formData.duree) : null
      };
      
      await medecinService.createConsultation(consultationData);
      toast.success('Consultation enregistrée avec succès');
      navigate(`/medecin/patients/${patientId}`);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast.error('Erreur lors de l\'enregistrement de la consultation');
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
            <h1 className="text-3xl font-bold text-gray-900">Nouvelle Consultation</h1>
            <p className="text-gray-600 mt-1">Enregistrer une consultation pour le patient</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(`/medecin/patients/${patientId}`)}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
        </div>

        {/* Consultation Form */}
        <Card borderColor="cyan">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Diagnostic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnostic <span className="text-red-500">*</span>
              </label>
              <textarea
                name="diagnostic"
                value={formData.diagnostic}
                onChange={handleChange}
                rows={4}
                placeholder="Décrivez le diagnostic..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
            </div>

            {/* Traitement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Traitement
              </label>
              <textarea
                name="traitement"
                value={formData.traitement}
                onChange={handleChange}
                rows={4}
                placeholder="Décrivez le traitement prescrit..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            {/* Durée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée (minutes)
              </label>
              <input
                type="number"
                name="duree"
                value={formData.duree}
                onChange={handleChange}
                min="0"
                placeholder="Ex: 30"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ConsultationForm;
