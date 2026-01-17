import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { Card, Badge } from '../../components/UI';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import adminService from '../../services/adminService';
import MedicamentModal from '../../components/Admin/MedicamentModal';
import { toast } from 'react-hot-toast';

const MedicamentList = () => {
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicament, setSelectedMedicament] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  useEffect(() => {
    fetchMedicaments();
  }, []);

  const fetchMedicaments = async (search = '') => {
    try {
      setLoading(true);
      const response = await adminService.getMedicaments(search);
      setMedicaments(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des médicaments:', error);
      toast.error('Erreur lors du chargement des médicaments');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchMedicaments(value);
  };

  const handleCreate = () => {
    setSelectedMedicament(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (medicament) => {
    setSelectedMedicament(medicament);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (medicament) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le médicament "${medicament.nom}" ?`)) {
      try {
        await adminService.deleteMedicament(medicament.id);
        toast.success('Médicament supprimé avec succès');
        fetchMedicaments(searchTerm);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression du médicament');
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (modalMode === 'create') {
        await adminService.createMedicament(formData);
        toast.success('Médicament créé avec succès');
      } else {
        await adminService.updateMedicament(selectedMedicament.id, formData);
        toast.success('Médicament modifié avec succès');
      }
      setIsModalOpen(false);
      fetchMedicaments(searchTerm);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error('Erreur lors de la sauvegarde du médicament');
    }
  };

  const getCategorieColor = (categorie) => {
    const colors = {
      'Antibiotique': 'bg-cyan-100 text-cyan-800',
      'Antalgique': 'bg-green-100 text-green-800',
      'Anti-inflammatoire': 'bg-orange-100 text-orange-800',
      'Antiviral': 'bg-purple-100 text-purple-800',
      'Antihistaminique': 'bg-pink-100 text-pink-800',
      'Antipyrétique': 'bg-yellow-100 text-yellow-800',
      'Antidiabétique': 'bg-red-100 text-red-800',
      'Antihypertenseur': 'bg-indigo-100 text-indigo-800'
    };
    return colors[categorie] || 'bg-gray-100 text-gray-800';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Médicaments</h1>
            <p className="text-gray-600 mt-1">Gérer la base de données des médicaments</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Médicament
          </button>
        </div>

        {/* Search Bar */}
        <Card>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un médicament..."
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
                      Catégorie
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fabricant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posologie
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {medicaments.length > 0 ? (
                    medicaments.map((medicament) => (
                      <tr key={medicament.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{medicament.nom}</div>
                            {medicament.description && (
                              <div className="text-xs text-gray-500 max-w-xs truncate">
                                {medicament.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {medicament.categorie ? (
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategorieColor(medicament.categorie)}`}>
                              {medicament.categorie}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {medicament.fabricant || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {medicament.posologie || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(medicament)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(medicament)}
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
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        Aucun médicament trouvé
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
      <MedicamentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        medicament={selectedMedicament}
        mode={modalMode}
      />
    </DashboardLayout>
  );
};

export default MedicamentList;
