"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isUserMenuOpen && !target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsUserMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const menuItems = [
    { path: "/", label: "Accueil" },
    { path: "/projets", label: "Projets" },
    { path: "/audio", label: "Audio" },
    { path: "/services", label: "Services" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-40 py-4 px-6 transition-colors duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" aria-label="Retour à l'accueil">
          <motion.div
            className="w-16 h-16 relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img
              src="/images/logo.png"
              alt="Logo DEV4COM"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-md font-medium transition-colors ${
                pathname === item.path
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              aria-current={pathname === item.path ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}

          {/* User Menu or Admin Link */}
          {user ? (
            <div className="relative user-menu-container">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Menu utilisateur"
              >
                <User size={20} />
                <span className="text-md font-medium">
                  {user.displayName || user.email?.split('@')[0] || 'Utilisateur'}
                </span>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    <Link
                      href="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      Administration
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Déconnexion</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/admin"
              className={`text-md font-medium transition-colors ${
                pathname === "/admin"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              aria-current={pathname === "/admin" ? "page" : undefined}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
        >
          <Menu size={24} />
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50 md:hidden"
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex justify-between items-center mb-8">
                  <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Retour à l'accueil"
                  >
                    <img
                      src="/images/logo.png"
                      alt="Logo DEV4COM"
                      className="w-16 h-16 object-contain"
                    />
                  </Link>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Fermer le menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                <nav className="flex flex-col space-y-6">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-2xl font-medium transition-colors ${
                        pathname === item.path
                          ? "text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                      aria-current={pathname === item.path ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* Mobile User Menu */}
                  {user ? (
                    <>
                      <div className="pt-6 border-t border-gray-700">
                        <div className="flex items-center space-x-3 mb-6 text-gray-400">
                          <User size={24} />
                          <span className="text-lg font-medium">
                            {user.displayName || user.email?.split('@')[0] || 'Utilisateur'}
                          </span>
                        </div>
                        <Link
                          href="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className={`block text-2xl font-medium mb-6 transition-colors ${
                            pathname === "/admin"
                              ? "text-white"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          Administration
                        </Link>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center space-x-3 text-2xl font-medium text-gray-400 hover:text-white transition-colors"
                        >
                          <LogOut size={24} />
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-2xl font-medium transition-colors ${
                        pathname === "/admin"
                          ? "text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                      aria-current={pathname === "/admin" ? "page" : undefined}
                    >
                      Admin
                    </Link>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
