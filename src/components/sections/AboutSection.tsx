import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import AnimatedCounter from "@/components/ui/animated-counter";

const AboutSection = () => {
  return (
    <div className="w-full bg-white py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 font-premium tracking-wide">
            À propos de Lease Auto
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-700 font-inter leading-relaxed font-light text-lg mb-6">
              Chez Lease Auto, nous vous accompagnons dans la recherche de la
              solution de leasing idéale. Notre équipe d'experts met à votre
              disposition une sélection de véhicules haut de gamme, un service
              personnalisé et un suivi premium.
            </p>
            <p className="text-gray-600 font-inter leading-relaxed font-light">
              Avec plus de 15 ans d'expérience dans le secteur automobile, nous
              avons développé des partenariats solides avec les plus grands
              constructeurs pour vous proposer une sélection exceptionnelle de
              véhicules à des tarifs compétitifs.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutSection;
