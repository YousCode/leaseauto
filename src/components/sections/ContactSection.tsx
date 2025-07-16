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
    <div className="w-full bg-[#F9F9F9] py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#111111] mb-4 font-premium tracking-wide">
            Envie de louer ? Contactez-nous Maintenant !
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-inter leading-relaxed font-light">
            Notre équipe d'experts est à votre disposition pour vous accompagner
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    placeholder="Nom"
                    className="bg-white border-gray-200 text-gray-900 font-inter"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    className="bg-white border-gray-200 text-gray-900 font-inter"
                  />
                </div>
              </div>
              <div>
                <Textarea
                  placeholder="Message"
                  className="bg-white border-gray-200 text-gray-900 min-h-[120px] font-inter"
                />
              </div>
              <Button className="bg-[#E50914] hover:bg-[#E50914]/90 text-white px-8 py-3 rounded-sm font-inter font-light">
                Envoyer
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[#111111] font-medium mb-2 font-premium">
                    Nous appeler
                  </h4>
                  <a
                    href="tel:0184218393"
                    className="text-[#E50914] hover:underline font-inter"
                  >
                    01 84 21 83 93
                  </a>
                </div>

                <div>
                  <h4 className="text-[#111111] font-medium mb-2 font-premium">
                    Notre mail
                  </h4>
                  <a
                    href="mailto:leaseauto.epinay@gmail.com"
                    className="text-[#E50914] hover:underline font-inter"
                  >
                    leaseauto.epinay@gmail.com
                  </a>
                </div>

                <div>
                  <h4 className="text-[#111111] font-medium mb-2 font-premium">
                    Rencontrez-nous
                  </h4>
                  <p className="text-gray-600 font-inter">
                    Lease Auto
                    <br />
                    42 Bd Foch
                    <br />
                    93800 Épinay-sur-Seine
                  </p>
                </div>

                <div>
                  <h4 className="text-[#111111] font-medium mb-2 font-premium">
                    Ouverture
                  </h4>
                  <p className="text-gray-600 font-inter">Lundi - Samedi</p>
                </div>

                <div>
                  <h4 className="text-[#111111] font-medium mb-2 font-premium">
                    Réseaux sociaux
                  </h4>
                  <div className="space-y-2">
                    <a
                      href="https://www.instagram.com/leaseauto.epinay"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[#E50914] hover:underline font-inter text-left"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://www.tiktok.com/@leaseauto.epinay"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[#E50914] hover:underline font-inter text-left"
                    >
                      TikTok
                    </a>
                  </div>
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
