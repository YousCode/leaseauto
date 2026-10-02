/**
 * Réglages d'animation partagés : une seule courbe, une seule durée,
 * un seul déplacement. Tout composant animé importe d'ici.
 */
import type { Transition, Variants } from "framer-motion";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const DURATION = 0.45;
export const DISTANCE = 16;

export const baseTransition: Transition = { duration: DURATION, ease: EASE };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: DISTANCE },
  visible: { opacity: 1, y: 0, transition: baseTransition },
};

export const viewportOnce = { once: true, amount: 0.2 } as const;

/** Décalage d'apparition pour une liste (cartes, étapes…) */
export const stagger = (index: number, step = 0.07, max = 0.35) => Math.min(index * step, max);
