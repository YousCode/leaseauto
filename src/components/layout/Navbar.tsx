import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full h-20 flex items-center justify-between px-4 md:px-8 fixed top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black border-b border-gray-800" : "bg-transparent"}`}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center"
      >
        <Link to="/" className="text-2xl font-bold text-white">
          Lease<span className="text-[#DA1212]">Auto</span>
        </Link>
      </motion.div>

      <div className="hidden md:flex items-center space-x-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link
            to="/"
            className="text-white hover:text-[#DA1212] transition-colors font-medium"
          >
            Accueil
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            to="/vehicules"
            className="text-white hover:text-[#DA1212] transition-colors font-medium"
          >
            Véhicules
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            to="/services"
            className="text-white hover:text-[#DA1212] transition-colors font-medium"
          >
            Services
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            to="/about"
            className="text-white hover:text-[#DA1212] transition-colors font-medium"
          >
            À Propos
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link
            to="/contact"
            className="text-white hover:text-[#DA1212] transition-colors font-medium"
          >
            Contact
          </Link>
        </motion.div>
      </div>

      <div className="flex items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button className="bg-[#DA1212] hover:bg-[#B50F0F] text-white font-medium hidden md:inline-flex">
            Demander un Devis
          </Button>
        </motion.div>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-black z-40 p-4">
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="text-white hover:text-[#DA1212] transition-colors font-medium py-3 border-b border-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/vehicles"
              className="text-white hover:text-[#DA1212] transition-colors font-medium py-3 border-b border-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Véhicules
            </Link>
            <Link
              to="/services"
              className="text-white hover:text-[#DA1212] transition-colors font-medium py-3 border-b border-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-[#DA1212] transition-colors font-medium py-3 border-b border-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              À Propos
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-[#DA1212] transition-colors font-medium py-3 border-b border-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Button
              className="bg-[#DA1212] hover:bg-[#B50F0F] text-white font-medium w-full mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Demander un Devis
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
