import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
};

/** Apparition standard : fondu + 24 px, une seule fois, quand l'élément entre à l'écran. */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const Tag = motion[as];
  return (
    <Tag
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
      className={className}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
