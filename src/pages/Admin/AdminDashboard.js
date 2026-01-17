import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { StatCard, Card, Badge } from '../../components/UI';
import { Building2, Users, Pill, Activity, Plus, CheckCircle, List } from 'lucide-react';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    cabinetsActifs: 0,
    cabinetsTotal: 0,
    comptesUtilisateurs: 0,
    medicaments: 0,
    servicesActifs: 0
  });

  const [recentCabinets, setRecentCabinets] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Charger les statistiques
      const statsResponse = await adminService.getStats();
      setStats(statsResponse.data);
      
      // Charger les cabinets récents
      const cabinetsResponse = await adminService.getCabinetsRecents();
      setRecentCabinets(cabinetsResponse.data);
      
      // Charger l'activité récente
      const activityResponse = await adminService.getActiviteRecente();
      setRecentActivity(activityResponse.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'CREATION_CABINET':
      case 'MODIFICATION_CABINET':
      case 'SUPPRESSION_CABINET':
      case 'TOGGLE_CABINET':
        return <Plus className="w-4 h-4 text-violet-600" />;
      case 'CREATION_COMPTE':
      case 'MODIFICATION_COMPTE':
      case 'SUPPRESSION_COMPTE':
      case 'TOGGLE_COMPTE':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'CREATION_MEDICAMENT':
      case 'MODIFICATION_MEDICAMENT':
      case 'SUPPRESSION_MEDICAMENT':
        return <List className="w-4 h-4 text-cyan-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    }
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
            value={stats.comptesUtilisateurs}
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
                      Médecins
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentCabinets.length > 0 ? (
                    recentCabinets.map((cabinet) => (
                      <tr key={cabinet.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{cabinet.nom}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{cabinet.adresse || 'N/A'}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{cabinet.nombreMedecins}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant={cabinet.actif ? 'success' : 'default'}>
                            {cabinet.actif ? 'Actif' : 'Inactif'}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                        Aucun cabinet récent
                      </td>
                    </tr>
                  )}
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
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.titre}</p>
                      {activity.description && (
                        <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimeAgo(activity.dateCreation)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Aucune activité récente
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
