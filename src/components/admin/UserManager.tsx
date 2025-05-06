import React from 'react';
import { UserPlus, Shield, Mail, Calendar } from 'lucide-react';

const UserManager: React.FC = () => {
  const users = [
    { id: 1, name: 'Admin Principal', email: 'admin@dm-dev.com', role: 'admin', lastLogin: '2024-03-15' },
    { id: 2, name: 'Éditeur Content', email: 'editor@dm-dev.com', role: 'editor', lastLogin: '2024-03-14' },
    { id: 3, name: 'Gestionnaire Média', email: 'media@dm-dev.com', role: 'media', lastLogin: '2024-03-13' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <UserPlus size={20} />
          <span>Nouvel utilisateur</span>
        </button>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-medium">{user.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Mail size={14} />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>Dernière connexion: {user.lastLogin}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs ${
                user.role === 'admin' ? 'bg-blue-500/20 text-blue-400' :
                user.role === 'editor' ? 'bg-green-500/20 text-green-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserManager;