import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactSection = () => {
  return (
    <div className="w-full bg-[#F9F9F9] py-24 px-4 cv-auto">
      <div className="container mx-auto max-w-6xl">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#111111] mb-4 font-premium tracking-wide">
            Louer ou acheter votre prochain véhicule ?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-inter leading-relaxed font-light">
            Nos conseillers Lease Auto vous accompagnent à chaque étape — du
            choix du modèle jusqu’à la remise des clés.
          </p>
        </motion.div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  placeholder="Votre nom"
                  className="bg-white border-gray-200 text-gray-900 font-inter"
                />
                <Input
                  type="email"
                  placeholder="Votre e-mail"
                  className="bg-white border-gray-200 text-gray-900 font-inter"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="tel"
                  placeholder="Votre téléphone"
                  className="bg-white border-gray-200 text-gray-900 font-inter"
                />
                <select className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-900 font-inter focus:border-[#E50914] focus:outline-none">
                  <option value="">Type de projet</option>
                  <option value="location">Location (LOA / LLD)</option>
                  <option value="achat">Achat comptant ou financement</option>
                </select>
              </div>

              <Textarea
                placeholder="Décrivez votre besoin : modèle, budget, délai…"
                className="bg-white border-gray-200 text-gray-900 min-h-[120px] font-inter"
              />

              <Button className="bg-[#E50914] hover:bg-[#E50914]/90 text-white px-8 py-3 rounded-sm font-inter font-light">
                Envoyer ma demande
              </Button>
            </form>
          </motion.div>

          {/* Coordonnées */}
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
                    Nous écrire
                  </h4>
                  <a
                    href="mailto:leaseauto.epinay@gmail.com"
                    className="text-[#E50914] hover:underline font-inter break-all"
                  >
                    leaseauto.epinay@gmail.com
                  </a>
                </div>

                <div>
                  <h4 className="text-[#111111] font-medium mb-2 font-premium">
                    Nous rencontrer
                  </h4>
                  <p className="text-gray-600 font-inter">
                    Lease Auto
                    <br />
                    42 Boulevard Foch
                    <br />
                    93800 Épinay-sur-Seine
                  </p>
                </div>

                <div>
                  <h4 className="text-[#111111] font-medium mb-2 font-premium">
                    Horaires
                  </h4>
                  <p className="text-gray-600 font-inter">
                    Lundi à Samedi — 9h à 19h
                  </p>
                </div>

                <div>
                  <h4 className="text-[#111111] font-medium mb-2 font-premium">
                    Nos réseaux
                  </h4>
                  <div className="space-y-2">
                    <a
                      href="https://www.instagram.com/leaseauto.epinay"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[#E50914] hover:underline font-inter"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://www.tiktok.com/@leaseauto.epinay"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[#E50914] hover:underline font-inter"
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

export { ContactSection };
export default ContactSection;
