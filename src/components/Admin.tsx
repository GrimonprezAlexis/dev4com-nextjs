'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Settings, Mail, LogOut, FolderKanban } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProjectsManager from './admin/ProjectsManager';
import SettingsPanel from './admin/SettingsPanel';

const Admin: React.FC = () => {
  const { user, signIn, signUp, signOut, error, clearError } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', displayName: '' });
  const [currentSection, setCurrentSection] = useState('projects');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Client-side validation
    if (!loginForm.email || !loginForm.password) {
      return; // Error will be shown by AuthContext
    }

    if (isRegistering && !loginForm.displayName) {
      return; // Error will be shown by AuthContext
    }

    try {
      if (isRegistering) {
        console.log('Tentative d\'inscription avec:', loginForm.email);
        await signUp(loginForm.email, loginForm.password, loginForm.displayName);
        console.log('Inscription réussie!');
      } else {
        console.log('Tentative de connexion avec:', loginForm.email);
        await signIn(loginForm.email, loginForm.password);
        console.log('Connexion réussie!');
      }
    } catch (err: any) {
      console.error('Erreur d\'authentification:', err);
      console.error('Code d\'erreur:', err.code);
      console.error('Message d\'erreur:', err.message);
      // Error is already set in AuthContext, no need to handle here
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const adminSections = [
    { id: 'projects', icon: <FolderKanban size={24} />, title: 'Projets', component: ProjectsManager },
    { id: 'settings', icon: <Settings size={24} />, title: 'Paramètres', component: SettingsPanel },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  if (!user) {
    return (
      <motion.div
        className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          variants={itemVariants}
          className="bg-black/40 backdrop-blur-md p-8 rounded-xl w-full max-w-md border border-white/10"
        >
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Lock size={32} className="text-blue-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-6">
            {isRegistering ? 'Créer un compte' : 'Administration'}
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleAuth} className="space-y-6">
            {isRegistering && (
              <div>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    className="w-full bg-black/30 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    value={loginForm.displayName}
                    onChange={(e) => setLoginForm({ ...loginForm, displayName: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-black/30 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  className="w-full bg-black/30 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                  minLength={6}
                  autoComplete={isRegistering ? "new-password" : "current-password"}
                />
              </div>
              {isRegistering && (
                <p className="text-xs text-gray-400 mt-1 ml-1">Minimum 6 caractères</p>
              )}
            </div>

            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-blue-500 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isRegistering ? 'Créer un compte' : 'Se connecter'}
            </motion.button>

            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                clearError();
                setLoginForm({ email: '', password: '', displayName: '' });
              }}
              className="w-full text-sm text-gray-400 hover:text-white transition-colors"
            >
              {isRegistering ? 'Déjà un compte ? Se connecter' : 'Créer un compte'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    );
  }

  const CurrentComponent = adminSections.find(section => section.id === currentSection)?.component || ProjectsManager;

  return (
    <motion.div
      className="min-h-screen pt-24 pb-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div 
            variants={itemVariants}
            className="lg:w-64 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 h-fit"
          >
            <div className="mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <User size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">{user.displayName || 'Admin'}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
            </div>
            
            <nav className="space-y-2">
              {adminSections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => setCurrentSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    currentSection === section.id 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'text-gray-400 hover:bg-white/5'
                  }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {section.icon}
                  <span>{section.title}</span>
                </motion.button>
              ))}
              
              <motion.button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut size={24} />
                <span>Déconnexion</span>
              </motion.button>
            </nav>
          </motion.div>

          {/* Main Content */}
          <motion.div
            variants={itemVariants}
            className="flex-1"
          >
            {/* Dynamic Content */}
            <motion.div
              variants={itemVariants}
              className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10"
            >
              <CurrentComponent />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Admin;