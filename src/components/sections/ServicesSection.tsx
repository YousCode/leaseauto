import { motion } from "framer-motion";
import { Car, Users, Building } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      title: "Leasing Particuliers",
      description:
        "Solutions de leasing personnalisées pour les particuliers. LOA, LLD, financement flexible avec ou sans apport.",
      icon: <Car className="text-white" size={24} />,
    },
    {
      title: "Leasing Entreprises",
      description:
        "Offres dédiées aux professionnels et entreprises. Gestion de flotte, avantages fiscaux, TVA récupérable.",
      icon: <Building className="text-white" size={24} />,
    },
    {
      title: "Gestion de Flotte",
      description:
        "Service complet de gestion de parc automobile. Maintenance, assurance, remplacement véhicules.",
      icon: <Users className="text-white" size={24} />,
    },
  ];

  return (
    <div className="w-full bg-[#F9F9F9] py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 font-premium tracking-wide">
            Nos Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-inter leading-relaxed font-light">
            Des solutions de leasing adaptées à tous vos besoins
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="bg-[#E50914] p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4 font-premium">
                {service.title}
              </h3>
              <p className="text-gray-600 font-inter leading-relaxed font-light">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
