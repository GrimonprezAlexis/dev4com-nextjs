import { Metadata } from "next";
import Header from "@/components/Header";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title:
    "Services Web Annecy & Lausanne | Création Site Internet, E-commerce, SEO",
  description:
    "Découvrez nos services de développement web à Annecy et Lausanne : création de sites vitrines, e-commerce, applications web, SEO et solutions digitales sur mesure en Haute-Savoie et Suisse romande.",
  keywords: [
    "services web annecy",
    "services web lausanne",
    "création site vitrine annecy",
    "création site e-commerce lausanne",
    "développement application web suisse",
    "SEO référencement annecy lausanne",
    "webdesign haute-savoie",
    "maintenance site web suisse romande",
    "refonte site internet annecy",
    "hébergement web lausanne",
  ],
  alternates: {
    canonical: "https://www.dev4com.com/services",
  },
  openGraph: {
    title: "Services Web | DEV4COM - Agence Web Annecy & Lausanne",
    description:
      "Création de sites vitrines, e-commerce, applications web et SEO à Annecy, Lausanne et Suisse romande.",
    url: "https://www.dev4com.com/services",
    type: "website",
  },
};

export default function ServicesPage() {
  return (
    <main className="tech-pattern-bg min-h-screen text-white">
      <Header />
      <Services />
      <Footer />
    </main>
  );
}