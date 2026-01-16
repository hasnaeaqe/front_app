import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { StatCard, Card, Badge } from '../../components/UI';
import { Building2, Users, Pill, Activity, Plus, CheckCircle, List } from 'lucide-react';

const AdminDashboard = () => {
  const [stats] = useState({
    cabinetsActifs: 12,
    cabinetsTotal: 15,
    comptesUtilisateurs: 24,
    comptesMax: 30,
    medicaments: 150,
    servicesActifs: 8
  });

  const [recentCabinets] = useState([
    { id: 1, nom: 'Cabinet Dr. Alami', localisation: 'Casablanca, Maarif', statut: 'Actif' },
    { id: 2, nom: 'Cabinet Dr. Bennis', localisation: 'Rabat, Agdal', statut: 'Actif' },
    { id: 3, nom: 'Cabinet Dr. Chraibi', localisation: 'Marrakech, Gueliz', statut: 'Inactif' }
  ]);

  const [recentActivity] = useState([
    { id: 1, type: 'cabinet', text: 'Nouveau cabinet créé: Cabinet Dr. Alami', time: 'Il y a 2 heures' },
    { id: 2, type: 'users', text: '3 nouveaux comptes créés', time: 'Il y a 4 heures' },
    { id: 3, type: 'medicaments', text: 'Liste médicaments mise à jour', time: 'Il y a 1 jour' }
  ]);

  useEffect(() => {
    // TODO: API call to fetch admin statistics
    // const fetchStats = async () => {
    //   try {
    //     const response = await api.get('/api/admin/stats');
    //     setStats(response.data);
    //   } catch (error) {
    //     console.error('Erreur lors de la récupération des statistiques:', error);
    //   }
    // };
    // fetchStats();

    // TODO: API call to fetch recent cabinets
    // const fetchRecentCabinets = async () => {
    //   try {
    //     const response = await api.get('/api/cabinets?recent=true');
    //     setRecentCabinets(response.data);
    //   } catch (error) {
    //     console.error('Erreur lors de la récupération des cabinets récents:', error);
    //   }
    // };
    // fetchRecentCabinets();

    // TODO: API call to fetch recent activity
    // const fetchActivity = async () => {
    //   try {
    //     const response = await api.get('/api/admin/activity');
    //     setRecentActivity(response.data);
    //   } catch (error) {
    //     console.error('Erreur lors de la récupération de l\'activité:', error);
    //   }
    // };
    // fetchActivity();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'cabinet':
        return <Plus className="w-4 h-4 text-violet-600" />;
      case 'users':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'medicaments':
        return <List className="w-4 h-4 text-cyan-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Building2 className="w-8 h-8 text-violet-600" />}
            title="Cabinets Actifs"
            value={`${stats.cabinetsActifs} / ${stats.cabinetsTotal}`}
            subtitle="Cabinets enregistrés"
            iconBgColor="bg-violet-100"
          />
          <StatCard
            icon={<Users className="w-8 h-8 text-cyan-600" />}
            title="Comptes Utilisateurs"
            value={`${stats.comptesUtilisateurs} / ${stats.comptesMax}`}
            subtitle="Utilisateurs actifs"
            iconBgColor="bg-cyan-100"
          />
          <StatCard
            icon={<Pill className="w-8 h-8 text-green-600" />}
            title="Médicaments"
            value={stats.medicaments}
            subtitle="Dans la base de données"
            iconBgColor="bg-green-100"
          />
          <StatCard
            icon={<Activity className="w-8 h-8 text-rose-600" />}
            title="Services Actifs"
            value={stats.servicesActifs}
            subtitle="Services disponibles"
            iconBgColor="bg-rose-100"
          />
        </div>

        {/* Recent Cabinets Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cabinets Récents</h2>
          <Card borderColor="violet">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localisation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentCabinets.map((cabinet) => (
                    <tr key={cabinet.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{cabinet.nom}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{cabinet.localisation}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant={cabinet.statut === 'Actif' ? 'success' : 'default'}>
                          {cabinet.statut}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Activité Récente</h2>
          <Card borderColor="cyan">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
