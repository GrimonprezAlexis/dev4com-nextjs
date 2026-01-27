import React, { useState } from 'react';
import { Download, Database, FolderKanban, Music, Check, AlertCircle, FileJson, Loader2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface ExportableCollection {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const DataExport: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string>('projects');
  const [exportedCount, setExportedCount] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const collections: ExportableCollection[] = [
    {
      id: 'projects',
      name: 'Projets',
      icon: <FolderKanban size={20} />,
      description: 'Exporter tous les projets avec leurs details, technologies et liens'
    },
    {
      id: 'audio',
      name: 'Audio',
      icon: <Music size={20} />,
      description: 'Exporter tous les fichiers audio avec leurs metadonnees'
    },
    {
      id: 'all',
      name: 'Toutes les donnees',
      icon: <Database size={20} />,
      description: 'Exporter toutes les collections en un seul fichier JSON'
    }
  ];

  const fetchCollectionData = async (collectionName: string) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore Timestamps to ISO strings
      const processedData: any = { id: doc.id };

      Object.keys(data).forEach(key => {
        if (data[key] && typeof data[key].toDate === 'function') {
          processedData[key] = data[key].toDate().toISOString();
        } else {
          processedData[key] = data[key];
        }
      });

      return processedData;
    });
  };

  const handleExport = async () => {
    if (!auth.currentUser) {
      setError("Authentification requise");
      return;
    }

    setIsExporting(true);
    setError(null);
    setExportSuccess(null);
    setExportedCount(0);

    try {
      let exportData: any;
      let filename: string;

      if (selectedCollection === 'all') {
        // Export all collections
        const projectsData = await fetchCollectionData('projects');
        const audioData = await fetchCollectionData('audio');

        exportData = {
          exportedAt: new Date().toISOString(),
          exportedBy: auth.currentUser.email,
          collections: {
            projects: projectsData,
            audio: audioData
          }
        };

        setExportedCount(projectsData.length + audioData.length);
        filename = `dev4com-export-all-${new Date().toISOString().split('T')[0]}.json`;
      } else {
        // Export single collection
        const data = await fetchCollectionData(selectedCollection);

        exportData = {
          exportedAt: new Date().toISOString(),
          exportedBy: auth.currentUser.email,
          collection: selectedCollection,
          data: data
        };

        setExportedCount(data.length);
        filename = `dev4com-export-${selectedCollection}-${new Date().toISOString().split('T')[0]}.json`;
      }

      // Create and download file
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportSuccess(`Export reussi: ${filename}`);
    } catch (err) {
      console.error('Export error:', err);
      setError("Erreur lors de l'export: " + (err instanceof Error ? err.message : 'Erreur inconnue'));
    } finally {
      setIsExporting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Veuillez vous connecter pour acceder a l'export de donnees</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Export de donnees</h2>
      </div>

      {/* Description */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FileJson size={24} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-blue-400 font-medium mb-1">Export JSON</h3>
            <p className="text-gray-400 text-sm">
              Exportez vos donnees au format JSON pour les sauvegarder, les migrer vers un autre systeme ou les analyser.
              Les fichiers exportes contiennent toutes les informations de la base de donnees.
            </p>
          </div>
        </div>
      </div>

      {/* Collection Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Selectionnez les donnees a exporter</h3>

        <div className="grid gap-4">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => setSelectedCollection(col.id)}
              className={`w-full p-4 rounded-xl border transition-all text-left ${
                selectedCollection === col.id
                  ? 'bg-blue-500/20 border-blue-500/50'
                  : 'bg-black/40 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  selectedCollection === col.id ? 'bg-blue-500/30 text-blue-400' : 'bg-white/10 text-gray-400'
                }`}>
                  {col.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-white font-medium">{col.name}</h4>
                    {selectedCollection === col.id && (
                      <Check size={16} className="text-blue-400" />
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{col.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle size={20} className="text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {exportSuccess && (
        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Check size={20} className="text-green-400" />
            <div>
              <p className="text-green-400">{exportSuccess}</p>
              <p className="text-gray-400 text-sm mt-1">{exportedCount} element(s) exporte(s)</p>
            </div>
          </div>
        </div>
      )}

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
      >
        {isExporting ? (
          <>
            <Loader2 size={24} className="animate-spin" />
            <span>Export en cours...</span>
          </>
        ) : (
          <>
            <Download size={24} />
            <span>Exporter en JSON</span>
          </>
        )}
      </button>

      {/* Info */}
      <div className="bg-black/40 border border-white/10 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">Informations sur l'export</h4>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>- Le fichier exporte contiendra toutes les donnees de la collection selectionnee</li>
          <li>- Les dates seront converties au format ISO 8601</li>
          <li>- Les URLs des fichiers (images, audio) restent valides tant que les fichiers existent sur S3</li>
          <li>- Vous pouvez reimporter ces donnees via la fonction "Importer JSON" du gestionnaire de projets</li>
        </ul>
      </div>
    </div>
  );
};

export default DataExport;
