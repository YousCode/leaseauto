import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { useScrollRaf } from "@/hooks/useScrollRaf";
import { useCarrosserie } from "@/App";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useCarrosserie();

  const handleScroll = useCallback((scrollY: number) => {
    setIsScrolled(scrollY > 10);
  }, []);

  useScrollRaf(handleScroll);

  const scrollToSection = (sectionId: string) => {
    // If not on home page, navigate to home first
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="w-full h-16 fixed top-0 z-50 overflow-hidden">
      {/* Carrosserie background effect */}
      <div className="absolute inset-0">
        <div
          className={`h-full w-full transition-all duration-300 ${
            theme === "glossy"
              ? "carrosserie-glossy carrosserie-glossy-shadow"
              : "carrosserie-matte carrosserie-matte-shadow"
          } ${isScrolled ? "opacity-95" : "opacity-80"}`}
        />

        {/* Noise texture overlay */}
        <div
          className={`absolute inset-0 carrosserie-noise ${
            theme === "glossy"
              ? "opacity-15 mix-blend-overlay"
              : "opacity-5 mix-blend-multiply"
          }`}
        />

        {/* Animated shine for glossy theme */}
        {theme === "glossy" && (
          <div className="absolute inset-0 carrosserie-shine" />
        )}
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-between px-6 md:px-12 h-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center"
        >
          <button
            onClick={() => {
              navigate("/");
              setTimeout(() => scrollToSection("hero"), 100);
            }}
            className="text-xl font-premium font-light text-white tracking-wide hover:scale-105 transition-transform duration-300"
          >
            Lease<span className="text-[#E50914]">Auto</span>
          </button>
        </motion.div>

        <div className="hidden md:flex items-center space-x-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <button
              onClick={() => {
                navigate("/");
                setTimeout(() => scrollToSection("hero"), 100);
              }}
              className="text-white/90 hover:text-white transition-all duration-300 font-light font-inter relative group text-sm tracking-wide"
            >
              <span className="relative z-10">Accueil</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#E50914] transition-all duration-500 group-hover:w-full"></span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to="/vehicules"
              className="text-white/90 hover:text-white transition-all duration-300 font-light font-inter relative group text-sm tracking-wide"
            >
              <span className="relative z-10">Véhicules</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#E50914] transition-all duration-500 group-hover:w-full"></span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => scrollToSection("services")}
              className="text-white/90 hover:text-white transition-all duration-300 font-light font-inter relative group text-sm tracking-wide"
            >
              <span className="relative z-10">Services</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#E50914] transition-all duration-500 group-hover:w-full"></span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              onClick={() => scrollToSection("about")}
              className="text-white/90 hover:text-white transition-all duration-300 font-light font-inter relative group text-sm tracking-wide"
            >
              <span className="relative z-10">À Propos</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#E50914] transition-all duration-500 group-hover:w-full"></span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <button
              onClick={() => scrollToSection("contact")}
              className="text-white/90 hover:text-white transition-all duration-300 font-light font-inter relative group text-sm tracking-wide"
            >
              <span className="relative z-10">Contact</span>
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#E50914] transition-all duration-500 group-hover:w-full"></span>
            </button>
          </motion.div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme toggle button */}
          <motion.button
            onClick={() => setTheme(theme === "glossy" ? "matte" : "glossy")}
            className="hidden md:flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-300 text-xs font-inter"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={`Passer en mode ${theme === "glossy" ? "mat" : "brillant"}`}
          >
            <Palette size={16} />
            <span>{theme === "glossy" ? "Mat" : "Brillant"}</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => scrollToSection("contact")}
                className="bg-[#E50914] hover:bg-[#E50914]/90 text-white font-light font-inter hidden md:inline-flex transition-all duration-300 px-6 py-2 text-sm tracking-wide rounded-sm border border-[#E50914]/20"
              >
                Demander un Devis
              </Button>
            </motion.div>
          </motion.div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40">
          {/* Mobile menu background with carrosserie effect */}
          <div className="absolute inset-0">
            <div
              className={`h-full w-full ${
                theme === "glossy"
                  ? "carrosserie-glossy carrosserie-glossy-shadow"
                  : "carrosserie-matte carrosserie-matte-shadow"
              }`}
            />
            <div
              className={`absolute inset-0 carrosserie-noise ${
                theme === "glossy"
                  ? "opacity-15 mix-blend-overlay"
                  : "opacity-5 mix-blend-multiply"
              }`}
            />
          </div>

          <div className="relative p-4">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  navigate("/");
                  setTimeout(() => scrollToSection("hero"), 100);
                  setIsMobileMenuOpen(false);
                }}
                className="text-white hover:text-[#E50914] transition-colors font-medium py-3 border-b border-gray-800 text-left"
              >
                Accueil
              </button>
              <Link
                to="/vehicules"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-[#E50914] transition-colors font-medium py-3 border-b border-gray-800 text-left block"
              >
                Véhicules
              </Link>
              <button
                onClick={() => {
                  scrollToSection("services");
                  setIsMobileMenuOpen(false);
                }}
                className="text-white hover:text-[#E50914] transition-colors font-medium py-3 border-b border-gray-800 text-left"
              >
                Services
              </button>
              <button
                onClick={() => {
                  scrollToSection("about");
                  setIsMobileMenuOpen(false);
                }}
                className="text-white hover:text-[#E50914] transition-colors font-medium py-3 border-b border-gray-800 text-left"
              >
                À Propos
              </button>
              <button
                onClick={() => {
                  scrollToSection("contact");
                  setIsMobileMenuOpen(false);
                }}
                className="text-white hover:text-[#E50914] transition-colors font-medium py-3 border-b border-gray-800 text-left"
              >
                Contact
              </button>
              {/* Mobile theme toggle */}
              <button
                onClick={() => {
                  setTheme(theme === "glossy" ? "matte" : "glossy");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-white/70 hover:text-[#E50914] transition-colors font-medium py-3 border-b border-gray-800 text-left"
              >
                <Palette size={20} />
                <span>Mode {theme === "glossy" ? "Mat" : "Brillant"}</span>
              </button>

              <Button
                className="bg-[#E50914] hover:bg-[#E50914]/90 text-white font-medium w-full mt-4"
                onClick={() => {
                  scrollToSection("contact");
                  setIsMobileMenuOpen(false);
                }}
              >
                Demander un Devis
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
