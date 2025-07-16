import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Mail,
  User,
  Phone,
  CheckCircle,
  Euro,
  Car,
  Fuel,
  Settings,
  Clock,
  Shield,
  Star,
} from "lucide-react";

interface VehicleProps {
  id?: string;
  images?: string[];
  title?: string;
  brand?: string;
  model?: string;
  version?: string;
  year?: number;
  price?: number;
  monthly?: number;
  mileage?: number;
  energy?: string;
  gearbox?: string;
  doors?: string;
  seats?: string;
  fiscalPower?: string;
  dinPower?: string;
  color?: string;
  firstHand?: string;
  inspection?: string;
  warranty?: string;
  city?: string;
  registrationDate?: string;
  publishDate?: string;
  description?: string;
  options?: string[];
  downPayment?: string;
  duration?: string;
  residualValue?: string;
  extendedWarranty?: string;
}

const PREMIUM_VEHICLES: VehicleProps[] = [
  {
    id: "1",
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80&auto=format&fit=crop&crop=left",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80&auto=format&fit=crop&crop=right",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80&auto=format&fit=crop&crop=top",
    ],
    title: "TOYOTA COROLLA TOURING 1.8i 122 HK HYBRID SPORTS ACTIVE",
    brand: "Toyota",
    model: "Corolla Touring",
    version: "Sports Active",
    year: 2023,
    price: 22990,
    monthly: 405,
    mileage: 45000,
    energy: "Hybride",
    gearbox: "Automatique",
    doors: "5",
    seats: "5",
    fiscalPower: "8",
    dinPower: "122",
    color: "Gris Métallisé",
    firstHand: "Oui",
    inspection: "OK",
    warranty: "Garantie constructeur 5 ans ou 100 000 km",
    city: "Épinay-sur-Seine 93800",
    registrationDate: "2023-03-15",
    publishDate: "15 Janvier 2024",
    description:
      "Véhicule hybride économique et fiable, parfait pour les trajets quotidiens. Cette Toyota Corolla Touring combine efficacité énergétique et espace pratique pour répondre à tous vos besoins de mobilité. Entretien régulier effectué en concession, carnet d'entretien à jour. Véhicule non-fumeur, première main.",
    options: [
      "Climatisation",
      "Système de navigation GPS",
      "Caméra de recul",
      "Régulateur de vitesse",
      "Phares LED / Xenon",
      "Bluetooth",
      "Apple CarPlay / Android Auto",
      "Jantes alliage",
      "Aide au stationnement",
    ],
    downPayment: "3000",
    duration: "48",
    residualValue: "12000",
    extendedWarranty: "Extension possible 24 mois",
  },
];

