import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { Card, Button, Badge } from '../../components/UI';
import { User, Phone, Mail, MapPin, FileText, ClipboardList, Pill, Edit, Plus } from 'lucide-react';
import medecinService from '../../services/medecinService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PatientProfil = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dossier');

  useEffect(() => {
    fetchPatientProfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const fetchPatientProfil = async () => {
    try {
      setLoading(true);
      const response = await medecinService.getPatientProfilComplet(patientId);
      setPatient(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      toast.error('Erreur lors de la récupération du profil patient');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateNaissance) => {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const handleNewConsultation = () => {
    navigate(`/medecin/consultations/nouvelle/${patientId}`);
  };

  const handleEditDossierMedical = () => {
    navigate(`/medecin/dossier-medical/${patientId}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600">Patient non trouvé</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Patient Header */}
        <Card borderColor="violet">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 h-20 w-20 bg-violet-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-violet-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {patient.nom} {patient.prenom}
                </h1>
                <p className="text-gray-600 mt-1">
                  {calculateAge(patient.dateNaissance)} ans • {patient.sexe === 'M' ? 'Homme' : 'Femme'} • CIN: {patient.cin}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-1" />
                    {patient.numTel || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-1" />
                    {patient.email || 'N/A'}
                  </div>
                  {patient.typeMutuelle && (
                    <Badge variant="info">Mutuelle: {patient.typeMutuelle}</Badge>
                  )}
                </div>
                {patient.adresse && (
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {patient.adresse}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate('/medecin/patients')}
              >
                Retour
              </Button>
              <Button
                variant="primary"
                onClick={handleNewConsultation}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouvelle Consultation
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dossier', label: 'Dossier Médical', icon: FileText },
              { id: 'consultations', label: 'Historique Consultations', icon: ClipboardList },
              { id: 'ordonnances', label: 'Ordonnances', icon: Pill },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-violet-500 text-violet-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className={`mr-2 w-5 h-5 ${activeTab === tab.id ? 'text-violet-500' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'dossier' && (
            <Card borderColor="violet">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Dossier Médical</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditDossierMedical}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {patient.dossierMedical ? 'Modifier' : 'Remplir le dossier'}
                </Button>
              </div>
              
              {patient.dossierMedical ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Antécédents Médicaux</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {patient.dossierMedical.antMedicaux || 'Aucun'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Antécédents Chirurgicaux</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {patient.dossierMedical.antChirurgicaux || 'Aucun'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Allergies</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {patient.dossierMedical.allergies || 'Aucune'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Habitudes</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {patient.dossierMedical.habitudes || 'Aucune'}
                    </p>
                  </div>
                  {patient.dossierMedical.observations && (
                    <div className="md:col-span-2">
                      <h3 className="font-medium text-gray-900 mb-2">Observations</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {patient.dossierMedical.observations}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Aucun dossier médical enregistré</p>
                  <Button
                    variant="primary"
                    onClick={handleEditDossierMedical}
                    className="mt-4 bg-violet-600 hover:bg-violet-700"
                  >
                    Remplir le dossier médical
                  </Button>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'consultations' && (
            <Card borderColor="cyan">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Historique des Consultations ({patient.consultations?.length || 0})
              </h2>
              
              {patient.consultations && patient.consultations.length > 0 ? (
                <div className="space-y-4">
                  {patient.consultations.map((consultation) => (
                    <div key={consultation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm text-gray-500">
                            {formatDateTime(consultation.dateConsultation)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Dr. {consultation.medecinNom} {consultation.medecinPrenom}
                          </p>
                        </div>
                        <Badge variant="success">Terminée</Badge>
                      </div>
                      
                      {consultation.diagnostic && (
                        <div className="mb-2">
                          <h4 className="text-sm font-medium text-gray-900">Diagnostic:</h4>
                          <p className="text-sm text-gray-700">{consultation.diagnostic}</p>
                        </div>
                      )}
                      
                      {consultation.traitement && (
                        <div className="mb-2">
                          <h4 className="text-sm font-medium text-gray-900">Traitement:</h4>
                          <p className="text-sm text-gray-700">{consultation.traitement}</p>
                        </div>
                      )}
                      
                      {consultation.observations && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Observations:</h4>
                          <p className="text-sm text-gray-700">{consultation.observations}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Aucune consultation enregistrée</p>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'ordonnances' && (
            <Card borderColor="green">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Ordonnances ({patient.ordonnances?.length || 0})
              </h2>
              
              {patient.ordonnances && patient.ordonnances.length > 0 ? (
                <div className="space-y-4">
                  {patient.ordonnances.map((ordonnance) => (
                    <div key={ordonnance.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Ordonnance #{ordonnance.id}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(ordonnance.dateCreation)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Dr. {ordonnance.medecinNom} {ordonnance.medecinPrenom}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Pill className="w-4 h-4 mr-2" />
                          Voir détails
                        </Button>
                      </div>
                      
                      {ordonnance.instructions && (
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-gray-900">Instructions:</h4>
                          <p className="text-sm text-gray-700">{ordonnance.instructions}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Pill className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Aucune ordonnance enregistrée</p>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientProfil;
