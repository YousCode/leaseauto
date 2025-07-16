import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";

export interface VehicleProps {
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
      "Véhicule hybride économique et fiable, parfait pour les trajets quotidiens.",
    equipment: [
      "Climatisation automatique",
      "Système multimédia",
      "Caméra de recul",
    ],
    options: ["Jantes alliage", "Vitres teintées", "Toit ouvrant"],
    warranty: "Garantie constructeur 5 ans",
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
    description: "SUV compact hybride au design moderne et distinctif.",
    equipment: [
      "Navigation GPS",
      "Régulateur de vitesse",
      "Détecteur d'angle mort",
    ],
    options: ["Sellerie cuir", "Éclairage LED", "Système audio premium"],
    warranty: "Garantie constructeur 5 ans",
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
      "SUV coupé sportif avec finition M Sport, alliant performance et élégance.",
    equipment: ["Sièges sport", "Volant M Sport", "Suspension sport"],
    options: [
      "Pack M Performance",
      "Toit panoramique",
      "Système Hi-Fi Harman Kardon",
    ],
    warranty: "Garantie BMW 3 ans",
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
      "Compacte premium avec transmission automatique et finition M Sport.",
    equipment: ["Boîte automatique DKG7", "Climatisation bi-zone", "Feux LED"],
    options: [
      "Pack Connected Drive",
      "Sièges chauffants",
      "Rétroviseurs électriques",
    ],
    warranty: "Garantie BMW 3 ans",
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
      "Berline électrique révolutionnaire avec autopilot et superchargeur inclus.",
    equipment: ["Autopilot", "Écran tactile 15 pouces", "Superchargeur"],
    options: ["Peinture nacrée", "Intérieur premium", "Jantes 19 pouces"],
    warranty: "Garantie Tesla 4 ans",
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
      "Citadine premium compacte avec boîte S-Tronic et finition Advanced.",
    equipment: ["Boîte S-Tronic", "MMI Navigation", "Audi Virtual Cockpit"],
    options: ["Pack S-Line", "Toit contrastant", "Éclairage Matrix LED"],
    warranty: "Garantie Audi 3 ans",
  },
];

const VehicleCard = ({
  vehicle,
  onClick,
}: {
  vehicle: VehicleProps;
  onClick: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3 font-premium line-clamp-2">
          {vehicle.name}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-light text-[#E50914] font-premium">
              {vehicle.price?.toLocaleString()}€
            </span>
            <span className="text-lg text-gray-600 font-inter">
              {vehicle.monthlyRent}€/mois
            </span>
          </div>

          <div className="flex items-center text-gray-500 text-sm font-inter">
            <MapPin size={14} className="mr-1" />
            <span>{vehicle.city}</span>
          </div>

          <div className="flex items-center text-gray-500 text-sm font-inter">
            <Calendar size={14} className="mr-1" />
            <span>{vehicle.publishDate}</span>
          </div>
        </div>

        <Button className="w-full bg-transparent hover:bg-[#E50914] text-gray-900 hover:text-white border border-gray-300 hover:border-[#E50914] font-inter font-light transition-all duration-300">
          Voir le véhicule
        </Button>
      </div>
    </motion.div>
  );
};

const VehicleListing = () => {
  const navigate = useNavigate();
  const { data: publishedVehicles = [] } = useVehicles("published");
  const [searchValue, setSearchValue] = useState("");

  // Convert Supabase vehicles to component format or use static fallback
  const vehicles =
    publishedVehicles.length > 0
      ? publishedVehicles.map((v: any) => ({
          id: v.id,
          name: v.title || "Véhicule",
          brand: v.brand,
          model: v.model,
          year: v.year,
          price: v.price,
          monthlyRent: v.monthly,
          image:
            v.images?.[0] ||
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&q=80",
          city: v.city || "Paris",
          publishDate: new Date(v.created_at).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          description: v.description,
          equipment: [],
          options: v.options || [],
          warranty: "Garantie incluse",
        }))
      : PREMIUM_VEHICLES;

  // Filter vehicles based on search
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      searchValue === "" ||
      vehicle.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      vehicle.brand?.toLowerCase().includes(searchValue.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchValue.toLowerCase()) ||
      vehicle.city?.toLowerCase().includes(searchValue.toLowerCase());

    return matchesSearch;
  });

  const handleVehicleClick = (vehicleId: string) => {
    navigate(`/vehicules/${vehicleId}`);
  };

  return (
    <div className="min-h-screen bg-white py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 font-premium tracking-wide">
            Nos Véhicules Disponibles
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-inter leading-relaxed font-light">
            Découvrez notre sélection de véhicules premium disponibles en
            leasing. Trouvez le véhicule qui correspond à vos besoins et à votre
            style.
          </p>
        </motion.div>

        <div className="mb-12">
          <div className="relative max-w-md mx-auto">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Rechercher un véhicule, marque ou ville..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 bg-white border-gray-300 text-gray-900 w-full font-inter"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onClick={() => handleVehicleClick(vehicle.id || "1")}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg font-inter">
                Aucun véhicule ne correspond à votre recherche.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleListing;
