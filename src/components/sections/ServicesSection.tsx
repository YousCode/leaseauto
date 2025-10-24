// src/components/sections/ServicesSection.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Car, Users, Truck, CarFront, Zap, Award, ArrowRight, Check } from "lucide-react";

/**
 * ServicesSection — version simple, marquante + VFX 3D
 * - Cards 3D (tilt + parallax image + glare)
 * - Design clean (fond blanc), images 16/9 stables
 * - CTA rouge unique, bullets avec check
 * - Export: named + default
 */

type Service = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  image: string;
  bullets: string[];
  to: string;
};

const SERVICES: Service[] = [
  {
    icon: Car,
    title: "Leasing Longue Durée",
    description: "Solutions flexibles de 12 à 60 mois avec maintenance planifiée et coûts maîtrisés.",
    image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1600",
    bullets: ["Maintenance préventive", "Suivi digitalisé", "Option assistance 24/7"],
    to: "/services/leasing-longue-duree",
  },
  {
    icon: Users,
    title: "Leasing Professionnel",
    description: "Fiscalité optimisée, TCO réduit et outils de gestion de flotte.",
    image: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1600",
    bullets: ["Avantages fiscaux", "Gestion de flotte", "Facturation simplifiée"],
    to: "/services/leasing-professionnel",
  },
  {
    icon: Zap,
    title: "Véhicules Électriques",
    description: "EV & hybrides: autonomie optimisée et écosystème de recharge.",
    image: "https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=1600",
    bullets: ["Bonus écologique", "Bornes de recharge", "Autonomie optimisée"],
    to: "/services/vehicules-electriques",
  },
  {
    icon: Award,
    title: "Véhicules Premium",
    description: "Sélection haut de gamme: finitions, équipements, service VIP.",
    image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1600",
    bullets: ["Marques premium", "Équipements haut de gamme", "Service VIP"],
    to: "/services/vehicules-premium",
  },
  {
    icon: Truck,
    title: "Utilitaires Sur Mesure",
    description: "Fourgons, châssis cabine et transformations pour les pros exigeants.",
    image: "/images/services/utlitaires.png",
    bullets: ["Volumes adaptés à vos métiers", "Aménagements atelier ou frigorifique", "Disponibilité rapide"],
    to: "/services/utilitaires",
  },
  {
    icon: CarFront,
    title: "Leasing VTC & Chauffeurs",
    description: "Berlines confort et hybrides pour vos prestations haut de gamme en leasing longue durée.",
    image:  "/images/services/vtc.png",
    bullets: ["Contrats de leasing dédiés VTC", "Toyota C-HR & hybrides premium", "Assistance chauffeur 24/7"],
    to: "/services/leasing-vtc",
  },
];

/* ----------------------------- VFX (helpers) ----------------------------- */
function useCardVFX() {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const dx = px / rect.width - 0.5; // -0.5..0.5
    const dy = py / rect.height - 0.5;

    const rx = (-dy * 8).toFixed(2);  // rotateX
    const ry = (dx * 12).toFixed(2);  // rotateY
    const tx = (dx * 10).toFixed(2);  // translateX
    const ty = (dy * 10).toFixed(2);  // translateY

    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--tx", `${tx}px`);
    el.style.setProperty("--ty", `${ty}px`);
    el.style.setProperty("--px", `${px}px`);
    el.style.setProperty("--py", `${py}px`);
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--tx", `0px`);
    el.style.setProperty("--ty", `0px`);
  };

  return { ref, onMouseMove, onMouseLeave };
}

/* --------------------------- Card (unique name) -------------------------- */
function ServiceCardVFX({ s }: { s: Service }) {
  const Icon = s.icon;
  const vfx = useCardVFX();

  return (
    <article
      ref={vfx.ref}
      onMouseMove={vfx.onMouseMove}
      onMouseLeave={vfx.onMouseLeave}
      className="group relative overflow-hidden surface-card transition-transform duration-300 hover:-translate-y-2"
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      aria-label={s.title}
    >
      {/* Media */}
      <div className="relative aspect-[16/9] w-full overflow-hidden" style={{ transform: "translateZ(20px)" }}>
        <img
          src={s.image}
          alt={s.title}
          loading="lazy"
          sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="h-full w-full object-cover transition-transform duration-700"
          style={{ transform: "translate(calc(var(--tx,0px)*-1), calc(var(--ty,0px)*-1)) scale(1.06)" }}
        />
        {/* glare dynamique */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px circle at var(--px,50%) var(--py,50%), rgba(255,255,255,0.22), transparent 40%)",
            mixBlendMode: "screen",
          }}
        />
        {/* vignette subtile */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {/* badge icône */}
        <div
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#E50914] text-white shadow-lg"
          style={{ transform: "translateZ(40px)" }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-7" style={{ transform: "translateZ(10px)" }}>
        <h3 className="brand-title text-[20px] text-gray-900">{s.title}</h3>
        <p className="brand-subtitle mt-3 text-sm text-gray-600">{s.description}</p>

        <ul className="mt-4 space-y-2">
          {s.bullets.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-gray-700">
              <Check className="h-4 w-4 text-[#E50914]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Link
            to={s.to}
            className="brand-button flex w-full justify-center"
            style={{ transform: "translateZ(8px)" }}
          >
            En savoir plus <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* sheen border au hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div
          className="absolute -inset-[1px] rounded-2xl"
          style={{
            background:
              "conic-gradient(from 140deg at 50% 50%, rgba(239,68,68,.45), rgba(248,113,113,.25), transparent 60%)",
            WebkitMask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
            WebkitMaskComposite: "xor" as any,
            padding: 1,
          }}
        />
      </div>
    </article>
  );
}

/* ----------------------------- Section wrapper ---------------------------- */
export function ServicesSection() {
  return (
    <section
      id="services"
      className="section-shell bg-gradient-to-b from-white via-[#f5f7fb] to-white text-gray-900"
    >
      <div className="section-container">
        {/* header */}
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <span className="brand-eyebrow">Services signature</span>
          <h2 className="brand-title mt-6 text-4xl md:text-5xl">
            Une gamme complète de <span className="text-[#E50914]">services</span>
          </h2>
          <p className="brand-subtitle mt-4 text-lg">
            Performance, maîtrise du coût total de possession, confort — sans compromis.
          </p>
        </header>

        {/* grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((item) => (
            <ServiceCardVFX key={item.title} s={item} />
          ))}
        </div>

        {/* bottom CTA */}
        <div className="surface-card mt-16 p-8 text-center sm:p-10">
          <h3 className="brand-title text-2xl text-gray-900">
            Besoin d’un service personnalisé ?
          </h3>
          <p className="brand-subtitle mx-auto mt-3 max-w-2xl">
            Nos experts construisent une solution sur mesure pour vos usages et votre budget.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/services" className="brand-button">
              VOIR TOUS LES SERVICES <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="brand-button-neutral gap-2"
            >
              NOUS CONTACTER
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
