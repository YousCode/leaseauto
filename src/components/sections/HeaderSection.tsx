// src/components/layout/HeaderSection.tsx
import { Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Accueil", href: "/" },
  { name: "Véhicules", href: "/vehicules" },
  { name: "Financement", href: "/financement" },
  { name: "Contact", href: "/contact" },
];

const HeaderSection = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Détection du scroll pour changer le style
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md py-3 shadow-sm transition-all duration-300 ease-in-out"
      >
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between">
            
            {/* --- LOGO LEASE AUTO --- */}
            <Link to="/" className="flex items-center gap-3 shrink-0 z-50">
              <motion.img
                src="src/assets/logo-lease-auto.png"
                alt="Lease Auto"
                className="h-12 md:h-14 w-auto transition-all duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            </Link>

            {/* --- NAVIGATION DESKTOP --- */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
              {navItems.map((item) => {
                const active = location.pathname === item.href;
                const textColor = "text-slate-700 hover:text-[#E52127]";
                const activeColor = "text-[#E52127]";

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative group transition-colors duration-200 ${
                      active ? activeColor : textColor
                    }`}
                  >
                    {item.name}
                    {/* Soulignement rouge animé */}
                    <span className={`absolute -bottom-2 left-0 h-0.5 bg-[#E52127] transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                  </Link>
                );
              })}
            </nav>

            {/* --- CTA DROITE + PILL BUTTON --- */}
            <div className="hidden md:flex items-center gap-4">
              
              <Link
                to="/devis"
                className="rounded-full bg-[#E52127] text-white text-xs md:text-sm font-bold px-6 py-2.5 hover:bg-[#c91c22] transition-all shadow-[0_4px_14px_rgba(229,33,39,0.3)] hover:scale-105"
              >
                Demander une offre
              </Link>

              {/* Bouton Menu/User qui s'adapte au fond (Blanc ou Noir) */}
              
            </div>

            {/* --- BURGER MOBILE --- */}
            <button
              className="md:hidden p-2 transition-colors text-slate-800"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Ouvrir le menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* --- MENU MOBILE FULLSCREEN (Reste en Dark Mode pour le style Premium) --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-32 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6 text-center">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-bold text-white hover:text-[#E52127] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="mt-8 flex flex-col items-center gap-4">
                <Link
                  to="/devis"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full max-w-xs rounded-full bg-[#E52127] text-white font-bold px-6 py-4 text-lg shadow-[0_0_20px_rgba(229,33,39,0.4)]"
                >
                  Demander une offre
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export { HeaderSection };
export default HeaderSection;
