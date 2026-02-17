'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';

function linkifyEmail(text: string) {
  const email = 'contact@dev4com.com';
  if (!text.includes(email)) return text;
  const parts = text.split(email);
  return (
    <>
      {parts[0]}
      <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
        {email}
      </Link>
      {parts[1]}
    </>
  );
}

export default function PolitiqueConfidentialite() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: [
        'Dev4Ecom (ci-après « nous ») respecte votre vie privée et s\'engage à protéger vos données personnelles. Cette Politique de Confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos données.',
        'Cette politique s\'applique à tous les services fournis par Dev4Ecom, y compris notre site web et nos outils (chatbot, formulaires de contact, etc.).'
      ]
    },
    {
      id: 'donnees-collectees',
      title: '2. Données personnelles collectées',
      content: [
        'Nous collectons les données suivantes :',
        '• Données d\'identité : Nom, prénom, email, numéro de téléphone (si fourni)',
        '• Données de communication : Contenu des messages du chatbot, demandes de contact',
        '• Données de navigation : Adresse IP, type de navigateur, pages visitées, durée de visite',
        '• Données de cookies : Informations stockées via les cookies de votre navigateur',
        '• Données d\'authentification : Email et mot de passe (pour l\'accès admin)',
        '• Données d\'usage : Interactions avec le chatbot, clics, préférences'
      ]
    },
    {
      id: 'finalites',
      title: '3. Finalités de traitement',
      content: [
        'Nous utilisons vos données pour :',
        '• Traiter votre demande de contact ou devis',
        '• Vous envoyer nos propositions et informations commerciales',
        '• Améliorer nos services et notre site web',
        '• Analyser l\'usage du site (Google Analytics)',
        '• Assurer la sécurité et la prévention de la fraude',
        '• Respecter les obligations légales et réglementaires',
        '• Gérer les comptes utilisateurs et l\'authentification'
      ]
    },
    {
      id: 'fondement-legal',
      title: '4. Fondement légal du traitement',
      content: [
        'Nos traitements de données sont basés sur :',
        '• Votre consentement (chatbot, cookies)',
        '• L\'exécution d\'un contrat (demande de devis, service client)',
        '• Nos intérêts légitimes (amélioration de service, sécurité)',
        '• Les obligations légales (facturation, comptabilité)'
      ]
    },
    {
      id: 'partage-donnees',
      title: '5. Partage des données',
      content: [
        'Vos données peuvent être partagées avec :',
        '• Sous-traitants : Vercel (hébergement), Hostinger (email), Firebase (authentification)',
        '• Prestataires : Fournisseurs de services email, analytics, CRM',
        '• Autorités légales : Si légalement obligé (police, justice)',
        'Nous garantissons que tous les sous-traitants respectent la protection des données.'
      ]
    },
    {
      id: 'conservation',
      title: '6. Durée de conservation',
      content: [
        '• Demandes de contact : Conservées 3 ans pour la relation commerciale',
        '• Emails capturés par le chatbot : Conservés 2 ans ou jusqu\'à votre demande de suppression',
        '• Cookies : Supprimés automatiquement après 12-13 mois',
        '• Comptes administrateurs : Tant que le compte est actif + 1 an après fermeture',
        '• Données de facturation : 6 ans (obligation légale)',
        'Après ces délais, les données sont supprimées de manière sécurisée.'
      ]
    },
    {
      id: 'droits-utilisateur',
      title: '7. Vos droits',
      content: [
        'Conformément au RGPD, vous avez les droits suivants :',
        '• Droit d\'accès : Obtenir une copie de vos données',
        '• Droit de rectification : Corriger vos données inexactes',
        '• Droit à l\'oubli : Demander la suppression de vos données',
        '• Droit à la limitation du traitement : Limiter l\'utilisation de vos données',
        '• Droit à la portabilité : Recevoir vos données dans un format exploitable',
        '• Droit d\'opposition : Refuser certains traitements (marketing, analytics)',
        'Pour exercer ces droits, contactez-nous à contact@dev4com.com',
        'Nous avons 30 jours pour répondre à votre demande.'
      ]
    },
    {
      id: 'securite',
      title: '8. Sécurité des données',
      content: [
        'Nous mettons en place des mesures de sécurité pour protéger vos données :',
        '• Chiffrement HTTPS/TLS pour les transmissions',
        '• Authentification Firebase avec tokens sécurisés',
        '• Serveurs hébergés chez Vercel et Hostinger (entreprises de confiance)',
        '• Accès restreint aux données sensibles',
        '• Logs de sécurité et monitoring',
        'Cependant, aucun système n\'est 100% sécurisé. Nous vous recommandons d\'utiliser des mots de passe forts et de nous signaler toute suspicion de breach.'
      ]
    },
    {
      id: 'chatbot',
      title: '9. Assistant automatisé (Chatbot)',
      content: [
        'Notre assistant fonctionne entièrement côté client (dans votre navigateur). Aucune donnée n\'est transmise à des services tiers.',
        '• Vos messages : Traités localement dans votre navigateur',
        '• Aucun stockage serveur : Les conversations ne sont pas enregistrées',
        '• Aucun transfert de données : L\'assistant ne communique avec aucune API externe'
      ]
    },
    {
      id: 'cookies',
      title: '10. Cookies et technologies de suivi',
      content: [
        'Types de cookies utilisés :',
        '• Cookies de session : Permettent votre authentification (Firebase)',
        '• Cookies analytics : Google Analytics pour mesurer l\'usage (non identifiants)',
        '• Cookies de préférences : Sauvegardent vos choix (langue, thème)',
        'Gestion des cookies :',
        '• Vous pouvez refuser les cookies non-essentiels',
        '• Les cookies essentiels (sécurité, authentification) ne peuvent pas être refusés',
        '• Suppression : Paramètres du navigateur',
        'Consentement : En utilisant le site, vous consentez à nos cookies.'
      ]
    },
    {
      id: 'transferts-internationaux',
      title: '11. Transferts internationaux',
      content: [
        'Vos données peuvent être transférées hors de l\'UE :',
        '• Vercel (États-Unis)',
        '• Hostinger (Lituanie)',
        'Ces transferts sont sécurisés via des clauses contractuelles (Standard Contractual Clauses) conformes au RGPD.'
      ]
    },
    {
      id: 'rgpd-specifique',
      title: '12. Droits spécifiques RGPD',
      content: [
        'Responsable de traitement :',
        'Dev4Ecom — Lausanne, Suisse',
        'contact@dev4com.com',
        'Délégué à la Protection des Données (DPD) :',
        'Vous pouvez nous contacter pour toute question relative à la protection de vos données.',
        'Droit de réclamation :',
        'Vous avez le droit de déposer une plainte auprès du Préposé fédéral à la protection des données et à la transparence (PFPDT).'
      ]
    },
    {
      id: 'modifications',
      title: '13. Modifications de la politique',
      content: [
        'Nous pouvons modifier cette politique à tout moment. Les modifications prendront effet dès leur publication.',
        'Nous vous informerons de tout changement significatif via email ou notification sur le site.'
      ]
    },
    {
      id: 'contact-donnees',
      title: '14. Nous contacter',
      content: [
        'Pour toute question ou demande concernant vos données personnelles :',
        'Email : contact@dev4com.com',
        'Localisation : Lausanne, Suisse',
        'Délai de réponse : 30 jours'
      ]
    }
  ];

  return (
    <main className="tech-pattern-bg min-h-screen text-white">
      <Header />

      <motion.div
        className="min-h-screen pt-24 pb-16 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto max-w-4xl">
          {/* En-tête */}
          <motion.div variants={itemVariants} className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Politique de Confidentialité</h1>
            <p className="text-gray-400 text-lg">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </motion.div>

          {/* Table des matières */}
          <motion.div
            variants={itemVariants}
            className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-12"
          >
            <h2 className="text-xl font-bold mb-4">Table des matières</h2>
            <ul className="space-y-2 text-gray-400">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contenu des sections */}
          <div className="space-y-8">
            {sections.map((section) => (
              <motion.section
                key={section.id}
                id={section.id}
                variants={itemVariants}
                className="bg-black/40 backdrop-blur-md rounded-xl p-8 border border-white/10"
              >
                <h2 className="text-2xl font-bold mb-6 text-blue-400">{section.title}</h2>

                <div className="space-y-4">
                  {section.content.map((item, idx) => (
                    <p key={idx} className="text-gray-300 leading-relaxed">
                      {linkifyEmail(item)}
                    </p>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Pied de page */}
          <motion.div
            variants={itemVariants}
            className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400"
          >
            <p className="mb-4">
              © 2025 Dev4Ecom. Tous droits réservés.
            </p>
            <p className="text-sm">
              Cette politique est conforme au RGPD (Règlement Général sur la Protection des Données).
            </p>
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </main>
  );
}
