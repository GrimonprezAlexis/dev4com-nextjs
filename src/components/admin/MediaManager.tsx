import React, { useState, useEffect } from 'react';
import { Upload, Search, Grid, List, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tech: string[];
}

const MediaManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        fetchProjects();
      } else {
        setError("Please log in to access the media manager");
        setProjects([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProjects = async () => {
    try {
      if (!auth.currentUser) {
        setError("Authentication required");
        return;
      }
      
      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
      setError(null);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError("Error loading projects. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !auth.currentUser) return null;
    
    const storageRef = ref(storage, `projects/${selectedFile.name}`);
    await uploadBytes(storageRef, selectedFile);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleAddProject = async () => {
    if (!auth.currentUser) {
      setError("Authentication required");
      return;
    }
    setIsEditing(true);
    setEditingProject({
      id: '',
      title: '',
      category: '',
      description: '',
      image: '',
      tech: []
    });
  };

  const handleSaveProject = async () => {
    try {
      if (!editingProject || !auth.currentUser) {
        setError("Authentication required");
        return;
      }

      let imageUrl = editingProject.image;
      if (selectedFile) {
        imageUrl = await handleImageUpload() || '';
      }

      const projectData = {
        ...editingProject,
        image: imageUrl
      };

      if (editingProject.id) {
        await updateDoc(doc(db, 'projects', editingProject.id), projectData);
      } else {
        await addDoc(collection(db, 'projects'), projectData);
      }

      setIsEditing(false);
      setEditingProject(null);
      setSelectedFile(null);
      setError(null);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      setError("Error saving project. Please try again.");
    }
  };

  const handleDeleteProject = async (project: Project) => {
    try {
      if (!auth.currentUser) {
        setError("Authentication required");
        return;
      }
      
      await deleteDoc(doc(db, 'projects', project.id));
      if (project.image) {
        const imageRef = ref(storage, project.image);
        await deleteObject(imageRef);
      }
      setError(null);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      setError("Error deleting project. Please try again.");
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">Please log in to access the media manager</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestionnaire de projets</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleAddProject}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            <span>Nouveau projet</span>
          </button>
          <div className="flex bg-black/20 rounded-lg border border-white/5">
            <button
              className={`p-2 ${viewMode === 'grid' ? 'text-blue-400' : 'text-gray-400'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={20} />
            </button>
            <button
              className={`p-2 ${viewMode === 'list' ? 'text-blue-400' : 'text-gray-400'}`}
              onClick={() => setViewMode('list')}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher des projets..."
          className="w-full bg-black/20 border border-white/5 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isEditing && editingProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingProject.id ? 'Modifier le projet' : 'Nouveau projet'}
              </h3>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingProject(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Titre du projet"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                value={editingProject.title}
                onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
              />

              <input
                type="text"
                placeholder="Catégorie"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                value={editingProject.category}
                onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
              />

              <textarea
                placeholder="Description"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white h-32"
                value={editingProject.description}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
              />

              <input
                type="text"
                placeholder="Technologies (séparées par des virgules)"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white"
                value={editingProject.tech.join(', ')}
                onChange={(e) => setEditingProject({ ...editingProject, tech: e.target.value.split(',').map(t => t.trim()) })}
              />

              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="project-image"
                />
                <label
                  htmlFor="project-image"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg cursor-pointer hover:bg-blue-500/30 transition-colors"
                >
                  <Upload size={20} />
                  <span>Choisir une image</span>
                </label>
                {selectedFile && <span className="text-gray-400">{selectedFile.name}</span>}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveProject}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Save size={20} />
                  <span>Enregistrer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-4' : 'space-y-4'}`}>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={`bg-black/20 rounded-lg border border-white/5 overflow-hidden ${
              viewMode === 'list' ? 'flex items-center' : ''
            }`}
          >
            <div className={`${viewMode === 'grid' ? 'aspect-video' : 'w-24'} relative`}>
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-sm text-gray-500">{project.category}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditingProject(project);
                    }}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {viewMode === 'list' && (
                <p className="text-sm text-gray-400 mt-2">{project.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaManager;