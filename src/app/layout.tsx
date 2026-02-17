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
  metadataBase: new URL("https://www.dev4com.com"),
  title: {
    default:
      "DEV4COM - Agence Web Annecy & Lausanne | Création Site Internet, Développement Web Suisse",
    template: "%s | DEV4COM - Agence Web Annecy & Lausanne",
  },
  description:
    "Agence de développement web à Annecy et Lausanne. Création de sites internet sur mesure, e-commerce, applications web et solutions digitales en Haute-Savoie et Suisse romande. Devis gratuit.",
  keywords: [
    "dev4com",
    "agence web annecy",
    "agence web lausanne",
    "création site internet annecy",
    "création site internet lausanne",
    "développement web annecy",
    "développement web lausanne",
    "site web annecy",
    "site web lausanne",
    "développeur web annecy",
    "développeur web lausanne",
    "agence digitale suisse romande",
    "agence digitale haute-savoie",
    "création site e-commerce annecy",
    "création site e-commerce lausanne",
    "freelance web suisse",
    "développement web suisse romande",
    "site internet haute-savoie",
    "webdesign annecy",
    "webdesign lausanne",
    "solutions digitales annecy",
    "solutions digitales lausanne",
    "refonte site web annecy",
    "refonte site web lausanne",
    "agence web haute-savoie",
    "création application web suisse",
    "SEO annecy",
    "SEO lausanne",
    "référencement naturel annecy",
    "référencement naturel lausanne",
    "site vitrine annecy",
    "site vitrine lausanne",
    "agence web paris",
    "développement web paris",
  ],
  applicationName: "DEV4COM",
  authors: [{ name: "Dev4Com", url: "https://www.dev4com.com" }],
  creator: "Dev4Com",
  publisher: "Dev4Com",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/images/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://www.dev4com.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title:
      "DEV4COM - Agence Web Annecy & Lausanne | Développement Web & Solutions Digitales",
    description:
      "Expert en création de sites internet et développement web à Annecy, Lausanne et en Suisse romande. Sites vitrines, e-commerce, applications web sur mesure. Devis gratuit.",
    url: "https://www.dev4com.com",
    siteName: "DEV4COM",
    images: [
      {
        url: "/images/dev4com_white_logo_2000px.png",
        width: 2000,
        height: 2000,
        alt: "DEV4COM - Agence Web Annecy & Lausanne - Développement Web et Solutions Digitales",
        type: "image/png",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "DEV4COM - Agence Web Annecy & Lausanne | Développement Web & Solutions Digitales",
    description:
      "Création de sites internet et solutions digitales sur mesure à Annecy, Lausanne et Suisse romande. Devis gratuit.",
    creator: "@dev4com",
    site: "@dev4com",
    images: [
      {
        url: "/images/dev4com_white_logo_2000px.png",
        alt: "DEV4COM - Agence Web Annecy & Lausanne",
      },
    ],
  },
  category: "technology",
  other: {
    "format-detection": "telephone=no",
    "geo.region": "CH-VD",
    "geo.placename": "Vevey",
    "geo.position": "46.4631;6.8432",
    ICBM: "46.4631, 6.8432",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "DEV4COM",
  alternateName: "Dev4Ecom",
  description:
    "Agence de développement web spécialisée dans la création de sites internet, e-commerce et solutions digitales à Annecy, Lausanne et en Suisse romande.",
  url: "https://www.dev4com.com",
  logo: "https://www.dev4com.com/images/dev4com_white_logo_2000px.png",
  image: "https://www.dev4com.com/images/dev4com_white_logo_2000px.png",
  telephone: "",
  email: "contact@dev4com.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rue des Moulins 33",
    addressLocality: "Vevey",
    postalCode: "1800",
    addressRegion: "Vaud",
    addressCountry: "CH",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 46.4631,
    longitude: 6.8432,
  },
  areaServed: [
    {
      "@type": "City",
      name: "Annecy",
      "@id": "https://www.wikidata.org/wiki/Q39759",
    },
    {
      "@type": "City",
      name: "Lausanne",
      "@id": "https://www.wikidata.org/wiki/Q807",
    },
    {
      "@type": "City",
      name: "Paris",
      "@id": "https://www.wikidata.org/wiki/Q90",
    },
    {
      "@type": "AdministrativeArea",
      name: "Haute-Savoie",
    },
    {
      "@type": "AdministrativeArea",
      name: "Suisse romande",
    },
  ],
  sameAs: [],
  priceRange: "$$",
  knowsLanguage: ["fr", "en"],
  serviceType: [
    "Création de sites internet",
    "Développement web",
    "E-commerce",
    "Applications web",
    "Solutions digitales",
    "Référencement SEO",
    "Webdesign",
  ],
  founder: {
    "@type": "Person",
    name: "Alexis Grimonprez",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.className}>
      <head>
        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
