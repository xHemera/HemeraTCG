import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hemera TCG - Expanded Gauntlet',
  description: 'Expanded Gauntlet - decks and guides for the Expanded format'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-base-900 text-white font-display selection:bg-accent-500/40 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
