"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import MaintenanceBanner from "@/components/MaintenanceBanner";
import { useState, useEffect } from "react";
import Loader from "@/components/Loader";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [shouldShowLoader, setShouldShowLoader] = useState(false);

  useEffect(() => {
    // Vérifier si le loader a déjà été affiché dans cette session
    const hasSeenLoader = sessionStorage.getItem("hasSeenLoader");

    if (!hasSeenLoader) {
      setShouldShowLoader(true);
      setLoading(true);
      // Marquer que le loader a été affiché
      sessionStorage.setItem("hasSeenLoader", "true");
    }
  }, []);

  const handleLoaderComplete = () => {
    setLoading(false);
  };

  return (
    <main className="tech-pattern-bg min-h-screen text-white">
      {shouldShowLoader && loading && <Loader onComplete={handleLoaderComplete} />}

      <MaintenanceBanner />
      <Header />
      <Hero />
      <Footer />
    </main>
  );
}
