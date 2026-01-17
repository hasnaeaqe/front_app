import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import patientService from '../../services/patientService';
import toast from '../../utils/toast';
import { 
  Search, 
  User, 
  Calendar,
  Phone,
  Mail,
  Loader
} from 'lucide-react';

const RecherchePatients = () => {
  const navigate = useNavigate();
  
  // State
  const [searchType, setSearchType] = useState('nom');
  const [searchTerm, setSearchTerm] = useState('');
  const [allPatients, setAllPatients] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // Load all patients on component mount
  useEffect(() => {
    fetchAllPatients();
  }, []);

  const fetchAllPatients = async () => {
    try {
      setLoading(true);
      const response = await patientService.getAll();
      const patients = response.data || [];
      setAllPatients(patients);
      setSearchResults(patients);
      
      if (patients.length > 0) {
        toast.show(`${patients.length} patient(s) chargé(s)`, 'success');
      } else {
        toast.show('Aucun patient trouvé dans la base de données', 'info');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des patients:', err);
      toast.show('Erreur lors du chargement des patients. Vérifiez que le backend est démarré.', 'error');
      setAllPatients([]);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      // If search is empty, show all patients
      setSearchResults(allPatients);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      
      // Filter from all patients based on search type
      let results = [...allPatients];
      
      if (searchType === 'nom') {
        results = results.filter(patient => 
          patient.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (searchType === 'cin') {
        results = results.filter(patient => 
          patient.cin?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.show('Aucun patient trouvé', 'info');
      } else {
        toast.show(`${results.length} patient(s) trouvé(s)`, 'success');
      }
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      toast.show('Erreur lors de la recherche des patients', 'error');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
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

  const handleViewDossier = (patient) => {
    navigate(`/medecin/patients/${patient.id}`);
  };

  const handleNewConsultation = (patient) => {
    navigate(`/medecin/consultations/nouvelle/${patient.id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Recherche de Patients</h1>
          <p className="text-gray-600 mt-2">Trouvez rapidement un patient pour consultation</p>
        </div>

        {/* Search Section */}
        <Card borderColor="violet" className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Search Type Radio Buttons */}
            <div className="flex justify-center gap-8">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value="nom"
                  checked={searchType === 'nom'}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-5 h-5 text-violet-600 focus:ring-violet-500"
                />
                <span className="ml-3 text-lg font-medium text-gray-700">Par Nom</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value="cin"
                  checked={searchType === 'cin'}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-5 h-5 text-violet-600 focus:ring-violet-500"
                />
                <span className="ml-3 text-lg font-medium text-gray-700">Par CIN</span>
              </label>
            </div>

            {/* Search Input */}
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder={`Entrez le ${searchType === 'nom' ? 'nom ou prénom' : 'numéro CIN'} du patient...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={24} />}
                  className="text-lg"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !searchTerm.trim()}
                className="px-8 py-3 text-lg flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Recherche...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Rechercher
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Search Results */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin text-violet-600" size={40} />
            </div>
          ) : searchResults.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <User size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-600">Aucun patient trouvé</p>
                <p className="text-gray-500 mt-2">
                  {hasSearched ? 'Essayez avec un autre nom ou numéro CIN' : 'Aucun patient dans la base de données'}
                </p>
              </div>
            </Card>
          ) : (
            <div>
              <div className="mb-4">
                <p className="text-gray-700 text-lg">
                  <span className="font-semibold">{searchResults.length}</span> patient(s) {hasSearched ? 'trouvé(s)' : 'dans la base de données'}
                </p>
              </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((patient) => (
                    <Card key={patient.id} borderColor="cyan" className="hover:shadow-lg transition-shadow">
                      <div className="space-y-4">
                        {/* Patient Header */}
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                            {patient.prenom?.[0]}{patient.nom?.[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 truncate">
                              {patient.prenom} {patient.nom}
                            </h3>
                            <p className="text-sm text-gray-600">CIN: {patient.cin}</p>
                          </div>
                        </div>

                        {/* Patient Info */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar size={16} className="text-violet-600 flex-shrink-0" />
                            <span>{calculateAge(patient.dateNaissance)} ans</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone size={16} className="text-violet-600 flex-shrink-0" />
                            <span className="truncate">{patient.numTel || 'Non renseigné'}</span>
                          </div>
                          {patient.email && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <Mail size={16} className="text-violet-600 flex-shrink-0" />
                              <span className="truncate">{patient.email}</span>
                            </div>
                          )}
                        </div>

                        {/* Last Consultation */}
                        {patient.lastConsultation && (
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                              Dernière consultation: {new Date(patient.lastConsultation).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => handleViewDossier(patient)}
                            className="w-full justify-center"
                          >
                            Voir Dossier
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => handleNewConsultation(patient)}
                            className="w-full justify-center"
                          >
                            Nouvelle Consultation
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecherchePatients;
