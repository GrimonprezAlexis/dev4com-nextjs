'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  ExternalLink,
  Code,
  ShoppingCart,
  Globe,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  ArrowLeftCircle,
  ArrowRightCircle,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  icon: JSX.Element;
  tech: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  stats: {
    views: number;
    likes: number;
  };
}

const Projects: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(2);
  const [leftKeyPressed, setLeftKeyPressed] = useState(false);
  const [rightKeyPressed, setRightKeyPressed] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setLeftKeyPressed(true);
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        setRightKeyPressed(true);
        handleNext();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setLeftKeyPressed(false);
      } else if (e.key === 'ArrowRight') {
        setRightKeyPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 30;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    controls.start({ x: 0 });
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const left = diff < 0;
    const active = diff === 0;

    if (active) {
      return {
        zIndex: 30,
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        rotateY: 0,
      };
    }

    if (Math.abs(diff) > 2) {
      return {
        zIndex: 10,
        x: left ? -200 : 200,
        y: 0,
        scale: 0.8,
        opacity: 0,
        rotateY: left ? 45 : -45,
      };
    }

    if (left) {
      return {
        zIndex: 20 - Math.abs(diff),
        x: -140 * Math.abs(diff),
        y: 40 * Math.abs(diff),
        scale: 0.9,
        opacity: 0.8,
        rotateY: 12,
      };
    }

    return {
      zIndex: 20 - Math.abs(diff),
      x: 140 * Math.abs(diff),
      y: 40 * Math.abs(diff),
      scale: 0.9,
      opacity: 0.8,
      rotateY: -12,
    };
  };

  const projects: Project[] = [
    {
      id: "1",
      title: "E-commerce Premium",
      category: "E-commerce",
      description:
        "Plateforme e-commerce haut de gamme avec gestion de stock en temps réel et paiement sécurisé. Interface utilisateur moderne et intuitive pour une expérience d'achat optimale.",
      image:
        "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1920",
      icon: <ShoppingCart size={24} />,
      tech: ["React", "Node.js", "PostgreSQL", "Stripe"],
      author: {
        name: "Sophie Martin",
        role: "Lead Developer",
        avatar:
          "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=32",
      },
      stats: {
        views: 1234,
        likes: 56,
      },
    },
    {
      id: "2",
      title: "Application SaaS",
      category: "Web App",
      description:
        "Solution SaaS pour la gestion de projet avec analytics avancés et intégration API. Tableaux de bord personnalisables et rapports en temps réel.",
      image:
        "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1920",
      icon: <Globe size={24} />,
      tech: ["Vue.js", "Express", "MongoDB", "Docker"],
      author: {
        name: "Thomas Dubois",
        role: "Full Stack Developer",
        avatar:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=32",
      },
      stats: {
        views: 2345,
        likes: 89,
      },
    },
    {
      id: "3",
      title: "Site Vitrine Dynamique",
      category: "Web Design",
      description:
        "Site web moderne avec animations fluides et design responsive personnalisé. Optimisé pour les performances et le référencement.",
      image:
        "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1920",
      icon: <Code size={24} />,
      tech: ["React", "Tailwind CSS", "Framer Motion", "Next.js"],
      author: {
        name: "Julie Bernard",
        role: "UI/UX Designer",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32",
      },
      stats: {
        views: 3456,
        likes: 123,
      },
    },
    {
      id: "4",
      title: "Portfolio Créatif",
      category: "Design",
      description:
        "Portfolio artistique avec galerie interactive et animations personnalisées. Expérience utilisateur immersive et navigation fluide.",
      image:
        "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1920",
      icon: <Code size={24} />,
      tech: ["Next.js", "Three.js", "GSAP", "WebGL"],
      author: {
        name: "Marc Dupont",
        role: "Creative Developer",
        avatar:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=32",
      },
      stats: {
        views: 4567,
        likes: 234,
      },
    },
    {
      id: "5",
      title: "Application Mobile",
      category: "Mobile",
      description:
        "Application mobile native avec synchronisation temps réel et mode hors ligne. Interface utilisateur fluide et performances optimisées.",
      image:
        "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1920",
      icon: <Globe size={24} />,
      tech: ["React Native", "Firebase", "Redux", "TypeScript"],
      author: {
        name: "Emma Laurent",
        role: "Mobile Developer",
        avatar:
          "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=32",
      },
      stats: {
        views: 5678,
        likes: 345,
      },
    },
  ];

  return (
    <motion.div
      className="min-h-screen pt-24 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
            Nos Réalisations
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Découvrez nos projets les plus récents et innovants, démontrant
            notre expertise en développement web et solutions digitales.
          </p>
        </motion.div>

        <div className="relative h-[600px] perspective-1000">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-40">
            <motion.button
              onClick={handlePrev}
              className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={24} />
            </motion.button>
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40">
            <motion.button
              onClick={handleNext}
              className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>

          <div className="absolute inset-0 flex items-center justify-center touch-pan-y">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="absolute w-[500px] max-w-[90vw] cursor-pointer touch-pan-x"
                animate={getCardStyle(index)}
                transition={{
                  duration: 0.6,
                  ease: [0.32, 0.72, 0, 1],
                }}
                drag={index === activeIndex ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  if (index === activeIndex) {
                    setSelectedId(project.id);
                  } else {
                    setActiveIndex(index);
                  }
                }}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden shadow-xl border border-white/10"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="relative h-80">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={project.author.avatar}
                          alt={project.author.name}
                          className="w-12 h-12 rounded-full border-2 border-white/20"
                        />
                        <div>
                          <h2 className="text-2xl font-bold text-white">
                            {project.title}
                          </h2>
                          <p className="text-gray-400">
                            {project.author.name} • {project.author.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 text-sm bg-white/10 backdrop-blur-sm rounded-full text-white border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {index === activeIndex && (
                      <motion.button
                        className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10"
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Plus size={20} className="text-white" />
                      </motion.button>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>{project.stats.views} vues</span>
                        <span>{project.stats.likes} likes</span>
                      </div>
                      <ArrowRight size={16} className="text-blue-400" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === activeIndex ? "bg-blue-400" : "bg-white/30"
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>

        <motion.div 
          className="flex items-center justify-center space-x-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button 
            onClick={handlePrev}
            className={`flex items-center space-x-2 transition-colors duration-200 ${leftKeyPressed ? 'text-blue-400' : ''}`}
          >
            <ArrowLeftCircle 
              size={24} 
              className={`${leftKeyPressed ? 'text-blue-400' : 'text-gray-400'} transition-colors duration-200`}
            />
            <span className={`${leftKeyPressed ? 'text-blue-400' : 'text-gray-400'} transition-colors duration-200`}>
              Projet précédent
            </span>
          </button>
          <button 
            onClick={handleNext}
            className={`flex items-center space-x-2 transition-colors duration-200 ${rightKeyPressed ? 'text-blue-400' : ''}`}
          >
            <span className={`${rightKeyPressed ? 'text-blue-400' : 'text-gray-400'} transition-colors duration-200`}>
              Projet suivant
            </span>
            <ArrowRightCircle 
              size={24} 
              className={`${rightKeyPressed ? 'text-blue-400' : 'text-gray-400'} transition-colors duration-200`}
            />
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              layoutId={selectedId}
              className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden max-w-4xl w-full border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {projects.find((p) => p.id === selectedId) && (
                <div>
                  <div className="relative">
                    <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
                      <div className="flex items-center justify-between p-4">
                        <button
                          onClick={() => setSelectedId(null)}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white transition-colors"
                        >
                          <X size={20} />
                        </button>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center space-x-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>Voir le projet</span>
                            <ExternalLink size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    <div className="h-96">
                      <img
                        src={projects.find((p) => p.id === selectedId)!.image}
                        alt={projects.find((p) => p.id === selectedId)!.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <img
                            src={
                              projects.find((p) => p.id === selectedId)!.author
                                .avatar
                            }
                            alt={
                              projects.find((p) => p.id === selectedId)!.author
                                .name
                            }
                            className="w-16 h-16 rounded-full border-2 border-white/20"
                          />
                          <div>
                            <h2 className="text-3xl font-bold text-white">
                              {projects.find((p) => p.id === selectedId)!.title}
                            </h2>
                            <p className="text-gray-400">
                              {
                                projects.find((p) => p.id === selectedId)!
                                  .author.name
                              }{" "}
                              •{" "}
                              {
                                projects.find((p) => p.id === selectedId)!
                                  .author.role
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        Description
                      </h3>
                      <p className="text-gray-400">
                        {projects.find((p) => p.id === selectedId)!.description}
                      </p>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {projects
                          .find((p) => p.id === selectedId)!
                          .tech.map((tech) => (
                            <span
                              key={tech}
                              className="px-4 py-2 text-sm bg-white/10 backdrop-blur-sm rounded-full text-white border border-white/10"
                            >
                              {tech}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <span>
                        {projects.find((p) => p.id === selectedId)!.stats.views}{" "}
                        vues
                      </span>
                      <span>
                        {projects.find((p) => p.id === selectedId)!.stats.likes}{" "}
                        likes
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Projects;