import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { EASE, stagger } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";

type Stat = {
  /** Valeur finale, lue telle quelle par les lecteurs d'écran */
  label: string;
  /** Valeur affichée pour une progression p (0 → 1) */
  format: (p: number) => string;
  prefix?: string;
  suffix?: string;
  caption: string;
};

const NNBSP = " ";
const thousands = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);
const range = (from: number, to: number) => (p: number) => `${Math.round(from * p)}–${Math.round(to * p)}`;

// Uniquement des affirmations déjà présentes sur le site.
const STATS: Stat[] = [
  {
    label: "Plus de 1 200",
    prefix: "+",
    format: (p) => thousands(Math.round(1200 * p)),
    caption: "contrats sécurisés",
  },
  {
    label: "4,9 sur 5",
    format: (p) => (4.9 * p).toFixed(1).replace(".", ","),
    suffix: "/5",
    caption: "moyenne des avis Google",
  },
  {
    label: "24 à 48 heures",
    format: range(24, 48),
    suffix: "h",
    caption: "réponse après dossier complet",
  },
  {
    label: "12 à 84 mois",
    format: range(12, 84),
    suffix: "mois",
    caption: "durée en LOA",
  },
];

function Counter({ stat, start, delay }: { stat: Stat; start: boolean; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = stat.format(1);
      return;
    }
    if (!start) return;
    const controls = animate(0, 1, {
      duration: 1.8,
      delay,
      ease: EASE,
      onUpdate: (p) => {
        node.textContent = stat.format(p);
      },
    });
    return () => controls.stop();
  }, [start, reduce, stat, delay]);

  return (
    <span ref={ref} aria-hidden>
      {stat.format(reduce ? 1 : 0)}
    </span>
  );
}

/** Bandeau de preuves chiffrées (accueil) : 4 grands chiffres, compteur joué une seule fois. */
export function StatsSection() {
  const listRef = useRef<HTMLDListElement>(null);
  const inView = useInView(listRef, { once: true, amount: 0.35 });

  return (
    <section aria-labelledby="stats-title" className="bg-paper">
      <div className="grain relative overflow-hidden rounded-[36px] bg-night text-white md:rounded-[48px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-56 h-[460px] w-[460px] rounded-full bg-brand-ink/50 blur-[130px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-64 right-0 h-[420px] w-[420px] rounded-full bg-brand-primary/20 blur-[140px]"
        />

        <div className="container-x relative z-10 py-20 md:py-28">
          <Reveal>
            <h2 id="stats-title" className="eyebrow eyebrow-dark">
              Lease Auto en chiffres
            </h2>
          </Reveal>

          <dl
            ref={listRef}
            className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-14 md:gap-x-6 lg:grid-cols-4 lg:gap-x-0 lg:gap-y-0"
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.caption}
                className="flex flex-col-reverse justify-end border-t border-white/15 pt-6 lg:border-l lg:border-t-0 lg:px-6 lg:pt-0 xl:px-8 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
              >
                <dt className="mt-4 max-w-[16rem] text-sm leading-relaxed text-white/65 md:text-base">{stat.caption}</dt>
                <dd className="flex items-baseline whitespace-nowrap font-display font-extrabold">
                  <span className="sr-only">{stat.label}</span>
                  {stat.prefix ? (
                    <span aria-hidden className="mr-1 self-start text-2xl text-brand-primary-bright md:text-4xl">
                      {stat.prefix}
                    </span>
                  ) : null}
                  <span className="display-xl num text-[clamp(2rem,10vw,2.6rem)] md:text-[clamp(3.25rem,7.2vw,4.75rem)] lg:text-[clamp(2.75rem,4.9vw,4.5rem)]">
                    <Counter stat={stat} start={inView} delay={stagger(i, 0.12, 0.4)} />
                  </span>
                  {stat.suffix ? (
                    <span aria-hidden className="ml-1 text-sm text-white/50 md:ml-1.5 md:text-2xl lg:text-lg xl:text-2xl">
                      {stat.suffix}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
