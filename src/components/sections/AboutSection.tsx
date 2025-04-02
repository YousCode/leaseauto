import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const AboutSection = () => {
  return (
    <div className="w-full bg-black py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            À Propos de <span className="text-[#DA1212]">Lease Auto</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            La mobilité sans compromis
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Notre Histoire
            </h3>
            <p className="text-gray-400 mb-6">
              Fondée à Épinay-sur-Seine, Lease Auto est née d'une passion pour
              l'automobile et d'une vision claire : rendre accessible la
              mobilité premium à tous. Notre équipe d'experts automobiles
              s'engage à vous offrir un service personnalisé et des solutions
              adaptées à vos besoins.
            </p>
            <p className="text-gray-400 mb-8">
              Avec plus de 15 ans d'expérience dans le secteur automobile, nous
              avons développé des partenariats solides avec les plus grands
              constructeurs pour vous proposer une sélection exceptionnelle de
              véhicules à des tarifs compétitifs.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="text-[#DA1212] text-3xl font-bold mb-2">
                  500+
                </div>
                <div className="text-white text-sm">Véhicules disponibles</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="text-[#DA1212] text-3xl font-bold mb-2">
                  15+
                </div>
                <div className="text-white text-sm">Années d'expérience</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="text-[#DA1212] text-3xl font-bold mb-2">
                  24/7
                </div>
                <div className="text-white text-sm">Support client</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg">
                <div className="text-[#DA1212] text-3xl font-bold mb-2">
                  5000+
                </div>
                <div className="text-white text-sm">Clients satisfaits</div>
              </div>
            </div>

            <Button className="bg-[#DA1212] hover:bg-[#B50F0F] text-white">
              Découvrir notre équipe
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-6">
                Nous Contacter
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-[#DA1212] p-2 rounded mr-4 mt-1">
                    <Phone size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Téléphone</h4>
                    <p className="text-gray-400">+33 (0)1 23 45 67 89</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#DA1212] p-2 rounded mr-4 mt-1">
                    <Mail size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Email</h4>
                    <p className="text-gray-400">contact@lease-auto.fr</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#DA1212] p-2 rounded mr-4 mt-1">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Adresse</h4>
                    <p className="text-gray-400">123 Avenue d'Épinay</p>
                    <p className="text-gray-400">93800 Épinay-sur-Seine</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#DA1212] p-2 rounded mr-4 mt-1">
                    <Clock size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">
                      Horaires d'ouverture
                    </h4>
                    <p className="text-gray-400">Lundi - Vendredi: 9h - 19h</p>
                    <p className="text-gray-400">Samedi: 10h - 18h</p>
                    <p className="text-gray-400">Dimanche: Fermé</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80"
                alt="Showroom Lease Auto"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
