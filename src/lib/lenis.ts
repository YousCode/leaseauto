import type Lenis from "lenis";

/** Instance Lenis partagée (null si le défilement natif est utilisé). */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

/** Remonte en haut de page, en respectant Lenis quand il est actif. */
export const scrollToTop = (immediate = true) => {
  if (instance) instance.scrollTo(0, { immediate });
  else window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
};
