// src/components/sections/FooterSection.tsx

import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Catalogue", href: "/vehicules" },
  { label: "Financement", href: "/financement" },
  { label: "Assurances", href: "/assurances" },
  { label: "Contact", href: "/contact" },
  { label: "Dossier", href: "/dossier" },
];

const legalLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  {
    label: "Politique de confidentialité",
    href: "/politique-de-confidentialite",
  },
  { label: "Conditions générales", href: "/conditions-generales" },
  { label: "Cookies", href: "/cookies" },
  { label: "Plan du site", href: "/plan-du-site" },
];

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-24 text-slate-100">
      {/* Fond texturé plein écran */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#1f2937_0,transparent_55%),radial-gradient(circle_at_bottom,#020617_0,#020617_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='noStitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Contenu principal */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-6 pt-16 pb-10">
        {/* Bloc glass plein dans la largeur utile */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.7)] px-6 md:px-10 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Colonne 1 : marque + contact + horaires */}
            <div>
              <h3 className="text-2xl font-semibold mb-3">
                <span className="text-[#E52127]">Lease</span>
                <span className="text-slate-100">Auto</span>
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed mb-6 max-w-xs">
                Votre partenaire de confiance pour la location de véhicules.
                Des solutions claires et flexibles, pensées pour votre budget.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#E52127] mt-0.5" />
                  <span className="text-slate-200">
                    Lease Auto, 42 Bd Foch
                    <br />
                    93800 Épinay-sur-Seine
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#E52127]" />
                  <a
                    href="tel:0184218393"
                    className="text-slate-200 hover:text-white"
                  >
                    01&nbsp;84&nbsp;21&nbsp;83&nbsp;93
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#E52127]" />
                  <a
                    href="mailto:leaseauto.epinay@gmail.com"
                    className="text-slate-200 hover:text-white"
                  >
                    leaseauto.epinay@gmail.com
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-[#E52127] mt-0.5" />
                  <div>
                    <p className="text-slate-100">Lundi – Samedi</p>
                    <p className="text-slate-300 text-xs">09:30 – 19:30</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne 2 : navigation */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] mb-4 text-slate-200">
                Navigation
              </h4>
              <ul className="space-y-2 text-sm">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="text-slate-300 hover:text-[#E52127] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne 3 : formulaire contact */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] mb-4 text-slate-200">
                Nous contacter
              </h4>
              <form
                className="space-y-3 text-sm"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  placeholder="Nom"
                  className="w-full px-3 py-2 rounded-md bg-[#020618]/80 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#E52127]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 rounded-md bg-[#020618]/80 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#E52127]"
                />
                <textarea
                  rows={3}
                  placeholder="Message"
                  className="w-full px-3 py-2 rounded-md bg-[#020618]/80 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#E52127] resize-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#E52127] text-white font-medium py-2.5 text-sm hover:bg-[#c91c22] transition-colors"
                >
                  Envoyer
                </button>
              </form>
            </div>

            {/* Colonne 4 : réseaux + légal */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] mb-4 text-slate-200">
                Suivez-nous
              </h4>
              <div className="flex items-center gap-3 mb-6">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/lease_auto/"
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 rounded-full bg-[#020618]/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-[#E52127] hover:border-[#E52127] hover:text-white transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>

                {/* TikTok (texte simple comme icône, à remplacer par une vraie icône si tu en ajoutes une) */}
                <a
                  href="https://www.tiktok.com/@leaseauto?_r=1&_t=ZN-91kVouJaR2U"
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 rounded-full bg-[#020618]/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-[#E52127] hover:border-[#E52127] hover:text-white transition-colors"
                >
                  <span className="text-[11px] font-semibold tracking-wide">
                    Tik
                  </span>
                </a>
              </div>

              <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-[0.16em] mb-3">
                Informations légales
              </h5>
              <ul className="space-y-2 text-sm">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-slate-400 hover:text-slate-100 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="relative border-t border-[#0b1220]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-6 py-4">
          <p className="text-center text-xs text-slate-500">
            © {currentYear} LeaseAuto. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { FooterSection };
export default FooterSection;
