import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
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
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40">
          <div className="bg-gray-900/95 backdrop-blur-md h-full">
            <div className="p-6">
              <div className="flex flex-col space-y-6">
                <button
                  onClick={() => {
                    navigate("/");
                    setTimeout(() => scrollToSection("hero"), 100);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white/90 hover:text-white transition-colors font-medium py-3 border-b border-white/20 text-left"
                >
                  Accueil
                </button>
                <Link
                  to="/vehicules"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/90 hover:text-white transition-colors font-medium py-3 border-b border-white/20 text-left block"
                >
                  Véhicules
                </Link>
                <button
                  onClick={() => {
                    scrollToSection("services");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white/90 hover:text-white transition-colors font-medium py-3 border-b border-white/20 text-left"
                >
                  Services
                </button>
                <button
                  onClick={() => {
                    scrollToSection("about");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white/90 hover:text-white transition-colors font-medium py-3 border-b border-white/20 text-left"
                >
                  À Propos
                </button>
                <button
                  onClick={() => {
                    scrollToSection("contact");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white/90 hover:text-white transition-colors font-medium py-3 border-b border-white/20 text-left"
                >
                  Contact
                </button>

                <Button
                  className="bg-red-600 hover:bg-red-700 text-white font-medium w-full mt-4 rounded-lg shadow-md"
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;