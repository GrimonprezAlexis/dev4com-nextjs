'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, Settings, Mail, LogOut, FolderKanban, Code, Music, Download,
  ArrowLeft, Shield, KeyRound, CheckCircle, AlertCircle, Loader2, Eye, EyeOff,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProjectsManager from './admin/ProjectsManager';
import SettingsPanel from './admin/SettingsPanel';
import AudioManager from './admin/AudioManager';
import DataExport from './admin/DataExport';

type AuthMode = 'login' | 'reset';

const Admin: React.FC = () => {
  const { user, signIn, signOut, resetPassword, error, clearError } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '', displayName: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState('projects');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!loginForm.email || !loginForm.password) return;

    setIsSubmitting(true);
    try {
      await signIn(loginForm.email, loginForm.password);
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!loginForm.email) return;

    setIsSubmitting(true);
    try {
      await resetPassword(loginForm.email);
      setResetSent(true);
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const switchAuthMode = (mode: AuthMode) => {
    clearError();
    setAuthMode(mode);
    setResetSent(false);
    setShowPassword(false);
    if (mode === 'login') {
      setLoginForm({ email: loginForm.email, password: '', displayName: '' });
    } else {
      setLoginForm({ ...loginForm, password: '', displayName: '' });
    }
  };

  const adminSections = [
    { id: 'projects', icon: FolderKanban, title: 'Projets', component: ProjectsManager },
    { id: 'audio', icon: Music, title: 'Audio', component: AudioManager },
    { id: 'export', icon: Download, title: 'Export', component: DataExport },
    { id: 'settings', icon: Settings, title: 'Paramètres', component: SettingsPanel },
    { id: 'dev-gen', icon: Code, title: 'Dev GEN', href: 'https://dev4com-gen-invoice.vercel.app' },
  ];

  // ─── AUTH SCREEN ────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center relative">
        {/* Atmospheric background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-[600px] h-[600px] bg-blue-500/[0.06] rounded-full blur-[120px] translate-y-[-10%]" />
          <div className="absolute w-[400px] h-[400px] bg-violet-500/[0.04] rounded-full blur-[100px] translate-x-[30%] translate-y-[20%]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px] relative z-10"
        >
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/60">
            {/* Gradient accent line */}
            <div className="h-[2px] bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500" />

            <div className="bg-[#0c0c10]/90 backdrop-blur-2xl px-8 py-10">
              <AnimatePresence mode="wait">
                {/* ── LOGIN ── */}
                {authMode === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="flex justify-center mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/15 to-violet-500/15 border border-white/[0.08] flex items-center justify-center">
                        <Shield size={26} className="text-blue-400" />
                      </div>
                    </div>

                    <h2 className="text-[22px] font-semibold text-center text-white mb-1 tracking-tight">
                      Administration
                    </h2>
                    <p className="text-sm text-gray-500 text-center mb-8">
                      Connectez-vous pour accéder au panneau
                    </p>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-5 p-3.5 bg-red-500/[0.08] border border-red-500/20 rounded-xl flex items-start gap-2.5"
                      >
                        <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                        <span className="text-sm text-red-400/90 leading-snug">{error}</span>
                      </motion.div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-3.5">
                      <div className="relative group">
                        <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          type="email"
                          placeholder="Adresse email"
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          required
                          autoComplete="email"
                        />
                      </div>

                      <div className="relative group">
                        <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Mot de passe"
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-11 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          required
                          minLength={6}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      <div className="flex justify-end pt-0.5">
                        <button
                          type="button"
                          onClick={() => switchAuthMode('reset')}
                          className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
                        >
                          Mot de passe oublié ?
                        </button>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-3 rounded-xl font-medium text-sm hover:from-blue-500 hover:to-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 mt-2"
                        whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 size={18} className="animate-spin" />
                            Connexion...
                          </span>
                        ) : (
                          'Se connecter'
                        )}
                      </motion.button>
                    </form>
                  </motion.div>
                )}

                {/* ── RESET PASSWORD ── */}
                {authMode === 'reset' && (
                  <motion.div
                    key="reset"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <button
                      onClick={() => switchAuthMode('login')}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors mb-8 -ml-1"
                    >
                      <ArrowLeft size={16} />
                      Retour
                    </button>

                    {!resetSent ? (
                      <>
                        <div className="flex justify-center mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/15 to-orange-500/15 border border-white/[0.08] flex items-center justify-center">
                            <KeyRound size={26} className="text-amber-400" />
                          </div>
                        </div>

                        <h2 className="text-[22px] font-semibold text-center text-white mb-1 tracking-tight">
                          Mot de passe oublié
                        </h2>
                        <p className="text-sm text-gray-500 text-center mb-8">
                          Entrez votre email pour recevoir un lien de réinitialisation
                        </p>

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-5 p-3.5 bg-red-500/[0.08] border border-red-500/20 rounded-xl flex items-start gap-2.5"
                          >
                            <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-red-400/90 leading-snug">{error}</span>
                          </motion.div>
                        )}

                        <form onSubmit={handleResetPassword} className="space-y-4">
                          <div className="relative group">
                            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-amber-400 transition-colors" />
                            <input
                              type="email"
                              placeholder="Adresse email"
                              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-amber-500/20 transition-all text-sm"
                              value={loginForm.email}
                              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                              required
                              autoComplete="email"
                            />
                          </div>

                          <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-xl font-medium text-sm hover:from-amber-500 hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
                            whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 size={18} className="animate-spin" />
                                Envoi...
                              </span>
                            ) : (
                              'Envoyer le lien'
                            )}
                          </motion.button>
                        </form>
                      </>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                      >
                        <div className="flex justify-center mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-green-500/15 border border-white/[0.08] flex items-center justify-center">
                            <CheckCircle size={26} className="text-emerald-400" />
                          </div>
                        </div>

                        <h2 className="text-[22px] font-semibold text-white mb-2 tracking-tight">
                          Email envoyé
                        </h2>
                        <p className="text-sm text-gray-400 mb-2 leading-relaxed">
                          Un lien de réinitialisation a été envoyé à
                        </p>
                        <p className="text-sm text-white font-medium mb-8">
                          {loginForm.email}
                        </p>
                        <p className="text-xs text-gray-500 mb-8">
                          Vérifiez votre boîte de réception et vos spams.
                        </p>

                        <motion.button
                          onClick={() => switchAuthMode('login')}
                          className="w-full bg-white/[0.06] border border-white/[0.08] text-white py-3 rounded-xl font-medium text-sm hover:bg-white/[0.1] transition-all"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Retour à la connexion
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Subtle bottom glow */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-blue-500/[0.04] rounded-full blur-[40px] pointer-events-none" />
        </motion.div>
      </div>
    );
  }

  // ─── ADMIN DASHBOARD ────────────────────────────────────────────
  const currentSectionData = adminSections.find(s => s.id === currentSection);
  const CurrentComponent = currentSectionData?.component || ProjectsManager;

  return (
    <motion.div
      className="min-h-screen pt-24 pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── SIDEBAR (Desktop) ── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="hidden lg:flex flex-col w-72 shrink-0"
          >
            <div className="sticky top-28 overflow-hidden rounded-2xl border border-white/[0.08] shadow-xl shadow-black/30">
              <div className="h-[2px] bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500" />

              <div className="bg-[#0c0c10]/80 backdrop-blur-xl p-5">
                {/* User section */}
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/[0.06]">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/[0.08] flex items-center justify-center text-sm font-semibold text-blue-400 shrink-0">
                    {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm truncate">{user.displayName || 'Admin'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  {adminSections.map((section) => {
                    const isActive = currentSection === section.id && !('href' in section);
                    const isExternal = 'href' in section;
                    const Icon = section.icon;

                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => {
                          if (isExternal && section.href) {
                            window.open(section.href, '_blank');
                          } else {
                            setCurrentSection(section.id);
                          }
                        }}
                        className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                          isActive
                            ? 'bg-blue-500/[0.08] text-blue-400'
                            : 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.03]'
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeSidebar"
                            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-blue-500 rounded-full"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        <Icon size={20} />
                        <span className="flex-1 text-left">{section.title}</span>
                        {isExternal && <ExternalLink size={14} className="text-gray-600" />}
                      </motion.button>
                    );
                  })}
                </nav>

                {/* Logout */}
                <div className="mt-5 pt-5 border-t border-white/[0.06]">
                  <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/[0.05] transition-all"
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* ── MOBILE HEADER + NAV ── */}
          <div className="lg:hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/[0.08] flex items-center justify-center text-xs font-semibold text-blue-400">
                  {user.displayName?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user.displayName || 'Admin'}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/[0.05] transition-all"
              >
                <LogOut size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 admin-scrollbar-hide">
              {adminSections.map((section) => {
                const isActive = currentSection === section.id && !('href' in section);
                const isExternal = 'href' in section;
                const Icon = section.icon;

                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      if (isExternal && section.href) {
                        window.open(section.href, '_blank');
                      } else {
                        setCurrentSection(section.id);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all shrink-0 ${
                      isActive
                        ? 'bg-blue-500/[0.1] text-blue-400 border border-blue-500/20'
                        : 'text-gray-400 hover:bg-white/[0.03] border border-white/[0.06]'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{section.title}</span>
                    {isExternal && <ExternalLink size={12} className="text-gray-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex-1 min-w-0"
          >
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] shadow-xl shadow-black/30">
              <div className="h-[2px] bg-gradient-to-r from-blue-500/50 via-violet-500/50 to-blue-500/50" />
              <div className="bg-[#0c0c10]/80 backdrop-blur-xl p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSection}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CurrentComponent />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.main>
        </div>
      </div>
    </motion.div>
  );
};

export default Admin;
