"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Linkedin, Twitter, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { path: "/", label: "Accueil" },
    { path: "/projects", label: "Projets" },
    { path: "/services", label: "Services" },
    { path: "/contact", label: "Contact" },
    { path: "/admin", label: "Admin" },
  ];

  const socialLinks = [
    { Icon: Facebook, href: "#" },
    { Icon: Twitter, href: "#" },
    { Icon: Linkedin, href: "#" },
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
        <Link href="/">
          <motion.div
            className="w-16 h-16 relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm font-medium transition-colors ${
                pathname === item.path
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Social Links */}
        <div className="hidden md:flex space-x-4">
          {socialLinks.map(({ Icon, href }, index) => (
            <motion.a
              key={index}
              href={href}
              whileHover={{ scale: 1.2, color: "#ffffff" }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Icon size={18} />
            </motion.a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                  <Link href="/" onClick={() => setIsMenuOpen(false)}>
                    <img
                      src="/images/logo.png"
                      alt="Logo"
                      className="w-16 h-16 object-contain"
                    />
                  </Link>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
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
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto">
                  <div className="flex justify-center space-x-6">
                    {socialLinks.map(({ Icon, href }, index) => (
                      <motion.a
                        key={index}
                        href={href}
                        whileHover={{ scale: 1.2, color: "#ffffff" }}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Icon size={24} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;