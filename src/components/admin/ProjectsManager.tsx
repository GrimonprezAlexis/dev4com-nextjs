import React, { useState, useEffect } from 'react';
import { Upload, Search, Grid, List, Plus, Edit2, Trash2, X, Save, Calendar, ExternalLink, User, Tag, Link as LinkIcon, FileJson, Check, AlertCircle, Download } from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { uploadToS3, deleteFromS3 } from '../../lib/s3';
import { Project, ProjectStatus, PROJECT_STATUSES } from '../../types/project';

const ProjectsManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState<Partial<Project>[] | null>(null);
  const [importStep, setImportStep] = useState<'select' | 'preview' | 'importing' | 'complete'>('select');
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importMode, setImportMode] = useState<'file' | 'text'>('file');
  const [jsonText, setJsonText] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        fetchProjects();
      } else {
        setError("Veuillez vous connecter pour accéder au gestionnaire de projets");
        setProjects([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProjects = async () => {
    try {
      if (!auth.currentUser) {
        setError("Authentification requise");
        return;
      }

      const querySnapshot = await getDocs(collection(db, 'projects'));
      const projectsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          subtitle: data.subtitle,
          job: data.job,
          description: data.description,
          imageUrl: data.imageUrl || data.image || '',
          imagesUrl: data.imagesUrl || [],
          technologies: data.technologies || data.tech || [],
          icons: data.icons || [],
          tags: data.tags || [],
          links: data.links || {
            app_link: data.url,
            repository: '',
            maquette: ''
          },
          status: data.status as ProjectStatus,
          createdAt: data.createdAt?.toDate() || new Date(),
          client: data.client,
        };
      }) as Project[];

      projectsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setProjects(projectsData);
      setError(null);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError("Erreur lors du chargement des projets");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validation du fichier
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError("Le fichier est trop volumineux. Taille maximale: 10MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError("Le fichier doit être une image");
        return;
      }

      setSelectedFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.onerror = () => {
        setError("Erreur lors de la lecture du fichier");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProject = async () => {
    if (!auth.currentUser) {
      setError("Authentification requise");
      return;
    }
    setIsEditing(true);
    setEditingProject({
      title: '',
      subtitle: '',
      job: '',
      description: '',
      imageUrl: '',
      imagesUrl: [],
      technologies: [],
      icons: [],
      tags: [],
      links: {
        app_link: '',
        repository: '',
        maquette: ''
      },
      status: 'In Progress',
      createdAt: new Date(),
      client: '',
    });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleEditProject = (project: Project) => {
    setIsEditing(true);
    setEditingProject(project);
    setPreviewUrl(project.imageUrl);
    setSelectedFile(null);
  };

  const handleSaveProject = async () => {
    try {
      if (!editingProject || !auth.currentUser) {
        setError("Authentification requise");
        return;
      }

      if (!editingProject.title || !editingProject.description) {
        setError("Veuillez remplir au moins le titre et la description");
        return;
      }

      setIsLoading(true);
      setError(null);

      let imageUrl = editingProject.imageUrl || '';

      // Upload nouvelle image si sélectionnée
      if (selectedFile) {
        try {
          console.log('Uploading image to S3...');
          imageUrl = await uploadToS3(selectedFile, 'projects');
          console.log('Image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('S3 upload error:', uploadError);
          throw new Error('Échec de l\'upload de l\'image: ' + (uploadError instanceof Error ? uploadError.message : 'Erreur inconnue'));
        }
      }

      const projectData = {
        title: editingProject.title,
        subtitle: editingProject.subtitle || '',
        job: editingProject.job || '',
        description: editingProject.description,
        imageUrl: imageUrl,
        imagesUrl: editingProject.imagesUrl || [],
        technologies: editingProject.technologies || [],
        icons: editingProject.icons || [],
        tags: editingProject.tags || [],
        links: {
          app_link: editingProject.links?.app_link || '',
          repository: editingProject.links?.repository || '',
          maquette: editingProject.links?.maquette || '',
        },
        status: editingProject.status || 'In Progress',
        createdAt: Timestamp.fromDate(editingProject.createdAt || new Date()),
        client: editingProject.client || '',
      };

      console.log('Saving project data:', projectData);

      if (editingProject.id) {
        // Mise à jour d'un projet existant
        console.log('Updating project:', editingProject.id);
        await updateDoc(doc(db, 'projects', editingProject.id), projectData);

        // Supprimer l'ancienne image si une nouvelle a été uploadée
        if (selectedFile && editingProject.imageUrl && editingProject.imageUrl !== imageUrl) {
          try {
            console.log('Deleting old image from S3:', editingProject.imageUrl);
            await deleteFromS3(editingProject.imageUrl);
          } catch (err) {
            console.error('Error deleting old image (non-critical):', err);
          }
        }
      } else {
        // Création d'un nouveau projet
        console.log('Creating new project');
        await addDoc(collection(db, 'projects'), projectData);
      }

      console.log('Project saved successfully');
      setIsEditing(false);
      setEditingProject(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
      setIsLoading(false);
      await fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError("Erreur lors de l'enregistrement du projet: " + errorMessage);
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${project.title}" ?`)) {
      return;
    }

    try {
      if (!auth.currentUser) {
        setError("Authentification requise");
        return;
      }

      await deleteDoc(doc(db, 'projects', project.id));

      if (project.imageUrl) {
        try {
          await deleteFromS3(project.imageUrl);
        } catch (err) {
          console.error('Error deleting image from S3:', err);
        }
      }

      setError(null);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      setError("Erreur lors de la suppression du projet");
    }
  };

  const validateJsonData = (data: any) => {
    // Valider que c'est un tableau
    if (!Array.isArray(data)) {
      throw new Error("Le JSON doit contenir un tableau de projets");
    }

    // Valider la structure des projets
    const validatedData = data.map((item, index) => ({
      title: item.title || `Projet ${index + 1}`,
      subtitle: item.subtitle || '',
      job: item.job || '',
      description: item.description || '',
      imageUrl: item.imageUrl || item.image || '',
      imagesUrl: item.imagesUrl || [],
      technologies: item.technologies || item.tech || [],
      icons: item.icons || [],
      tags: item.tags || [],
      links: item.links || {
        app_link: item.app_link || item.url || '',
        repository: item.repository || '',
        maquette: item.maquette || ''
      },
      status: (item.status || 'In Progress') as ProjectStatus,
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      client: item.client || ''
    }));

    return validatedData;
  };

  const handleJsonFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.name.endsWith('.json')) {
        setError("Le fichier doit être au format JSON");
        return;
      }

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const validatedData = validateJsonData(data);

        setImportData(validatedData);
        setImportStep('preview');
        setError(null);
      } catch (err) {
        console.error('Error parsing JSON:', err);
        setError(err instanceof Error ? err.message : "Erreur lors de la lecture du fichier JSON. Vérifiez le format.");
      }
    }
  };

  const handleJsonTextValidate = () => {
    try {
      if (!jsonText.trim()) {
        setError("Veuillez saisir du JSON");
        return;
      }

      const data = JSON.parse(jsonText);
      const validatedData = validateJsonData(data);

      setImportData(validatedData);
      setImportStep('preview');
      setError(null);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      setError(err instanceof Error ? err.message : "Erreur lors du parsing du JSON. Vérifiez la syntaxe.");
    }
  };

  const handleImportProjects = async () => {
    if (!importData || !auth.currentUser) {
      setError("Aucune donnée à importer ou authentification requise");
      return;
    }

    setImportStep('importing');
    setImportProgress({ current: 0, total: importData.length });
    const errors: string[] = [];

    for (let i = 0; i < importData.length; i++) {
      const projectData = importData[i];

      try {
        await addDoc(collection(db, 'projects'), {
          ...projectData,
          createdAt: Timestamp.fromDate(projectData.createdAt || new Date())
        });

        setImportProgress({ current: i + 1, total: importData.length });
      } catch (error) {
        console.error(`Erreur lors de l'import du projet "${projectData.title}":`, error);
        errors.push(`${projectData.title}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }

    setImportErrors(errors);
    setImportStep('complete');

    // Rafraîchir la liste des projets
    await fetchProjects();
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        title: "Projet E-commerce",
        subtitle: "Site de vente en ligne moderne",
        job: "Développement Full-Stack",
        description: "Création d'une plateforme e-commerce complète avec gestion de panier, paiement en ligne et espace client.",
        imageUrl: "https://example.com/images/project1.jpg",
        imagesUrl: [
          "https://example.com/images/project1-1.jpg",
          "https://example.com/images/project1-2.jpg"
        ],
        technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Stripe"],
        icons: ["react", "nextjs", "typescript", "tailwind", "stripe"],
        tags: ["E-commerce", "Full-Stack", "Responsive"],
        links: {
          app_link: "https://example-ecommerce.com",
          repository: "https://github.com/exemple/ecommerce",
          maquette: "https://figma.com/file/exemple",
          credentials: [
            {
              email: "demo@example.com",
              password: "demo123"
            }
          ]
        },
        status: "Completed",
        createdAt: new Date().toISOString(),
        client: "Client Exemple SAS"
      },
      {
        title: "Application Mobile",
        subtitle: "App de gestion de tâches",
        job: "Développement Mobile",
        description: "Application mobile cross-platform pour la gestion de projets et de tâches avec synchronisation cloud.",
        imageUrl: "https://example.com/images/project2.jpg",
        imagesUrl: [],
        technologies: ["React Native", "Firebase", "Redux"],
        icons: ["react", "firebase"],
        tags: ["Mobile", "Productivité", "Cloud"],
        links: {
          app_link: "https://play.google.com/store/exemple",
          repository: "https://github.com/exemple/mobile-app"
        },
        status: "In Progress",
        createdAt: new Date().toISOString(),
        client: "Startup Innovation"
      },
      {
        title: "Site Vitrine",
        subtitle: "Présentation entreprise",
        job: "Développement Web",
        description: "Site vitrine élégant et responsive pour présenter les services et l'équipe de l'entreprise.",
        imageUrl: "https://example.com/images/project3.jpg",
        imagesUrl: ["https://example.com/images/project3-1.jpg"],
        technologies: ["HTML5", "CSS3", "JavaScript", "GSAP"],
        icons: ["html", "css", "javascript"],
        tags: ["Vitrine", "Responsive", "Animation"],
        links: {
          app_link: "https://example-vitrine.com",
          maquette: "https://figma.com/file/vitrine"
        },
        status: "Completed",
        createdAt: new Date().toISOString(),
        client: "Entreprise Consulting"
      }
    ];

    const jsonString = JSON.stringify(templateData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template-projets-import.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const closeImportModal = () => {
    setIsImporting(false);
    setImportData(null);
    setImportStep('select');
    setImportProgress({ current: 0, total: 0 });
    setImportErrors([]);
    setImportMode('file');
    setJsonText('');
    setError(null);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.job?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      project.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = !statusFilter || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Veuillez vous connecter pour accéder au gestionnaire de projets</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Gestionnaire de Projets</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsImporting(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <FileJson size={20} />
            <span className="hidden sm:inline">Importer JSON</span>
          </button>
          <button
            onClick={downloadTemplate}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
            title="Télécharger un modèle JSON d'exemple"
          >
            <Download size={20} />
            <span className="hidden sm:inline">Télécharger un modèle</span>
          </button>
          <button
            onClick={handleAddProject}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Nouveau Projet</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">Tous les statuts</option>
          {PROJECT_STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <div className="flex bg-black/40 rounded-lg border border-white/10 overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-black/20 rounded-xl border border-white/10">
          <p className="text-gray-400">Aucun projet trouvé</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="relative h-48">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <span className="text-4xl">🚀</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="p-2 bg-blue-500/80 backdrop-blur-sm rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit2 size={16} className="text-white" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project)}
                    className="p-2 bg-red-500/80 backdrop-blur-sm rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    project.status === 'Completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1">{project.title}</h3>
                {project.subtitle && (
                  <p className="text-sm text-gray-400 mb-2">{project.subtitle}</p>
                )}
                {project.job && (
                  <p className="text-xs text-blue-400 mb-2">{project.job}</p>
                )}
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{project.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-white/10 rounded-full text-gray-400">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-white/10 rounded-full text-gray-400">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{project.createdAt.toLocaleDateString('fr-FR')}</span>
                  </div>
                  {project.client && (
                    <div className="flex items-center space-x-1">
                      <User size={12} />
                      <span className="truncate max-w-[100px]">{project.client}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all flex items-center space-x-4"
            >
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🚀</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate">{project.title}</h3>
                {project.subtitle && <p className="text-sm text-gray-400 truncate">{project.subtitle}</p>}
                {project.job && <p className="text-xs text-blue-400">{project.job}</p>}
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>{project.createdAt.toLocaleDateString('fr-FR')}</span>
                  {project.client && <span>Client: {project.client}</span>}
                  <span className={`px-2 py-1 rounded-full ${
                    project.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                    project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                <button
                  onClick={() => handleEditProject(project)}
                  className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit2 size={16} className="text-white" />
                </button>
                <button
                  onClick={() => handleDeleteProject(project)}
                  className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={16} className="text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditing && editingProject && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl max-w-5xl w-full border border-white/10 shadow-2xl my-8">
              <div className="sticky top-0 bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 border-b border-white/10 flex justify-between items-center rounded-t-xl z-10">
              <h3 className="text-xl font-bold text-white">
                {editingProject.id ? 'Modifier le projet' : 'Nouveau projet'}
              </h3>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingProject(null);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setError(null);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-h-[calc(100vh-10rem)] overflow-y-auto">
              {/* Error message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Titre <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Titre du projet"
                />
              </div>

              {/* Subtitle & Job */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Sous-titre
                  </label>
                  <input
                    type="text"
                    value={editingProject.subtitle || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Sous-titre descriptif"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Job / Rôle
                  </label>
                  <input
                    type="text"
                    value={editingProject.job || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, job: e.target.value })}
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Freelance, Mission, etc."
                  />
                </div>
              </div>

              {/* Status & Client */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Statut <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as ProjectStatus })}
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    {PROJECT_STATUSES.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Client / Entreprise
                  </label>
                  <input
                    type="text"
                    value={editingProject.client || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Nom du client"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Description du projet"
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Technologies (séparées par des virgules)
                </label>
                <input
                  type="text"
                  value={editingProject.technologies?.join(', ')}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  })}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={editingProject.tags?.join(', ')}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  })}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Projet 1, Web App, etc."
                />
              </div>

              {/* Links */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-400">
                  Liens
                </label>

                <input
                  type="url"
                  value={editingProject.links?.app_link || ''}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    links: { ...editingProject.links, app_link: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Lien de démo (https://...)"
                />

                <input
                  type="url"
                  value={editingProject.links?.repository || ''}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    links: { ...editingProject.links, repository: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Lien GitHub (https://github.com/...)"
                />

                <input
                  type="url"
                  value={editingProject.links?.maquette || ''}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    links: { ...editingProject.links, maquette: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Lien maquette (Figma, etc.)"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Date de création
                </label>
                <input
                  type="date"
                  value={editingProject.createdAt ? editingProject.createdAt.toISOString().split('T')[0] : ''}
                  onChange={(e) => setEditingProject({ ...editingProject, createdAt: new Date(e.target.value) })}
                  className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Image principale
                </label>
                <div className="space-y-4">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Boutons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleSaveProject}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Enregistrer</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditingProject(null);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setError(null);
                  }}
                  disabled={isLoading}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'import JSON */}
      {isImporting && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl max-w-4xl w-full border border-white/10 shadow-2xl my-8">
              <div className="sticky top-0 bg-gradient-to-br from-gray-900 to-black p-4 sm:p-6 border-b border-white/10 flex justify-between items-center rounded-t-xl z-10">
              <h3 className="text-xl font-bold text-white">Importer des projets depuis JSON</h3>
              <button
                onClick={closeImportModal}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                disabled={importStep === 'importing'}
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {/* Étape 1: Sélection du fichier ou saisie texte */}
              {importStep === 'select' && (
                <div className="space-y-4">
                  {/* Mode Switch */}
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <button
                      onClick={() => setImportMode('file')}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        importMode === 'file'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Upload size={18} />
                        <span>Fichier JSON</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setImportMode('text')}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        importMode === 'text'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileJson size={18} />
                        <span>Saisie directe</span>
                      </div>
                    </button>
                  </div>

                  {/* Mode Fichier */}
                  {importMode === 'file' && (
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <FileJson size={64} className="mx-auto text-purple-400 mb-4" />
                        <p className="text-gray-400 mb-4">
                          Sélectionnez un fichier JSON contenant vos projets
                        </p>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleJsonFileChange}
                          className="hidden"
                          id="json-upload"
                        />
                        <label
                          htmlFor="json-upload"
                          className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"
                        >
                          <Upload size={20} />
                          <span>Choisir un fichier</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Mode Texte */}
                  {importMode === 'text' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-white text-sm font-medium">
                          Collez votre JSON ici :
                        </label>
                        <textarea
                          value={jsonText}
                          onChange={(e) => setJsonText(e.target.value)}
                          placeholder='[
  {
    "title": "Mon Projet",
    "description": "Description du projet",
    "imageUrl": "https://...",
    "technologies": ["React", "Node.js"],
    "status": "Completed"
  }
]'
                          className="w-full h-96 bg-black/40 border border-gray-700 rounded-lg p-4 text-white font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
                        />
                      </div>
                      <button
                        onClick={handleJsonTextValidate}
                        disabled={!jsonText.trim()}
                        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check size={20} />
                        <span>Valider le JSON</span>
                      </button>
                    </div>
                  )}

                  <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                    <p className="text-blue-400 text-sm">
                      <strong>Format attendu:</strong> Un tableau JSON avec des objets projet contenant: title, description, imageUrl, technologies, etc.
                    </p>
                  </div>
                </div>
              )}

              {/* Étape 2: Prévisualisation */}
              {importStep === 'preview' && importData && (
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Check size={20} className="text-green-400" />
                      <p className="text-green-400">
                        {importData.length} projet{importData.length > 1 ? 's' : ''} détecté{importData.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {importData.map((project, index) => (
                      <div
                        key={index}
                        className="bg-black/40 border border-white/10 rounded-lg p-4 flex items-start space-x-4"
                      >
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{project.title}</h4>
                          <p className="text-gray-400 text-sm truncate">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.technologies?.slice(0, 3).map((tech, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                                {tech}
                              </span>
                            ))}
                            {(project.technologies?.length || 0) > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-500/20 text-gray-400 rounded">
                                +{(project.technologies?.length || 0) - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleImportProjects}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Save size={20} />
                      <span>Enregistrer tout en base de données</span>
                    </button>
                    <button
                      onClick={() => {
                        setImportData(null);
                        setImportStep('select');
                      }}
                      className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {/* Étape 3: Import en cours */}
              {importStep === 'importing' && (
                <div className="space-y-4 py-8">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Import en cours...</h4>
                    <p className="text-gray-400">
                      {importProgress.current} / {importProgress.total} projets importés
                    </p>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 transition-all duration-300"
                      style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Étape 4: Terminé */}
              {importStep === 'complete' && (
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-6 text-center">
                    <Check size={64} className="mx-auto text-green-400 mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Import terminé!</h4>
                    <p className="text-gray-400">
                      {importProgress.current} projet{importProgress.current > 1 ? 's' : ''} importé{importProgress.current > 1 ? 's' : ''} avec succès
                    </p>
                  </div>

                  {importErrors.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle size={20} className="text-red-400" />
                        <p className="text-red-400 font-medium">
                          {importErrors.length} erreur{importErrors.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <ul className="text-red-400 text-sm space-y-1 ml-6">
                        {importErrors.map((error, index) => (
                          <li key={index} className="list-disc">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={closeImportModal}
                    className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
