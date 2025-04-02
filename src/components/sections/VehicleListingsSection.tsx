import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleCard, { VehicleProps } from "@/components/vehicles/VehicleCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

// Export this so it can be imported in other components
export const MOCK_VEHICLES: VehicleProps[] = [
  {
    id: "1",
    name: "Peugeot 3008 GT",
    brand: "Peugeot",
    model: "3008 GT",
    year: 2023,
    price: 399,
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
    category: "SUV",
    fuelType: "Hybride",
    transmission: "Automatique",
    description:
      "Le SUV Peugeot 3008 GT allie élégance et performance avec son moteur hybride économique et son intérieur haut de gamme. Parfait pour les familles et les trajets urbains.",
  },
  {
    id: "2",
    name: "BMW X5 M Sport",
    brand: "BMW",
    model: "X5 M Sport",
    year: 2023,
    price: 799,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    category: "SUV",
    fuelType: "Essence",
    transmission: "Automatique",
    description:
      "Le BMW X5 M Sport offre une expérience de conduite dynamique avec son moteur puissant et sa technologie de pointe. Son design sportif et son intérieur luxueux en font un SUV d'exception.",
  },
  {
    id: "3",
    name: "Tesla Model Y",
    brand: "Tesla",
    model: "Model Y",
    year: 2023,
    price: 679,
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80",
    category: "Électrique",
    fuelType: "Électrique",
    transmission: "Automatique",
    description:
      "La Tesla Model Y combine performance électrique et espace pratique. Avec son autonomie impressionnante et ses fonctionnalités de conduite autonome, elle représente l'avenir de la mobilité.",
  },
  {
    id: "4",
    name: "Audi Q8 e-tron",
    brand: "Audi",
    model: "Q8 e-tron",
    year: 2023,
    price: 899,
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    category: "SUV",
    fuelType: "Électrique",
    transmission: "Automatique",
    description:
      "L'Audi Q8 e-tron allie le luxe d'un SUV premium à la performance d'une motorisation électrique. Son design élégant et sa technologie avancée en font un véhicule d'exception.",
  },
  {
    id: "5",
    name: "Mercedes-Benz EQS",
    brand: "Mercedes-Benz",
    model: "EQS",
    year: 2023,
    price: 1099,
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
    category: "Berline",
    fuelType: "Électrique",
    transmission: "Automatique",
    description:
      "La Mercedes-Benz EQS redéfinit le luxe électrique avec son design futuriste et son intérieur high-tech. Son autonomie exceptionnelle et son confort inégalé en font la référence des berlines électriques.",
  },
  {
    id: "6",
    name: "Range Rover Sport",
    brand: "Land Rover",
    model: "Range Rover Sport",
    year: 2023,
    price: 949,
    image:
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80",
    category: "SUV",
    fuelType: "Hybride",
    transmission: "Automatique",
    description:
      "Le Range Rover Sport hybride combine capacités tout-terrain légendaires et efficacité énergétique. Son luxe britannique et sa polyvalence en font un SUV premium pour tous les terrains.",
  },
];

const categories = ["Tous", "SUV", "Berline", "Électrique", "Hybride"];

const VehicleListingsSection = () => {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const navigate = useNavigate();

  const filteredVehicles =
    activeCategory === "Tous"
      ? MOCK_VEHICLES
      : activeCategory === "Hybride"
        ? MOCK_VEHICLES.filter((vehicle) => vehicle.fuelType === "Hybride")
        : activeCategory === "Électrique"
          ? MOCK_VEHICLES.filter((vehicle) => vehicle.fuelType === "Électrique")
          : MOCK_VEHICLES.filter(
              (vehicle) => vehicle.category === activeCategory,
            );

  const handleVehicleClick = (vehicleId: string) => {
    navigate(`/vehicules/${vehicleId}`);
  };

  return (
    <div className="w-full bg-black py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Notre <span className="text-[#DA1212]">Sélection</span> de Véhicules
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Découvrez notre collection de véhicules premium disponibles à
            l'achat ou en leasing, avec les derniers modèles des constructeurs
            les plus prestigieux.
          </p>
        </motion.div>

        <Tabs defaultValue="Tous" className="mb-12">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-transparent">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                onClick={() => setActiveCategory(category)}
                className="data-[state=active]:bg-[#DA1212] data-[state=active]:text-white"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <VehicleCard
                {...vehicle}
                onClick={() => handleVehicleClick(vehicle.id || "1")}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button className="bg-transparent hover:bg-[#DA1212] text-white border border-white hover:border-[#DA1212] px-8 py-2">
            Voir tous les véhicules
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default VehicleListingsSection;
