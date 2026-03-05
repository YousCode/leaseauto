import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollRaf } from "@/hooks/useScrollRaf";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
    <nav className={`w-full h-16 fixed top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-gray-900/95 backdrop-blur-md shadow-lg" 
        : "bg-gray-900/90 backdrop-blur-sm"
    }`}>
      {/* Content */}
      <div className="flex items-center justify-between px-6 md:px-12 h-full max-w-7xl mx-auto">
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
            className="text-2xl font-bold text-white tracking-tight hover:scale-105 transition-transform duration-300"
          >
            Lease<span className="text-red-500">Auto</span>
          </button>
        </motion.div>

        <div className="hidden md:flex items-center space-x-8">
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
              className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group"
            >
              <span className="relative z-10">Accueil</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to="/vehicules"
              className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group"
            >
              <span className="relative z-10">Véhicules</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => scrollToSection("services")}
              className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group"
            >
              <span className="relative z-10">Services</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              onClick={() => scrollToSection("about")}
              className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group"
            >
              <span className="relative z-10">À Propos</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <button
              onClick={() => scrollToSection("contact")}
              className="text-white/90 hover:text-white transition-all duration-300 font-medium relative group"
            >
              <span className="relative z-10">Contact</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </motion.div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => scrollToSection("contact")}
                className="bg-red-600 hover:bg-red-700 text-white font-medium hidden md:inline-flex transition-all duration-300 px-6 py-2 rounded-lg shadow-md hover:shadow-lg"
              >
                Demander un Devis
              </Button>
            </motion.div>
          </motion.div>

          <button
            className="md:hidden text-white/90 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden fixed inset-0 top-16 z-40"
          >
            <div className="bg-gray-900/97 backdrop-blur-md h-full">
              <div className="p-6">
                <div className="flex flex-col space-y-1">
                  {[
                    { label: "Accueil", action: () => { navigate("/"); setTimeout(() => scrollToSection("hero"), 80); } },
                    { label: "Services", action: () => scrollToSection("services") },
                    { label: "À Propos", action: () => scrollToSection("about") },
                    { label: "Contact", action: () => scrollToSection("contact") },
                  ].map(({ label, action }, i) => (
                    <motion.button
                      key={label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18, delay: i * 0.05 }}
                      onClick={() => { action(); setIsMobileMenuOpen(false); }}
                      className="text-white/90 hover:text-white transition-colors font-medium py-4 border-b border-white/10 text-left text-lg"
                    >
                      {label}
                    </motion.button>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.18, delay: 0.2 }}
                  >
                    <Link
                      to="/vehicules"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-white/90 hover:text-white transition-colors font-medium py-4 border-b border-white/10 text-left text-lg block"
                    >
                      Véhicules
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.28 }}
                    className="pt-6"
                  >
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white font-medium w-full rounded-xl shadow-md h-12 text-base"
                      onClick={() => { scrollToSection("contact"); setIsMobileMenuOpen(false); }}
                    >
                      Demander un Devis
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;