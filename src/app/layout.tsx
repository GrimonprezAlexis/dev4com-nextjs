import { AuthProvider } from '@/contexts/AuthContext';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DEV4COM - Agence de Développement Web & Solutions Digitales',
  description: 'Votre partenaire expert en développement web, création de sites internet et solutions digitales sur mesure.',
  keywords: ['dev4com', 'développement web', 'agence web', 'création site internet', 'solutions digitales'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}