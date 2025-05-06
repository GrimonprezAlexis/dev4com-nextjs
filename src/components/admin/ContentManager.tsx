import React, { useState } from 'react';
import { File, Plus, Edit2, Trash2 } from 'lucide-react';

const ContentManager: React.FC = () => {
  const [pages] = useState([
    { id: 1, title: 'Accueil', path: '/', lastModified: '2024-03-15' },
    { id: 2, title: 'À propos', path: '/about', lastModified: '2024-03-14' },
    { id: 3, title: 'Projets', path: '/projects', lastModified: '2024-03-13' },
    { id: 4, title: 'Contact', path: '/contact', lastModified: '2024-03-12' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestionnaire de contenu</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Plus size={20} />
          <span>Nouvelle page</span>
        </button>
      </div>

      <div className="space-y-4">
        {pages.map((page) => (
          <div
            key={page.id}
            className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <File size={20} />
              </div>
              <div>
                <h3 className="font-medium">{page.title}</h3>
                <p className="text-sm text-gray-500">{page.path}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                Modifié le {page.lastModified}
              </span>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Edit2 size={18} />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContentManager;