import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleCard, {
  VehicleCardProps,
} from "@/components/vehicles/VehicleCard";
import { motion } from "framer-motion";
import { useVehicles } from "@/hooks/useVehicles";

const VehicleListingsSection = () => {
  const navigate = useNavigate();
  const { data: publishedVehicles = [] } = useVehicles("published");

  // Fallback static vehicles for demo
  const staticVehicles: VehicleCardProps[] = [
    {
      slug: "bmw-x2",
      image:
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=640&q=80",
      name: "BMW X2 F39 SDRIVE 20iA 192 CH M SPORT",
      price: "26990",
      monthly: "548",
      city: "Épinay-sur-Seine 93800",
      date: "2024-01-15",
    },
    {
      slug: "tesla-model-3",
      image:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=640&q=80",
      name: "TESLA MODEL 3 STANDARD PLUS RWD MY22",
      price: "27990",
      monthly: "493",
      city: "Levallois-Perret 92300",
      date: "2024-01-05",
    },
    {
      slug: "audi-a1",
      image:
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=640&q=80",
      name: "AUDI A1 SPORTBACK 30 TFSI 110 CH ADVANCED",
      price: "26990",
      monthly: "466",
      city: "Paris 75017",
      date: "2024-02-01",
    },
    {
      slug: "toyota-corolla",
      image:
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=640&q=80",
      name: "TOYOTA COROLLA TOURING 1.8 HYBRID SPORTS ACTIVE",
      price: "22990",
      monthly: "405",
      city: "Épinay-sur-Seine 93800",
      date: "2024-01-20",
    },
    {
      slug: "bmw-serie1",
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=640&q=80",
      name: "BMW SÉRIE 1 F40 120i 178 CH M-SPORT DKG7",
      price: "25990",
      monthly: "466",
      city: "Saint-Denis 93200",
      date: "2024-02-10",
    },
    {
      slug: "skoda-kodiaq",
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=640&q=80",
      name: "SKODA KODIAQ 1.5 TSI 150 CH STYLE DSG7 7 PL",
      price: "32990",
      monthly: "596",
      city: "Argenteuil 95100",
      date: "2024-02-12",
    },
  ];

  // Use published vehicles from Supabase or fallback to static data
  const vehicles =
    publishedVehicles.length > 0
      ? publishedVehicles.map((v: any) => ({
          slug: v.id,
          image:
            v.images?.[0] ||
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&q=80",
          name: v.title || "Véhicule",
          price: v.price?.toString() || "0",
          monthly: v.monthly?.toString() || "0",
          city: v.city || "Paris",
          date: v.created_at || new Date().toISOString(),
        }))
      : staticVehicles;

  const handleVehicleClick = (index: number) => {
    const vehicle = vehicles[index];
    if (vehicle.slug) {
      navigate(`/vehicules/${vehicle.slug}`);
    }
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

        {/* grille responsive */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle, index) => (
            <VehicleCard
              key={vehicle.slug || index}
              {...vehicle}
              onClick={() => handleVehicleClick(index)}
            />
          ))}
        </div>

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

export default VehicleListingsSection;
