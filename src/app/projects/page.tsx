'use client';

import Header from '@/components/Header';
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';

export default function ProjectsPage() {
  return (
    <main className="tech-pattern-bg min-h-screen text-white">
      <Header />
      <Projects />
      <Footer />
    </main>
  );
}