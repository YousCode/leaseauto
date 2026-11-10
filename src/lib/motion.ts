/**
 * Réglages framer-motion partagés (apparitions simples).
 * Les scènes pilotées par le scroll passent par GSAP : voir src/lib/gsap.ts.
 */
import type { Transition, Variants } from "framer-motion";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const DURATION = 0.6;
export const DISTANCE = 24;

export const baseTransition: Transition = { duration: DURATION, ease: EASE };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: DISTANCE },
  visible: { opacity: 1, y: 0, transition: baseTransition },
};

export const viewportOnce = { once: true, amount: 0.2 } as const;

/** Décalage d'apparition pour une liste (cartes, étapes…) */
export const stagger = (index: number, step = 0.07, max = 0.35) => Math.min(index * step, max);
