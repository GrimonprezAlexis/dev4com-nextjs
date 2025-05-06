import React from 'react';
import { LineChart, Activity, ArrowUpRight } from 'lucide-react';

const DashboardHome: React.FC = () => {
  const recentActivities = [
    { id: 1, type: 'update', message: 'Mise à jour de la page d\'accueil', time: 'Il y a 2h' },
    { id: 2, type: 'new', message: 'Nouveau projet ajouté', time: 'Il y a 4h' },
    { id: 3, type: 'contact', message: 'Nouveau message de contact', time: 'Il y a 6h' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Tableau de bord</h2>
        <button className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
          <span>Voir les rapports</span>
          <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="relative h-[300px] bg-black/20 rounded-lg p-4 border border-white/5">
        <div className="absolute top-4 left-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <LineChart size={20} />
            <span>Statistiques des visites</span>
          </div>
        </div>
        <div className="flex items-center justify-center h-full text-gray-500">
          Graphique des visites (à implémenter)
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4 text-gray-400">
          <Activity size={20} />
          <h3 className="text-lg font-medium">Activités récentes</h3>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span>{activity.message}</span>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;