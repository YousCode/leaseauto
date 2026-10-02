import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Users, Truck, CarFront, Zap, Award, ArrowRight, Check } from "lucide-react";
import { fadeUp, viewportOnce, stagger } from "@/lib/motion";

type Service = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  bullets: string[];
  image?: string;
};

const SERVICES: Service[] = [
  {
    icon: Car,
    title: "Leasing Longue Durée",
    description: "Solutions flexibles de 12 à 60 mois avec maintenance planifiée et coûts maîtrisés.",
    bullets: ["Maintenance préventive", "Suivi digitalisé", "Option assistance 24/7"],
  },
  {
    icon: Users,
    title: "Leasing Professionnel",
    description: "Fiscalité optimisée, coût total réduit et outils de gestion de flotte.",
    bullets: ["Avantages fiscaux", "Gestion de flotte", "Facturation simplifiée"],
  },
  {
    icon: Zap,
    title: "Véhicules Électriques",
    description: "Électriques et hybrides : autonomie adaptée et écosystème de recharge.",
    bullets: ["Bonus écologique", "Bornes de recharge", "Autonomie optimisée"],
  },
  {
    icon: Award,
    title: "Véhicules Premium",
    description: "Sélection haut de gamme : finitions, équipements, accompagnement dédié.",
    bullets: ["Marques premium", "Équipements haut de gamme", "Service dédié"],
  },
  {
    icon: Truck,
    title: "Utilitaires Sur Mesure",
    description: "Fourgons, châssis cabine et transformations pour les pros exigeants.",
    bullets: ["Volumes adaptés à vos métiers", "Aménagements atelier ou frigorifique", "Disponibilité rapide"],
    image: "/images/services/utilitaires.webp",
  },
  {
    icon: CarFront,
    title: "Leasing VTC & Chauffeurs",
    description: "Berlines confort et hybrides pour vos prestations, en leasing longue durée.",
    bullets: ["Contrats dédiés VTC", "Toyota C-HR & hybrides", "Assistance chauffeur 24/7"],
    image: "/images/services/vtc.webp",
  },
];

function ServiceCard({ s, index }: { s: Service; index: number }) {
  const Icon = s.icon;
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay: stagger(index) }}
      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {s.image ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
          <img src={s.image} alt={s.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-brand-primary-soft text-brand-primary">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.description}</p>
        <ul className="mt-4 space-y-2">
          {s.bullets.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="h-4 w-4 shrink-0 text-brand-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/contact"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition-[gap] hover:gap-3"
        >
          Demander un devis <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="bg-brand-light py-20 md:py-24 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
        <motion.header
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-400">Nos services</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-brand-ink md:text-4xl">
            Une gamme complète de services
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 md:text-base">
            Particuliers, VTC, artisans et sociétés : une solution par usage, un seul interlocuteur.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((item, i) => (
            <ServiceCard key={item.title} s={item} index={i} />
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-14 flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-8 text-center sm:p-10 lg:flex-row lg:text-left"
        >
          <div>
            <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">Besoin d’un service personnalisé ?</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Nos conseillers construisent une solution sur mesure pour vos usages et votre budget.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/vehicules"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-dark"
            >
              Voir les véhicules <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
            >
              Nous contacter
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ServicesSection;
