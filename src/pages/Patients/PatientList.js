import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Table from '../../components/UI/Table';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import patientService from '../../services/patientService';
import { useAuth } from '../../context/AuthContext';
import { validatePhoneNumber } from '../../utils/validation';
import toast from '../../utils/toast';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Send, 
  Trash2, 
  Phone, 
  Mail,
  Loader
} from 'lucide-react';

const PatientList = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  
  // State management
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search state
  const [searchType, setSearchType] = useState('nom');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  
  // Form data
  const [formData, setFormData] = useState({
    cin: '',
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: 'M',
    telephone: '',
    email: '',
    adresse: '',
    typeMutuelle: 'CNOPS'
  });
  
  // Validation errors
  const [formErrors, setFormErrors] = useState({});
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch patients on mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Filter patients when search changes
  useEffect(() => {
    filterPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, searchType, patients]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientService.getAll();
      setPatients(response.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des patients:', err);
      setError('Impossible de charger la liste des patients');
      // Sample data for development
      setPatients([
        {
          id: 1,
          cin: 'AB123456',
          nom: 'Alami',
          prenom: 'Mohammed',
          telephone: '0612345678',
          email: 'mohammed.alami@email.com',
          dateNaissance: '1985-03-15',
          sexe: 'M',
          adresse: '123 Rue de Casablanca',
          typeMutuelle: 'CNOPS'
        },
        {
          id: 2,
          cin: 'CD789012',
          nom: 'Bennani',
          prenom: 'Fatima',
          telephone: '0698765432',
          email: 'fatima.bennani@email.com',
          dateNaissance: '1990-07-22',
          sexe: 'F',
          adresse: '456 Avenue Mohammed V',
          typeMutuelle: 'CNSS'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = patients.filter(patient => {
      if (searchType === 'nom') {
        return (
          patient.nom?.toLowerCase().includes(term) ||
          patient.prenom?.toLowerCase().includes(term)
        );
      } else if (searchType === 'cin') {
        return patient.cin?.toLowerCase().includes(term);
      }
      return false;
    });

    setFilteredPatients(filtered);
    setCurrentPage(1);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.cin.trim()) errors.cin = 'CIN requis';
    if (!formData.nom.trim()) errors.nom = 'Nom requis';
    if (!formData.prenom.trim()) errors.prenom = 'Prénom requis';
    if (!formData.dateNaissance) errors.dateNaissance = 'Date de naissance requise';
    if (!formData.telephone.trim()) errors.telephone = 'Téléphone requis';
    else if (!validatePhoneNumber(formData.telephone)) {
      errors.telephone = 'Numéro de téléphone invalide';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email invalide';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreatePatient = () => {
    setModalMode('create');
    setFormData({
      cin: '',
      nom: '',
      prenom: '',
      dateNaissance: '',
      sexe: 'M',
      telephone: '',
      email: '',
      adresse: '',
      typeMutuelle: 'CNOPS'
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEditPatient = (patient) => {
    setModalMode('edit');
    setSelectedPatient(patient);
    setFormData({
      cin: patient.cin || '',
      nom: patient.nom || '',
      prenom: patient.prenom || '',
      dateNaissance: patient.dateNaissance || '',
      sexe: patient.sexe || 'M',
      telephone: patient.telephone || '',
      email: patient.email || '',
      adresse: patient.adresse || '',
      typeMutuelle: patient.typeMutuelle || 'CNOPS'
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDeletePatient = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteConfirm(true);
  };

  const handleViewPatient = (patient) => {
    const basePath = userRole === 'SECRETAIRE' ? '/secretaire' : '/medecin';
    navigate(`${basePath}/patients/${patient.id}`);
  };

  const handleSendToDoctor = async (patient) => {
    try {
      await patientService.sendToDoctor(patient.id);
      toast.success(`Patient ${patient.prenom} ${patient.nom} envoyé au médecin avec succès`);
    } catch (err) {
      console.error('Erreur lors de l\'envoi au médecin:', err);
      toast.error('Erreur lors de l\'envoi au médecin. Veuillez réessayer.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      if (modalMode === 'create') {
        await patientService.create(formData);
        toast.success('Patient créé avec succès');
      } else {
        await patientService.update(selectedPatient.id, formData);
        toast.success('Patient modifié avec succès');
      }
      
      setShowModal(false);
      fetchPatients();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      toast.error('Erreur lors de la sauvegarde du patient');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await patientService.delete(selectedPatient.id);
      toast.success('Patient supprimé avec succès');
      setShowDeleteConfirm(false);
      fetchPatients();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression du patient');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Table columns
  const columns = [
    { key: 'cin', label: 'CIN' },
    { key: 'nom', label: 'NOM' },
    { key: 'prenom', label: 'PRÉNOM' },
    { 
      key: 'telephone', 
      label: 'TÉLÉPHONE',
      render: (row) => (
        <span className="flex items-center gap-2">
          <Phone size={16} className="text-gray-400" />
          {row.telephone}
        </span>
      )
    },
    { 
      key: 'email', 
      label: 'EMAIL',
      render: (row) => (
        <span className="flex items-center gap-2">
          <Mail size={16} className="text-gray-400" />
          {row.email || '-'}
        </span>
      )
    }
  ];

  // Action buttons
  const actions = (row) => (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleViewPatient(row);
        }}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Voir le profil"
        aria-label="Voir le profil"
      >
        <Eye size={18} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEditPatient(row);
        }}
        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
        title="Modifier"
        aria-label="Modifier"
      >
        <Edit size={18} />
      </button>
      {userRole === 'SECRETAIRE' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSendToDoctor(row);
          }}
          className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
          title="Envoyer au médecin"
          aria-label="Envoyer au médecin"
        >
          <Send size={18} />
        </button>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeletePatient(row);
        }}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Supprimer"
        aria-label="Supprimer"
      >
        <Trash2 size={18} />
      </button>
    </>
  );

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedData = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Patients</h1>
          <p className="text-gray-600 mt-2">Gérez la liste de vos patients</p>
        </div>

        {/* Search Bar */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de recherche
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    value="nom"
                    checked={searchType === 'nom'}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Par Nom</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    value="cin"
                    checked={searchType === 'cin'}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Par CIN</span>
                </label>
              </div>
            </div>
            
            <div className="flex-1">
              <Input
                placeholder={`Rechercher par ${searchType === 'nom' ? 'nom ou prénom' : 'CIN'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={20} />}
              />
            </div>

            <Button
              variant="primary"
              onClick={handleCreatePatient}
              className="flex items-center gap-2"
            >
              <Plus size={20} />
              Nouveau Patient
            </Button>
          </div>
        </Card>

        {/* Patients Table */}
        <Card>
          {loading && !patients.length ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin text-violet-600" size={40} />
            </div>
          ) : error && !patients.length ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <Button variant="outline" onClick={fetchPatients} className="mt-4">
                Réessayer
              </Button>
            </div>
          ) : (
            <Table
              columns={columns}
              data={paginatedData}
              actions={actions}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </Card>

        {/* Patient Form Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={modalMode === 'create' ? 'Nouveau Patient' : 'Modifier Patient'}
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                {modalMode === 'create' ? 'Créer' : 'Enregistrer'}
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="CIN"
                name="cin"
                value={formData.cin}
                onChange={handleInputChange}
                error={formErrors.cin}
                required
                placeholder="AB123456"
              />
              
              <Input
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                error={formErrors.nom}
                required
                placeholder="Nom de famille"
              />
              
              <Input
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                error={formErrors.prenom}
                required
                placeholder="Prénom"
              />
              
              <Input
                label="Date de naissance"
                name="dateNaissance"
                type="date"
                value={formData.dateNaissance}
                onChange={handleInputChange}
                error={formErrors.dateNaissance}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sexe <span className="text-red-500">*</span>
                </label>
                <select
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  required
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              
              <Input
                label="Téléphone"
                name="telephone"
                type="tel"
                value={formData.telephone}
                onChange={handleInputChange}
                error={formErrors.telephone}
                required
                placeholder="0612345678"
              />
              
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={formErrors.email}
                placeholder="email@example.com"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type Mutuelle
                </label>
                <select
                  name="typeMutuelle"
                  value={formData.typeMutuelle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="CNOPS">CNOPS</option>
                  <option value="CNSS">CNSS</option>
                  <option value="RAMED">RAMED</option>
                  <option value="PRIVEE">Assurance Privée</option>
                  <option value="AUCUNE">Aucune</option>
                </select>
              </div>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <textarea
                name="adresse"
                value={formData.adresse}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Adresse complète"
              />
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Confirmer la suppression"
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
                Annuler
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Supprimer
              </Button>
            </div>
          }
        >
          <p className="text-gray-700">
            Êtes-vous sûr de vouloir supprimer le patient{' '}
            <strong>{selectedPatient?.prenom} {selectedPatient?.nom}</strong> ?
          </p>
          <p className="text-red-600 mt-2 text-sm">
            Cette action est irréversible et supprimera toutes les données associées.
          </p>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default PatientList;
