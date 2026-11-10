import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Award, Car, CarFront, Check, Truck, Users, Zap } from "lucide-react";
import { stagger } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";

type Service = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  bullets: string[];
  image?: string;
};

const LEASING: Service = {
  icon: Car,
  title: "Leasing Longue Durée",
  description: "Solutions flexibles de 12 à 60 mois avec maintenance planifiée et coûts maîtrisés.",
  bullets: ["Maintenance préventive", "Suivi digitalisé", "Option assistance 24/7"],
};

const PRO: Service = {
  icon: Users,
  title: "Leasing Professionnel",
  description: "Fiscalité optimisée, coût total réduit et outils de gestion de flotte.",
  bullets: ["Avantages fiscaux", "Gestion de flotte", "Facturation simplifiée"],
};

const ELECTRIC: Service = {
  icon: Zap,
  title: "Véhicules Électriques",
  description: "Électriques et hybrides : autonomie adaptée et écosystème de recharge.",
  bullets: ["Bonus écologique", "Bornes de recharge", "Autonomie optimisée"],
};

const PREMIUM: Service = {
  icon: Award,
  title: "Véhicules Premium",
  description: "Sélection haut de gamme : finitions, équipements, accompagnement dédié.",
  bullets: ["Marques premium", "Équipements haut de gamme", "Service dédié"],
};

const UTILITY: Service = {
  icon: Truck,
  title: "Utilitaires Sur Mesure",
  description: "Fourgons, châssis cabine et transformations pour les pros exigeants.",
  bullets: ["Volumes adaptés à vos métiers", "Aménagements atelier ou frigorifique", "Disponibilité rapide"],
  image: "/images/services/utilitaires.webp",
};

const VTC: Service = {
  icon: CarFront,
  title: "Leasing VTC & Chauffeurs",
  description: "Berlines confort et hybrides pour vos prestations, en leasing longue durée.",
  bullets: ["Contrats dédiés VTC", "Toyota C-HR & hybrides", "Assistance chauffeur 24/7"],
  image: "/images/services/vtc.webp",
};

const cardBase =
  "surface group relative h-full transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-slate-300";

function ServiceBody({ s, large = false }: { s: Service; large?: boolean }) {
  const Icon = s.icon;
  return (
    <>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-primary-soft text-brand-primary">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className={`mt-6 font-display font-semibold text-night ${large ? "text-2xl md:text-[1.75rem] md:leading-tight" : "text-xl"}`}>
        {s.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-[15px]">{s.description}</p>
      <ul className="mt-5 space-y-2.5">
        {s.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-sm text-slate-700">
            <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      {/* Lien étiré : toute la carte est cliquable */}
      <Link
        to="/contact"
        aria-label={`Demander un devis : ${s.title}`}
        className="mt-auto inline-flex min-h-[44px] items-center gap-2 pt-6 text-sm font-semibold text-night after:absolute after:inset-0 after:rounded-[28px]"
      >
        Demander un devis
        <ArrowUpRight
          aria-hidden
          className="h-4 w-4 text-brand-primary transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </Link>
    </>
  );
}

function ServiceCard({ s }: { s: Service }) {
  return (
    <article className={`${cardBase} flex flex-col p-7 md:p-8`}>
      <ServiceBody s={s} />
    </article>
  );
}

function FeatureCard({ s, imageRight = false }: { s: Service; imageRight?: boolean }) {
  return (
    <article className={`${cardBase} grid gap-2 p-3 sm:grid-cols-2`}>
      <div
        className={`relative aspect-[16/11] overflow-hidden rounded-[20px] bg-slate-100 sm:aspect-auto sm:min-h-[380px] ${
          imageRight ? "sm:order-last" : ""
        }`}
      >
        <img
          src={s.image}
          alt={s.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-col p-4 sm:p-6 md:p-7">
        <ServiceBody s={s} large />
      </div>
    </article>
  );
}

/** Grille « bento » des services. Le titre de page (h1) est porté par le PageHero. */
export function ServicesSection() {
  return (
    <section id="services" aria-label="Nos services" className="bg-paper py-14 md:py-20">
      <div className="container-x">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-12">
          <Reveal className="md:col-span-2 lg:col-span-7">
            <FeatureCard s={UTILITY} />
          </Reveal>
          <Reveal delay={stagger(1)} className="lg:col-span-5">
            <ServiceCard s={LEASING} />
          </Reveal>

          <Reveal className="lg:col-span-4">
            <ServiceCard s={PRO} />
          </Reveal>
          <Reveal delay={stagger(1)} className="lg:col-span-4">
            <ServiceCard s={ELECTRIC} />
          </Reveal>
          <Reveal delay={stagger(2)} className="lg:col-span-4">
            <ServiceCard s={PREMIUM} />
          </Reveal>

          <Reveal className="md:col-span-2 lg:col-span-5">
            <aside className="surface-night grain relative flex h-full flex-col overflow-hidden p-8 md:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-brand-ink/70 blur-[90px]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-brand-primary/25 blur-[100px]"
              />
              <div className="relative z-10 flex h-full flex-col">
                <p className="eyebrow eyebrow-dark">Sur mesure</p>
                <h2 className="display-md mt-5">Besoin d’un service personnalisé ?</h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65 md:text-base">
                  Nos conseillers construisent une solution sur mesure pour vos usages et votre budget.
                </p>
                <div className="mt-auto flex flex-col gap-3 pt-10 sm:flex-row">
                  <Link to="/vehicules" className="btn btn-primary">
                    Voir les véhicules
                    <ArrowUpRight />
                  </Link>
                  <Link to="/contact" className="btn btn-ghost-dark">
                    Nous contacter
                  </Link>
                </div>
              </div>
            </aside>
          </Reveal>
          <Reveal delay={stagger(1)} className="md:col-span-2 lg:col-span-7">
            <FeatureCard s={VTC} imageRight />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
