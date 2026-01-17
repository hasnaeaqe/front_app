import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Table from '../../components/UI/Table';
import Badge from '../../components/UI/Badge';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Modal from '../../components/UI/Modal';
import consultationService from '../../services/consultationService';
import { useAuth } from '../../context/AuthContext';
import toast from '../../utils/toast';
import { 
  Stethoscope, 
  Eye, 
  FileText, 
  Calendar, 
  Clock,
  Filter,
  Plus,
  Loader
} from 'lucide-react';

const ConsultationList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('Toutes');
  
  // Modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  useEffect(() => {
    fetchConsultations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultations, dateFrom, dateTo, statusFilter]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get consultations from database based on user role
      let response;
      if (user && user.id) {
        // If user is a medecin, get consultations for today
        if (user.role === 'MEDECIN') {
          response = await consultationService.getAll();
        } else {
          // Otherwise get all consultations
          response = await consultationService.getAll();
        }
      } else {
        response = await consultationService.getAll();
      }
      
      const data = response.data || [];
      setConsultations(data);
      
      if (data.length === 0) {
        toast.show('Aucune consultation trouvée', 'info');
      } else {
        toast.show(`${data.length} consultation(s) chargée(s)`, 'success');
      }
    } catch (err) {
      console.error('Error fetching consultations:', err);
      if (err.response?.status === 404) {
        // No consultations found - this is OK
        setConsultations([]);
        toast.show('Aucune consultation trouvée', 'info');
      } else if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
        toast.show('Erreur de connexion au serveur. Vérifiez que le backend est démarré sur le port 8080.', 'error');
      } else {
        setError('Erreur lors du chargement des consultations');
        toast.show('Erreur lors du chargement des consultations. Vérifiez que le backend est démarré.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...consultations];
    
    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(c => new Date(c.dateConsultation) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(c => new Date(c.dateConsultation) <= new Date(dateTo));
    }
    
    // Note: Status filter removed since backend doesn't return status
    
    setFilteredConsultations(filtered);
  };

  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
    setShowDetailsModal(true);
  };

  const getStatusBadgeVariant = (statut) => {
    switch (statut) {
      case 'En cours':
        return 'warning';
      case 'Terminée':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const columns = [
    {
      header: 'Date & Heure',
      accessor: 'dateConsultation',
      render: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center text-sm font-medium text-gray-900">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {new Date(row.dateConsultation).toLocaleDateString('fr-FR')}
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            {new Date(row.dateConsultation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )
    },
    {
      header: 'Patient',
      accessor: 'patientNom',
      render: (row) => (
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-900">
            {row.patientNom} {row.patientPrenom}
          </div>
          <div className="text-sm text-gray-500">
            ID: {row.patientId}
          </div>
        </div>
      )
    },
    {
      header: 'Diagnostic',
      accessor: 'diagnostic',
      render: (row) => (
        <div className="text-sm text-gray-700">
          {row.diagnostic ? truncateText(row.diagnostic) : '-'}
        </div>
      )
    },
    {
      header: 'Durée',
      accessor: 'duree',
      render: (row) => (
        <div className="text-sm text-gray-700">
          {row.duree > 0 ? `${row.duree} min` : '-'}
        </div>
      )
    },
    {
      header: 'Médecin',
      accessor: 'medecinNom',
      render: (row) => (
        <div className="text-sm text-gray-700">
          Dr. {row.medecinNom} {row.medecinPrenom}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewDetails(row)}
          title="Voir les détails"
        >
          <Eye className="w-4 h-4" />
        </Button>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Stethoscope className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Mes Consultations</h1>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/medecin/consultations/nouvelle')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Consultation
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="date"
              label="Date de début"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            
            <Input
              type="date"
              label="Date de fin"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Toutes">Toutes</option>
                <option value="En cours">En cours</option>
                <option value="Terminée">Terminée</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Consultations Table */}
        <Card>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Chargement des consultations...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{error}</p>
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune consultation trouvée</p>
            </div>
          ) : (
            <Table columns={columns} data={filteredConsultations} />
          )}
        </Card>

        {/* Details Modal */}
        {showDetailsModal && selectedConsultation && (
          <Modal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title="Détails de la consultation"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Patient</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedConsultation.patientNom} {selectedConsultation.patientPrenom}
                </p>
                <p className="text-sm text-gray-600">
                  ID: {selectedConsultation.patientId}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Médecin</h3>
                <p className="mt-1 text-sm text-gray-900">
                  Dr. {selectedConsultation.medecinNom} {selectedConsultation.medecinPrenom}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date et heure</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedConsultation.dateConsultation).toLocaleDateString('fr-FR')} à {new Date(selectedConsultation.dateConsultation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Diagnostic</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedConsultation.diagnostic || '-'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Traitement</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedConsultation.traitement || '-'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Observations</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedConsultation.observations || '-'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Durée</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedConsultation.duree > 0 ? `${selectedConsultation.duree} minutes` : 'Non définie'}
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="secondary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ConsultationList;
