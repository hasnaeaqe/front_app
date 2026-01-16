import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Badge from '../../components/UI/Badge';
import Table from '../../components/UI/Table';
import rendezVousService from '../../services/rendezVousService';
import patientService from '../../services/patientService';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './RendezVousList.css';
import { format, isToday, isSameDay, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, User, Plus, Edit, X, Check, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const RendezVousList = () => {
  // API services available for production (currently using mock data)
  // eslint-disable-next-line no-unused-vars
  const apiServices = { rendezVousService, patientService };
  
  const [rendezVous, setRendezVous] = useState([]);
  const [filteredRendezVous, setFilteredRendezVous] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar');
  const [filterMode, setFilterMode] = useState('all');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [showModal, setShowModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState(null);
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchPatient, setSearchPatient] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    medecinId: '',
    date: '',
    heure: '',
    motif: '',
    notes: '',
    statut: 'EN_ATTENTE'
  });

  const mockMedecins = [
    { id: 1, nom: 'Alami', prenom: 'Hassan', specialite: 'Cardiologue' },
    { id: 2, nom: 'Benjelloun', prenom: 'Fatima', specialite: 'Pédiatre' },
    { id: 3, nom: 'El Idrissi', prenom: 'Mohammed', specialite: 'Généraliste' },
    { id: 4, nom: 'Tazi', prenom: 'Amina', specialite: 'Dermatologue' }
  ];

  const mockPatients = [
    { id: 1, nom: 'Alaoui', prenom: 'Youssef', cin: 'AB123456', telephone: '0612345678' },
    { id: 2, nom: 'Bennani', prenom: 'Zahra', cin: 'CD789012', telephone: '0623456789' },
    { id: 3, nom: 'Chakir', prenom: 'Karim', cin: 'EF345678', telephone: '0634567890' },
    { id: 4, nom: 'Drissi', prenom: 'Laila', cin: 'GH901234', telephone: '0645678901' },
    { id: 5, nom: 'El Fassi', prenom: 'Omar', cin: 'IJ567890', telephone: '0656789012' }
  ];

  const mockRendezVous = [
    { 
      id: 1, 
      patientId: 1, 
      patientNom: 'Alaoui', 
      patientPrenom: 'Youssef',
      medecinId: 1,
      medecinNom: 'Alami',
      medecinPrenom: 'Hassan',
      medecinSpecialite: 'Cardiologue',
      date: format(new Date(), 'yyyy-MM-dd'),
      heure: '09:00',
      motif: 'Consultation de contrôle',
      notes: 'Patient suivi pour hypertension',
      statut: 'CONFIRME'
    },
    { 
      id: 2, 
      patientId: 2, 
      patientNom: 'Bennani', 
      patientPrenom: 'Zahra',
      medecinId: 2,
      medecinNom: 'Benjelloun',
      medecinPrenom: 'Fatima',
      medecinSpecialite: 'Pédiatre',
      date: format(new Date(), 'yyyy-MM-dd'),
      heure: '10:30',
      motif: 'Vaccination enfant',
      notes: '',
      statut: 'EN_ATTENTE'
    },
    { 
      id: 3, 
      patientId: 3, 
      patientNom: 'Chakir', 
      patientPrenom: 'Karim',
      medecinId: 3,
      medecinNom: 'El Idrissi',
      medecinPrenom: 'Mohammed',
      medecinSpecialite: 'Généraliste',
      date: format(new Date(), 'yyyy-MM-dd'),
      heure: '14:00',
      motif: 'Douleurs abdominales',
      notes: 'Urgence',
      statut: 'CONFIRME'
    },
    { 
      id: 4, 
      patientId: 4, 
      patientNom: 'Drissi', 
      patientPrenom: 'Laila',
      medecinId: 4,
      medecinNom: 'Tazi',
      medecinPrenom: 'Amina',
      medecinSpecialite: 'Dermatologue',
      date: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'),
      heure: '11:00',
      motif: 'Problème de peau',
      notes: '',
      statut: 'EN_ATTENTE'
    },
    { 
      id: 5, 
      patientId: 5, 
      patientNom: 'El Fassi', 
      patientPrenom: 'Omar',
      medecinId: 1,
      medecinNom: 'Alami',
      medecinPrenom: 'Hassan',
      medecinSpecialite: 'Cardiologue',
      date: format(new Date(Date.now() - 86400000), 'yyyy-MM-dd'),
      heure: '16:00',
      motif: 'Bilan cardiaque',
      notes: 'Patient a 65 ans',
      statut: 'TERMINE'
    },
    { 
      id: 6, 
      patientId: 1, 
      patientNom: 'Alaoui', 
      patientPrenom: 'Youssef',
      medecinId: 2,
      medecinNom: 'Benjelloun',
      medecinPrenom: 'Fatima',
      medecinSpecialite: 'Pédiatre',
      date: format(new Date(Date.now() - 172800000), 'yyyy-MM-dd'),
      heure: '15:30',
      motif: 'Consultation annulée',
      notes: 'Patient absent',
      statut: 'ANNULE'
    }
  ];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterRendezVous = useCallback(() => {
    let filtered = [...rendezVous];

    if (viewMode === 'calendar') {
      filtered = filtered.filter(rdv => {
        const rdvDate = parseISO(rdv.date);
        return isSameDay(rdvDate, selectedDate);
      });
    } else {
      if (filterMode === 'today') {
        filtered = filtered.filter(rdv => {
          const rdvDate = parseISO(rdv.date);
          return isToday(rdvDate);
        });
      } else if (filterMode === 'week') {
        const start = startOfWeek(new Date(), { locale: fr });
        const end = endOfWeek(new Date(), { locale: fr });
        filtered = filtered.filter(rdv => {
          const rdvDate = parseISO(rdv.date);
          return rdvDate >= start && rdvDate <= end;
        });
      }
    }

    if (statusFilter !== 'Tous') {
      filtered = filtered.filter(rdv => rdv.statut === statusFilter);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.heure}`);
      const dateB = new Date(`${b.date}T${b.heure}`);
      return dateA - dateB;
    });

    setFilteredRendezVous(filtered);
  }, [rendezVous, selectedDate, filterMode, statusFilter, viewMode]);

  useEffect(() => {
    filterRendezVous();
  }, [filterRendezVous]);

  useEffect(() => {
    if (searchPatient.trim().length > 0) {
      const filtered = patients.filter(p => 
        `${p.nom} ${p.prenom}`.toLowerCase().includes(searchPatient.toLowerCase()) ||
        p.cin?.toLowerCase().includes(searchPatient.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients([]);
    }
  }, [searchPatient, patients]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      setMedecins(mockMedecins);
      setPatients(mockPatients);
      setRendezVous(mockRendezVous);

      /* Production API calls:
      const [rdvResponse, patientsResponse] = await Promise.all([
        rendezVousService.getAll(),
        patientService.getAll()
      ]);
      
      setRendezVous(rdvResponse.data);
      setPatients(patientsResponse.data);
      
      // Fetch medecins from API when available
      setMedecins(mockMedecins);
      */

      toast.success('Données chargées avec succès');
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Erreur lors du chargement des données');
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (statut) => {
    const statusConfig = {
      EN_ATTENTE: { variant: 'warning', label: 'En Attente' },
      CONFIRME: { variant: 'info', label: 'Confirmé' },
      ANNULE: { variant: 'danger', label: 'Annulé' },
      TERMINE: { variant: 'success', label: 'Terminé' }
    };

    const config = statusConfig[statut] || { variant: 'default', label: statut };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayRendezVous = rendezVous.filter(rdv => {
        const rdvDate = parseISO(rdv.date);
        return isSameDay(rdvDate, date);
      });

      if (dayRendezVous.length > 0) {
        return (
          <div className="flex justify-center mt-1">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
          </div>
        );
      }
    }
    return null;
  };

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dayRendezVous = rendezVous.filter(rdv => {
        const rdvDate = parseISO(rdv.date);
        return isSameDay(rdvDate, date);
      });

      if (dayRendezVous.length > 0) {
        return 'has-events';
      }
    }
    return null;
  };

  const handleOpenModal = (rdv = null) => {
    if (rdv) {
      setSelectedRdv(rdv);
      setFormData({
        patientId: rdv.patientId,
        patientName: `${rdv.patientNom} ${rdv.patientPrenom}`,
        medecinId: rdv.medecinId,
        date: rdv.date,
        heure: rdv.heure,
        motif: rdv.motif,
        notes: rdv.notes || '',
        statut: rdv.statut
      });
      setSearchPatient(`${rdv.patientNom} ${rdv.patientPrenom}`);
    } else {
      setSelectedRdv(null);
      setFormData({
        patientId: '',
        patientName: '',
        medecinId: '',
        date: format(selectedDate, 'yyyy-MM-dd'),
        heure: '',
        motif: '',
        notes: '',
        statut: 'EN_ATTENTE'
      });
      setSearchPatient('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRdv(null);
    setSearchPatient('');
    setShowPatientDropdown(false);
  };

  const handleSelectPatient = (patient) => {
    setFormData({
      ...formData,
      patientId: patient.id,
      patientName: `${patient.nom} ${patient.prenom}`
    });
    setSearchPatient(`${patient.nom} ${patient.prenom}`);
    setShowPatientDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientId || !formData.medecinId || !formData.date || !formData.heure || !formData.motif) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const medecin = medecins.find(m => m.id === parseInt(formData.medecinId));
      const patient = patients.find(p => p.id === parseInt(formData.patientId));

      const rdvData = {
        patientId: formData.patientId,
        patientNom: patient.nom,
        patientPrenom: patient.prenom,
        medecinId: formData.medecinId,
        medecinNom: medecin.nom,
        medecinPrenom: medecin.prenom,
        medecinSpecialite: medecin.specialite,
        date: formData.date,
        heure: formData.heure,
        motif: formData.motif,
        notes: formData.notes,
        statut: formData.statut
      };

      if (selectedRdv) {
        /* Production API call:
        await rendezVousService.update(selectedRdv.id, rdvData);
        */
        const updatedRendezVous = rendezVous.map(rdv =>
          rdv.id === selectedRdv.id ? { ...rdv, ...rdvData } : rdv
        );
        setRendezVous(updatedRendezVous);
        toast.success('Rendez-vous modifié avec succès');
      } else {
        /* Production API call:
        const response = await rendezVousService.create(rdvData);
        setRendezVous([...rendezVous, response.data]);
        */
        const newRdv = { 
          id: Math.max(...rendezVous.map(r => r.id)) + 1, 
          ...rdvData 
        };
        setRendezVous([...rendezVous, newRdv]);
        toast.success('Rendez-vous créé avec succès');
      }

      handleCloseModal();
    } catch (err) {
      console.error('Error saving rendez-vous:', err);
      toast.error('Erreur lors de l\'enregistrement du rendez-vous');
    }
  };

  const handleCancelRdv = async () => {
    if (!selectedRdv) return;

    try {
      /* Production API call:
      await rendezVousService.delete(selectedRdv.id);
      */
      const updatedRendezVous = rendezVous.map(rdv =>
        rdv.id === selectedRdv.id ? { ...rdv, statut: 'ANNULE' } : rdv
      );
      setRendezVous(updatedRendezVous);
      toast.success('Rendez-vous annulé');
      setShowCancelConfirm(false);
      setSelectedRdv(null);
    } catch (err) {
      console.error('Error canceling rendez-vous:', err);
      toast.error('Erreur lors de l\'annulation');
    }
  };

  const handleChangeStatus = async (rdv, newStatus) => {
    try {
      /* Production API call:
      await rendezVousService.update(rdv.id, { ...rdv, statut: newStatus });
      */
      const updatedRendezVous = rendezVous.map(r =>
        r.id === rdv.id ? { ...r, statut: newStatus } : r
      );
      setRendezVous(updatedRendezVous);
      toast.success('Statut mis à jour');
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const renderCalendarView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              Calendrier
            </h3>
            <div className="calendar-container">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                locale="fr-FR"
                tileContent={getTileContent}
                tileClassName={getTileClassName}
                className="w-full border-none"
              />
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Date sélectionnée:</span>
                <br />
                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                <span>Jours avec rendez-vous</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Rendez-vous du {format(selectedDate, 'd MMMM yyyy', { locale: fr })}
              </h3>
              <Button onClick={() => handleOpenModal()} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Nouveau RDV
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Tous">Tous les statuts</option>
                <option value="EN_ATTENTE">En Attente</option>
                <option value="CONFIRME">Confirmé</option>
                <option value="ANNULE">Annulé</option>
                <option value="TERMINE">Terminé</option>
              </select>
            </div>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement...</p>
              </div>
            ) : filteredRendezVous.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Aucun rendez-vous pour cette date</p>
                <Button onClick={() => handleOpenModal()} className="mt-4" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Créer un rendez-vous
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRendezVous.map(rdv => (
                  <div
                    key={rdv.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2 text-blue-600 font-semibold">
                            <Clock className="w-5 h-5" />
                            <span className="text-lg">{rdv.heure}</span>
                          </div>
                          {getStatusBadge(rdv.statut)}
                        </div>
                        
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {rdv.patientNom} {rdv.patientPrenom}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Dr. {rdv.medecinNom} {rdv.medecinPrenom}</span>
                            <span className="text-gray-400"> · {rdv.medecinSpecialite}</span>
                          </div>
                          
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">Motif:</span> {rdv.motif}
                          </div>
                          
                          {rdv.notes && (
                            <div className="text-sm text-gray-600 italic">
                              Note: {rdv.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        {rdv.statut === 'EN_ATTENTE' && (
                          <button
                            onClick={() => handleChangeStatus(rdv, 'CONFIRME')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Confirmer"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                        {rdv.statut === 'CONFIRME' && (
                          <button
                            onClick={() => handleChangeStatus(rdv, 'TERMINE')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Marquer comme terminé"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenModal(rdv)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        {rdv.statut !== 'ANNULE' && rdv.statut !== 'TERMINE' && (
                          <button
                            onClick={() => {
                              setSelectedRdv(rdv);
                              setShowCancelConfirm(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Annuler"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderListView = () => {
    const columns = [
      { 
        key: 'dateHeure', 
        label: 'Date & Heure',
        render: (rdv) => (
          <div>
            <div className="font-medium text-gray-900">
              {format(parseISO(rdv.date), 'd MMMM yyyy', { locale: fr })}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              {rdv.heure}
            </div>
          </div>
        )
      },
      { 
        key: 'patient', 
        label: 'Patient',
        render: (rdv) => (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{rdv.patientNom} {rdv.patientPrenom}</span>
          </div>
        )
      },
      { 
        key: 'medecin', 
        label: 'Médecin',
        render: (rdv) => (
          <div>
            <div className="font-medium">Dr. {rdv.medecinNom} {rdv.medecinPrenom}</div>
            <div className="text-sm text-gray-600">{rdv.medecinSpecialite}</div>
          </div>
        )
      },
      { 
        key: 'motif', 
        label: 'Motif',
        render: (rdv) => (
          <div className="max-w-xs">
            <div className="text-sm text-gray-700">{rdv.motif}</div>
            {rdv.notes && (
              <div className="text-xs text-gray-500 italic mt-1">{rdv.notes}</div>
            )}
          </div>
        )
      },
      { 
        key: 'statut', 
        label: 'Statut',
        render: (rdv) => getStatusBadge(rdv.statut)
      },
      {
        key: 'actions',
        label: 'Actions',
        render: (rdv) => (
          <div className="flex gap-2">
            {rdv.statut === 'EN_ATTENTE' && (
              <button
                onClick={() => handleChangeStatus(rdv, 'CONFIRME')}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Confirmer"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            {rdv.statut === 'CONFIRME' && (
              <button
                onClick={() => handleChangeStatus(rdv, 'TERMINE')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Terminer"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => handleOpenModal(rdv)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Modifier"
            >
              <Edit className="w-4 h-4" />
            </button>
            {rdv.statut !== 'ANNULE' && rdv.statut !== 'TERMINE' && (
              <button
                onClick={() => {
                  setSelectedRdv(rdv);
                  setShowCancelConfirm(true);
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Annuler"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )
      }
    ];

    return (
      <Card>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Liste des Rendez-vous</h3>
            <Button onClick={() => handleOpenModal()}>
              <Plus className="w-4 h-4 mr-1" />
              Nouveau RDV
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2">
              <Button
                variant={filterMode === 'today' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterMode('today')}
              >
                Aujourd'hui
              </Button>
              <Button
                variant={filterMode === 'week' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterMode('week')}
              >
                Cette semaine
              </Button>
              <Button
                variant={filterMode === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterMode('all')}
              >
                Tous
              </Button>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tous">Tous les statuts</option>
              <option value="EN_ATTENTE">En Attente</option>
              <option value="CONFIRME">Confirmé</option>
              <option value="ANNULE">Annulé</option>
              <option value="TERMINE">Terminé</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          ) : filteredRendezVous.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun rendez-vous trouvé</p>
            </div>
          ) : (
            <Table columns={columns} data={filteredRendezVous} />
          )}
        </div>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Rendez-vous</h1>
          <p className="text-gray-600">Gérez et planifiez les rendez-vous des patients</p>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={viewMode === 'calendar' ? 'primary' : 'outline'}
            onClick={() => setViewMode('calendar')}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Vue Calendrier
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            <Filter className="w-4 h-4 mr-2" />
            Vue Liste
          </Button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <X className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {viewMode === 'calendar' ? renderCalendarView() : renderListView()}

        <Modal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={selectedRdv ? 'Modifier le Rendez-vous' : 'Nouveau Rendez-vous'}
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>
                {selectedRdv ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchPatient}
                    onChange={(e) => {
                      setSearchPatient(e.target.value);
                      setShowPatientDropdown(true);
                    }}
                    onFocus={() => setShowPatientDropdown(true)}
                    placeholder="Rechercher par nom ou CIN..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                {showPatientDropdown && filteredPatients.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredPatients.map(patient => (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => handleSelectPatient(patient)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{patient.nom} {patient.prenom}</div>
                          <div className="text-sm text-gray-500">CIN: {patient.cin}</div>
                        </div>
                        <div className="text-sm text-gray-400">{patient.telephone}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Médecin <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.medecinId}
                onChange={(e) => setFormData({ ...formData, medecinId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un médecin</option>
                {medecins.map(medecin => (
                  <option key={medecin.id} value={medecin.id}>
                    Dr. {medecin.nom} {medecin.prenom} - {medecin.specialite}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.heure}
                  onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motif <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.motif}
                onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Motif de la consultation..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optionnel)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notes additionnelles..."
              />
            </div>

            {selectedRdv && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EN_ATTENTE">En Attente</option>
                  <option value="CONFIRME">Confirmé</option>
                  <option value="ANNULE">Annulé</option>
                  <option value="TERMINE">Terminé</option>
                </select>
              </div>
            )}
          </form>
        </Modal>

        <Modal
          isOpen={showCancelConfirm}
          onClose={() => {
            setShowCancelConfirm(false);
            setSelectedRdv(null);
          }}
          title="Confirmer l'annulation"
          footer={
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCancelConfirm(false);
                  setSelectedRdv(null);
                }}
              >
                Non, garder
              </Button>
              <Button variant="danger" onClick={handleCancelRdv}>
                Oui, annuler
              </Button>
            </div>
          }
        >
          <p className="text-gray-700">
            Êtes-vous sûr de vouloir annuler ce rendez-vous ?
          </p>
          {selectedRdv && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Patient:</span> {selectedRdv.patientNom} {selectedRdv.patientPrenom}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Date:</span> {format(parseISO(selectedRdv.date), 'd MMMM yyyy', { locale: fr })} à {selectedRdv.heure}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Médecin:</span> Dr. {selectedRdv.medecinNom} {selectedRdv.medecinPrenom}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default RendezVousList;
