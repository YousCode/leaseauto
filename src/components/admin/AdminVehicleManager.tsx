import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Eye, EyeOff, Shield } from "lucide-react";
import { MOCK_VEHICLES } from "../sections/VehicleListingsSection";
import type { VehicleCardProps } from "../vehicles/VehicleCard";
import VehicleForm from "./VehicleForm";

type ExtendedVehicleProps = VehicleCardProps & {
  id?: string;
  category?: string;
  year?: string | number;
  mileage?: number | string;
  price?: string | number | null;
  registration?: string;
  trim?: string;
  version?: string;
  model?: string;
  [key: string]: any;
};

const AdminVehicleManager = () => {
  const [vehicles, setVehicles] = useState<ExtendedVehicleProps[]>(() =>
    MOCK_VEHICLES.map((vehicle) => ({ ...vehicle })),
  );
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] =
    useState<ExtendedVehicleProps | null>(null);
  const [showConfidentialInfo, setShowConfidentialInfo] = useState(false);

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setIsAddVehicleOpen(true);
  };

  const handleEditVehicle = (vehicle: ExtendedVehicleProps) => {
    setSelectedVehicle(vehicle);
    setIsAddVehicleOpen(true);
  };

  const handleDeleteVehicle = (id: string) => {
    // In a real app, this would call an API to delete the vehicle
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
  };

  const handleFormSubmit = (vehicleData: ExtendedVehicleProps) => {
    // In a real app, this would call an API to add or update the vehicle
    if (selectedVehicle) {
      // Update existing vehicle
      setVehicles(
        vehicles.map((vehicle) =>
          vehicle.id === selectedVehicle.id
            ? { ...vehicle, ...vehicleData }
            : vehicle,
        ),
      );
    } else {
      // Add new vehicle
      const newVehicle = {
        ...vehicleData,
        id: `${vehicles.length + 1}`,
      };
      setVehicles([...vehicles, newVehicle]);
    }
    setIsAddVehicleOpen(false);
    setSelectedVehicle(null);
  };

  const toggleConfidentialInfo = () => {
    setShowConfidentialInfo(!showConfidentialInfo);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Véhicules</h2>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={toggleConfidentialInfo}
            className="border-gray-700"
          >
            {showConfidentialInfo ? (
              <>
                <EyeOff size={16} className="mr-2" /> Masquer les infos
                confidentielles
              </>
            ) : (
              <>
                <Eye size={16} className="mr-2" /> Afficher les infos
                confidentielles
              </>
            )}
          </Button>
          <Button
            className="bg-[#DA1212] hover:bg-[#B50F0F]"
            onClick={handleAddVehicle}
          >
            <Plus size={18} className="mr-2" /> Ajouter un véhicule
          </Button>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-gray-800/50">
                <TableHead className="text-gray-400">Véhicule</TableHead>
                {showConfidentialInfo && (
                  <TableHead className="text-gray-400">
                    <div className="flex items-center">
                      <Shield size={14} className="mr-1 text-amber-400" />
                      Immatriculation
                    </div>
                  </TableHead>
                )}
                <TableHead className="text-gray-400">Catégorie</TableHead>
                <TableHead className="text-gray-400">Année</TableHead>
                <TableHead className="text-gray-400">Kilométrage</TableHead>
                <TableHead className="text-gray-400">Prix</TableHead>
                <TableHead className="text-gray-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow
                  key={vehicle.id}
                  className="border-gray-800 hover:bg-gray-800/50"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded overflow-hidden bg-gray-800">
                        {vehicle.image && (
                          <img
                            src={vehicle.image}
                            alt={vehicle.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{vehicle.name}</div>
                        <div className="text-sm text-gray-400">
                          {vehicle.brand} {vehicle.model} {vehicle.trim}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  {showConfidentialInfo && (
                    <TableCell>
                      <div className="px-2 py-1 bg-amber-400/10 border border-amber-400/20 rounded text-amber-400 text-xs inline-block">
                        {vehicle.registration || "Non renseigné"}
                      </div>
                    </TableCell>
                  )}
                  <TableCell>{vehicle.category}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>
                    {vehicle.mileage
                      ? `${vehicle.mileage.toLocaleString()} km`
                      : "N/A"}
                  </TableCell>
                  <TableCell>{vehicle.price}€/mois</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditVehicle(vehicle)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVehicle(vehicle.id || "1")}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedVehicle ? "Modifier le véhicule" : "Ajouter un véhicule"}
            </DialogTitle>
          </DialogHeader>
          <VehicleForm
            vehicle={selectedVehicle || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsAddVehicleOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVehicleManager;
