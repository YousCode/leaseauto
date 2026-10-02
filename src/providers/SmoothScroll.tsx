import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenis";

/**
 * Défilement inertiel (Lenis) sur desktop. Sur tactile et quand l'utilisateur
 * demande moins d'animations, on reste sur le défilement natif.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    });
    setLenis(lenis);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}

export default SmoothScroll;
