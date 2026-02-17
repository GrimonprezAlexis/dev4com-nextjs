import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | DEV4COM - Agence Web Annecy & Lausanne",
  description:
    "Mentions légales de DEV4COM, agence de développement web à Annecy et Lausanne. Informations juridiques, éditeur, hébergeur et conditions d'utilisation.",
  alternates: {
    canonical: "https://www.dev4com.com/mentions-legales",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MentionsLegalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
