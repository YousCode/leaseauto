// src/components/sections/FooterSection.tsx

import { ArrowUpRight, Clock, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const logoWhite = `${import.meta.env.BASE_URL}logo-lease-auto-white.png`;

const navItems = [
  { label: "Catalogue", href: "/vehicules" },
  { label: "Financement", href: "/financement" },
  { label: "Déposer un dossier", href: "/dossier" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = [
  { label: "LOA / LLD", href: "/financement" },
  { label: "Reprise / Estimation", href: "/contact" },
  { label: "Accompagnement pro", href: "/services" },
];

const legalLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
  { label: "Conditions générales", href: "/conditions-generales" },
  { label: "Cookies", href: "/cookies" },
];

const columnTitle = "font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50";
const columnLink =
  "inline-flex min-h-[32px] items-center text-[15px] text-white/70 transition-colors duration-300 hover:text-white";
const socialLink =
  "grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors duration-300 hover:border-white hover:bg-white hover:text-night";

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className={columnTitle}>{title}</h2>
      <ul className="mt-5 space-y-1.5">
        {links.map((item) => (
          <li key={item.label}>
            <Link to={item.href} className={columnLink}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="grain relative overflow-hidden bg-night text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-72 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand-ink/40 blur-[150px]"
      />

      <div className="container-x relative z-10 pt-20 md:pt-28">
        <div className="grid gap-x-8 gap-y-14 lg:grid-cols-12">
          {/* Marque + réseaux */}
          <div className="lg:col-span-3">
            <Link to="/" aria-label="Lease Auto, accueil" className="inline-flex">
              <img
                src={logoWhite}
                alt="Lease Auto"
                width={457}
                height={86}
                loading="lazy"
                decoding="async"
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-white/65">
              Votre partenaire de confiance pour la location de véhicules. Des solutions claires et flexibles, pensées
              pour votre budget.
            </p>

            <h2 className={`mt-10 ${columnTitle}`}>Suivez-nous</h2>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://www.instagram.com/lease_auto/"
                target="_blank"
                rel="noreferrer"
                aria-label="Lease Auto sur Instagram"
                className={socialLink}
              >
                <Instagram aria-hidden className="h-[18px] w-[18px]" />
              </a>
              <a
                href="https://www.tiktok.com/@leaseauto?_r=1&_t=ZN-91kVouJaR2U"
                target="_blank"
                rel="noreferrer"
                aria-label="Lease Auto sur TikTok"
                className={socialLink}
              >
                <span aria-hidden className="text-[11px] font-semibold tracking-wide">
                  Tik
                </span>
              </a>
            </div>
          </div>

          {/* Coordonnées + horaires */}
          <div className="lg:col-span-3">
            <h2 className={columnTitle}>Nous trouver</h2>
            <ul className="mt-5 space-y-4 text-[15px] text-white/70">
              <li className="flex items-start gap-3">
                <MapPin aria-hidden className="mt-1 h-4 w-4 shrink-0 text-brand-primary-bright" />
                <span>
                  Lease Auto, 42 Bd Foch
                  <br />
                  93800 Épinay-sur-Seine
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone aria-hidden className="h-4 w-4 shrink-0 text-brand-primary-bright" />
                <a href="tel:0184218393" className="num transition-colors duration-300 hover:text-white">
                  01&nbsp;84&nbsp;21&nbsp;83&nbsp;93
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail aria-hidden className="h-4 w-4 shrink-0 text-brand-primary-bright" />
                <a
                  href="mailto:leaseauto.epinay@gmail.com"
                  className="break-all transition-colors duration-300 hover:text-white"
                >
                  leaseauto.epinay@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock aria-hidden className="mt-1 h-4 w-4 shrink-0 text-brand-primary-bright" />
                <span>
                  Lundi – Samedi
                  <br />
                  <span className="num text-white/50">09:30 – 19:30</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Liens */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-[1fr_1fr_1.3fr] lg:col-span-6">
            <LinkColumn title="Navigation" links={navItems} />
            <LinkColumn title="Services" links={serviceLinks} />
            <div className="col-span-2 sm:col-span-1">
              <LinkColumn title="Informations légales" links={legalLinks} />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between md:mt-24">
          <p>© {currentYear} LeaseAuto. Tous droits réservés.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 font-medium text-white/70 transition-colors duration-300 hover:text-white"
          >
            Demander une offre
            <ArrowUpRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Mot-symbole géant : SVG calé sur la largeur, donc jamais de débordement horizontal. */}
      <div aria-hidden className="pointer-events-none relative z-10 select-none px-3 pb-3 pt-10 md:px-6 md:pb-5 md:pt-14">
        <svg
          viewBox="0 0 1196 138"
          focusable="false"
          className="block h-auto w-full font-display font-extrabold text-white/[0.06]"
        >
          <text x="-10" y="136" fontSize="200" textLength="1210" lengthAdjust="spacingAndGlyphs" fill="currentColor">
            LEASE AUTO
          </text>
        </svg>
      </div>
    </footer>
  );
};

export { FooterSection };
export default FooterSection;
