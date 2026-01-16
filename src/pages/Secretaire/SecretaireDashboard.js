import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { StatCard, Card } from '../../components/UI';
import { Users, Calendar, DollarSign, Clock, ArrowRight } from 'lucide-react';

const SecretaireDashboard = () => {
  const navigate = useNavigate();
  const [stats] = useState({
    patientsTotal: 145,
    rdvAujourdhui: 12,
    facturesEnAttente: 8,
    revenuTotal: '24,500'
  });
  useEffect(() => {
    // TODO: API call to fetch secretaire statistics
    // const fetchStats = async () => {
    //   try {
    //     const response = await api.get('/api/secretaire/stats');
    //     setStats(response.data);
    //   } catch (error) {
    //     console.error('Erreur lors de la récupération des statistiques:', error);
    //   }
    // };
    // fetchStats();
  }, []);

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
            value={`${stats.revenuTotal} MAD`}
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
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">10:00 - Dr. Alami</p>
                  <p className="text-xs text-gray-600">Patient: Mohammed Ben Ali</p>
                </div>
                <span className="text-xs text-violet-600 font-medium">Dans 30 min</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">11:00 - Dr. Alami</p>
                  <p className="text-xs text-gray-600">Patient: Fatima Zahra</p>
                </div>
                <span className="text-xs text-gray-600 font-medium">Dans 1h30</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">14:00 - Dr. Alami</p>
                  <p className="text-xs text-gray-600">Patient: Ahmed Idrissi</p>
                </div>
                <span className="text-xs text-gray-600 font-medium">Dans 4h</span>
              </div>
            </div>
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
