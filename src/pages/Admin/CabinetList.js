import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { Card, Badge } from '../../components/UI';
import { Plus, Search, Edit, Power, Trash2 } from 'lucide-react';
import adminService from '../../services/adminService';
import CabinetModal from '../../components/Admin/CabinetModal';
import { toast } from 'react-hot-toast';

const CabinetList = () => {
  const [cabinets, setCabinets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCabinet, setSelectedCabinet] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  useEffect(() => {
    fetchCabinets();
  }, []);

  const fetchCabinets = async (search = '') => {
    try {
      setLoading(true);
      const response = await adminService.getCabinets(search);
      setCabinets(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des cabinets:', error);
      toast.error('Erreur lors du chargement des cabinets');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchCabinets(value);
  };

  const handleCreate = () => {
    setSelectedCabinet(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (cabinet) => {
    setSelectedCabinet(cabinet);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleToggleActif = async (cabinet) => {
    try {
      await adminService.toggleCabinetActif(cabinet.id);
      toast.success(`Cabinet ${cabinet.actif ? 'désactivé' : 'activé'} avec succès`);
      fetchCabinets(searchTerm);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handleDelete = async (cabinet) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le cabinet "${cabinet.nom}" ?`)) {
      try {
        await adminService.deleteCabinet(cabinet.id);
        toast.success('Cabinet supprimé avec succès');
        fetchCabinets(searchTerm);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression du cabinet');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (modalMode === 'create') {
        await adminService.createCabinet(formData);
        toast.success('Cabinet créé avec succès');
      } else {
        await adminService.updateCabinet(selectedCabinet.id, formData);
        toast.success('Cabinet modifié avec succès');
      }
      setIsModalOpen(false);
      fetchCabinets(searchTerm);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error('Erreur lors de la sauvegarde du cabinet');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Cabinets</h1>
            <p className="text-gray-600 mt-1">Gérer les cabinets médicaux</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Cabinet
          </button>
        </div>

        {/* Search Bar */}
        <Card>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un cabinet..."
              value={searchTerm}
              onChange={handleSearch}
              className="flex-1 outline-none text-gray-700"
            />
          </div>
        </Card>

        {/* Table */}
        <Card>
          {loading ? (
            <div className="text-center py-8 text-gray-600">Chargement...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cabinet
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Adresse
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Médecins
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Création
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cabinets.length > 0 ? (
                    cabinets.map((cabinet) => (
                      <tr key={cabinet.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{cabinet.nom}</div>
                            {cabinet.email && (
                              <div className="text-xs text-gray-500">{cabinet.email}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-600 max-w-xs">
                            {cabinet.adresse || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{cabinet.nombreMedecins}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {formatDate(cabinet.dateCreation)}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant={cabinet.actif ? 'success' : 'default'}>
                            {cabinet.actif ? 'Actif' : 'Inactif'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(cabinet)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleActif(cabinet)}
                              className={`p-1 ${cabinet.actif ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'} rounded transition-colors`}
                              title={cabinet.actif ? 'Désactiver' : 'Activer'}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(cabinet)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                        Aucun cabinet trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Modal */}
      <CabinetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        cabinet={selectedCabinet}
        mode={modalMode}
      />
    </DashboardLayout>
  );
};

export default CabinetList;
