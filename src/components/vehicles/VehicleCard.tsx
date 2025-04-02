import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Car, Fuel, Calendar, Settings } from "lucide-react";

export interface VehicleProps {
  id?: string;
  name?: string;
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  image?: string;
  category?: string;
  fuelType?: string;
  transmission?: string;
  onClick?: () => void;
}

const VehicleCard = ({
  id = "1",
  name = "Porsche 911 Carrera",
  brand = "Porsche",
  model = "911 Carrera",
  year = 2023,
  price = 1299,
  image = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
  category = "Sports",
  fuelType = "Essence",
  transmission = "Automatique",
  onClick = () => {},
}: VehicleProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        className={`overflow-hidden transition-all duration-300 bg-black border-gray-800 h-full ${isHovered ? "shadow-xl" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
          />
          <div className="absolute top-2 right-2 bg-[#DA1212] text-white text-xs font-bold px-2 py-1 rounded">
            {category}
          </div>
        </div>

        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-white">{name}</h3>
              <p className="text-gray-400 text-sm">
                {brand} • {year}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[#DA1212] font-bold">{price}€</p>
              <p className="text-gray-400 text-xs">par mois</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
            <div className="flex items-center text-gray-400">
              <Car size={16} className="mr-2 text-[#DA1212]" />
              <span>{model}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Fuel size={16} className="mr-2 text-[#DA1212]" />
              <span>{fuelType}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Calendar size={16} className="mr-2 text-[#DA1212]" />
              <span>{year}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Settings size={16} className="mr-2 text-[#DA1212]" />
              <span>{transmission}</span>
            </div>
          </div>

          <Button
            className={`w-full mt-4 transition-all duration-300 ${isHovered ? "bg-[#DA1212] hover:bg-[#B50F0F]" : "bg-gray-800 hover:bg-gray-700"}`}
          >
            Voir les détails
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VehicleCard;
