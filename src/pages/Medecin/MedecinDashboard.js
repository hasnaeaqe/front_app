import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { StatCard, Card, Button } from '../../components/UI';
import { useNotifications } from '../../context/NotificationContext';
import { Users, Stethoscope, Clock, DollarSign, AlertCircle, Search, Printer, ArrowRight } from 'lucide-react';
import medecinService from '../../services/medecinService';
import { useAuth } from '../../context/AuthContext';

const MedecinDashboard = () => {
  const navigate = useNavigate();
  const { patientEnCours } = useNotifications();
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    patientsTotal: 0,
    consultationsAujourdhui: 0,
    consultationsEnCours: 0,
    revenuAujourdhui: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Poll for patient en cours every 10 seconds
    const interval = setInterval(() => {
      if (user && user.id) {
        medecinService.getPatientEnCours(user.id).catch(() => {});
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      if (user && user.id) {
        const response = await medecinService.getStats(user.id);
        setStats(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      id: 'recherche',
      title: 'Rechercher Patient',
      description: 'Trouver un dossier patient',
      icon: <Search className="w-10 h-10 text-violet-600" />,
      color: 'violet',
      path: '/medecin/recherche-patients'
    },
    {
      id: 'consultation',
      title: 'Nouvelle Consultation',
      description: 'Démarrer une consultation',
      icon: <Stethoscope className="w-10 h-10 text-cyan-600" />,
      color: 'cyan',
      path: '/medecin/consultations'
    },
    {
      id: 'ordonnance',
      title: 'Imprimer Ordonnance',
      description: 'Créer et imprimer une ordonnance',
      icon: <Printer className="w-10 h-10 text-green-600" />,
      color: 'green',
      action: 'print'
    }
  ];

  const handleQuickAction = (action) => {
    if (action.action === 'print') {
      // TODO: Implement print ordonnance logic
      console.log('Imprimer ordonnance');
    } else if (action.path) {
      navigate(action.path);
    }
  };

  const handleViewDossier = () => {
    if (patientEnCours) {
      navigate(`/medecin/dossier-medical/${patientEnCours.id}`);
    }
  };

  const handleStartConsultation = () => {
    if (patientEnCours) {
      navigate(`/medecin/consultations/nouvelle/${patientEnCours.id}`);
    }
  };

  const getBorderColor = (color) => {
    const colors = {
      violet: 'border-violet-500 hover:border-violet-600',
      cyan: 'border-cyan-500 hover:border-cyan-600',
      green: 'border-green-500 hover:border-green-600'
    };
    return colors[color] || colors.violet;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Chargement...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Patient en Cours Alert */}
        {patientEnCours && (
          <Card borderColor="rose" className="bg-rose-50">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-rose-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-rose-900 mb-2">
                  Patient en attente
                </h3>
                <p className="text-sm text-rose-800 mb-4">
                  {patientEnCours.nom} {patientEnCours.prenom} est prêt pour la consultation
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    onClick={handleStartConsultation}
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    Démarrer consultation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleViewDossier}
                  >
                    Voir le dossier
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">Bienvenue sur votre espace médecin</p>
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
            icon={<Stethoscope className="w-8 h-8 text-cyan-600" />}
            title="Consultations Aujourd'hui"
            value={stats.consultationsAujourdhui}
            subtitle="Consultations planifiées"
            iconBgColor="bg-cyan-100"
          />
          <StatCard
            icon={<Clock className="w-8 h-8 text-rose-600" />}
            title="Consultations en Cours"
            value={stats.consultationsEnCours}
            subtitle="En cours"
            iconBgColor="bg-rose-100"
          />
          <StatCard
            icon={<DollarSign className="w-8 h-8 text-green-600" />}
            title="Revenu Aujourd'hui"
            value={`${stats.revenuAujourdhui} MAD`}
            subtitle="Ce jour"
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
                onClick={() => handleQuickAction(action)}
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

        {/* Additional Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card borderColor="violet">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochaines Consultations</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Mohammed Ben Ali</p>
                  <p className="text-xs text-gray-600">Consultation de suivi</p>
                </div>
                <span className="text-xs text-violet-600 font-medium">10:00</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Fatima Zahra</p>
                  <p className="text-xs text-gray-600">Première consultation</p>
                </div>
                <span className="text-xs text-gray-600 font-medium">11:00</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Ahmed Idrissi</p>
                  <p className="text-xs text-gray-600">Contrôle mensuel</p>
                </div>
                <span className="text-xs text-gray-600 font-medium">14:00</span>
              </div>
            </div>
          </Card>

          <Card borderColor="cyan">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques de la Semaine</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Consultations effectuées</span>
                  <span className="font-semibold text-gray-900">28 / 35</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-violet-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Nouveaux patients</span>
                  <span className="font-semibold text-gray-900">12</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-cyan-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Ordonnances émises</span>
                  <span className="font-semibold text-gray-900">24</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Patients */}
        <Card borderColor="green">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patients Récents</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière Visite</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnostic</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    Mohammed Ben Ali
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    Hier, 14:30
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    Grippe saisonnière
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Button variant="outline" size="sm">Voir dossier</Button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    Fatima Zahra
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    Il y a 2 jours
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    Consultation de routine
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Button variant="outline" size="sm">Voir dossier</Button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    Ahmed Idrissi
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    Il y a 3 jours
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    Hypertension
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Button variant="outline" size="sm">Voir dossier</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MedecinDashboard;
