import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="tech-pattern-bg min-h-screen text-white">
      <Header />
      <Hero />
      <Footer />
    </main>
  );
}