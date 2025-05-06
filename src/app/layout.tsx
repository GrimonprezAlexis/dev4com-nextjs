import { AuthProvider } from "@/contexts/AuthContext";
import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatBot from "@/components/Chatbot";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "DEV4COM - Agence de Développement Web & Solutions Digitales",
  description:
    "Votre partenaire expert en développement web, création de sites internet et solutions digitales sur mesure.",
  keywords: [
    "dev4com",
    "développement web",
    "agence web",
    "création site internet",
    "solutions digitales",
    "freelance web suisse",
  ],
  applicationName: "DEV4COM",
  authors: [{ name: "Dev4Com", url: "https://www.dev4com.com" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/images/apple-touch-icon.png",
  },
  openGraph: {
    title: "DEV4COM - Agence Digitale",
    description:
      "Expert digital en Suisse pour la création de sites modernes et automatisations intelligentes.",
    url: "https://www.dev4com.com",
    siteName: "DEV4COM",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "DEV4COM cover image",
      },
    ],
    locale: "fr_CH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DEV4COM",
    description:
      "Solutions digitales, développement web & automatisations IA pour les pros.",
    creator: "@dev4com",
    images: ["/images/og-cover.jpg"],
  },
  other: {
    "format-detection": "telephone=no",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.className}>
      <head>
        {/* Performance & Prefetch */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <ChatBot />
        </AuthProvider>
      </body>
    </html>
  );
}
