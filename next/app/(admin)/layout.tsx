'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type NavItem = {
  label: string;
  href: string;
  badge?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Stock', href: '/admin/stock', badge: 'Live' },
  { label: 'Leads', href: '/admin/leads' },
  { label: 'Settings', href: '/admin/settings' },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">
        Lease Auto
        <span className="badge">Admin</span>
      </div>

      <div className="nav-section">
        <div className="nav-title">Pilotage</div>
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${active ? 'active' : ''}`}>
              <span>{item.label}</span>
              {item.badge ? <span className="pill">{item.badge}</span> : null}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="layout-shell">
      <Sidebar />
      <main className="main-area">
        <div className="topbar">
          <div>
            <div className="pill">Protected · role = admin</div>
            <h1 style={{ margin: '8px 0 0', fontSize: 24, fontWeight: 700 }}>Admin Panel</h1>
            <p style={{ color: '#94a3b8', marginTop: 4 }}>
              Contrôle complet du stock, des leads et de la config produit.
            </p>
          </div>
          <div className="pill">Session Supabase</div>
        </div>

        {children}
      </main>
    </div>
  );
}
