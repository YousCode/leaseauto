import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVehicles } from "@/hooks/useVehicles";
import { EASE } from "@/lib/motion";

/** Visuels du site (véhicules floqués Lease Auto), servis en WebP depuis /public */
const HERO_IMAGES = [
  { src: "/images/hero/hero-vtc.webp", alt: "Berlines Lease Auto devant La Défense" },
  { src: "/images/hero/hero-utilitaires.webp", alt: "Gamme d’utilitaires Lease Auto" },
];
const SLIDE_MS = 8000;
const MIN_BRANDS_FOR_MARQUEE = 3;

const enter = (i: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay: 0.15 + i * 0.09 },
});

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { data: vehicles = [] } = useVehicles("published");

  useEffect(() => {
    if (HERO_IMAGES.length < 2) return;
    const timer = setInterval(() => setActiveIndex((i) => (i + 1) % HERO_IMAGES.length), SLIDE_MS);
    return () => clearInterval(timer);
  }, []);

  const brands = useMemo(() => {
    const names = new Set<string>();
    (vehicles as any[]).forEach((v) => {
      const b = typeof v.brand === "string" ? v.brand.trim() : "";
      if (b) names.add(b);
    });
    const list = [...names];
    return list.length >= MIN_BRANDS_FOR_MARQUEE ? [...list, ...list, ...list] : [];
  }, [vehicles]);

  const normalizedQuery = query.trim().toLowerCase();
  const suggestions = useMemo(() => {
    if (!normalizedQuery) return [];
    return (vehicles as any[])
      .filter((v) => {
        const brand = (v.brand || "").toLowerCase();
        const model = (v.model || v.title || "").toLowerCase();
        return brand.includes(normalizedQuery) || model.includes(normalizedQuery);
      })
      .slice(0, 5);
  }, [vehicles, normalizedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalizedQuery) return;
    navigate(`/vehicules?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelect = (slug?: string | null) => {
    if (slug) navigate(`/vehicules/${slug}`);
  };

  return (
    <section className="relative w-full min-h-[85vh] md:h-screen overflow-hidden bg-brand-ink-deep text-white">
      {/* Fond : crossfade lent entre les visuels du site */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.img
            key={HERO_IMAGES[activeIndex].src}
            src={HERO_IMAGES[activeIndex].src}
            alt={HERO_IMAGES[activeIndex].alt}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="absolute inset-0 h-full w-full object-cover"
            loading={activeIndex === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink-deep/95 via-brand-ink-deep/40 to-brand-ink-deep/30" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-10 text-center">
        <motion.h1
          {...enter(0)}
          className="mb-6 max-w-5xl text-4xl font-extrabold uppercase leading-none tracking-tight drop-shadow-xl md:text-6xl lg:text-7xl"
        >
          Une offre claire.<br className="hidden md:block" /> Sans surprise.
        </motion.h1>

        <motion.p {...enter(1)} className="mb-2 max-w-3xl text-lg font-medium text-white/90 md:text-xl">
          Vous définissez le véhicule, la durée et le budget. Nous gérons le reste.
        </motion.p>

        <motion.p {...enter(2)} className="mb-10 max-w-2xl text-sm text-white/65">
          Plus de <span className="font-bold text-white">1 200</span> contrats sécurisés, livraisons rapides et suivi 100% en ligne.
        </motion.p>

        <motion.div {...enter(3)} className="group relative mb-8 w-full max-w-2xl">
          <form onSubmit={handleSubmit}>
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-brand-primary">
              <Search size={22} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher le véhicule de mes rêves (ex: Audi RS3)"
              className="w-full rounded-xl bg-white py-4 pl-14 pr-4 text-slate-900 placeholder-slate-500 shadow-2xl transition-shadow focus:outline-none focus:ring-4 focus:ring-brand-primary/30"
            />
            <input type="submit" className="hidden" />
          </form>

          {normalizedQuery ? (
            <div className="absolute top-full mt-3 w-full overflow-hidden rounded-xl border border-slate-200 bg-white/95 text-slate-900 shadow-2xl backdrop-blur-sm">
              {suggestions.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-600">Aucun véhicule trouvé pour “{query}”.</p>
              ) : (
                suggestions.map((v: any) => (
                  <button
                    key={v.slug || v.id}
                    type="button"
                    onClick={() => handleSelect(v.slug || v.id)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-100"
                  >
                    <span className="text-sm font-semibold text-slate-900">
                      {v.brand || "Marque"} {v.model || v.title || ""}
                    </span>
                    <span className="text-xs text-slate-500">
                      {v.city ? `${v.city} • ` : ""}
                      {typeof v.price === "number" ? `${v.price.toLocaleString("fr-FR")} €` : "Voir le détail"}
                    </span>
                  </button>
                ))
              )}
            </div>
          ) : null}
        </motion.div>

        <motion.div {...enter(4)} className="flex flex-col items-center gap-4 md:flex-row">
          <Link
            to="/vehicules"
            className="group inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/10 px-8 py-3.5 font-semibold tracking-wide backdrop-blur-sm transition-colors hover:bg-white hover:text-brand-ink"
          >
            <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            Voir toutes les offres
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center rounded-full bg-brand-primary px-8 py-3.5 font-bold tracking-wide shadow-lg transition-colors hover:bg-brand-primary-dark"
          >
            Parler à un conseiller
          </Link>
        </motion.div>
      </div>

      {/* Marques du parc (masqué sous 3 marques) */}
      {brands.length > 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-10 z-20 select-none overflow-hidden py-2">
          <motion.div
            className="flex gap-16 whitespace-nowrap md:gap-24"
            animate={{ x: [0, -1000] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          >
            {brands.map((brand, i) => (
              <span key={i} className="shrink-0 text-sm font-bold uppercase italic tracking-wider text-white/40 md:text-lg">
                {brand}
              </span>
            ))}
          </motion.div>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-brand-ink-deep via-brand-ink-deep/90 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-brand-ink-deep via-brand-ink-deep/90 to-transparent" />
        </div>
      )}
    </section>
  );
}

export default HeroSection;
