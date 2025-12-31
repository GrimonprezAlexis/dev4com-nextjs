import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-12 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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
                  Audit & Conseil
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Liens Utiles</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/sitemap.xml"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/mentions-legales"
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
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} DEV4COM. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