const VehicleDetailPage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<VehicleProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const foundVehicle = PREMIUM_VEHICLES.find((v) => v.id === vehicleId);
    setVehicle(foundVehicle || PREMIUM_VEHICLES[0]);
    setLoading(false);
  }, [vehicleId]);

  if (loading || !vehicle) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E50914]"></div>
      </div>
    );
  }

  const criteriaData = [
    { label: "Marque", value: vehicle.brand },
    { label: "Modèle", value: vehicle.model },
    { label: "Version", value: vehicle.version },
    { label: "Année", value: vehicle.year },
    { label: "Kilométrage", value: `${vehicle.mileage?.toLocaleString()} km` },
    { label: "Énergie", value: vehicle.energy },
    { label: "Boîte de vitesse", value: vehicle.gearbox },
    { label: "Nombre de portes", value: vehicle.doors },
    { label: "Nombre de places", value: vehicle.seats },
    { label: "Puissance fiscale", value: `${vehicle.fiscalPower} CV` },
    { label: "Puissance DIN", value: `${vehicle.dinPower} ch` },
    { label: "Couleur", value: vehicle.color },
    { label: "Première main", value: vehicle.firstHand },
    { label: "Contrôle technique", value: vehicle.inspection },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    alert("Demande envoyée avec succès ! Nous vous recontacterons rapidement.");
    setContactForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <Button
          variant="ghost"
          className="mb-8 text-gray-600 hover:text-gray-900 font-inter"
          onClick={() => navigate("/vehicules")}
        >
          <ArrowLeft size={18} className="mr-2" /> Retour au catalogue
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <Carousel className="w-full">
                <CarouselContent>
                  {vehicle.images?.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[16/10]">
                        <img
                          src={image}
                          alt={`${vehicle.title} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </motion.div>

            {/* Informations principales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-premium">
                    {vehicle.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1 text-[#E50914]" />
                      <span className="text-sm">{vehicle.city}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1 text-[#E50914]" />
                      <span className="text-sm">
                        Publié le {vehicle.publishDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 text-right">
                  <div className="text-3xl font-bold text-[#E50914] font-premium">
                    {vehicle.price?.toLocaleString()}€
                  </div>
                  <div className="text-lg text-gray-600">
                    {vehicle.monthly}€/mois
                  </div>
                </div>
              </div>

              {/* Badges rapides */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  <Fuel size={14} className="mr-1" />
                  {vehicle.energy}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  <Car size={14} className="mr-1" />
                  {vehicle.mileage?.toLocaleString()} km
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800"
                >
                  <Settings size={14} className="mr-1" />
                  {vehicle.gearbox}
                </Badge>
                {vehicle.firstHand === "Oui" && (
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800"
                  >
                    <Star size={14} className="mr-1" />
                    Première main
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Critères */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 font-premium">
                Critères
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {criteriaData.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between py-2 border-b border-gray-100"
                  >
                    <span className="text-gray-600 font-medium">
                      {item.label}
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Équipements */}
            {vehicle.options && vehicle.options.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-premium">
                  Équipements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vehicle.options.map((option, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle size={16} className="mr-3 text-green-500" />
                      <span className="text-gray-700">{option}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Financement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 font-premium flex items-center">
                <Euro size={20} className="mr-2 text-[#E50914]" />
                Financement
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#E50914]">
                    {vehicle.price?.toLocaleString()}€
                  </div>
                  <div className="text-sm text-gray-600">Prix</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#E50914]">
                    {vehicle.monthly}€
                  </div>
                  <div className="text-sm text-gray-600">Par mois</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#E50914]">
                    {vehicle.downPayment}€
                  </div>
                  <div className="text-sm text-gray-600">Apport</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#E50914]">
                    {vehicle.duration}
                  </div>
                  <div className="text-sm text-gray-600">Mois</div>
                </div>
              </div>
              {vehicle.residualValue && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <strong>Valeur résiduelle:</strong> {vehicle.residualValue}€
                  </div>
                  {vehicle.extendedWarranty && (
                    <div className="text-sm text-blue-800 mt-1">
                      <strong>Garantie:</strong> {vehicle.extendedWarranty}
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 font-premium">
                Description détaillée
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {vehicle.description}
              </p>
            </motion.div>

            {/* Reprise possible */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-gradient-to-r from-[#E50914] to-[#B50F0F] rounded-lg shadow-sm p-6 text-white"
            >
              <h2 className="text-xl font-bold mb-2 font-premium">
                Reprise possible
              </h2>
              <p className="text-white/90">
                Nous reprenons votre ancien véhicule au meilleur prix.
                Estimation gratuite et immédiate. Simplifiez votre changement de
                véhicule avec notre service de reprise.
              </p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-6 sticky top-24"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-premium">
                Intéressé par ce véhicule ?
              </h3>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    placeholder="Votre nom"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    className="pl-10"
                    required
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
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    placeholder="Votre téléphone"
                    value={contactForm.phone}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, phone: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
                <Textarea
                  placeholder="Votre message (optionnel)"
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  className="min-h-[100px]"
                />
                <Button
                  type="submit"
                  className="w-full bg-[#E50914] hover:bg-[#B50F0F] text-white font-medium"
                >
                  Envoyer ma demande
                </Button>
              </form>
            </motion.div>

            {/* Informations showroom */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-premium">
                Lease Auto
              </h3>

              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin size={16} className="mr-3 text-[#E50914] mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Adresse</div>
                    <div className="text-sm text-gray-600">
                      42 Boulevard Foch
                      <br />
                      93800 Épinay-sur-Seine
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone size={16} className="mr-3 text-[#E50914] mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Téléphone</div>
                    <a
                      href="tel:0184218393"
                      className="text-sm text-[#E50914] hover:underline"
                    >
                      01 84 21 83 93
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock size={16} className="mr-3 text-[#E50914] mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Horaires</div>
                    <div className="text-sm text-gray-600">
                      9h30 - 13h30 / 14h30 - 18h30
                      <br />
                      Du lundi au samedi
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Shield size={16} className="mr-3 text-[#E50914] mt-1" />
                  <div>
                    <div className="font-medium text-gray-900">Garantie</div>
                    <div className="text-sm text-gray-600">
                      {vehicle.warranty}
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-4 bg-[#E50914] hover:bg-[#B50F0F] text-white">
                Prendre rendez-vous
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;
