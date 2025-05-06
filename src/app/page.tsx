"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { useState } from "react";
import Loader from "@/components/Loader";

export default function Home() {
  const [loading, setLoading] = useState(true);

  const handleLoaderComplete = () => {
    setLoading(false);
  };

  return (
    <main className="tech-pattern-bg min-h-screen text-white">
      {loading && <Loader onComplete={handleLoaderComplete} />}

      <Header />
      <Hero />
      <Footer />
    </main>
  );
}
