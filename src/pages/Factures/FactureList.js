import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Table from '../../components/UI/Table';
import Badge from '../../components/UI/Badge';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import factureService from '../../services/factureService';
import patientService from '../../services/patientService';
import toast from '../../utils/toast';
import { formatCurrency, formatCurrencyWithSuffix } from '../../utils/currency';
import { 
  Search, 
  Plus, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Printer,
  Filter,
  Loader
} from 'lucide-react';

const FactureList = () => {
  // State management
  const [factures, setFactures] = useState([]);
  const [filteredFactures, setFilteredFactures] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEnAttente: 0,
    totalPayeesMois: 0,
    montantEnAttente: 0,
    montantEncaisseMois: 0
  });
  
  // Filter state
  const [statutFilter, setStatutFilter] = useState('TOUTES');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [showConfirmPay, setShowConfirmPay] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    patientId: '',
    consultationId: '',
    montant: '',
    dateEcheance: '',
    notes: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterFactures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statutFilter, factures]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch factures
      const facturesResponse = await factureService.getAll();
      if (facturesResponse.data) {
        setFactures(facturesResponse.data);
      }
      
      // Fetch stats
      const statsResponse = await factureService.getStats();
      if (statsResponse.data) {
        setStats(statsResponse.data);
      }
      
      // Fetch patients for dropdown
      const patientsResponse = await patientService.getAll();
      if (patientsResponse.data) {
        setPatients(patientsResponse.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Impossible de charger les factures');
    } finally {
      setLoading(false);
    }
  };

  const filterFactures = () => {
    let filtered = [...factures];
    
    // Filter by status
    if (statutFilter !== 'TOUTES') {
      filtered = filtered.filter(f => f.statutPaiement === statutFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(f => 
        f.numero?.toLowerCase().includes(term) ||
        f.patientNom?.toLowerCase().includes(term) ||
        f.patientPrenom?.toLowerCase().includes(term)
      );
    }
    
    setFilteredFactures(filtered);
  };

  const handleCreateFacture = () => {
    setFormData({
      patientId: '',
      consultationId: '',
      montant: '',
      dateEcheance: '',
      notes: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleSubmitFacture = async (e) => {
    e.preventDefault();
    
    // Validation
    const errors = {};
    if (!formData.patientId) errors.patientId = 'Patient requis';
    if (!formData.montant || formData.montant <= 0) errors.montant = 'Montant invalide';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      await factureService.create(formData);
      toast.success('Facture créée avec succès');
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      toast.error('Erreur lors de la création de la facture');
    }
  };

  const handleValiderPaiement = (facture) => {
    setSelectedFacture(facture);
    setShowConfirmPay(true);
  };

  const confirmPaiement = async () => {
    if (!selectedFacture) return;
    
    try {
      await factureService.payer(selectedFacture.id);
      toast.success('Paiement validé avec succès');
      setShowConfirmPay(false);
      setSelectedFacture(null);
      fetchData();
    } catch (error) {
      console.error('Erreur lors de la validation du paiement:', error);
      toast.error('Erreur lors de la validation du paiement');
    }
  };

  const handleImprimerFacture = (facture) => {
    // Sanitize data to prevent XSS
    const sanitize = (str) => {
      if (!str) return '';
      return String(str).replace(/[<>]/g, '');
    };
    
    // Simple print implementation
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Facture ${sanitize(facture.numero)}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .info { margin-bottom: 20px; }
            .label { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FACTURE</h1>
            <p>N° ${sanitize(facture.numero)}</p>
          </div>
          <div class="info">
            <p><span class="label">Patient:</span> ${sanitize(facture.patientPrenom)} ${sanitize(facture.patientNom)}</p>
            <p><span class="label">CIN:</span> ${sanitize(facture.patientCin)}</p>
            <p><span class="label">Date d'émission:</span> ${new Date(facture.dateEmission).toLocaleDateString('fr-FR')}</p>
            <p><span class="label">Statut:</span> ${sanitize(facture.statutPaiement)}</p>
          </div>
          <table>
            <tr>
              <th>Description</th>
              <th>Montant</th>
            </tr>
            <tr>
              <td>${sanitize(facture.notes || 'Consultation médicale')}</td>
              <td>${sanitize(facture.montant)} MAD</td>
            </tr>
            <tr>
              <th>Total</th>
              <th>${sanitize(facture.montant)} MAD</th>
            </tr>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getStatutBadge = (statut) => {
    switch (statut) {
      case 'PAYE':
        return <Badge variant="success">Payée</Badge>;
      case 'EN_ATTENTE':
        return <Badge variant="warning">En attente</Badge>;
      case 'REMBOURSE':
        return <Badge variant="info">Remboursée</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFactures.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFactures.length / itemsPerPage);

  const columns = [
    { header: 'N° Facture', accessor: 'numero' },
    { 
      header: 'Patient', 
      accessor: (row) => `${row.patientPrenom || ''} ${row.patientNom || ''}` 
    },
    { 
      header: 'Date Émission', 
      accessor: (row) => new Date(row.dateEmission).toLocaleDateString('fr-FR') 
    },
    { 
      header: 'Montant', 
      accessor: (row) => `${row.montant} MAD` 
    },
    { 
      header: 'Statut', 
      accessor: (row) => getStatutBadge(row.statutPaiement) 
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex space-x-2">
          {row.statutPaiement === 'EN_ATTENTE' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => handleValiderPaiement(row)}
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleImprimerFacture(row)}
          >
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Factures</h1>
          <p className="text-gray-600 mt-1">Gérer les factures et les paiements</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEnAttente}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(stats.montantEnAttente)} MAD
                </p>
              </div>
              <Clock className="w-10 h-10 text-orange-500" />
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Payées ce mois</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPayeesMois}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(stats.montantEncaisseMois)} MAD
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Factures</p>
                <p className="text-2xl font-bold text-gray-900">{factures.length}</p>
              </div>
              <DollarSign className="w-10 h-10 text-blue-500" />
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Filtrées</p>
                <p className="text-2xl font-bold text-gray-900">{filteredFactures.length}</p>
              </div>
              <Filter className="w-10 h-10 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                icon={<Search className="w-5 h-5" />}
                placeholder="Rechercher par numéro ou nom patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={statutFilter}
                onChange={(e) => setStatutFilter(e.target.value)}
              >
                <option value="TOUTES">Toutes</option>
                <option value="EN_ATTENTE">En attente</option>
                <option value="PAYE">Payées</option>
                <option value="REMBOURSE">Remboursées</option>
              </select>
              <Button onClick={handleCreateFacture}>
                <Plus className="w-5 h-5 mr-2" />
                Nouvelle Facture
              </Button>
            </div>
          </div>
        </Card>

        {/* Factures Table */}
        <Card>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 animate-spin text-violet-600" />
            </div>
          ) : (
            <>
              <Table columns={columns} data={currentItems} />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="secondary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Précédent
                  </Button>
                  <span className="px-4 py-2">
                    Page {currentPage} sur {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Create Facture Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nouvelle Facture"
      >
        <form onSubmit={handleSubmitFacture} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Patient *
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            >
              <option value="">Sélectionner un patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.prenom} {patient.nom} - {patient.cin}
                </option>
              ))}
            </select>
            {formErrors.patientId && (
              <p className="text-red-500 text-sm mt-1">{formErrors.patientId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant (MAD) *
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="Ex: 500.00"
              value={formData.montant}
              onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
              error={formErrors.montant}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date d'échéance
            </label>
            <Input
              type="date"
              value={formData.dateEcheance}
              onChange={(e) => setFormData({ ...formData, dateEcheance: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              rows="3"
              placeholder="Notes supplémentaires..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer la Facture
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Payment Modal */}
      <Modal
        isOpen={showConfirmPay}
        onClose={() => setShowConfirmPay(false)}
        title="Confirmer le Paiement"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Êtes-vous sûr de vouloir valider le paiement de la facture{' '}
            <strong>{selectedFacture?.numero}</strong> ?
          </p>
          <p className="text-gray-600">
            Montant: <strong>{selectedFacture?.montant} MAD</strong>
          </p>
          <p className="text-gray-600">
            Patient: <strong>{selectedFacture?.patientPrenom} {selectedFacture?.patientNom}</strong>
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setShowConfirmPay(false)}>
              Annuler
            </Button>
            <Button variant="success" onClick={confirmPaiement}>
              Valider le Paiement
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default FactureList;
