import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

type PageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Boutons, puces ou recherche sous le texte */
  children?: ReactNode;
  /** Bloc à droite (stats, visuel) sur desktop */
  aside?: ReactNode;
  align?: "left" | "center";
};

const enter = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay: 0.05 + i * 0.08 },
});

/**
 * En-tête des pages intérieures : bande « nuit » pleine largeur, coins bas arrondis.
 * Elle remonte sous le header flottant (marge négative = --header-offset).
 * Contient le <h1> de la page.
 */
export function PageHero({ eyebrow, title, subtitle, children, aside, align = "left" }: PageHeroProps) {
  const centered = align === "center";
  return (
    <section className="grain relative -mt-[var(--header-offset)] overflow-hidden rounded-b-[36px] bg-night text-white md:rounded-b-[48px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-ink/60 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-52 -left-32 h-[420px] w-[420px] rounded-full bg-brand-primary/25 blur-[130px]"
      />
      <div
        className={`container-x relative z-10 grid gap-10 pb-14 pt-36 md:pb-20 md:pt-44 ${
          aside ? "lg:grid-cols-[1.2fr_0.8fr] lg:items-end" : ""
        }`}
      >
        <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
          {eyebrow ? (
            <motion.p {...enter(0)} className="eyebrow eyebrow-dark">
              {eyebrow}
            </motion.p>
          ) : null}
          <motion.h1 {...enter(1)} className="display-lg mt-5">
            {title}
          </motion.h1>
          {subtitle ? (
            <motion.p {...enter(2)} className="mt-5 text-base leading-relaxed text-white/65 md:text-lg">
              {subtitle}
            </motion.p>
          ) : null}
          {children ? (
            <motion.div {...enter(3)} className={`mt-8 flex flex-wrap gap-3 ${centered ? "justify-center" : ""}`}>
              {children}
            </motion.div>
          ) : null}
        </div>
        {aside ? <motion.div {...enter(3)}>{aside}</motion.div> : null}
      </div>
    </section>
  );
}

export default PageHero;
