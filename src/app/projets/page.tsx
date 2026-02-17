import { Metadata } from "next";
import Header from "@/components/Header";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title:
    "Nos Réalisations | Sites Web & Applications - Annecy, Lausanne, Suisse",
  description:
    "Découvrez nos réalisations web : sites vitrines, e-commerce et applications développés pour des clients à Annecy, Lausanne, Haute-Savoie et Suisse romande.",
  keywords: [
    "portfolio agence web annecy",
    "réalisations site internet lausanne",
    "projets web haute-savoie",
    "exemples sites web suisse romande",
    "portfolio développeur web annecy",
    "références agence digitale lausanne",
  ],
  alternates: {
    canonical: "https://www.dev4com.com/projets",
  },
  openGraph: {
    title: "Nos Projets | DEV4COM - Agence Web Annecy & Lausanne",
    description:
      "Portfolio de nos réalisations web : sites vitrines, e-commerce et applications à Annecy, Lausanne et Suisse romande.",
    url: "https://www.dev4com.com/projets",
    type: "website",
  },
};

export default function ProjetsPage() {
  return (
    <main className="tech-pattern-bg min-h-screen text-white">
      <Header />
      <Projects />
      <Footer />
    </main>
  );
}
