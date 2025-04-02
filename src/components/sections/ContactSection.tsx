import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Car } from "lucide-react";

const ContactSection = () => {
  return (
    <div className="w-full bg-gray-900 py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Demandez un <span className="text-[#DA1212]">Devis</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Vous souhaitez obtenir plus d'informations sur nos véhicules ou nos
            services de financement ? Notre équipe d'experts est à votre
            disposition.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-black p-8 rounded-lg"
          >
            <h3 className="text-xl font-bold text-white mb-6">
              Envoyez-nous un message
            </h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    placeholder="Votre Nom"
                    className="bg-gray-900 border-gray-800 text-white"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Votre Email"
                    className="bg-gray-900 border-gray-800 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    placeholder="Téléphone"
                    className="bg-gray-900 border-gray-800 text-white"
                  />
                </div>
                <div>
                  <Select>
                    <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                      <SelectValue placeholder="Type de service" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800 text-white">
                      <SelectItem value="achat">Achat de véhicule</SelectItem>
                      <SelectItem value="vente">Vente de véhicule</SelectItem>
                      <SelectItem value="financement">Financement</SelectItem>
                      <SelectItem value="pro">Service Pro</SelectItem>
                      <SelectItem value="autre">Autre demande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Select>
                  <SelectTrigger className="bg-gray-900 border-gray-800 text-white">
                    <SelectValue placeholder="Véhicule d'intérêt (optionnel)" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
                    <SelectItem value="peugeot">Peugeot 3008 GT</SelectItem>
                    <SelectItem value="bmw">BMW X5 M Sport</SelectItem>
                    <SelectItem value="tesla">Tesla Model Y</SelectItem>
                    <SelectItem value="autre">Autre modèle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Textarea
                  placeholder="Votre Message"
                  className="bg-gray-900 border-gray-800 text-white min-h-[150px]"
                />
              </div>
              <Button className="bg-[#DA1212] hover:bg-[#B50F0F] text-white w-full md:w-auto px-8">
                Envoyer ma demande
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-black p-8 rounded-lg"
          >
            <h3 className="text-xl font-bold text-white mb-6">
              Informations de Contact
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

              <div className="flex items-start">
                <div className="bg-[#DA1212] p-2 rounded mr-4 mt-1">
                  <Car size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Showroom</h4>
                  <p className="text-gray-400">
                    Venez découvrir notre sélection de véhicules dans notre
                    showroom d'Épinay-sur-Seine
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
