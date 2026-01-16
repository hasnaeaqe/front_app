import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import dossierMedicalService from '../../services/dossierMedicalService';
import toast from '../../utils/toast';
import { 
  FileText, 
  Edit,
  AlertTriangle,
  Loader,
  Heart,
  Activity,
  Pill,
  ClipboardList,
  Plus
} from 'lucide-react';

/**
 * DossierMedicalView - Read-only view of medical record
 * Can be integrated into PatientProfile page
 * @param {string} patientId - Patient ID
 * @param {boolean} embedded - If true, renders without layout wrapper
 */
const DossierMedicalView = ({ patientId: propPatientId, embedded = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const patientId = propPatientId || id;
  
  // State
  const [dossierMedical, setDossierMedical] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchDossierMedical();
    }
  }, [patientId]);

  const fetchDossierMedical = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call when backend is ready
      // const response = await dossierMedicalService.getByPatient(patientId);
      // setDossierMedical(response.data);
      
      // Mock data for development
      const mockDossier = {
        id: 1,
        patientId: patientId,
        antecedentsMedicaux: 'Hypertension artérielle depuis 2018\nDiabète de type 2 diagnostiqué en 2020',
        antecedentsChirurgicaux: 'Appendicectomie en 2005\nChirurgie du genou en 2019',
        allergies: 'Pénicilline\nPollen',
        habitudes: 'Non fumeur\nConsommation d\'alcool occasionnelle\nPratique du sport 2 fois par semaine',
        diagnosticActuel: 'Suivi régulier pour hypertension et diabète',
        traitementActuel: 'Amlodipine 5mg - 1cp/jour\nMetformine 850mg - 2cp/jour',
        observations: 'Patient compliant au traitement\nContrôle régulier des paramètres nécessaire',
        dateCreation: '2024-01-01',
        dateModification: '2024-01-15'
      };
      
      setDossierMedical(mockDossier);
    } catch (err) {
      console.error('Error fetching dossier medical:', err);
      setError('Erreur lors du chargement du dossier médical');
      toast.error('Erreur lors du chargement du dossier médical');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/medecin/dossier-medical/${patientId}/modifier`);
  };

  const handleCreate = () => {
    navigate(`/medecin/dossier-medical/${patientId}/nouveau`);
  };

  const renderSection = (title, content, icon, highlight = false) => {
    if (!content || content.trim() === '') {
      return null;
    }
    
    return (
      <div className={`${highlight ? 'border-2 border-red-200 bg-red-50' : 'border border-gray-200 bg-gray-50'} rounded-lg p-4`}>
        <div className="flex items-center space-x-2 mb-3">
          {icon}
          <h3 className={`font-semibold ${highlight ? 'text-red-900' : 'text-gray-900'}`}>
            {title}
          </h3>
          {highlight && (
            <Badge variant="danger" size="sm">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Important
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-700 whitespace-pre-line">
          {content}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Chargement du dossier médical...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8 text-red-600">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  if (!dossierMedical) {
    return (
      <Card>
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">Aucun dossier médical trouvé</p>
          <Button variant="primary" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Créer un dossier médical
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Dossier Médical</h2>
              <p className="text-sm text-gray-500">
                Dernière modification: {new Date(dossierMedical.dateModification).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        </div>
      </Card>

      {/* Medical Record Content */}
      <div className="grid grid-cols-1 gap-4">
        {/* Allergies - Highlighted section */}
        {renderSection(
          'Allergies',
          dossierMedical.allergies,
          <AlertTriangle className="w-5 h-5 text-red-600" />,
          true
        )}

        {/* Antécédents Médicaux */}
        {renderSection(
          'Antécédents médicaux',
          dossierMedical.antecedentsMedicaux,
          <Heart className="w-5 h-5 text-blue-600" />
        )}

        {/* Antécédents Chirurgicaux */}
        {renderSection(
          'Antécédents chirurgicaux',
          dossierMedical.antecedentsChirurgicaux,
          <Activity className="w-5 h-5 text-blue-600" />
        )}

        {/* Habitudes */}
        {renderSection(
          'Habitudes de vie',
          dossierMedical.habitudes,
          <ClipboardList className="w-5 h-5 text-blue-600" />
        )}

        {/* Diagnostic Actuel */}
        {renderSection(
          'Diagnostic actuel',
          dossierMedical.diagnosticActuel,
          <FileText className="w-5 h-5 text-blue-600" />
        )}

        {/* Traitement Actuel */}
        {renderSection(
          'Traitement actuel',
          dossierMedical.traitementActuel,
          <Pill className="w-5 h-5 text-blue-600" />
        )}

        {/* Observations */}
        {renderSection(
          'Observations générales',
          dossierMedical.observations,
          <FileText className="w-5 h-5 text-blue-600" />
        )}
      </div>

      {/* Empty state if no data */}
      {!dossierMedical.antecedentsMedicaux && 
       !dossierMedical.antecedentsChirurgicaux && 
       !dossierMedical.allergies && 
       !dossierMedical.habitudes && 
       !dossierMedical.diagnosticActuel && 
       !dossierMedical.traitementActuel && 
       !dossierMedical.observations && (
        <Card>
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Le dossier médical est vide</p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Compléter le dossier
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DossierMedicalView;
