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

export default function MentionsLegales() {
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
      id: 'editeur',
      title: '1. Éditeur du site',
      content: [
        { label: 'Nom commercial', value: 'Dev4Ecom' },
        { label: 'Localisation', value: 'Lausanne, Suisse' },
        { label: 'Email', value: 'contact@dev4com.com' }
      ]
    },
    {
      id: 'hebergeurs',
      title: '2. Hébergeurs du site',
      content: [
        {
          label: 'Hébergeur principal (application)',
          value: 'Vercel Inc.',
          details: '440 N Barranca Ave, Covina, CA 91723, USA | www.vercel.com'
        },
        {
          label: 'Hébergeur emails & DNS',
          value: 'Hostinger International Ltd.',
          details: 'Švitrigailos g. 34, Vilnius, Lithuania | www.hostinger.com'
        }
      ]
    },
    {
      id: 'propriete-intellectuelle',
      title: '3. Propriété intellectuelle',
      content: [
        'Tous les contenus présents sur le site Dev4Ecom (textes, images, vidéos, logos, designs) sont la propriété exclusive de Dev4Ecom ou sont utilisés avec autorisation. Toute reproduction, distribution, modification ou utilisation non autorisée est interdite.',
        'Les marques, logos et noms cités sur le site sont propriété de leurs détenteurs respectifs.'
      ]
    },
    {
      id: 'responsabilite',
      title: '4. Responsabilité',
      content: [
        'Dev4Ecom s\'efforce de mettre à jour régulièrement les informations présentes sur le site. Cependant, Dev4Ecom ne peut garantir l\'exactitude, l\'exhaustivité ou l\'actualité de ces informations.',
        'Dev4Ecom décline toute responsabilité quant aux dommages directs ou indirects résultant de l\'utilisation du site, notamment la perte de données, la perte de revenus ou les préjudices commerciaux.',
        'Dev4Ecom ne peut être tenu responsable des contenus ou services accessibles via des liens externes présents sur le site.'
      ]
    },
    {
      id: 'donnees-personnelles',
      title: '5. Données personnelles & RGPD',
      content: [
        'Dev4Ecom collecte et traite certaines données personnelles pour vous fournir ses services et améliorer votre expérience utilisateur.',
        'Données collectées : Nom, email, messages de chat, adresse IP, cookies.',
        'Finalités : Traitement des demandes de contact, amélioration du service, analytics.',
        'Durée de conservation : Les données sont conservées tant que nécessaire pour les finalités indiquées, puis supprimées.',
        'Droits : Vous avez le droit d\'accès, de rectification, d\'opposition et de suppression de vos données en écrivant à contact@dev4com.com.',
        'Sous-traitants : Vercel (hébergement), Hostinger (email), Firebase (authentification).',
        'Politique complète : Consultez notre Politique de Confidentialité pour plus de détails.'
      ]
    },
    {
      id: 'cookies',
      title: '6. Cookies et technologies de suivi',
      content: [
        'Le site utilise des cookies pour améliorer votre expérience de navigation et mesurer l\'utilisation du site.',
        'Types de cookies : Cookies de session, cookies analytics (Google Analytics), cookies de préférences.',
        'Consentement : En continuant à naviguer sur le site, vous consentez à l\'utilisation de cookies. Vous pouvez configurer votre navigateur pour refuser les cookies.',
        'Gestion : Les cookies peuvent être supprimés à tout moment via les paramètres de votre navigateur.'
      ]
    },
    {
      id: 'chatbot',
      title: '7. Assistant (Chatbot)',
      content: [
        'Dev4Ecom utilise un assistant automatisé (chatbot) pour faciliter la navigation et répondre aux questions fréquentes.',
        'L\'assistant fonctionne entièrement côté client et ne transmet aucune donnée à des services tiers.',
        'Limitation : L\'assistant fournit des informations à titre indicatif. Pour toute demande précise, veuillez nous contacter directement par email à contact@dev4com.com.'
      ]
    },
    {
      id: 'conditions-utilisation',
      title: '8. Conditions d\'utilisation',
      content: [
        'Interdictions : L\'utilisateur s\'engage à ne pas utiliser le site pour :',
        '• Violer les droits d\'autrui (propriété intellectuelle, données personnelles, etc.)',
        '• Diffuser des contenus illégaux, diffamatoires ou offensants',
        '• Constituer une nuisance ou déranger les autres utilisateurs',
        '• Accéder au site de manière non autorisée ou contourner les mesures de sécurité',
        '• Utiliser des bots, scrapers ou autres outils automatisés sans autorisation',
        'Suspension d\'accès : Dev4Ecom se réserve le droit de suspendre ou fermer l\'accès en cas de violation de ces conditions.'
      ]
    },
    {
      id: 'liens-externes',
      title: '9. Liens externes',
      content: [
        'Le site peut contenir des liens vers des sites tiers. Dev4Ecom ne contrôle pas ces sites et décline toute responsabilité quant à leur contenu, leur sécurité ou leurs pratiques.',
        'Veuillez consulter les mentions légales de ces sites tiers avant d\'utiliser leurs services.'
      ]
    },
    {
      id: 'modification',
      title: '10. Modification des Mentions Légales',
      content: [
        'Dev4Ecom se réserve le droit de modifier ces Mentions Légales à tout moment. Les modifications prendront effet dès leur publication sur le site.',
        'En continuant à utiliser le site après une modification, vous acceptez les nouvelles conditions.'
      ]
    },
    {
      id: 'droit-applicable',
      title: '11. Droit applicable et litiges',
      content: [
        'Ces Mentions Légales sont soumises au droit suisse et à la juridiction des tribunaux du Canton de Vaud.',
        'En cas de litige, vous avez la possibilité de contacter Dev4Ecom pour trouver une résolution à l\'amiable.',
        'Pour les réclamations relatives à la protection des données, vous pouvez contacter le Préposé fédéral à la protection des données et à la transparence (PFPDT).'
      ]
    },
    {
      id: 'contact',
      title: '12. Contact',
      content: [
        'Pour toute question ou réclamation concernant ces Mentions Légales, veuillez nous contacter :',
        'Email : contact@dev4com.com',
        'Localisation : Lausanne, Suisse'
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Mentions Légales</h1>
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
                  {Array.isArray(section.content) ? (
                    section.content.map((item, idx) => {
                      if (typeof item === 'string') {
                        return (
                          <p key={idx} className="text-gray-300 leading-relaxed">
                            {linkifyEmail(item)}
                          </p>
                        );
                      } else if (typeof item === 'object' && 'label' in item && 'value' in item) {
                        return (
                          <div key={idx} className="border-l-2 border-blue-400 pl-4">
                            <p className="font-semibold text-white">{item.label}</p>
                            <p className="text-gray-300">{typeof item.value === 'string' ? linkifyEmail(item.value) : item.value}</p>
                            {'details' in item && item.details && (
                              <p className="text-gray-400 text-sm mt-1">{item.details}</p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    })
                  ) : null}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Pied de page légal */}
          <motion.div
            variants={itemVariants}
            className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400"
          >
            <p className="mb-4">
              © 2025 Dev4Ecom. Tous droits réservés.
            </p>
            <p className="text-sm">
              Cette page est conforme à la LCEN (Loi pour la Confiance dans l'Économie Numérique) et au RGPD.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </main>
  );
}
