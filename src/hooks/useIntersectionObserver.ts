import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for Intersection Observer API
 * Optimized for triggering animations when elements are 15% visible
 */
export const useIntersectionObserver = (threshold = 0.15) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          // Disconnect after first intersection for performance
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: "50px", // Start loading 50px before element enters viewport
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isIntersecting };
};
