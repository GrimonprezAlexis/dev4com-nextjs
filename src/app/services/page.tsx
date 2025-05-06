'use client';

import Header from '@/components/Header';
import Services from '@/components/Services';
import Footer from '@/components/Footer';

export default function ServicesPage() {
  return (
    <main className="tech-pattern-bg min-h-screen text-white">
      <Header />
      <Services />
      <Footer />
    </main>
  );
}