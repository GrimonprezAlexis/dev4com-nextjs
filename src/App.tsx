import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Admin from "./components/Admin";
import Footer from "./components/Footer";
import Services from "./components/Services";
import SEO from "./components/SEO";

const AnimatedRoutes = () => {
  const location = useLocation();
  const seoData = {
    "/": {
      title: "DEV4COM - Agence de Développement Web & Solutions Digitales",
      description: "Votre partenaire expert en développement web, création de sites internet et solutions digitales sur mesure. Expertise React, Node.js et technologies innovantes.",
      keywords: ["dev4com", "développement web", "agence web", "création site internet", "solutions digitales"],
    },
    "/services": {
      title: "Services Web & Digital - DEV4COM",
      description: "Découvrez nos services de développement web, e-commerce, SEO et solutions digitales personnalisées pour votre entreprise.",
      keywords: ["services web", "dev4com services", "développement web", "e-commerce", "SEO"],
    },
    "/projects": {
      title: "Nos Réalisations - Portfolio DEV4COM",
      description: "Explorez notre portfolio de projets web et digitaux. Sites web modernes, e-commerce et applications sur mesure.",
      keywords: ["portfolio dev4com", "projets web", "réalisations digitales", "sites web"],
    },
    "/contact": {
      title: "Contactez DEV4COM - Votre Projet Web Sur Mesure",
      description: "Discutons de votre projet digital. Contactez notre équipe d'experts en développement web pour un devis personnalisé.",
      keywords: ["contact dev4com", "devis site web", "projet digital", "agence web contact"],
    },
  };

  const currentSEO = seoData[location.pathname as keyof typeof seoData] || seoData["/"];

  return (
    <AnimatePresence mode="wait">
      <SEO {...currentSEO} />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Hero />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoaded(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleLoaderComplete = () => {
    setLoading(false);
  };

  return (
    <Router>
      <div className="tech-pattern-bg min-h-screen text-white">
        {loading && <Loader onComplete={handleLoaderComplete} />}

        <div
          className={`transition-opacity duration-500 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
        >
          <Header />
          <main>
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;