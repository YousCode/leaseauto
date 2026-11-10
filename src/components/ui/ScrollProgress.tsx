import { motion, useScroll, useSpring } from "framer-motion";

/** Fine barre de progression de lecture, collée en haut de la fenêtre. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-brand-primary-bright"
    />
  );
}

export default ScrollProgress;
