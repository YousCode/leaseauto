// src/components/home/HeroSection.tsx
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";

// 3 vraies photos de voitures (Pexels), ambiance sombre / premium
const HERO_IMAGES = [
  "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=1920",
];

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
    transformPageOnResize: true,
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -18]);
  const textOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  const goPrev = () =>
    setActiveIndex((prev) =>
      prev === 0 ? HERO_IMAGES.length - 1 : prev - 1
    );

  const goNext = () =>
    setActiveIndex((prev) =>
      prev === HERO_IMAGES.length - 1 ? 0 : prev + 1
    );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] lg:min-h-[88vh] overflow-hidden"
    >
      {/* Carrousel d’images plein écran, très épuré */}
      <motion.div
        className="absolute inset-0 flex"
        style={{ y: bgY, x: `-${activeIndex * 100}%` }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {HERO_IMAGES.map((src) => (
          <img
            key={src}
            src={src}
            alt="Voiture premium"
            className="h-full w-full flex-shrink-0 object-cover"
            loading="eager"
          />
        ))}
      </motion.div>

      {/* Overlays pour lecture du texte */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45" />

      {/* Contenu texte */}
      <motion.div
        className="relative container mx-auto px-4 lg:px-8 py-16 lg:py-24 flex flex-col justify-center min-h-[80vh]"
        style={{ y: textY, opacity: textOpacity }}
      >
        <div className="max-w-2xl space-y-6">
          <h1 className="font-heading text-3xl md:text-5xl lg:text-[3.4rem] font-semibold text-white leading-tight">
            Une offre claire, sans surprise, adaptée à votre budget.
          </h1>

          <p className="text-slate-100/85 text-sm md:text-base leading-relaxed">
            Vous définissez le type de véhicule, la durée et le loyer. Nous
            sécurisons le contrat, gérons les formalités et vous accompagnons
            pendant toute la durée de la location.
          </p>

          <p className="text-sm md:text-[15px] text-slate-100/90">
            Leasing simple, contrat sécurisé, service premium.
          </p>

          {/* CTA minimalistes */}
          <div className="flex flex-wrap items-center gap-4">
            <Button
              asChild
              className="bg-brand-red hover:bg-brand-red/90 text-white rounded-full px-9 h-11 md:h-12 shadow-[0_18px_45px_rgba(220,38,38,0.45)] transition-transform hover:-translate-y-0.5"
            >
              <Link to="/vehicules">
                Voir toutes les offres
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="outline"
              className="rounded-full h-11 md:h-12 border-white/30 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm"
              asChild
            >
              <Link to="/contact">Parler à un conseiller</Link>
            </Button>
          </div>

          {/* Badges courts, style très clean */}
          <div className="flex flex-wrap gap-3 pt-1 text-xs md:text-sm text-slate-100/80">
            <BadgeIcon label="Contrats clairs" />
            <BadgeIcon label="Livraison rapide" />
            <BadgeIcon label="Suivi en ligne" />
          </div>
        </div>

        {/* Étapes simplifiées */}
        <div className="mt-10 grid gap-4 md:grid-cols-3 text-xs md:text-sm text-slate-100/90">
          <StepCard
            icon={<ClipboardList className="h-4 w-4" />}
            title="1. Choisir"
            text="Voiture, durée, budget."
          />
          <StepCard
            icon={<FileCheck className="h-4 w-4" />}
            title="2. Envoyer"
            text="Vos pièces, en ligne."
          />
          <StepCard
            icon={<PhoneCall className="h-4 w-4" />}
            title="3. Valider"
            text="On confirme et on livre."
          />
        </div>

        {/* Contrôles du carrousel, discrets */}
        <div className="absolute inset-x-0 bottom-10 flex items-center justify-between px-6 md:px-10 pointer-events-none">
          <button
            onClick={goPrev}
            className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/55 border border-white/15 text-white hover:bg-black/80 transition"
            aria-label="Image précédente"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="pointer-events-auto flex gap-2">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex ? "w-6 bg-white" : "w-2.5 bg-white/40"
                }`}
                aria-label={`Aller à l’image ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/55 border border-white/15 text-white hover:bg-black/80 transition"
            aria-label="Image suivante"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}

function StepCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-black/35 border border-white/10 px-4 py-3.5 backdrop-blur-sm">
      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-brand-red">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="font-medium text-slate-50">{title}</p>
        <p className="text-[11px] md:text-xs text-slate-200/90 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}

function BadgeIcon({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/25 px-3 py-1 shadow-sm backdrop-blur-sm">
      <CheckCircle2 className="h-3.5 w-3.5 text-brand-blue" />
      <span className="text-[11px] text-slate-50">{label}</span>
    </span>
  );
}

export default HeroSection;
