import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { Card, Button } from '../../components/UI';
import { Search, User, Eye, Plus } from 'lucide-react';
import medecinService from '../../services/medecinService';
import patientService from '../../services/patientService';
import toast from 'react-hot-toast';

const RecherchePatients = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('nom');
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounced search function
  const performSearch = useCallback(async (type, query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || trimmedQuery.length < 2) {
      setPatients([]);
      return;
    }

    try {
      setLoading(true);
      let response;
      
      try {
        // Try medecinService first
        response = await medecinService.searchPatients(type, trimmedQuery);
      } catch (medecinError) {
        // If medecin service fails, fall back to patient service
        console.log('Medecin search service unavailable, using patient service');
        response = await patientService.search(trimmedQuery);
      }
      
      setPatients(response.data || []);
      
      if (!response.data || response.data.length === 0) {
        toast.info('Aucun patient trouvé');
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast.error('Erreur lors de la recherche des patients');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search when query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchType, searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchType, performSearch]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Veuillez entrer un terme de recherche');
      return;
    }

    // Immediate search on form submit
    performSearch(searchType, searchQuery);
  };

  const handleViewProfile = (patientId) => {
    navigate(`/medecin/patients/${patientId}`);
  };

  const handleNewConsultation = (patientId) => {
    navigate(`/medecin/consultations/nouvelle/${patientId}`);
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recherche Patients</h1>
          <p className="text-gray-600 mt-1">Trouvez un patient par nom ou CIN</p>
        </div>

        {/* Search Form */}
        <Card borderColor="violet">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de recherche
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="nom"
                    checked={searchType === 'nom'}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Par Nom/Prénom</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="cin"
                    checked={searchType === 'cin'}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Par CIN</span>
                </label>
              </div>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {searchType === 'cin' ? 'CIN' : 'Nom ou Prénom'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchType === 'cin' ? 'Ex: AB123456' : 'Ex: Alami'}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {loading ? 'Recherche...' : 'Rechercher'}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Results Table */}
        {patients.length > 0 && (
          <Card borderColor="violet">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Résultats ({patients.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CIN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Âge
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sexe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-violet-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-violet-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.nom} {patient.prenom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {patient.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.cin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {calculateAge(patient.dateNaissance)} ans
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.sexe === 'M' ? 'Homme' : 'Femme'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.numTel || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile(patient.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Voir profil
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleNewConsultation(patient.id)}
                          className="bg-cyan-600 hover:bg-cyan-700"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Consultation
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecherchePatients;
