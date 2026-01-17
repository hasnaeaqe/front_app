import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { Card, Button } from '../../components/UI';
import { FileText, Search, Eye, Edit, AlertTriangle, User, Loader } from 'lucide-react';
import dossierMedicalService from '../../services/dossierMedicalService';
import toast from 'react-hot-toast';

const DossierMedicalList = () => {
  const navigate = useNavigate();
  const [dossiers, setDossiers] = useState([]);
  const [filteredDossiers, setFilteredDossiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDossiers();
  }, []);

  useEffect(() => {
    filterDossiers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, dossiers]);

  const fetchDossiers = async () => {
    try {
      setLoading(true);
      const response = await dossierMedicalService.getAll();
      setDossiers(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des dossiers:', error);
      toast.error('Erreur lors du chargement des dossiers médicaux');
      setDossiers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterDossiers = () => {
    if (!searchTerm.trim()) {
      setFilteredDossiers(dossiers);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = dossiers.filter(dossier => 
      dossier.patientNom?.toLowerCase().includes(term) ||
      dossier.patientPrenom?.toLowerCase().includes(term) ||
      dossier.patientCin?.toLowerCase().includes(term)
    );
    setFilteredDossiers(filtered);
  };

  const handleViewDossier = (patientId) => {
    navigate(`/medecin/patients/${patientId}`);
  };

  const handleEditDossier = (patientId) => {
    navigate(`/medecin/dossier-medical/${patientId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin text-violet-600" size={40} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dossiers Médicaux</h1>
            <p className="text-gray-600 mt-1">Gestion des dossiers médicaux des patients</p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => navigate('/medecin/recherche-patients')}
            className="bg-violet-600 hover:bg-violet-700"
          >
            <FileText className="w-5 h-5 mr-2" />
            Nouveau Dossier
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou CIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center space-x-4">
              <div className="bg-violet-100 p-3 rounded-full">
                <FileText className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Dossiers</p>
                <p className="text-2xl font-bold text-gray-900">{dossiers.length}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center space-x-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avec Allergies</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dossiers.filter(d => d.allergies && d.allergies.trim()).length}
                </p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Patients Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{dossiers.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Dossiers Table */}
        {filteredDossiers.length > 0 ? (
          <Card borderColor="violet">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernière Modification
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Allergies
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diagnostic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDossiers.map((dossier) => (
                    <tr key={dossier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-violet-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-violet-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {dossier.patientNom} {dossier.patientPrenom}
                            </div>
                            <div className="text-sm text-gray-500">
                              CIN: {dossier.patientCin || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(dossier.dateModification)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {dossier.allergies && dossier.allergies.trim() ? (
                          <div className="flex items-center text-red-600">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Oui</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Aucune</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="max-w-xs truncate">
                          {dossier.diagnostic || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDossier(dossier.patientId)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => handleEditDossier(dossier.patientId)}
                            className="bg-violet-600 hover:bg-violet-700"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Modifier
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Aucun dossier trouvé' : 'Aucun dossier médical'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Essayez avec un autre terme de recherche'
                  : 'Commencez par créer un dossier médical pour vos patients'
                }
              </p>
              {!searchTerm && (
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/medecin/recherche-patients')}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Créer un Dossier
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DossierMedicalList;
