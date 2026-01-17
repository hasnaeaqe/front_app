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
  }, []);

  useEffect(() => {
    applyFilters();
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
      
      setConsultations(response.data || []);
    } catch (err) {
      console.error('Error fetching consultations:', err);
      setError('Erreur lors du chargement des consultations');
      toast.error('Erreur lors du chargement des consultations');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...consultations];
    
    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(c => new Date(c.date) >= new Date(dateFrom));
    }
    if (dateTo) {
      filtered = filtered.filter(c => new Date(c.date) <= new Date(dateTo));
    }
    
    // Filter by status
    if (statusFilter && statusFilter !== 'Toutes') {
      filtered = filtered.filter(c => c.statut === statusFilter);
    }
    
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
      accessor: 'date',
      render: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center text-sm font-medium text-gray-900">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {new Date(row.date).toLocaleDateString('fr-FR')}
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            {row.heure}
          </div>
        </div>
      )
    },
    {
      header: 'Patient',
      accessor: 'patient',
      render: (row) => (
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-900">
            {row.patient.nom} {row.patient.prenom}
          </div>
          <div className="text-sm text-gray-500">
            CIN: {row.patient.cin}
          </div>
        </div>
      )
    },
    {
      header: 'Diagnostic',
      accessor: 'diagnostic',
      render: (row) => (
        <div className="text-sm text-gray-700">
          {truncateText(row.diagnostic)}
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
      header: 'Statut',
      accessor: 'statut',
      render: (row) => (
        <Badge variant={getStatusBadgeVariant(row.statut)}>
          {row.statut}
        </Badge>
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
                  {selectedConsultation.patient.nom} {selectedConsultation.patient.prenom}
                </p>
                <p className="text-sm text-gray-600">
                  CIN: {selectedConsultation.patient.cin}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date et heure</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedConsultation.date).toLocaleDateString('fr-FR')} à {selectedConsultation.heure}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Diagnostic</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedConsultation.diagnostic}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Durée</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedConsultation.duree > 0 ? `${selectedConsultation.duree} minutes` : 'Non définie'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                <div className="mt-1">
                  <Badge variant={getStatusBadgeVariant(selectedConsultation.statut)}>
                    {selectedConsultation.statut}
                  </Badge>
                </div>
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
