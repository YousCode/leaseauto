import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Car,
  MessageSquare,
  Upload,
  Search,
  ShieldCheck,
} from "lucide-react";
import { MOCK_VEHICLES } from "../sections/VehicleListingsSection";
import { VehicleProps } from "../vehicles/VehicleCard";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("vehicles");
  const [vehicles, setVehicles] = useState<VehicleProps[]>(MOCK_VEHICLES);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleProps | null>(
    null,
  );
  const [searchValue, setSearchValue] = useState("");

  // Mock quote requests data
  const quoteRequests = [
    {
      id: "1",
      name: "Jean Dupont",
      email: "jean@example.com",
      phone: "0612345678",
      vehicle: "Peugeot 3008 GT",
      date: "2023-05-15",
    },
    {
      id: "2",
      name: "Marie Laurent",
      email: "marie@example.com",
      phone: "0687654321",
      vehicle: "BMW X5 M Sport",
      date: "2023-05-14",
    },
    {
      id: "3",
      name: "Pierre Martin",
      email: "pierre@example.com",
      phone: "0698765432",
      vehicle: "Tesla Model Y",
      date: "2023-05-13",
    },
  ];

  const handleLogout = () => {
    // In a real app, this would clear auth tokens and redirect
    window.location.href = "/";
  };

  const handleEditVehicle = (vehicle: VehicleProps) => {
    setSelectedVehicle(vehicle);
    setIsAddVehicleOpen(true);
  };

  const handleDeleteVehicle = (id: string) => {
    // In a real app, this would call an API to delete the vehicle
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
  };

  const handleAddOrUpdateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to add or update the vehicle
    setIsAddVehicleOpen(false);
    setSelectedVehicle(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchLower = searchValue.toLowerCase();
    return (
      vehicle.name?.toLowerCase().includes(searchLower) ||
      vehicle.brand?.toLowerCase().includes(searchLower) ||
      vehicle.model?.toLowerCase().includes(searchLower) ||
      vehicle.category?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Header */}
      <header className="bg-gray-900 border-b border-gray-800 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">
            Lease<span className="text-[#DA1212]">Auto</span> Admin
          </h1>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-gray-400 hover:text-white"
        >
          <LogOut size={18} className="mr-2" /> Déconnexion
        </Button>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-900 border-r border-gray-800 p-6 md:min-h-[calc(100vh-64px)]">
          <Tabs
            orientation="vertical"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="flex flex-col items-start space-y-2 bg-transparent">
              <TabsTrigger
                value="vehicles"
                className="w-full justify-start text-left px-2 py-2 data-[state=active]:bg-[#DA1212] data-[state=active]:text-white"
              >
                <Car size={18} className="mr-2" /> Véhicules
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="w-full justify-start text-left px-2 py-2 data-[state=active]:bg-[#DA1212] data-[state=active]:text-white"
              >
                <MessageSquare size={18} className="mr-2" /> Demandes
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="w-full justify-start text-left px-2 py-2 data-[state=active]:bg-[#DA1212] data-[state=active]:text-white"
              >
                <ShieldCheck size={18} className="mr-2" /> Sécurité
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <TabsContent value="vehicles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Véhicules</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <Input
                    placeholder="Rechercher un véhicule..."
                    className="pl-9 bg-gray-800 border-gray-700 w-64"
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                </div>
                <Dialog
                  open={isAddVehicleOpen}
                  onOpenChange={setIsAddVehicleOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-[#DA1212] hover:bg-[#B50F0F]">
                      <Plus size={18} className="mr-2" /> Ajouter un véhicule
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedVehicle
                          ? "Modifier le véhicule"
                          : "Ajouter un véhicule"}
                      </DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handleAddOrUpdateVehicle}
                      className="space-y-4 mt-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-400">
                            Marque
                          </label>
                          <Input
                            defaultValue={selectedVehicle?.brand}
                            className="bg-black border-gray-800"
                            placeholder="ex: Peugeot"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">
                            Modèle
                          </label>
                          <Input
                            defaultValue={selectedVehicle?.model}
                            className="bg-black border-gray-800"
                            placeholder="ex: 3008 GT"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Année</label>
                          <Input
                            type="number"
                            defaultValue={selectedVehicle?.year}
                            className="bg-black border-gray-800"
                            placeholder="ex: 2023"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">
                            Prix (€/mois)
                          </label>
                          <Input
                            type="number"
                            defaultValue={selectedVehicle?.price}
                            className="bg-black border-gray-800"
                            placeholder="ex: 399"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">
                            Catégorie
                          </label>
                          <Input
                            defaultValue={selectedVehicle?.category}
                            className="bg-black border-gray-800"
                            placeholder="ex: SUV"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">
                            Type de carburant
                          </label>
                          <Input
                            defaultValue={selectedVehicle?.fuelType}
                            className="bg-black border-gray-800"
                            placeholder="ex: Hybride"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">
                            Transmission
                          </label>
                          <Input
                            defaultValue={selectedVehicle?.transmission}
                            className="bg-black border-gray-800"
                            placeholder="ex: Automatique"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">
                            URL de l'image
                          </label>
                          <Input
                            defaultValue={selectedVehicle?.image}
                            className="bg-black border-gray-800"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">
                          Description
                        </label>
                        <Textarea
                          defaultValue={selectedVehicle?.description}
                          className="bg-black border-gray-800 min-h-[100px]"
                          placeholder="Description du véhicule..."
                        />
                      </div>
                      <div className="pt-4 border-t border-gray-800">
                        <label className="text-sm text-gray-400 block mb-2">
                          Modèle 3D
                        </label>
                        <div className="flex items-center space-x-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="border-dashed border-gray-700"
                          >
                            <Upload size={18} className="mr-2" /> Télécharger un
                            modèle 3D (.glb)
                          </Button>
                          {selectedVehicle && (
                            <span className="text-sm text-gray-400">
                              model.glb
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddVehicleOpen(false)}
                        >
                          Annuler
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[#DA1212] hover:bg-[#B50F0F]"
                        >
                          {selectedVehicle ? "Mettre à jour" : "Ajouter"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-gray-800/50">
                      <TableHead className="text-gray-400">Véhicule</TableHead>
                      <TableHead className="text-gray-400">Catégorie</TableHead>
                      <TableHead className="text-gray-400">Année</TableHead>
                      <TableHead className="text-gray-400">Prix</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => (
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
                              <div className="font-semibold">
                                {vehicle.name}
                              </div>
                              <div className="text-sm text-gray-400">
                                {vehicle.brand}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{vehicle.category}</TableCell>
                        <TableCell>{vehicle.year}</TableCell>
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
                              onClick={() =>
                                handleDeleteVehicle(vehicle.id || "1")
                              }
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
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <h2 className="text-2xl font-bold">Demandes de Devis</h2>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-gray-800/50">
                      <TableHead className="text-gray-400">Client</TableHead>
                      <TableHead className="text-gray-400">Email</TableHead>
                      <TableHead className="text-gray-400">Téléphone</TableHead>
                      <TableHead className="text-gray-400">Véhicule</TableHead>
                      <TableHead className="text-gray-400">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quoteRequests.map((request) => (
                      <TableRow
                        key={request.id}
                        className="border-gray-800 hover:bg-gray-800/50"
                      >
                        <TableCell className="font-medium">
                          {request.name}
                        </TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.phone}</TableCell>
                        <TableCell>{request.vehicle}</TableCell>
                        <TableCell>{request.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <h2 className="text-2xl font-bold">Paramètres de Sécurité</h2>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">
                    Accès aux données confidentielles
                  </h3>
                  <p className="text-sm text-gray-400">
                    Les données confidentielles (immatriculations, documents
                    administratifs) sont uniquement accessibles aux
                    administrateurs autorisés.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Documents sécurisés</h3>
                  <p className="text-sm text-gray-400">
                    Les documents administratifs téléchargés (carte grise,
                    contrôle technique, etc.) sont stockés de manière sécurisée
                    et ne sont jamais exposés publiquement.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Journaux d'activité</h3>
                  <p className="text-sm text-gray-400">
                    Toutes les actions effectuées dans l'interface
                    d'administration sont enregistrées pour des raisons de
                    sécurité et de traçabilité.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
