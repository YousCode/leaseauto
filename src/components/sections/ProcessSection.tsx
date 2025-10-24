"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Search, FileText, Car } from "lucide-react";

/* ---------- Étapes ---------- */
const STEPS = [
  {
    icon: Search,
    title: "Sélection",
    description:
      "Découvrez nos véhicules récents et premium, disponibles à la location ou à l’achat selon vos besoins.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: FileText,
    title: "Simulation",
    description:
      "Obtenez une estimation claire et personnalisée : financement, durée, apport et mensualités.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: CheckCircle2,
    title: "Validation",
    description:
      "Nos experts finalisent votre dossier et préparent tous les documents nécessaires pour une mise en main rapide.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Car,
    title: "Livraison",
    description:
      "Retrait à Épinay-sur-Seine ou livraison à domicile, clé en main.",
    color: "bg-orange-50 text-orange-600",
  },
];

/* ---------- Effet tilt léger ---------- */
function TiltCard({
  children,
  className = "",
  active,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [rx, setRx] = useState(0);
  const [ry, setRy] = useState(0);

  const move = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setRy((px - 0.5) * 8);
    setRx((0.5 - py) * 6);
  };

  const reset = () => {
    setRx(0);
    setRy(0);
  };

  return (
    <div
      ref={ref}
      role="button"
      aria-label={ariaLabel}
      onMouseMove={move}
      onMouseLeave={reset}
      onBlur={reset}
      className={`relative rounded-2xl border bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 
        ${active ? "border-gray-200 shadow-[0_20px_60px_-28px_rgba(0,0,0,0.25)]" : "border-gray-200 hover:shadow-lg"}
        ${className}
      `}
      style={{
        transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glow discret */}
      <span className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-[radial-gradient(600px_120px_at_50%_0%,rgba(0,0,0,0.05),transparent_70%)]" />
      {children}
    </div>
  );
}

/* ---------- Section principale ---------- */
export default function ProcessSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % STEPS.length);
    }, 3000);
    return () => clearInterval(id);
  }, [paused]);

  const fade = {
    enter: { opacity: 0, y: 12, scale: 0.98 },
    center: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -12, scale: 0.98 },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#f7f8fa] to-white py-24">
      {/* Halo doux */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/5 to-transparent" />

      <div
        className="mx-auto w-full max-w-5xl px-5"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-3 font-premium text-[34px] leading-tight text-gray-900 sm:text-4xl">
            Votre parcours, étape par étape
          </h2>
          <p className="mx-auto max-w-2xl font-inter text-[15px] text-gray-600 sm:text-base">
            Louer ou acheter — on s’occupe de tout, du premier échange à la
            remise des clés.
          </p>
        </motion.div>

        {/* Carte active */}
        <div className="mx-auto grid w-full max-w-[760px] place-items-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              variants={fade}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 0.1, 0.25, 1] }}
              className="w-full"
            >
              {(() => {
                const s = STEPS[current];
                const Icon = s.icon;
                return (
                  <TiltCard
                    active
                    ariaLabel={`Étape ${current + 1} sur ${STEPS.length} — ${s.title}`}
                  >
                    {/* En-tête */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`grid h-12 w-12 place-items-center rounded-xl ${s.color} shrink-0`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-premium text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                          Étape {current + 1} / {STEPS.length}
                        </div>
                        <h3 className="mt-0.5 text-[18px] font-semibold text-gray-900 sm:text-[19px]">
                          {s.title}
                        </h3>
                        <p className="mt-2 max-w-[60ch] font-inter text-[13.5px] leading-relaxed text-gray-600 sm:text-sm">
                          {s.description}
                        </p>
                      </div>
                    </div>
                  </TiltCard>
                );
              })()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicateurs (points) */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {STEPS.map((_, i) => (
            <button
              key={i}
              aria-label={`Aller à l’étape ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === current
                  ? "w-6 bg-[#E50914]"
                  : "w-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

       
      </div>
    </section>
  );
}