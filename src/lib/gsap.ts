/**
 * Point d'entrée unique pour GSAP : plugins enregistrés une seule fois.
 * Toujours importer gsap / ScrollTrigger / useGSAP depuis ce fichier.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
gsap.defaults({ ease: "power3.out", duration: 0.8 });

/** Media queries partagées pour gsap.matchMedia() */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023px)",
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(MQ.reduce).matches;

export { gsap, ScrollTrigger, useGSAP };
