'use client';

import Header from '@/components/Header';
import Admin from '@/components/Admin';
import Footer from '@/components/Footer';

export default function AdminPage() {
  return (
    <main className="tech-pattern-bg min-h-screen text-white">
      <Header />
      <Admin />
      <Footer />
    </main>
  );
}