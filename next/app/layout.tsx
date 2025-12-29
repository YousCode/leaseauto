import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lease Auto',
  description: 'Plateforme de leasing premium - Public + Admin',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
