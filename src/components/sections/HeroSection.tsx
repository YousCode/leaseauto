// src/components/home/HeroSection.tsx
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  ChevronRight, 
  ChevronLeft 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVehicles } from "@/hooks/useVehicles";

// Images haute qualité style "Dark/Premium"
const HERO_IMAGES = [
  "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=1920",
];

// Liste des marques (Triplée pour assurer le flux continu)
const BRANDS_LIST = ["Porsche", "Ferrari", "Aston Martin", "BMW", "Lamborghini", "Volvo", "Mercedes", "Audi", "Land Rover", "Maserati", "Bentley"];
const BRANDS = [...BRANDS_LIST, ...BRANDS_LIST, ...BRANDS_LIST]; 

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { data: vehicles = [] } = useVehicles("published");

  // Changement automatique d'image toutes les 5 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === HERO_IMAGES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goPrev = () => setActiveIndex((prev) => (prev === 0 ? HERO_IMAGES.length - 1 : prev - 1));
  const goNext = () => setActiveIndex((prev) => (prev === HERO_IMAGES.length - 1 ? 0 : prev + 1));

  const normalizedQuery = query.trim().toLowerCase();
  const suggestions = useMemo(() => {
    if (!normalizedQuery) return [];
    return vehicles
      .filter((v: any) => {
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
    if (!slug) return;
    navigate(`/vehicules/${slug}`);
  };

  return (
    <div className="relative w-full min-h-[85vh] md:h-screen overflow-hidden bg-black text-white font-sans">
      
      {/* --- BACKGROUND CARROUSEL --- */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={HERO_IMAGES[activeIndex]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            alt="Luxury Car Background"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            loading={activeIndex === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchpriority={activeIndex === 0 ? "high" : "auto"}
          />
        </AnimatePresence>
        
        {/* Overlays : Dégradés pour lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50" />
        <div className="absolute inset-0 bg-black/20" /> 
      </div>

      {/* --- CONTENU PRINCIPAL CENTRÉ --- */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center mt-8">
        
        {/* Titre Principal */}
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase leading-none mb-6 max-w-5xl drop-shadow-2xl"
        >
          Une offre claire.<br className="hidden md:block" /> Sans surprise.
        </motion.h1>

        {/* Sous-titre */}
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-200 font-medium mb-2 max-w-3xl"
        >
          Vous définissez le véhicule, la durée et le budget. Nous gérons le reste.
        </motion.p>

        {/* Stats / Info rassurante */}
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-sm text-gray-400 mb-10 max-w-2xl"
        >
          Plus de <span className="font-bold text-white">1 200</span> contrats sécurisés, livraisons rapides et suivi 100% en ligne.
        </motion.p>

        {/* BARRE DE RECHERCHE */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative w-full max-w-2xl mb-8 group"
        >
          <form onSubmit={handleSubmit}>
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#E60000] transition-colors">
              <Search size={22} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher le véhicule de mes rêves (ex: Audi RS3)"
              className="w-full py-4 pl-14 pr-4 rounded-xl bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-[#E60000]/30 transition-all shadow-2xl"
            />
            <input type="submit" className="hidden" />
          </form>

          {normalizedQuery ? (
            <div className="absolute top-full mt-3 w-full rounded-xl bg-white/95 text-black shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-sm">
              {suggestions.length === 0 ? (
                <p className="px-4 py-3 text-sm text-gray-600">Aucun véhicule trouvé pour “{query}”.</p>
              ) : (
                suggestions.map((v: any) => (
                  <button
                    key={v.slug || v.id}
                    type="button"
                    onClick={() => handleSelect(v.slug || v.id)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span className="text-sm font-semibold text-gray-900">
                      {(v.brand || "Marque")} {(v.model || v.title || "")}
                    </span>
                    <span className="text-xs text-gray-500">
                      {v.city ? `${v.city} • ` : ""}
                      {typeof v.price === "number" ? `${v.price.toLocaleString("fr-FR")} €` : "Voir le détail"}
                    </span>
                  </button>
                ))
              )}
            </div>
          ) : null}
        </motion.div>

        {/* BOUTONS D'ACTION */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col md:flex-row items-center gap-4"
        >
          <Link to="/vehicules">
            <button className="px-8 py-3.5 rounded-full border border-white text-white hover:bg-white hover:text-black transition-all flex items-center gap-2 group font-semibold tracking-wide backdrop-blur-sm bg-black/20">
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              Voir toutes les offres
            </button>
          </Link>
          
          <Link to="/contact">
            <button className="px-8 py-3.5 rounded-full bg-[#E60000] text-white font-bold tracking-wide hover:bg-[#cc0000] hover:scale-105 transition-all shadow-[0_0_25px_rgba(230,0,0,0.5)]">
              Parler à un conseiller
            </button>
          </Link>
        </motion.div>
      </div>

      {/* --- BANDEAU MARQUES (INFINITE MARQUEE RAPIDE) --- */}
      <div className="absolute bottom-10 left-0 right-0 z-20 overflow-hidden select-none pointer-events-none py-2">
        <motion.div 
          className="flex whitespace-nowrap gap-16 md:gap-24"
          animate={{ x: [0, -1000] }} 
          transition={{ 
            ease: "linear", 
            duration: 15, // VITESSE MODIFIÉE ICI (plus petit = plus rapide)
            repeat: Infinity 
          }}
        >
          {BRANDS.map((brand, i) => (
            <span 
              key={i} 
              className="text-white/40 text-sm md:text-lg font-bold italic tracking-wider uppercase shrink-0"
            >
              {brand}
            </span>
          ))}
        </motion.div>
        
        {/* Dégradés latéraux */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black via-black/90 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black via-black/90 to-transparent" />
      </div>

    </div>
  );
}

export default HeroSection;
