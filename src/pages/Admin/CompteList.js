import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { Card, Badge } from '../../components/UI';
import { Plus, Search, Edit, Power, Trash2 } from 'lucide-react';
import adminService from '../../services/adminService';
import CompteModal from '../../components/Admin/CompteModal';
import { toast } from 'react-hot-toast';

const CompteList = () => {
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompte, setSelectedCompte] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  useEffect(() => {
    fetchComptes();
  }, []);

  const fetchComptes = async (search = '') => {
    try {
      setLoading(true);
      const response = await adminService.getUtilisateurs(search);
      setComptes(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des comptes:', error);
      toast.error('Erreur lors du chargement des comptes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchComptes(value);
  };

  const handleCreate = () => {
    setSelectedCompte(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (compte) => {
    setSelectedCompte(compte);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleToggleActif = async (compte) => {
    try {
      await adminService.toggleUtilisateurActif(compte.id);
      toast.success(`Compte ${compte.actif ? 'désactivé' : 'activé'} avec succès`);
      fetchComptes(searchTerm);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handleDelete = async (compte) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le compte de "${compte.prenom} ${compte.nom}" ?`)) {
      try {
        await adminService.deleteUtilisateur(compte.id);
        toast.success('Compte supprimé avec succès');
        fetchComptes(searchTerm);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression du compte');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (modalMode === 'create') {
        await adminService.createUtilisateur(formData);
        toast.success('Compte créé avec succès');
      } else {
        await adminService.updateUtilisateur(selectedCompte.id, formData);
        toast.success('Compte modifié avec succès');
      }
      setIsModalOpen(false);
      fetchComptes(searchTerm);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la sauvegarde du compte';
      toast.error(errorMessage);
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'MEDECIN':
        return 'primary'; // violet
      case 'SECRETAIRE':
        return 'info'; // bleu
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'MEDECIN':
        return 'Médecin';
      case 'SECRETAIRE':
        return 'Secrétaire';
      default:
        return role;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Comptes</h1>
            <p className="text-gray-600 mt-1">Gérer les comptes utilisateurs</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Compte
          </button>
        </div>

        {/* Search Bar */}
        <Card>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un compte..."
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
                      Nom
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cabinet
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
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
                  {comptes.length > 0 ? (
                    comptes.map((compte) => (
                      <tr key={compte.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {compte.prenom} {compte.nom}
                            </div>
                            {compte.specialiteNom && (
                              <div className="text-xs text-gray-500">{compte.specialiteNom}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{compte.email}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {compte.cabinetNom || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant={getRoleBadgeVariant(compte.role)}>
                            {getRoleLabel(compte.role)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant={compte.actif ? 'success' : 'default'}>
                            {compte.actif ? 'Actif' : 'Inactif'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(compte)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleActif(compte)}
                              className={`p-1 ${compte.actif ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'} rounded transition-colors`}
                              title={compte.actif ? 'Désactiver' : 'Activer'}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(compte)}
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
                        Aucun compte trouvé
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
      <CompteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        compte={selectedCompte}
        mode={modalMode}
      />
    </DashboardLayout>
  );
};

export default CompteList;
