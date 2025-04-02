import { motion } from "framer-motion";
import ServiceCard from "../services/ServiceCard";
import { Car, RefreshCw, Wallet, Users, Briefcase } from "lucide-react";

const ServicesSection = () => {
  return (
    <div className="w-full bg-gray-900 py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nos <span className="text-[#DA1212]">Services</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Découvrez notre gamme complète de services automobiles conçus pour
            répondre à tous vos besoins de mobilité.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            title="Achat de véhicules"
            description="Vente de voitures neuves ou très récentes. Marques: Audi, Mercedes, BMW, Peugeot, Toyota, etc. Types: SUV, sportives, citadines, utilitaires. Voitures révisées, garanties, faible kilométrage."
            icon={<Car className="text-white" size={24} />}
            delay={0}
          />

          <ServiceCard
            title="Reprise / vente de véhicules"
            description="Reprise avec ou sans nouvel achat. Estimation gratuite, reprise cash ou en leasing. Paiement rapide."
            icon={<RefreshCw className="text-white" size={24} />}
            delay={1}
          />

          <ServiceCard
            title="Financement"
            description="LOA (Location avec Option d'Achat), LLD (Location Longue Durée), Crédit auto classique. Avec ou sans apport – Durée: 12 à 72 mois."
            icon={<Wallet className="text-white" size={24} />}
            delay={2}
          />

          <ServiceCard
            title="Accompagnement complet"
            description="Aide au choix du véhicule, montage dossier de financement, livraison rapide France entière, suivi après-vente, démarches administratives simplifiées."
            icon={<Users className="text-white" size={24} />}
            delay={3}
          />

          <ServiceCard
            title="Service Pro"
            description="Leasing pour entreprises, professions libérales. Gestion de flotte, offres fiscales, TVA récupérable. Contrats adaptés à l'activité."
            icon={<Briefcase className="text-white" size={24} />}
            delay={4}
            className="md:col-span-2 lg:col-span-1"
          />
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
