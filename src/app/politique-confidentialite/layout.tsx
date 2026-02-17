import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Politique de Confidentialité | DEV4COM - Agence Web Annecy & Lausanne",
  description:
    "Politique de confidentialité de DEV4COM. Protection des données personnelles, RGPD, cookies et droits des utilisateurs. Agence web Annecy et Lausanne.",
  alternates: {
    canonical: "https://www.dev4com.com/politique-confidentialite",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PolitiqueConfidentialiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
