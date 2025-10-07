import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleCard, {
  VehicleCardProps,
} from "@/components/vehicles/VehicleCard";
import { motion, AnimatePresence } from "framer-motion";
import { useVehicles } from "@/hooks/useVehicles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Export MOCK_VEHICLES for admin use
export const MOCK_VEHICLES = [
  {
    id: "1",
    slug: "bmw-x2",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=640&q=80",
    name: "BMW X2 F39 SDRIVE 20iA 192 CH M SPORT",
    brand: "BMW",
    model: "X2",
    price: "26990",
    monthly: "548",
    city: "Épinay-sur-Seine 93800",
    date: "2024-01-15",
    category: "suv",
    year: "2022",
    mileage: 25000,
    color: "Noir",
    trim: "M Sport",
    registration: "AB-123-CD",
  },
  {
    id: "2",
    slug: "tesla-model-3",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=640&q=80",
    name: "TESLA MODEL 3 STANDARD PLUS RWD MY22",
    brand: "Tesla",
    model: "Model 3",
    price: "27990",
    monthly: "493",
    city: "Levallois-Perret 92300",
    date: "2024-01-05",
    category: "electriques",
    year: "2022",
    mileage: 18000,
    color: "Blanc",
    trim: "Standard Plus",
    registration: "EF-456-GH",
  },
  {
    id: "3",
    slug: "audi-a1",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=640&q=80",
    name: "AUDI A1 SPORTBACK 30 TFSI 110 CH ADVANCED",
    brand: "Audi",
    model: "A1",
    price: "26990",
    monthly: "466",
    city: "Paris 75017",
    date: "2024-02-01",
    category: "citadines",
    year: "2023",
    mileage: 12000,
    color: "Rouge",
    trim: "Advanced",
    registration: "IJ-789-KL",
  },
];

const VehicleListingsSection = () => {
  const navigate = useNavigate();
  const { data: publishedVehicles = [] } = useVehicles("published");
  const [activeTab, setActiveTab] = useState("all");

  // Use MOCK_VEHICLES as staticVehicles
  const staticVehicles: (VehicleCardProps & { category: string })[] = MOCK_VEHICLES.map(vehicle => ({
    slug: vehicle.slug,
    image: vehicle.image,
    name: vehicle.name,
    price: vehicle.price,
    monthly: vehicle.monthly,
    city: vehicle.city,
    date: vehicle.date,
    category: vehicle.category,
  }));

  // Categorize vehicles based on energy type and model
  const categorizeVehicle = (vehicle: any) => {
    const title = (vehicle.title || vehicle.name || "").toLowerCase();
    const energy = (vehicle.energy || "").toLowerCase();
    const brand = (vehicle.brand || "").toLowerCase();

    if (
      energy.includes("électrique") ||
      energy.includes("electric") ||
      brand.includes("tesla")
    ) {
      return "electriques";
    }
    if (energy.includes("hybride") || energy.includes("hybrid")) {
      return "hybrides";
    }
    if (
      title.includes("suv") ||
      title.includes("x2") ||
      title.includes("x3") ||
      title.includes("kodiaq") ||
      title.includes("c-hr")
    ) {
      return "suv";
    }
    if (
      title.includes("a1") ||
      title.includes("série 1") ||
      title.includes("serie 1") ||
      title.includes("polo") ||
      title.includes("clio")
    ) {
      return "citadines";
    }
    return "autres";
  };

  // Use published vehicles from Supabase or fallback to static data
  const vehicles =
    publishedVehicles.length > 0
      ? publishedVehicles.map((v: any) => ({
          slug: v.slug || v.id,
          image:
            v.images?.[0] ||
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&q=80",
          name: v.title || "Véhicule",
          price: v.price?.toString() || "0",
          monthly: v.monthly?.toString() || "0",
          city: v.city || "Paris",
          date: v.created_at || new Date().toISOString(),
          category: categorizeVehicle(v),
        }))
      : staticVehicles;

  // Filter vehicles by category
  const filteredVehicles =
    activeTab === "all"
      ? vehicles
      : vehicles.filter((v) => v.category === activeTab);

  // Count vehicles by category
  const getCategoryCount = (category: string) => {
    if (category === "all") return vehicles.length;
    return vehicles.filter((v) => v.category === category).length;
  };

  const handleVehicleClick = (index: number) => {
    const vehicle = filteredVehicles[index];
    const slug = vehicle.slug || `vehicle-${index + 1}`;
    navigate(`/vehicules/${slug}`);
  };

  return (
    <section id="vehicles" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* titre */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-light text-gray-900 font-premium tracking-wide">
            Nos&nbsp;Véhicules
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-inter">
            Sélection haut de gamme disponible immédiatement
          </p>
        </motion.header>

        {/* Tabs pour filtrer par catégorie */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
            <TabsTrigger value="all" className="flex items-center gap-2">
              Tous
              <Badge variant="secondary" className="ml-1">
                {getCategoryCount("all")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="suv" className="flex items-center gap-2">
              SUV
              <Badge variant="secondary" className="ml-1">
                {getCategoryCount("suv")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="citadines" className="flex items-center gap-2">
              Citadines
              <Badge variant="secondary" className="ml-1">
                {getCategoryCount("citadines")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="hybrides" className="flex items-center gap-2">
              Hybrides
              <Badge variant="secondary" className="ml-1">
                {getCategoryCount("hybrides")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="electriques"
              className="flex items-center gap-2"
            >
              Électriques
              <Badge variant="secondary" className="ml-1">
                {getCategoryCount("electriques")}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle, index) => (
                    <VehicleCard
                      key={vehicle.slug || index}
                      {...vehicle}
                      onClick={() => handleVehicleClick(index)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg font-inter">
                      Aucun véhicule dans cette catégorie.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>

        {/* CTA global */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <button
            onClick={() => navigate("/vehicules")}
            className="rounded-md bg-[#E50914] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#d40812] font-inter"
          >
            Voir tous les véhicules
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export { VehicleListingsSection };
export default VehicleListingsSection;