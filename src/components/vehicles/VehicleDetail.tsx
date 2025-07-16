import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Mail,
  User,
  Phone,
  CheckCircle,
} from "lucide-react";

interface VehicleProps {
  id?: string;
  name?: string;
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  monthlyRent?: number;
  image?: string;
  city?: string;
  publishDate?: string;
  description?: string;
  equipment?: string[];
  options?: string[];
  warranty?: string;
}

const PREMIUM_VEHICLES: VehicleProps[] = [
  {
    id: "1",
    name: "TOYOTA COROLLA TOURING 1.8i 122 HK HYBRID SPORTS ACTIVE",
    brand: "Toyota",
    model: "Corolla Touring",
    year: 2023,
    price: 22990,
    monthlyRent: 405,
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
    city: "Épinay-sur-Seine 93800",
    publishDate: "15 Janvier 2024",
    description:
      "Véhicule hybride économique et fiable, parfait pour les trajets quotidiens. Cette Toyota Corolla Touring combine efficacité énergétique et espace pratique pour répondre à tous vos besoins de mobilité.",
    equipment: [
      "Climatisation automatique",
      "Système multimédia",
      "Caméra de recul",
      "Régulateur de vitesse",
      "Feux LED",
    ],
    options: [
      "Jantes alliage 17 pouces",
      "Vitres teintées",
      "Toit ouvrant panoramique",
      "Sellerie mixte",
    ],
    warranty: "Garantie constructeur 5 ans ou 100 000 km",
  },
  {
    id: "2",
    name: "TOYOTA C-HR (2) C-LUB 1.8 HYBRID 122 BUSINESS CVT",
    brand: "Toyota",
    model: "C-HR",
    year: 2023,
    price: 21990,
    monthlyRent: 385,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
    city: "Paris 75001",
    publishDate: "12 Janvier 2024",
    description:
      "SUV compact hybride au design moderne et distinctif. Le Toyota C-HR offre une expérience de conduite unique avec son style audacieux et sa technologie hybride avancée.",
    equipment: [
      "Navigation GPS",
      "Régulateur de vitesse adaptatif",
      "Détecteur d'angle mort",
      "Système de freinage d'urgence",
    ],
    options: [
      "Sellerie cuir",
      "Éclairage LED intégral",
      "Système audio premium JBL",
      "Chargeur sans fil",
    ],
    warranty: "Garantie constructeur 5 ans ou 100 000 km",
  },
  {
    id: "3",
    name: "BMW X2 F39 SDRIVE 20iA 192 CH M SPORT",
    brand: "BMW",
    model: "X2",
    year: 2023,
    price: 26990,
    monthlyRent: 548,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    city: "Neuilly-sur-Seine 92200",
    publishDate: "10 Janvier 2024",
    description:
      "SUV coupé sportif avec finition M Sport, alliant performance et élégance. Le BMW X2 redéfinit le segment des SUV compacts avec son design distinctif et ses performances dynamiques.",
    equipment: [
      "Sièges sport M",
      "Volant M Sport",
      "Suspension sport",
      "Système iDrive",
      "BMW ConnectedDrive",
    ],
    options: [
      "Pack M Performance",
      "Toit panoramique",
      "Système Hi-Fi Harman Kardon",
      "Jantes M 19 pouces",
    ],
    warranty: "Garantie BMW 3 ans kilométrage illimité",
  },
  {
    id: "4",
    name: "BMW SERIE 1 F40 120i 2.0 178 CH M-SPORT DKG7",
    brand: "BMW",
    model: "Série 1",
    year: 2023,
    price: 25990,
    monthlyRent: 466,
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    city: "Boulogne-Billancourt 92100",
    publishDate: "8 Janvier 2024",
    description:
      "Compacte premium avec transmission automatique et finition M Sport. La BMW Série 1 offre le plaisir de conduire BMW dans un format compact et urbain.",
    equipment: [
      "Boîte automatique DKG7",
      "Climatisation bi-zone",
      "Feux LED",
      "BMW Live Cockpit",
    ],
    options: [
      "Pack Connected Drive",
      "Sièges chauffants",
      "Rétroviseurs électriques",
      "Aide au stationnement",
    ],
    warranty: "Garantie BMW 3 ans kilométrage illimité",
  },
  {
    id: "5",
    name: "TESLA MODEL 3 (3) 275 STANDARD PLUS RWD MY22",
    brand: "Tesla",
    model: "Model 3",
    year: 2022,
    price: 27990,
    monthlyRent: 493,
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80",
    city: "Levallois-Perret 92300",
    publishDate: "5 Janvier 2024",
    description:
      "Berline électrique révolutionnaire avec autopilot et superchargeur inclus. La Tesla Model 3 représente l'avenir de la mobilité avec ses technologies de pointe et son autonomie exceptionnelle.",
    equipment: [
      "Autopilot",
      "Écran tactile 15 pouces",
      "Superchargeur",
      "Mise à jour OTA",
      "Système audio premium",
    ],
    options: [
      "Peinture nacrée",
      "Intérieur premium blanc",
      "Jantes 19 pouces",
      "Pilote automatique intégral",
    ],
    warranty: "Garantie Tesla 4 ans ou 80 000 km",
  },
  {
    id: "6",
    name: "AUDI A1 SPORTBACK 30 TFSI 110 CH ADVANCED S-TRONIC",
    brand: "Audi",
    model: "A1 Sportback",
    year: 2023,
    price: 26990,
    monthlyRent: 466,
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
    city: "Courbevoie 92400",
    publishDate: "3 Janvier 2024",
    description:
      "Citadine premium compacte avec boîte S-Tronic et finition Advanced. L'Audi A1 Sportback combine élégance, technologie et agilité urbaine dans un design sophistiqué.",
    equipment: [
      "Boîte S-Tronic",
      "MMI Navigation plus",
      "Audi Virtual Cockpit",
      "Audi Pre Sense",
    ],
    options: [
      "Pack S-Line extérieur",
      "Toit contrastant noir",
      "Éclairage Matrix LED",
      "Bang & Olufsen",
    ],
    warranty: "Garantie Audi 3 ans ou 100 000 km",
  },
];

