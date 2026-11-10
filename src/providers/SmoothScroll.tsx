import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Défilement inertiel (Lenis) synchronisé avec GSAP ScrollTrigger.
 * Tactile et « réduire les animations » : défilement natif, ScrollTrigger suit quand même.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}

export default SmoothScroll;
