import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "DEV4COM - Agence de Développement Web & Solutions Digitales sur Mesure",
  description = "Expert en développement web et solutions digitales innovantes. DEV4COM crée des sites web performants, e-commerce et applications sur mesure pour propulser votre entreprise vers le succès. Devis gratuit.",
  keywords = [
    "dev4com",
    "développement web",
    "agence web",
    "création site internet",
    "solutions digitales",
    "e-commerce",
    "applications web",
    "site web professionnel",
    "agence digitale",
    "développeur web",
    "SEO",
    "React",
    "Node.js",
    "transformation digitale",
    "Lausanne",
    "Annecy"
  ],
  image = "https://dev4com.com/og-image.jpg",
  url = "https://dev4com.com",
  type = "website",
  author = "DEV4COM",
  publishedTime,
  modifiedTime
}) => {
  const siteName = "DEV4COM";
  const twitterHandle = "@dev4com";
  const locale = "fr_FR";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      <meta name="language" content="French" />
      <meta name="revisit-after" content="7 days" />
      <meta name="generator" content="React" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Article Specific Meta Tags */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:publisher" content="https://dev4com.com" />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        </>
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="format-detection" content="telephone=no" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "DEV4COM",
          "image": image,
          "url": "https://dev4com.com",
          "telephone": "+33-1-23-45-67-89",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Rue des Moulins 33",
            "addressLocality": "Vevey",
            "postalCode": "1800",
            "addressCountry": "CH"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 46.4631,
            "longitude": 6.8432
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday"
            ],
            "opens": "09:00",
            "closes": "18:00"
          },
          "sameAs": [
            "https://facebook.com/dev4com",
            "https://twitter.com/dev4com",
            "https://linkedin.com/company/dev4com",
            "https://instagram.com/dev4com"
          ],
          "priceRange": "€€",
          "description": description,
          "areaServed": "France",
          "serviceType": [
            "Développement Web",
            "E-commerce",
            "Solutions Digitales",
            "SEO",
            "Applications Web"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;