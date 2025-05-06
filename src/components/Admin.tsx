'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Settings, Image, BarChart, Mail, Globe, ShoppingCart, AlertCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardHome from './admin/DashboardHome';
import MediaManager from './admin/MediaManager';
import SettingsPanel from './admin/SettingsPanel';

const Admin: React.FC = () => {
  const { user, signIn, signUp, signOut, error, clearError } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', displayName: '' });
  const [currentSection, setCurrentSection] = useState('dashboard');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      if (isRegistering) {
        await signUp(loginForm.email, loginForm.password, loginForm.displayName);
      } else {
        await signIn(loginForm.email, loginForm.password);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      // Handle the specific case of email already in use
      if (err.code === 'auth/email-already-in-use') {
        clearError();
        setIsRegistering(false); // Switch back to login form
        // We'll show a message indicating they should log in instead
        return;
      }
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
    { id: 'dashboard', icon: <BarChart size={24} />, title: 'Tableau de bord', component: DashboardHome },
    { id: 'media', icon: <Image size={24} />, title: 'Projets', component: MediaManager },
    { id: 'settings', icon: <Settings size={24} />, title: 'Paramètres', component: SettingsPanel },
  ];

  const stats = [
    { icon: <Globe size={20} />, label: 'Visiteurs', value: '1.2K', trend: '+12%' },
    { icon: <ShoppingCart size={20} />, label: 'Projets', value: '25', trend: '+5%' },
    { icon: <Mail size={20} />, label: 'Messages', value: '48', trend: '+18%' },
    { icon: <AlertCircle size={20} />, label: 'Notifications', value: '7', trend: '-2%' },
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
                />
              </div>
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

  const CurrentComponent = adminSections.find(section => section.id === currentSection)?.component || DashboardHome;

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
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                        <p className="text-xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                    <span className={`text-sm ${
                      stat.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stat.trend}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

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