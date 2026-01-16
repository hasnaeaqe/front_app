import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import patientService from '../../services/patientService';
import { useAuth } from '../../context/AuthContext';
import toast from '../../utils/toast';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Heart, 
  FileText, 
  Pill, 
  Receipt, 
  File,
  Edit,
  Download,
  Upload,
  Eye,
  Loader
} from 'lucide-react';

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  
  // State
  const [patient, setPatient] = useState(null);
  const [dossierMedical, setDossierMedical] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [ordonnances, setOrdonnances] = useState([]);
  const [factures, setFactures] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dossier');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch patient basic info
      const patientResponse = await patientService.getById(id);
      setPatient(patientResponse.data);
      
      // Fetch related data based on active tab
      await fetchTabData(activeTab);
      
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Impossible de charger les données du patient');
      
      // Sample data for development
      setPatient({
        id: id,
        cin: 'AB123456',
        nom: 'Alami',
        prenom: 'Mohammed',
        dateNaissance: '1985-03-15',
        sexe: 'M',
        telephone: '0612345678',
        email: 'mohammed.alami@email.com',
        adresse: '123 Rue de Casablanca, Casablanca',
        typeMutuelle: 'CNOPS'
      });
      
      setDossierMedical({
        antecedentsMedicaux: 'Diabète Type 2, Hypertension',
        antecedentsChirurgicaux: 'Appendicectomie (2005)',
        allergies: 'Pénicilline',
        habitudes: 'Non fumeur, Sport régulier',
        diagnosticActuel: 'Suivi diabète',
        traitementActuel: 'Metformine 1000mg'
      });
      
      setConsultations([
        {
          id: 1,
          date: '2024-01-15',
          medecin: 'Dr. Bennani',
          diagnostic: 'Contrôle diabète',
          traitement: 'Continuer traitement actuel'
        }
      ]);
      
      setOrdonnances([
        {
          id: 1,
          date: '2024-01-15',
          medecin: 'Dr. Bennani',
          medicaments: 'Metformine 1000mg, Atorvastatine 20mg'
        }
      ]);
      
      setFactures([
        {
          id: 1,
          date: '2024-01-15',
          montant: 250,
          statut: 'Payée'
        }
      ]);
      
      setDocuments([
        {
          id: 1,
          type: 'Analyse sanguine',
          date: '2024-01-10',
          nom: 'analyse_sang_2024.pdf'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTabData = async (tab) => {
    try {
      switch (tab) {
        case 'dossier':
          // API call: GET /api/dossiers-medicaux/patient/:id
          break;
        case 'consultations':
          // API call: GET /api/consultations/patient/:id
          break;
        case 'ordonnances':
          // API call: GET /api/ordonnances/patient/:id
          break;
        case 'factures':
          // API call: GET /api/factures/patient/:id
          break;
        case 'documents':
          // API call: GET /api/documents/patient/:id
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données de l\'onglet:', err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchTabData(tab);
  };

  const calculateAge = (dateNaissance) => {
    if (!dateNaissance) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusBadgeVariant = (statut) => {
    const statusMap = {
      'Payée': 'success',
      'En attente': 'warning',
      'Impayée': 'danger'
    };
    return statusMap[statut] || 'default';
  };

  const handleNewConsultation = () => {
    navigate(`/medecin/consultations/nouvelle/${id}`);
  };

  const handleNewAppointment = () => {
    navigate(`/secretaire/rendez-vous/nouveau?patientId=${id}`);
  };

  const handleSendToDoctor = async () => {
    try {
      // API call: POST /api/patients/:id/send-to-medecin
      await patientService.sendToDoctor(id);
      toast.success('Patient envoyé au médecin avec succès');
    } catch (err) {
      console.error('Erreur:', err);
      toast.error('Erreur lors de l\'envoi au médecin');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-violet-600" size={40} />
        </div>
      </DashboardLayout>
    );
  }

  if (error && !patient) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={fetchPatientData}>
              Réessayer
            </Button>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Patient Info */}
        <Card borderColor="violet">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {patient?.prenom?.[0]}{patient?.nom?.[0]}
              </div>
            </div>

            {/* Patient Details */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {patient?.prenom} {patient?.nom}
                  </h1>
                  <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
                    <span className="flex items-center gap-2">
                      <User size={16} />
                      CIN: {patient?.cin}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar size={16} />
                      {calculateAge(patient?.dateNaissance)} ans
                    </span>
                    <span className="flex items-center gap-2">
                      {patient?.sexe === 'M' ? '♂ Masculin' : '♀ Féminin'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 mt-4 md:mt-0"
                >
                  <Edit size={18} />
                  Modifier
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={18} className="text-violet-600" />
                  <span>{patient?.telephone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail size={18} className="text-violet-600" />
                  <span>{patient?.email || 'Non renseigné'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin size={18} className="text-violet-600" />
                  <span>{patient?.adresse}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart size={18} className="text-violet-600" />
                  <Badge variant="info">{patient?.typeMutuelle}</Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                {userRole === 'SECRETAIRE' && (
                  <>
                    <Button variant="primary" onClick={handleNewAppointment}>
                      Prendre RDV
                    </Button>
                    <Button variant="outline" onClick={handleSendToDoctor}>
                      Envoyer au médecin
                    </Button>
                  </>
                )}
                {userRole === 'MEDECIN' && (
                  <>
                    <Button variant="primary" onClick={handleNewConsultation}>
                      Nouvelle Consultation
                    </Button>
                    <Button variant="outline" onClick={() => handleTabChange('dossier')}>
                      Dossier Médical
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Card>
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex flex-wrap -mb-px">
              {[
                { key: 'dossier', label: 'Dossier Médical', icon: FileText },
                { key: 'consultations', label: 'Consultations', icon: Heart },
                { key: 'ordonnances', label: 'Ordonnances', icon: Pill },
                { key: 'factures', label: 'Factures', icon: Receipt },
                { key: 'documents', label: 'Documents', icon: File }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`
                    flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.key
                      ? 'border-violet-600 text-violet-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {/* Dossier Médical Tab */}
            {activeTab === 'dossier' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Dossier Médical</h2>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Edit size={18} />
                    Modifier
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Antécédents Médicaux</h3>
                    <p className="text-gray-700">{dossierMedical?.antecedentsMedicaux || 'Aucun'}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Antécédents Chirurgicaux</h3>
                    <p className="text-gray-700">{dossierMedical?.antecedentsChirurgicaux || 'Aucun'}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Allergies</h3>
                    <p className="text-gray-700">{dossierMedical?.allergies || 'Aucune'}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Habitudes</h3>
                    <p className="text-gray-700">{dossierMedical?.habitudes || 'Non renseigné'}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Diagnostic Actuel</h3>
                    <p className="text-gray-700">{dossierMedical?.diagnosticActuel || 'Non renseigné'}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Traitement Actuel</h3>
                    <p className="text-gray-700">{dossierMedical?.traitementActuel || 'Aucun'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Consultations Tab */}
            {activeTab === 'consultations' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Historique des Consultations</h2>
                </div>

                {consultations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucune consultation enregistrée</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Médecin</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnostic</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Traitement</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {consultations.map((consultation) => (
                          <tr key={consultation.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(consultation.date).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {consultation.medecin}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{consultation.diagnostic}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{consultation.traitement}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <button className="text-violet-600 hover:text-violet-800 flex items-center gap-1 ml-auto">
                                <Eye size={16} />
                                Voir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Ordonnances Tab */}
            {activeTab === 'ordonnances' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Ordonnances</h2>
                </div>

                {ordonnances.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucune ordonnance enregistrée</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ordonnances.map((ordonnance) => (
                      <div key={ordonnance.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {new Date(ordonnance.date).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-sm text-gray-600">{ordonnance.medecin}</p>
                          </div>
                          <Pill className="text-violet-600" size={24} />
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{ordonnance.medicaments}</p>
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                          <Download size={16} />
                          Télécharger PDF
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Factures Tab */}
            {activeTab === 'factures' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Factures</h2>
                </div>

                {factures.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucune facture enregistrée</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {factures.map((facture) => (
                          <tr key={facture.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(facture.date).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {facture.montant} DH
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Badge variant={getStatusBadgeVariant(facture.statut)}>
                                {facture.statut}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                              <button className="text-violet-600 hover:text-violet-800 flex items-center gap-1 ml-auto">
                                <Eye size={16} />
                                Voir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Documents Médicaux</h2>
                  <Button variant="primary" className="flex items-center gap-2">
                    <Upload size={18} />
                    Téléverser
                  </Button>
                </div>

                {documents.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucun document enregistré</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((document) => (
                      <div key={document.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <File className="text-violet-600 flex-shrink-0" size={24} />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{document.nom}</p>
                            <p className="text-sm text-gray-600">{document.type}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(document.date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg">
                              <Eye size={18} />
                            </button>
                            <button className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg">
                              <Download size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientProfile;
