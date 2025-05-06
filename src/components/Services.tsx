'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Link from 'next/link';
import {
  BotIcon,
  Code,
  Globe,
  Lightbulb,
  Music,
  PenTool,
  ShoppingCart,
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Service {
  id: string;
  icon: JSX.Element;
  title: string;
  category: string;
  description: string[];
  image: string;
  delay: number;
}

const services: Service[] = [
  {
    id: '1',
    icon: <Code size={28} />,
    title: 'Site Web Moderne',
    category: 'Développement Web',
    description: [
      'Maquette gratuite avant engagement',
      'Solutions clé en main avec back office d\'administration',
      'Sites responsive et optimisés pour tous les appareils',
    ],
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1920',
    delay: 0.1,
  },
  {
    id: '2',
    icon: <ShoppingCart size={28} />,
    title: 'E-commerce',
    category: 'Solutions E-commerce',
    description: [
      'Plateforme de vente en ligne personnalisée',
      'Gestion des stocks et commandes',
      'Intégration des solutions de paiement',
    ],
    image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1920',
    delay: 0.2,
  },
  {
    id: '3',
    icon: <BotIcon size={28} />,
    title: 'Automatisation IA',
    category: 'Intelligence Artificielle',
    description: [
      'Formulaires de contact automatisés sur CRM',
      'Système de réservation en ligne',
      'Workflows d\'automatisation IA',
    ],
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1920',
    delay: 0.3,
  },
  {
    id: '4',
    icon: <Globe size={28} />,
    title: 'Optimisation SEO',
    category: 'Marketing Digital',
    description: [
      'Boost présence en ligne et acquisition client',
      'Visibilité locale renforcée',
      'Excellent retour sur investissement',
      'Optimisation des avis Google Business',
    ],
    image: 'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=1920',
    delay: 0.4,
  },
  {
    id: '5',
    icon: <PenTool size={28} />,
    title: 'Identité Visuelle',
    category: 'Design',
    description: [
      'Design de contenu pour réseaux sociaux',
      'Cartes de visite, flyers et QR codes',
      'Création ou refonte de logo',
    ],
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1920',
    delay: 0.5,
  },
  {
    id: '6',
    icon: <Lightbulb size={28} />,
    title: 'Consulting',
    category: 'Conseil',
    description: [
      'Audit de votre présence digitale',
      'Stratégie de développement web',
      'Conseils personnalisés',
    ],
    image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920',
    delay: 0.6,
  },
  {
    id: '7',
    icon: <PenTool size={28} />,
    title: 'Maintenance & Support',
    category: 'Support',
    description: [
      'Maintenance gratuite pendant 1 an',
      'Formation à l\'utilisation des outils',
      'Support technique dédié',
    ],
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1920',
    delay: 0.7,
  },
  {
    id: '8',
    icon: <Music size={28} />,
    title: 'Playlist Personnalisée',
    category: 'Audio',
    description: [
      'Création d\'une playlist musicale personnalisée',
      'Ambiance sonore adaptée à votre marque',
      'Mise à jour régulière',
    ],
    image: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=1920',
    delay: 0.8,
  },
];

const Services: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const controls = useAnimation();
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
          setFocusedIndex(prev => (prev + 1) % filteredServices.length);
          break;
        case 'ArrowLeft':
          setFocusedIndex(prev => 
            prev - 1 < 0 ? filteredServices.length - 1 : prev - 1
          );
          break;
        case 'ArrowUp':
          setFocusedIndex(prev => {
            const newIndex = prev - 4;
            return newIndex < 0 ? prev : newIndex;
          });
          break;
        case 'ArrowDown':
          setFocusedIndex(prev => {
            const newIndex = prev + 4;
            return newIndex >= filteredServices.length ? prev : newIndex;
          });
          break;
        case 'Enter':
          if (!selectedId) {
            setSelectedId(filteredServices[focusedIndex].id);
          } else {
            setSelectedId(null);
          }
          break;
        case 'Escape':
          setSelectedId(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredServices.length, focusedIndex, selectedId]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent, serviceId: string) => {
    if (!touchStart) return;

    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;

    if (Math.abs(diff) > 30) {
      const direction = diff > 0 ? 'left' : 'right';
      const currentIndex = filteredServices.findIndex(s => s.id === serviceId);
      
      if (direction === 'left' && currentIndex < filteredServices.length - 1) {
        setSelectedId(filteredServices[currentIndex + 1].id);
      } else if (direction === 'right' && currentIndex > 0) {
        setSelectedId(filteredServices[currentIndex - 1].id);
      }
      
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          variants={cardVariants}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Nos Services
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Des solutions digitales innovantes pour propulser votre entreprise vers le succès.
            Découvrez notre gamme complète de services personnalisés.
          </p>
        </motion.div>

        <div className="relative mb-8 max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un service..."
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              layoutId={service.id}
              onTouchStart={handleTouchStart}
              onTouchMove={(e) => handleTouchMove(e, service.id)}
              onTouchEnd={handleTouchEnd}
              className={`bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden group transform transition-all duration-300 hover:translate-y-[-10px] hover:shadow-xl ${
                index === focusedIndex ? 'ring-2 ring-blue-500' : ''
              }`}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <motion.img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md rounded-full p-2">
                  <div className="text-blue-400">
                    {service.icon}
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2">{service.title}</h3>
                    <span className="text-sm text-blue-400">{service.category}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    onClick={() => setSelectedId(service.id)}
                  >
                    <ExternalLink size={20} />
                  </motion.button>
                </div>
                
                <ul className="space-y-2">
                  {service.description.map((item, index) => (
                    <li key={index} className="text-gray-400 text-sm flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
            >
              <motion.div
                layoutId={selectedId}
                className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden w-full max-w-2xl mx-4"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={(e) => handleTouchMove(e, selectedId)}
                onTouchEnd={handleTouchEnd}
              >
                <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = filteredServices.findIndex(s => s.id === selectedId);
                      if (currentIndex > 0) {
                        setSelectedId(filteredServices[currentIndex - 1].id);
                      }
                    }}
                    className="p-2 bg-black/50 rounded-full text-white/70 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                </div>

                <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = filteredServices.findIndex(s => s.id === selectedId);
                      if (currentIndex < filteredServices.length - 1) {
                        setSelectedId(filteredServices[currentIndex + 1].id);
                      }
                    }}
                    className="p-2 bg-black/50 rounded-full text-white/70 hover:text-white"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </div>

                {services.find(s => s.id === selectedId) && (
                  <div>
                    <div className="relative h-48 sm:h-64">
                      <motion.img
                        src={services.find(s => s.id === selectedId)!.image}
                        alt={services.find(s => s.id === selectedId)!.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="flex justify-center mb-4">
                            <div className="bg-white/10 backdrop-blur-md rounded-full p-4">
                              {services.find(s => s.id === selectedId)!.icon}
                            </div>
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-bold px-4">
                            {services.find(s => s.id === selectedId)!.title}
                          </h2>
                          <p className="text-blue-400 mt-2">
                            {services.find(s => s.id === selectedId)!.category}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 sm:p-8">
                      <ul className="space-y-4 mb-6">
                        {services.find(s => s.id === selectedId)!.description.map((item, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <span className="text-blue-400 mt-1">•</span>
                            <span className="text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <Link href="/contact">
                          <motion.button
                            className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Demander un devis
                          </motion.button>
                        </Link>
                        <button
                          onClick={() => setSelectedId(null)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          Fermer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-12 sm:mt-16 text-center"
          variants={cardVariants}
        >
          <Link href="/contact">
            <motion.button
              className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 sm:px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Démarrer votre projet
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Services;