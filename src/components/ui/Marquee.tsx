import type { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  /** Durée d'un cycle complet, en secondes */
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
};

/** Bandeau défilant infini en CSS pur (contenu dupliqué, aria-hidden sur la copie). */
export function Marquee({ children, duration = 40, reverse = false, pauseOnHover = false, className = "" }: MarqueeProps) {
  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <div
        className="marquee-track"
        data-reverse={reverse}
        data-pause={pauseOnHover}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Marquee;
