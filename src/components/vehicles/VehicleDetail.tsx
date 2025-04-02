import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { VehicleProps } from "./VehicleCard";
import {
  Calendar,
  Fuel,
  Gauge,
  Info,
  Mail,
  User,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import { MOCK_VEHICLES } from "../sections/VehicleListingsSection";

const VehicleDetail = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [vehicle, setVehicle] = useState<VehicleProps | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundVehicle = MOCK_VEHICLES.find((v) => v.id === vehicleId);
    setVehicle(foundVehicle || MOCK_VEHICLES[0]);
    setLoading(false);
  }, [vehicleId]);

  if (loading || !vehicle) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#DA1212]"></div>
      </div>
    );
  }

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  return (
    <div className="w-full bg-black py-12 px-4">
      <div className="container mx-auto">
        <Button
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white"
          onClick={() => navigate("/vehicules")}
        >
          <ArrowLeft size={18} className="mr-2" /> Retour au catalogue
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[4/3] rounded-lg overflow-hidden mb-6"
            >
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-[#DA1212] text-white text-sm font-bold px-3 py-1 rounded">
                {vehicle.category}
              </div>
            </motion.div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Vue 360°</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-400 border-gray-700"
                  onClick={toggleRotation}
                >
                  <RotateCcw size={16} className="mr-2" />
                  {isRotating ? "Arrêter la rotation" : "Rotation auto"}
                </Button>
              </div>
              <div className="aspect-[16/9] bg-gray-800 rounded-lg overflow-hidden">
                <Canvas className="w-full h-full">
                  <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                  <OrbitControls
                    autoRotate={isRotating}
                    enableZoom={true}
                    enablePan={true}
                  />
                  <ambientLight intensity={0.5} />
                  <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                  />
                  <Environment preset="city" />

                  {/* Placeholder mesh - in a real app, you would load a 3D model */}
                  <mesh>
                    <boxGeometry args={[1, 0.4, 2]} />
                    <meshStandardMaterial
                      color={
                        vehicle.category === "Sports" ? "#ff0000" : "#333333"
                      }
                    />
                  </mesh>
                </Canvas>
              </div>
            </div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {vehicle.name}
              </h1>
              <div className="flex items-center mb-6">
                <p className="text-2xl font-bold text-[#DA1212] mr-2">
                  {vehicle.price}€
                </p>
                <p className="text-gray-400">/ mois</p>
              </div>

              <Tabs defaultValue="details" className="mb-8">
                <TabsList className="grid grid-cols-2 gap-4 bg-transparent">
                  <TabsTrigger
                    value="details"
                    onClick={() => setActiveTab("details")}
                    className="data-[state=active]:bg-[#DA1212] data-[state=active]:text-white"
                  >
                    Détails
                  </TabsTrigger>
                  <TabsTrigger
                    value="request"
                    onClick={() => setActiveTab("request")}
                    className="data-[state=active]:bg-[#DA1212] data-[state=active]:text-white"
                  >
                    Demande d'information
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-6">
                  <div className="bg-gray-900 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Caractéristiques
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <div className="bg-[#DA1212] p-2 rounded mr-3">
                          <Calendar size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Année</p>
                          <p className="text-white font-medium">
                            {vehicle.year}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="bg-[#DA1212] p-2 rounded mr-3">
                          <Fuel size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Carburant</p>
                          <p className="text-white font-medium">
                            {vehicle.fuelType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="bg-[#DA1212] p-2 rounded mr-3">
                          <Gauge size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Transmission</p>
                          <p className="text-white font-medium">
                            {vehicle.transmission}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="bg-[#DA1212] p-2 rounded mr-3">
                          <Info size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Catégorie</p>
                          <p className="text-white font-medium">
                            {vehicle.category}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-white mb-3">
                        Options de financement
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-black rounded border border-gray-800">
                          <span className="text-white">LOA - 36 mois</span>
                          <span className="text-[#DA1212] font-bold">
                            {vehicle.price}€/mois
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-black rounded border border-gray-800">
                          <span className="text-white">LLD - 48 mois</span>
                          <span className="text-[#DA1212] font-bold">
                            {Math.round(vehicle.price * 0.9)}€/mois
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-black rounded border border-gray-800">
                          <span className="text-white">Crédit - 60 mois</span>
                          <span className="text-[#DA1212] font-bold">
                            {Math.round(vehicle.price * 1.1)}€/mois
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full mt-6 bg-[#DA1212] hover:bg-[#B50F0F] text-white">
                      Réserver ce véhicule
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="request" className="mt-6">
                  <div className="bg-gray-900 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Je souhaite ce véhicule
                    </h3>

                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <User
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <Input
                            placeholder="Votre nom"
                            className="pl-10 bg-black border-gray-800 text-white"
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
                            className="pl-10 bg-black border-gray-800 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <Input
                          placeholder="Téléphone"
                          className="bg-black border-gray-800 text-white"
                        />
                      </div>

                      <div>
                        <Textarea
                          placeholder="Votre message"
                          className="bg-black border-gray-800 text-white min-h-[120px]"
                        />
                      </div>

                      <Button className="w-full bg-[#DA1212] hover:bg-[#B50F0F] text-white">
                        Envoyer ma demande
                      </Button>
                    </form>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
