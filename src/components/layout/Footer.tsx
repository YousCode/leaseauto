import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { useCarrosserie } from "@/App";

const Footer = () => {
  const { theme } = useCarrosserie();

  return (
    <motion.footer
      className="w-full relative py-8 px-4 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {/* Carrosserie background effect */}
      <div className="absolute inset-0">
        <div
          className={`h-full w-full ${
            theme === "glossy"
              ? "carrosserie-glossy carrosserie-glossy-shadow"
              : "carrosserie-matte carrosserie-matte-shadow"
          }`}
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
      <div className="relative container mx-auto max-w-6xl">
        {/* Social Media Links */}
        <div className="flex justify-center space-x-8 mb-6">
          <motion.a
            href="https://www.instagram.com/leaseauto.epinay"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-[#CCCCCC] hover:text-white transition-colors duration-300 group"
            whileHover={{ scale: 1.05 }}
          >
            <Instagram
              size={20}
              className="group-hover:text-[#E50914] transition-colors"
            />
            <span className="font-inter text-sm">Instagram</span>
          </motion.a>

          <motion.a
            href="https://www.tiktok.com/@leaseauto.epinay"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-[#CCCCCC] hover:text-white transition-colors duration-300 group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-5 h-5 group-hover:text-[#E50914] transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.83a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.26z" />
              </svg>
            </div>
            <span className="font-inter text-sm">TikTok</span>
          </motion.a>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8 mb-6 text-[#CCCCCC] text-sm font-inter">
          <div className="flex items-center space-x-2">
            <Phone size={16} className="text-[#E50914]" />
            <a
              href="tel:0184218393"
              className="hover:text-white transition-colors"
            >
              01 84 21 83 93
            </a>
          </div>

          <div className="flex items-center space-x-2">
            <Mail size={16} className="text-[#E50914]" />
            <a
              href="mailto:leaseauto.epinay@gmail.com"
              className="hover:text-white transition-colors"
            >
              leaseauto.epinay@gmail.com
            </a>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-[#E50914]" />
            <span>42 Bd Foch, 93800 Épinay-sur-Seine</span>
          </div>
        </div>

        {/* Copyright */}
        <div
          className={`text-center pt-6 border-t ${
            theme === "glossy" ? "border-white/10" : "border-white/5"
          }`}
        >
          <p
            className={`font-inter text-sm font-light ${
              theme === "glossy" ? "text-[#CCCCCC]" : "text-[#c5c5c5]"
            }`}
          >
            © {new Date().getFullYear()} Lease Auto — Tous droits réservés.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
