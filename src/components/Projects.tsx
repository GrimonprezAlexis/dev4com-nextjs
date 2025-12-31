'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, FileText, Calendar, User, Sparkles } from 'lucide-react';
import { collection, getDocs, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { Project } from '../types/project';

const ProjectCard: React.FC<{ project: Project; index: number; onClick: () => void }> = ({ project, index, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="group h-full cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-full bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 flex flex-col shadow-lg">
        {/* macOS-style bar */}
        <div className="relative h-9 bg-gradient-to-b from-gray-700 to-gray-800 flex items-center px-4 border-b border-gray-900/50 rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-sm hover:brightness-110 transition-all cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm hover:brightness-110 transition-all cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-[#28ca41] shadow-sm hover:brightness-110 transition-all cursor-pointer"></div>
          </div>
          <h2 className="absolute left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-300 truncate max-w-[60%] pointer-events-none">
            {project.title}
          </h2>
        </div>

        {/* Image container */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <span className="text-6xl text-white/30">🚀</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

          {/* Project number badge */}
          <div className="absolute top-4 left-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20">
              <span className="text-lg font-bold text-white">{String(index + 1).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Status badge */}
          {project.status === 'In Progress' && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1.5 text-xs font-medium bg-yellow-500/90 backdrop-blur-sm rounded-full text-white border border-yellow-400/30 flex items-center gap-1.5">
                <Sparkles size={12} />
                En cours
              </span>
            </div>
          )}

          {/* Title on image */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {project.client && (
              <div className="flex items-center gap-2 text-gray-300 mb-3">
                <User size={14} />
                <span className="text-xs">{project.client}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card content */}
        <div className="flex-1 p-6 bg-gradient-to-b from-black/60 to-black/80 backdrop-blur-sm flex flex-col">
          <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
            {project.title}
          </h4>

          <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-300 rounded-lg border border-blue-500/20"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-3 py-1 text-xs font-medium bg-gray-500/10 text-gray-400 rounded-lg border border-gray-500/20">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef);
      const querySnapshot = await getDocs(q);

      const projectsData: Project[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status !== 'Archived') {
          projectsData.push({
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
            status: data.status,
            createdAt: data.createdAt?.toDate() || new Date(),
            client: data.client,
          });
        }
      });

      projectsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        className="min-h-screen pt-24 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Nos Réalisations
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                Découvrez nos projets les plus récents et innovants
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="h-[500px]"
              >
                <div className="h-full animate-pulse bg-white/5 rounded-xl border border-white/10">
                  <div className="h-64 bg-white/10 rounded-t-xl" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                    <div className="h-3 bg-white/10 rounded w-full" />
                    <div className="flex gap-2 mt-4">
                      <div className="h-8 bg-white/10 rounded flex-1" />
                      <div className="h-8 bg-white/10 rounded w-28" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="min-h-screen pt-24 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (projects.length === 0) {
    return (
      <motion.div
        className="min-h-screen pt-24 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Nos Réalisations
            </h1>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Aucun projet disponible pour le moment</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen pt-24 pb-16 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            Nos Réalisations
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Découvrez nos projets les plus récents et innovants, démontrant notre expertise en développement web et solutions digitales
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Project Details Panel */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Side Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-2/3 lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-gray-900 to-black border-l border-white/10 z-50 overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-gradient-to-br from-gray-900 to-black border-b border-white/10 p-6 flex items-center justify-between z-10 backdrop-blur-md">
                <h2 className="text-2xl font-bold text-white">Détails du projet</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-400 hover:text-white" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Image */}
                {selectedProject.imageUrl && (
                  <div className="relative h-80 rounded-xl overflow-hidden">
                    <img
                      src={selectedProject.imageUrl}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {selectedProject.title}
                  </h3>
                  {selectedProject.subtitle && (
                    <p className="text-blue-300 text-lg mb-2">
                      {selectedProject.subtitle}
                    </p>
                  )}
                  {selectedProject.job && (
                    <p className="text-gray-400 text-sm uppercase tracking-wider">
                      {selectedProject.job}
                    </p>
                  )}
                </div>

                {/* Client & Status */}
                <div className="flex flex-wrap gap-3">
                  {selectedProject.client && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                      <User size={16} className="text-blue-400" />
                      <span className="text-sm text-gray-300">{selectedProject.client}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                    <Calendar size={16} className="text-purple-400" />
                    <span className="text-sm text-gray-300">
                      {selectedProject.createdAt.toLocaleDateString('fr-FR', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className={`px-4 py-2 rounded-lg border ${
                    selectedProject.status === 'Completed'
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : selectedProject.status === 'In Progress'
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                      : 'bg-gray-500/10 border-gray-500/30 text-gray-400'
                  }`}>
                    <span className="text-sm font-medium">{selectedProject.status}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 text-sm font-medium bg-blue-500/10 text-blue-300 rounded-lg border border-blue-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                {selectedProject.tags && selectedProject.tags.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 text-sm font-medium bg-purple-500/10 text-purple-300 rounded-lg border border-purple-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Liens</h4>
                  <div className="space-y-3">
                    {selectedProject.links.app_link && selectedProject.links.app_link !== '#' && (
                      <a
                        href={selectedProject.links.app_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all border border-blue-500/20 hover:border-blue-500/40"
                      >
                        <ExternalLink size={20} />
                        <span className="font-medium">Voir le projet en ligne</span>
                      </a>
                    )}
                    {isAuthenticated && selectedProject.links.repository && selectedProject.links.repository !== '#' && (
                      <a
                        href={selectedProject.links.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-gray-500/10 hover:bg-gray-500/20 text-gray-300 rounded-lg transition-all border border-gray-500/20 hover:border-gray-500/40"
                      >
                        <Github size={20} />
                        <span className="font-medium">Voir le code source</span>
                      </a>
                    )}
                    {selectedProject.links.maquette && selectedProject.links.maquette !== '#' && (
                      <a
                        href={selectedProject.links.maquette}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded-lg transition-all border border-purple-500/20 hover:border-purple-500/40"
                      >
                        <FileText size={20} />
                        <span className="font-medium">Voir la maquette</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Projects;
