import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Autocomplete from '../../components/UI/Autocomplete';
import Badge from '../../components/UI/Badge';
import consultationService from '../../services/consultationService';
import ordonnanceService from '../../services/ordonnanceService';
import medicamentService from '../../services/medicamentService';
import patientService from '../../services/patientService';
import dossierMedicalService from '../../services/dossierMedicalService';
import { useAuth } from '../../context/AuthContext';
import toast from '../../utils/toast';
import { 
  generateOrdonnanceMedicaments, 
  generateOrdonnanceExamens 
} from './OrdonnanceTemplate';
import { 
  Stethoscope, 
  Plus, 
  Trash2, 
  Printer, 
  Save,
  AlertTriangle,
  Pill,
  FileText,
  User,
  ArrowLeft,
  Loader,
  X
} from 'lucide-react';

const ConsultationForm = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State
  const [patient, setPatient] = useState(null);
  const [dossierMedical, setDossierMedical] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    diagnostic: '',
    traitement: '',
    observations: '',
    duree: ''
  });
  
  // Medications state
  const [medicaments, setMedicaments] = useState([]);
  const [medicamentSearch, setMedicamentSearch] = useState('');
  const [medicamentOptions, setMedicamentOptions] = useState([]);
  const [searchingMeds, setSearchingMeds] = useState(false);
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [currentMedicament, setCurrentMedicament] = useState({
    medicament: null,
    posologie: '',
    duree: '',
    dureeUnite: 'jours',
    quantite: ''
  });
  
  // Examinations state
  const [examens, setExamens] = useState({
    analysesSang: false,
    radiographie: false,
    echographie: false,
    scanner: false,
    irm: false,
    ecg: false,
    autres: false
  });
  const [autresExamens, setAutresExamens] = useState('');
  const [examenNotes, setExamenNotes] = useState('');

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  useEffect(() => {
    if (medicamentSearch.length >= 2) {
      searchMedicaments();
    } else {
      setMedicamentOptions([]);
    }
  }, [medicamentSearch]);

  const fetchPatientData = async () => {
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
        telephone: '0612345678',
        mutuelle: 'CNSS',
        age: 38
      };
      
      const mockDossier = {
        id: 1,
        allergies: 'Pénicilline, Pollen',
        antecedentsMedicaux: 'Hypertension artérielle',
        lastConsultation: '2024-01-10'
      };
      
      setPatient(mockPatient);
      setDossierMedical(mockDossier);
    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError('Erreur lors du chargement des données du patient');
      toast.error('Erreur lors du chargement des données du patient');
    } finally {
      setLoading(false);
    }
  };

  const searchMedicaments = async () => {
    try {
      setSearchingMeds(true);
      
      // TODO: Replace with actual API call
      // const response = await medicamentService.search(medicamentSearch);
      // setMedicamentOptions(response.data);
      
      // Mock data
      const mockMedicaments = [
        { id: 1, nom: 'Paracétamol 500mg', description: 'Antalgique et antipyrétique' },
        { id: 2, nom: 'Ibuprofène 400mg', description: 'Anti-inflammatoire non stéroïdien' },
        { id: 3, nom: 'Amoxicilline 500mg', description: 'Antibiotique' },
        { id: 4, nom: 'Doliprane 1000mg', description: 'Antalgique' },
        { id: 5, nom: 'Aspégic 100mg', description: 'Antiagrégant plaquettaire' }
      ].filter(med => 
        med.nom.toLowerCase().includes(medicamentSearch.toLowerCase())
      );
      
      setMedicamentOptions(mockMedicaments);
    } catch (err) {
      console.error('Error searching medications:', err);
    } finally {
      setSearchingMeds(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMedicamentSelect = (med) => {
    setCurrentMedicament(prev => ({
      ...prev,
      medicament: med
    }));
    setMedicamentSearch(med.nom);
  };

  const handleAddMedicament = () => {
    if (!currentMedicament.medicament) {
      toast.error('Veuillez sélectionner un médicament');
      return;
    }
    if (!currentMedicament.posologie) {
      toast.error('Veuillez saisir la posologie');
      return;
    }
    
    setMedicaments(prev => [...prev, { ...currentMedicament }]);
    
    // Reset
    setCurrentMedicament({
      medicament: null,
      posologie: '',
      duree: '',
      dureeUnite: 'jours',
      quantite: ''
    });
    setMedicamentSearch('');
    setShowAddMedModal(false);
    toast.success('Médicament ajouté');
  };

  const handleRemoveMedicament = (index) => {
    setMedicaments(prev => prev.filter((_, i) => i !== index));
    toast.success('Médicament supprimé');
  };

  const handleExamenChange = (e) => {
    const { name, checked } = e.target;
    setExamens(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const validateForm = () => {
    if (!formData.diagnostic.trim()) {
      toast.error('Le diagnostic est requis');
      return false;
    }
    if (!formData.traitement.trim()) {
      toast.error('Le traitement est requis');
      return false;
    }
    if (!formData.duree || formData.duree <= 0) {
      toast.error('La durée de consultation est requise');
      return false;
    }
    return true;
  };

  const handleSaveConsultation = async () => {
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      
      const consultationData = {
        patientId,
        medecinId: user.id,
        date: new Date().toISOString(),
        diagnostic: formData.diagnostic,
        traitement: formData.traitement,
        observations: formData.observations,
        duree: parseInt(formData.duree),
        statut: 'Terminée'
      };
      
      // TODO: Replace with actual API calls
      // const consultationResponse = await consultationService.create(consultationData);
      
      // Save ordonnances if any
      if (medicaments.length > 0) {
        const ordonnanceMedicaments = {
          consultationId: 1, // consultationResponse.data.id
          type: 'medicaments',
          medicaments: medicaments.map(m => ({
            medicamentId: m.medicament.id,
            nom: m.medicament.nom,
            posologie: m.posologie,
            duree: `${m.duree} ${m.dureeUnite}`,
            quantite: m.quantite
          }))
        };
        // await ordonnanceService.create(ordonnanceMedicaments);
      }
      
      const selectedExamens = Object.entries(examens)
        .filter(([_, checked]) => checked)
        .map(([key]) => key);
      
      if (selectedExamens.length > 0 || autresExamens.trim()) {
        const ordonnanceExamens = {
          consultationId: 1, // consultationResponse.data.id
          type: 'examens',
          examens: selectedExamens,
          autresExamens: autresExamens,
          notes: examenNotes
        };
        // await ordonnanceService.create(ordonnanceExamens);
      }
      
      toast.success('Consultation enregistrée avec succès');
      navigate(`/medecin/patients/${patientId}`);
    } catch (err) {
      console.error('Error saving consultation:', err);
      toast.error('Erreur lors de l\'enregistrement de la consultation');
    } finally {
      setSaving(false);
    }
  };

  const handlePrintOrdonnanceMedicaments = () => {
    if (medicaments.length === 0) {
      toast.error('Aucun médicament à imprimer');
      return;
    }
    
    const data = {
      doctor: {
        nom: user.nom || 'Nom',
        prenom: user.prenom || 'Prénom',
        specialite: user.specialite || 'Médecin Généraliste',
        telephone: user.telephone || ''
      },
      patient: {
        nom: patient.nom,
        prenom: patient.prenom,
        age: patient.age,
        mutuelle: patient.mutuelle
      },
      medicaments: medicaments.map(m => ({
        nom: m.medicament.nom,
        posologie: m.posologie,
        duree: `${m.duree} ${m.dureeUnite}`,
        quantite: m.quantite
      })),
      date: new Date()
    };
    
    generateOrdonnanceMedicaments(data);
    toast.success('Ordonnance médicaments générée');
  };

  const handlePrintOrdonnanceExamens = () => {
    const selectedExamens = [];
    
    if (examens.analysesSang) selectedExamens.push('Analyses de sang');
    if (examens.radiographie) selectedExamens.push('Radiographie');
    if (examens.echographie) selectedExamens.push('Échographie');
    if (examens.scanner) selectedExamens.push('Scanner');
    if (examens.irm) selectedExamens.push('IRM');
    if (examens.ecg) selectedExamens.push('ECG');
    if (examens.autres && autresExamens.trim()) {
      selectedExamens.push(autresExamens);
    }
    
    if (selectedExamens.length === 0) {
      toast.error('Aucun examen sélectionné');
      return;
    }
    
    const data = {
      doctor: {
        nom: user.nom || 'Nom',
        prenom: user.prenom || 'Prénom',
        specialite: user.specialite || 'Médecin Généraliste',
        telephone: user.telephone || ''
      },
      patient: {
        nom: patient.nom,
        prenom: patient.prenom,
        age: patient.age,
        mutuelle: patient.mutuelle
      },
      examens: selectedExamens,
      notes: examenNotes,
      date: new Date()
    };
    
    generateOrdonnanceExamens(data);
    toast.success('Ordonnance examens générée');
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
              onClick={() => navigate(`/medecin/patients/${patientId}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Stethoscope className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Nouvelle Consultation</h1>
          </div>
        </div>

        {/* Patient Info Card */}
        <Card>
          <div className="flex items-start justify-between">
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
                  {patient.mutuelle && (
                    <>
                      <span>•</span>
                      <span>Mutuelle: {patient.mutuelle}</span>
                    </>
                  )}
                </div>
                {dossierMedical?.lastConsultation && (
                  <p className="text-sm text-gray-500 mt-1">
                    Dernière consultation: {new Date(dossierMedical.lastConsultation).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            </div>
            
            {dossierMedical?.allergies && (
              <Badge variant="danger">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Allergies: {dossierMedical.allergies}
              </Badge>
            )}
          </div>
        </Card>

        {/* Consultation Form */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de consultation</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnostic <span className="text-red-500">*</span>
              </label>
              <textarea
                name="diagnostic"
                value={formData.diagnostic}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Saisir le diagnostic..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Traitement <span className="text-red-500">*</span>
              </label>
              <textarea
                name="traitement"
                value={formData.traitement}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Saisir le traitement prescrit..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observations
              </label>
              <textarea
                name="observations"
                value={formData.observations}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Observations supplémentaires..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                name="duree"
                label="Durée de consultation (minutes)"
                value={formData.duree}
                onChange={handleInputChange}
                placeholder="Ex: 30"
                min="1"
                required
              />
            </div>
          </div>
        </Card>

        {/* Ordonnance Médicaments Section */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Pill className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Ordonnance Médicaments</h2>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddMedModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter médicament
            </Button>
          </div>
          
          {medicaments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucun médicament ajouté</p>
            </div>
          ) : (
            <div className="space-y-3">
              {medicaments.map((med, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{med.medicament.nom}</h3>
                    <p className="text-sm text-gray-600 mt-1">{med.medicament.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-700">
                      <span><strong>Posologie:</strong> {med.posologie}</span>
                      {med.duree && (
                        <span><strong>Durée:</strong> {med.duree} {med.dureeUnite}</span>
                      )}
                      {med.quantite && (
                        <span><strong>Quantité:</strong> {med.quantite}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMedicament(index)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex justify-end pt-4">
                <Button
                  variant="secondary"
                  onClick={handlePrintOrdonnanceMedicaments}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer ordonnance médicaments
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Ordonnance Examens Section */}
        <Card>
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Ordonnance Examens</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="analysesSang"
                  checked={examens.analysesSang}
                  onChange={handleExamenChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Analyses de sang</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="radiographie"
                  checked={examens.radiographie}
                  onChange={handleExamenChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Radiographie</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="echographie"
                  checked={examens.echographie}
                  onChange={handleExamenChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Échographie</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="scanner"
                  checked={examens.scanner}
                  onChange={handleExamenChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Scanner</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="irm"
                  checked={examens.irm}
                  onChange={handleExamenChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">IRM</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="ecg"
                  checked={examens.ecg}
                  onChange={handleExamenChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">ECG</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  name="autres"
                  checked={examens.autres}
                  onChange={handleExamenChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Autres examens</span>
              </label>
              {examens.autres && (
                <textarea
                  value={autresExamens}
                  onChange={(e) => setAutresExamens(e.target.value)}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Préciser les autres examens..."
                />
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes supplémentaires
              </label>
              <textarea
                value={examenNotes}
                onChange={(e) => setExamenNotes(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Notes ou instructions particulières..."
              />
            </div>
            
            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="secondary"
                onClick={handlePrintOrdonnanceExamens}
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimer ordonnance examens
              </Button>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <Card>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => navigate(`/medecin/patients/${patientId}`)}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveConsultation}
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
                  Enregistrer consultation
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Add Medication Modal */}
        {showAddMedModal && (
          <Modal
            isOpen={showAddMedModal}
            onClose={() => {
              setShowAddMedModal(false);
              setCurrentMedicament({
                medicament: null,
                posologie: '',
                duree: '',
                dureeUnite: 'jours',
                quantite: ''
              });
              setMedicamentSearch('');
            }}
            title="Ajouter un médicament"
          >
            <div className="space-y-4">
              <Autocomplete
                label="Rechercher un médicament"
                value={medicamentSearch}
                onChange={(e) => setMedicamentSearch(e.target.value)}
                onSelect={handleMedicamentSelect}
                options={medicamentOptions}
                placeholder="Taper au moins 2 caractères..."
                loading={searchingMeds}
              />
              
              {currentMedicament.medicament && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-gray-900">{currentMedicament.medicament.nom}</p>
                  <p className="text-sm text-gray-600">{currentMedicament.medicament.description}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posologie <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentMedicament.posologie}
                  onChange={(e) => setCurrentMedicament(prev => ({
                    ...prev,
                    posologie: e.target.value
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 1 comprimé 3 fois par jour"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée
                  </label>
                  <input
                    type="number"
                    value={currentMedicament.duree}
                    onChange={(e) => setCurrentMedicament(prev => ({
                      ...prev,
                      duree: e.target.value
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 7"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unité
                  </label>
                  <select
                    value={currentMedicament.dureeUnite}
                    onChange={(e) => setCurrentMedicament(prev => ({
                      ...prev,
                      dureeUnite: e.target.value
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="jours">Jours</option>
                    <option value="semaines">Semaines</option>
                    <option value="mois">Mois</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantité
                </label>
                <input
                  type="number"
                  value={currentMedicament.quantite}
                  onChange={(e) => setCurrentMedicament(prev => ({
                    ...prev,
                    quantite: e.target.value
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 1 boîte"
                  min="1"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="secondary"
                  onClick={() => setShowAddMedModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddMedicament}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ConsultationForm;