const VehicleDetail = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<VehicleProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock additional images for carousel
  const getVehicleImages = (mainImage: string) => [
    mainImage,
    mainImage.replace("w=800", "w=800&auto=format&fit=crop&crop=left"),
    mainImage.replace("w=800", "w=800&auto=format&fit=crop&crop=right"),
    mainImage.replace("w=800", "w=800&auto=format&fit=crop&crop=top"),
  ];

  useEffect(() => {
    const foundVehicle = PREMIUM_VEHICLES.find((v) => v.id === vehicleId);
    setVehicle(foundVehicle || PREMIUM_VEHICLES[0]);
    setLoading(false);
  }, [vehicleId]);

  const scrollToContact = () => {
    const contactElement = document.getElementById("contact");
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading || !vehicle) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E50914]"></div>
      </div>
    );
  }

  const vehicleImages = getVehicleImages(vehicle.image || "");

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicleImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + vehicleImages.length) % vehicleImages.length,
    );
  };

  return (
    <div className="w-full bg-white py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <Button
          variant="ghost"
          className="mb-8 text-gray-600 hover:text-gray-900 font-inter"
          onClick={() => navigate("/vehicules")}
        >
          <ArrowLeft size={18} className="mr-2" /> Retour au catalogue
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Carousel */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[4/3] rounded-lg overflow-hidden mb-6 bg-gray-100"
            >
              <img
                src={vehicleImages[currentImageIndex]}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-200"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-200 rotate-180"
              >
                <ArrowLeft size={20} />
              </button>

              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {vehicleImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex
                        ? "bg-[#E50914]"
                        : "bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Vehicle Details */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-4 font-premium leading-tight">
                {vehicle.name}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-light text-[#E50914] font-premium">
                    {vehicle.price?.toLocaleString()}€
                  </span>
                  <span className="text-xl text-gray-600 font-inter">
                    {vehicle.monthlyRent}€/mois
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-gray-600 font-inter">
                  <MapPin size={18} className="mr-3 text-[#E50914]" />
                  <span>{vehicle.city}</span>
                </div>
                <div className="flex items-center text-gray-600 font-inter">
                  <Calendar size={18} className="mr-3 text-[#E50914]" />
                  <span>Publié le {vehicle.publishDate}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3 font-premium">
                  Description
                </h3>
                <p className="text-gray-600 font-inter leading-relaxed">
                  {vehicle.description}
                </p>
              </div>

              {/* Equipment */}
              {vehicle.equipment && vehicle.equipment.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 font-premium">
                    Équipements
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {vehicle.equipment.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center text-gray-600 font-inter"
                      >
                        <CheckCircle
                          size={16}
                          className="mr-2 text-green-500"
                        />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Options */}
              {vehicle.options && vehicle.options.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 font-premium">
                    Options
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {vehicle.options.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center text-gray-600 font-inter"
                      >
                        <CheckCircle size={16} className="mr-2 text-blue-500" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warranty */}
              {vehicle.warranty && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 font-premium">
                    Garantie
                  </h3>
                  <p className="text-gray-600 font-inter">{vehicle.warranty}</p>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button className="w-full bg-[#E50914] hover:bg-[#E50914]/90 text-white font-inter font-medium py-3">
                  Demander un devis
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-900 hover:bg-gray-50 font-inter font-medium py-3"
                  onClick={scrollToContact}
                >
                  Nous contacter
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 bg-gray-50 rounded-lg p-8"
        >
          <h3 className="text-xl font-medium text-gray-900 mb-6 font-premium text-center">
            Intéressé par ce véhicule ?
          </h3>

          <form className="max-w-2xl mx-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder="Votre nom"
                  className="pl-10 bg-white border-gray-300 text-gray-900 font-inter"
                />
              </div>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  type="email"
                  placeholder="Votre email"
                  className="pl-10 bg-white border-gray-300 text-gray-900 font-inter"
                />
              </div>
            </div>

            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Votre téléphone"
                className="pl-10 bg-white border-gray-300 text-gray-900 font-inter"
              />
            </div>

            <div>
              <Textarea
                placeholder="Votre message (optionnel)"
                className="bg-white border-gray-300 text-gray-900 min-h-[100px] font-inter"
              />
            </div>

            <Button className="w-full bg-[#E50914] hover:bg-[#E50914]/90 text-white font-inter font-medium py-3">
              Envoyer ma demande
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VehicleDetail;
