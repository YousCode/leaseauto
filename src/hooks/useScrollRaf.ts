import { useEffect } from "react";

/**
 * Custom hook to optimize scroll event handling using requestAnimationFrame
 * Prevents excessive scroll event firing for better performance
 */
export const useScrollRaf = (callback: (scrollY: number) => void) => {
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          callback(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [callback]);
};
