import React from "react";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-12 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">DEV4COM</h3>
            <p className="text-gray-400 text-sm">
              Votre partenaire expert en développement web et solutions
              digitales sur mesure.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Développement Web
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  E-commerce
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  SEO
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Solutions Digitales
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Liens Utiles</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/projects"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Mentions Légales
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap.xml"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Plan du site
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>contact@dev4com.com</li>
              <li>+33 1 23 45 67 89</li>
              <li>Paris, France</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} DEV4COM. Tous droits réservés.
          </p>

          <div className="flex space-x-6">
            <motion.a
              href="https://twitter.com/dev4com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.2 }}
              aria-label="Suivez-nous sur Twitter"
            >
              <Twitter size={18} />
            </motion.a>
            <motion.a
              href="https://linkedin.com/company/dev4com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.2 }}
              aria-label="Suivez-nous sur LinkedIn"
            >
              <Linkedin size={18} />
            </motion.a>
            <motion.a
              href="/sitemap.xml"
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.2 }}
              aria-label="Accéder au plan du site"
            >
              <LinkIcon size={18} />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
