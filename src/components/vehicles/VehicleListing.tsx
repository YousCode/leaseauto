import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import VehicleCard, { VehicleProps } from "./VehicleCard";
import { Search, Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import { MOCK_VEHICLES } from "../sections/VehicleListingsSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VehicleListing = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<VehicleProps[]>(MOCK_VEHICLES);
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [fuelType, setFuelType] = useState<string>("all");
  const [transmission, setTransmission] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories from vehicles
  const categories = [
    "all",
    ...new Set(vehicles.map((v) => v.category || "").filter(Boolean)),
  ];

  // Get unique fuel types from vehicles
  const fuelTypes = [
    "all",
    ...new Set(vehicles.map((v) => v.fuelType || "").filter(Boolean)),
  ];

  // Get unique transmission types from vehicles
  const transmissionTypes = [
    "all",
    ...new Set(vehicles.map((v) => v.transmission || "").filter(Boolean)),
  ];

  // Get unique years from vehicles
  const years = [
    "all",
    ...new Set(vehicles.map((v) => v.year?.toString() || "").filter(Boolean)),
  ];

  // Price ranges
  const priceRanges = [
    { label: "Tous les prix", value: "all" },
    { label: "Moins de 300€", value: "0-300" },
    { label: "300€ - 600€", value: "300-600" },
    { label: "600€ - 1000€", value: "600-1000" },
    { label: "Plus de 1000€", value: "1000+" },
  ];

  // Filter vehicles based on all criteria
  const filteredVehicles = vehicles.filter((vehicle) => {
    // Search filter
    const matchesSearch =
      searchValue === "" ||
      vehicle.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      vehicle.brand?.toLowerCase().includes(searchValue.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchValue.toLowerCase());

    // Category filter
    const matchesCategory =
      activeCategory === "all" || vehicle.category === activeCategory;

    // Price range filter
    let matchesPriceRange = true;
    if (priceRange !== "all" && vehicle.price) {
      const [min, max] = priceRange.split("-");
      if (max) {
        matchesPriceRange =
          vehicle.price >= Number(min) && vehicle.price <= Number(max);
      } else if (min.endsWith("+")) {
        const minValue = Number(min.replace("+", ""));
        matchesPriceRange = vehicle.price >= minValue;
      }
    }

    // Fuel type filter
    const matchesFuelType = fuelType === "all" || vehicle.fuelType === fuelType;

    // Transmission filter
    const matchesTransmission =
      transmission === "all" || vehicle.transmission === transmission;

    // Year filter
    const matchesYear = year === "all" || vehicle.year?.toString() === year;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPriceRange &&
      matchesFuelType &&
      matchesTransmission &&
      matchesYear
    );
  });

  const handleVehicleClick = (vehicleId: string) => {
    navigate(`/vehicules/${vehicleId}`);
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Notre Catalogue de Véhicules
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Découvrez notre sélection de véhicules premium disponibles en
            leasing. Trouvez le véhicule qui correspond à vos besoins et à votre
            style.
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Rechercher un véhicule..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white w-full"
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-gray-800 border-gray-700 text-white"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={18} />
              <span>Filtres avancés</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Prix mensuel</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="bg-black border-gray-800">
                    <SelectValue placeholder="Tous les prix" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Carburant</label>
                <Select value={fuelType} onValueChange={setFuelType}>
                  <SelectTrigger className="bg-black border-gray-800">
                    <SelectValue placeholder="Tous les carburants" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    {fuelTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "all" ? "Tous les carburants" : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Transmission</label>
                <Select value={transmission} onValueChange={setTransmission}>
                  <SelectTrigger className="bg-black border-gray-800">
                    <SelectValue placeholder="Toutes les transmissions" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    {transmissionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "all" ? "Toutes les transmissions" : type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Année</label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="bg-black border-gray-800">
                    <SelectValue placeholder="Toutes les années" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y === "all" ? "Toutes les années" : y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Tabs
            defaultValue="all"
            value={activeCategory}
            onValueChange={setActiveCategory}
          >
            <TabsList className="bg-gray-900 border border-gray-800 p-1 overflow-x-auto flex w-full md:w-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-[#DA1212] data-[state=active]:text-white px-4 py-2 capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                {...vehicle}
                onClick={() => handleVehicleClick(vehicle.id || "1")}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">
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
