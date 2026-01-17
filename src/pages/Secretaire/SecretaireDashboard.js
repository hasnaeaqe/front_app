import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { StatCard, Card } from '../../components/UI';
import { Users, Calendar, DollarSign, Clock, ArrowRight } from 'lucide-react';
import secretaireService from '../../services/secretaireService';
import toast from '../../utils/toast';
import { formatCurrencyWithSuffix } from '../../utils/currency';

const SecretaireDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    patientsTotal: 0,
    rdvAujourdhui: 0,
    facturesEnAttente: 0,
    revenuTotal: 0
  });
  const [rendezVous, setRendezVous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch statistics
      console.log('Tentative fetch stats...');
      const statsResponse = await secretaireService.getStats();
      console.log('Stats reçues:', statsResponse.data);
      if (statsResponse.data) {
        setStats(statsResponse.data);
      }
      
      // Fetch today's appointments
      const rdvResponse = await secretaireService.getRendezVousAujourdhui();
      if (rdvResponse && Array.isArray(rdvResponse.data)) {
        setRendezVous(rdvResponse.data.slice(0, 5)); // Only show first 5
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setError('Impossible de charger les données du dashboard');
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeRemaining = (rdvDate, rdvTime) => {
    if (!rdvDate || !rdvTime) return 'N/A';
    
    const now = new Date();
    const rdvDateTime = new Date(`${rdvDate}T${rdvTime}`);
    const diffMs = rdvDateTime - now;
    
    if (diffMs < 0) return 'Passé';
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `Dans ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    if (remainingMins > 0) {
      return `Dans ${diffHours}h${remainingMins}`;
    }
    return `Dans ${diffHours}h`;
  };

  const quickActions = [
    {
      id: 'patients',
      title: 'Nouveau Patient',
      description: 'Enregistrer un nouveau patient',
      icon: <Users className="w-12 h-12 text-violet-600" />,
      color: 'violet',
      path: '/secretaire/patients'
    },
    {
      id: 'rdv',
      title: 'Prendre RDV',
      description: 'Planifier un rendez-vous',
      icon: <Calendar className="w-12 h-12 text-cyan-600" />,
      color: 'cyan',
      path: '/secretaire/rendez-vous'
    },
    {
      id: 'facturation',
      title: 'Facturation',
      description: 'Gérer les factures et paiements',
      icon: <DollarSign className="w-12 h-12 text-rose-600" />,
      color: 'rose',
      path: '/secretaire/facturation'
    }
  ];

  const getBorderColor = (color) => {
    const colors = {
      violet: 'border-violet-500 hover:border-violet-600',
      cyan: 'border-cyan-500 hover:border-cyan-600',
      rose: 'border-rose-500 hover:border-rose-600'
    };
    return colors[color] || colors.violet;
  };

  const handleQuickAction = (path) => {
    navigate(path);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">Bienvenue sur votre espace secrétaire</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Users className="w-8 h-8 text-violet-600" />}
            title="Patients Total"
            value={stats.patientsTotal}
            subtitle="Patients enregistrés"
            iconBgColor="bg-violet-100"
          />
          <StatCard
            icon={<Calendar className="w-8 h-8 text-cyan-600" />}
            title="RDV Aujourd'hui"
            value={stats.rdvAujourdhui}
            subtitle="Rendez-vous planifiés"
            iconBgColor="bg-cyan-100"
          />
          <StatCard
            icon={<Clock className="w-8 h-8 text-rose-600" />}
            title="Factures en Attente"
            value={stats.facturesEnAttente}
            subtitle="À traiter"
            iconBgColor="bg-rose-100"
          />
          <StatCard
            icon={<DollarSign className="w-8 h-8 text-green-600" />}
            title="Revenu Total"
            value={formatCurrencyWithSuffix(stats.revenuTotal || 0)}
            subtitle="Ce mois"
            iconBgColor="bg-green-100"
          />
        </div>

        {/* Quick Actions Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Accès Rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <div
                key={action.id}
                onClick={() => handleQuickAction(action.path)}
                className={`bg-white rounded-lg shadow-md border-2 ${getBorderColor(action.color)} p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-gray-50">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {action.description}
                    </p>
                  </div>
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <span>Accéder</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card borderColor="violet">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochains Rendez-vous</h3>
            {loading ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Chargement...</p>
              </div>
            ) : rendezVous.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Aucun rendez-vous aujourd'hui</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rendezVous.map((rdv) => (
                  <div key={rdv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {rdv.heureRdv} - Dr. {rdv.medecinNom || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-600">
                        Patient: {rdv.patientPrenom} {rdv.patientNom}
                      </p>
                    </div>
                    <span className={`text-xs font-medium ${
                      calculateTimeRemaining(rdv.dateRdv, rdv.heureRdv).includes('Passé') 
                        ? 'text-gray-500' 
                        : 'text-violet-600'
                    }`}>
                      {calculateTimeRemaining(rdv.dateRdv, rdv.heureRdv)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card borderColor="rose">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tâches du Jour</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Confirmer les RDV de demain</p>
                  <p className="text-xs text-gray-600">8 rendez-vous à confirmer</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Traiter les factures en attente</p>
                  <p className="text-xs text-gray-600">8 factures à traiter</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Mettre à jour les dossiers médicaux</p>
                  <p className="text-xs text-gray-600">3 dossiers en attente</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SecretaireDashboard;
