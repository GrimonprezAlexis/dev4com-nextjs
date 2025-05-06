import { AuthProvider } from "@/contexts/AuthContext";
import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "./favicon.ico",
    apple: ".images/apple-touch-icon.png",
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
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
