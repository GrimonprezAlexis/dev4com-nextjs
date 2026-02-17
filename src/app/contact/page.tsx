import { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Loading from "../loading";

export const metadata: Metadata = {
  title: "Contact | Devis Gratuit Création Site Web Annecy & Lausanne",
  description:
    "Contactez DEV4COM pour votre projet web à Annecy ou Lausanne. Devis gratuit pour la création de site internet, e-commerce ou application web en Haute-Savoie et Suisse romande.",
  keywords: [
    "contact agence web annecy",
    "contact agence web lausanne",
    "devis site internet annecy",
    "devis site internet lausanne",
    "devis création site web haute-savoie",
    "devis développement web suisse romande",
    "contact développeur web annecy",
    "contact développeur web lausanne",
  ],
  alternates: {
    canonical: "https://www.dev4com.com/contact",
  },
  openGraph: {
    title: "Contactez-nous | DEV4COM - Agence Web Annecy & Lausanne",
    description:
      "Demandez votre devis gratuit pour la création de votre site internet à Annecy, Lausanne ou en Suisse romande.",
    url: "https://www.dev4com.com/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="tech-pattern-bg min-h-screen text-white">
      <Header />
      <Suspense fallback={<Loading />}>
        <Contact />
      </Suspense>
      <Footer />
    </main>
  );
}
