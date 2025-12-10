import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, X, Plus, FileText } from "lucide-react";
import VehicleModelViewer from "@/components/vehicles/VehicleModelViewer";

interface VehicleFormProps {
  vehicle?: Record<string, any>;
  onSubmit: (vehicleData: any) => void;
  onCancel: () => void;
}

const carBrands = [
  "Audi",
  "BMW",
  "Citroën",
  "Dacia",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Kia",
  "Land Rover",
  "Mazda",
  "Mercedes-Benz",
  "Nissan",
  "Opel",
  "Peugeot",
  "Renault",
  "Seat",
  "Skoda",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

const vehicleTypes = [
  "Berline",
  "Break",
  "Cabriolet",
  "Citadine",
  "Coupé",
  "Crossover",
  "Monospace",
  "SUV",
  "Utilitaire",
  "4x4",
];

const fuelTypes = [
  "Essence",
  "Diesel",
  "Électrique",
  "Hybride",
  "Hybride rechargeable",
  "GPL",
  "Hydrogène",
];

const transmissionTypes = ["Manuelle", "Automatique", "Semi-automatique"];

const critAirOptions = ["0", "1", "2", "3", "4", "5"];

const emissionClasses = [
  "Euro 1",
  "Euro 2",
  "Euro 3",
  "Euro 4",
  "Euro 5",
  "Euro 6",
];

const upholsteryTypes = ["Cuir", "Tissu", "Alcantara", "Mixte", "Simili cuir"];

const commonEquipments = [
  "Climatisation",
  "GPS",
  "Bluetooth",
  "Régulateur de vitesse",
  "Caméra de recul",
  "Toit ouvrant",
  "Sièges chauffants",
  "Jantes alliage",
  "Aide au stationnement",
  "Système audio premium",
  "Apple CarPlay",
  "Android Auto",
  "Phares LED",
  "Démarrage sans clé",
];

const VehicleForm = ({ vehicle, onSubmit, onCancel }: VehicleFormProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const [vehicleData, setVehicleData] = useState<Record<string, any>>(
    vehicle || {},
  );
  const [vehicleImages, setVehicleImages] = useState<File[]>([]);
  const [documents, setDocuments] = useState<{ name: string; file: File }[]>(
    [],
  );
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [model3dPreview, setModel3dPreview] = useState<string | undefined>(
    vehicle?.model3dUrl,
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleEquipmentToggle = (equipment: string) => {
    if (selectedEquipments.includes(equipment)) {
      setSelectedEquipments(
        selectedEquipments.filter((item) => item !== equipment),
      );
    } else {
      setSelectedEquipments([...selectedEquipments, equipment]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      if (vehicleImages.length + newFiles.length <= 20) {
        setVehicleImages([...vehicleImages, ...newFiles]);
      } else {
        alert("Vous ne pouvez pas télécharger plus de 20 images");
      }
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        file,
      }));
      setDocuments([...documents, ...newFiles]);
    }
  };

  const handleModel3DUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const objectUrl = URL.createObjectURL(file);
    setModel3dPreview((previous) => {
      if (previous && previous.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }
      return objectUrl;
    });
    setVehicleData((prev) => ({
      ...prev,
      model3dUrl: objectUrl,
      model3dFileName: file.name,
    }));
  };

  useEffect(() => {
    setModel3dPreview(vehicle?.model3dUrl);
  }, [vehicle]);

  useEffect(() => {
    return () => {
      if (model3dPreview && model3dPreview.startsWith("blob:")) {
        URL.revokeObjectURL(model3dPreview);
      }
    };
  }, [model3dPreview]);

  const removeImage = (index: number) => {
    const updatedImages = [...vehicleImages];
    updatedImages.splice(index, 1);
    setVehicleImages(updatedImages);
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1);
    setDocuments(updatedDocuments);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...vehicleData,
      equipments: selectedEquipments,
      imageCount: vehicleImages.length,
      documentCount: documents.length,
    };
    onSubmit(formData);
  };

  // --------- TOTAL / RÉCAP ---------
  const leaseDuration = 36; // durée en mois (à rendre dynamique si besoin)
  const monthlyPrice = Number(vehicleData.price) || 0;
  const totalPrice = monthlyPrice * leaseDuration;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-[#DA1212] data-[state=active]:text-white"
          >
            Informations générales
          </TabsTrigger>
          <TabsTrigger
            value="technical"
            className="data-[state=active]:bg-[#DA1212] data-[state=active]:text-white"
          >
            Caractéristiques techniques
          </TabsTrigger>
          <TabsTrigger
            value="media"
            className="data-[state=active]:bg-[#DA1212] data-[state=active]:text-white"
          >
            Médias
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="data-[state=active]:bg-[#DA1212] data-[state=active]:text-white"
          >
            Documents confidentiels
          </TabsTrigger>
        </TabsList>

        {/* Informations générales */}
        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registration" className="text-sm text-gray-400">
                Numéro d'immatriculation{" "}
                <span className="text-[#DA1212]">*</span>{" "}
                <span className="text-xs">(confidentiel)</span>
              </Label>
              <Input
                id="registration"
                name="registration"
                value={vehicleData.registration || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800"
                placeholder="AB-123-CD"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand" className="text-sm text-gray-400">
                Marque <span className="text-[#DA1212]">*</span>
              </Label>
              <Select
                name="brand"
                value={vehicleData.brand || ""}
                onValueChange={(value) => handleSelectChange("brand", value)}
              >
                <SelectTrigger className="bg-black border-gray-800">
                  <SelectValue placeholder="Sélectionner une marque" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  {carBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm text-gray-400">
                Modèle <span className="text-[#DA1212]">*</span>
              </Label>
              <Input
                id="model"
                name="model"
                value={vehicleData.model || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800"
                placeholder="ex: 3008"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trim" className="text-sm text-gray-400">
                Finition
              </Label>
              <Input
                id="trim"
                name="trim"
                value={vehicleData.trim || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800"
                placeholder="ex: GT Line"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="version" className="text-sm text-gray-400">
                Version
              </Label>
              <Input
                id="version"
                name="version"
                value={vehicleData.version || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800"
                placeholder="ex: 1.6 THP 155ch"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm text-gray-400">
                Année modèle <span className="text-[#DA1212]">*</span>
              </Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={vehicleData.year || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800"
                placeholder="ex: 2023"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="registrationDate"
                className="text-sm text-gray-400"
              >
                Date de mise en circulation{" "}
                <span className="text-[#DA1212]">*</span>
              </Label>
              <Input
                id="registrationDate"
                name="registrationDate"
                type="date"
                value={vehicleData.registrationDate || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="technicalInspectionDate"
                className="text-sm text-gray-400"
              >
                Date de fin de validité du contrôle technique
              </Label>
              <Input
                id="technicalInspectionDate"
                name="technicalInspectionDate"
                type="date"
                value={vehicleData.technicalInspectionDate || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm text-gray-400">
                Prix (€/mois) <span className="text-[#DA1212]">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={vehicleData.price || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800"
                placeholder="ex: 399"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-sm text-gray-400">
                Couleur
              </Label>
              <Input
                id="color"
                name="color"
                value={vehicleData.color || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800"
                placeholder="ex: Noir Perla Nera"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title" className="text-sm text-gray-400">
                Titre de l'annonce <span className="text-[#DA1212]">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={vehicleData.title || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800"
                placeholder="ex: Peugeot 3008 GT Line 1.6 THP 155ch - Garantie 12 mois"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-sm text-gray-400">
                Description complète <span className="text-[#DA1212]">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={vehicleData.description || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800 min-h-[150px]"
                placeholder="Description détaillée du véhicule..."
                required
              />
            </div>
          </div>
        </TabsContent>

        {/* Caractéristiques techniques */}
        <TabsContent value="technical" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm text-gray-400">
                Type de véhicule <span className="text-[#DA1212]">*</span>
              </Label>
              <Select
                name="category"
                value={vehicleData.category || ""}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className="bg-black border-gray-800">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage" className="text-sm text-gray-400">
                Kilométrage <span className="text-[#DA1212]">*</span>
              </Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                value={vehicleData.mileage || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800"
                placeholder="ex: 45000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fiscalPower" className="text-sm text-gray-400">
                Puissance fiscale (CV)
              </Label>
              <Input
                id="fiscalPower"
                name="fiscalPower"
                type="number"
                value={vehicleData.fiscalPower || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800"
                placeholder="ex: 8"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enginePower" className="text-sm text-gray-400">
                Puissance moteur DIN (ch)
              </Label>
              <Input
                id="enginePower"
                name="enginePower"
                type="number"
                value={vehicleData.enginePower || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800"
                placeholder="ex: 155"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doors" className="text-sm text-gray-400">
                Nombre de portes
              </Label>
              <Input
                id="doors"
                name="doors"
                type="number"
                value={vehicleData.doors || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800"
                placeholder="ex: 5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seats" className="text-sm text-gray-400">
                Nombre de places
              </Label>
              <Input
                id="seats"
                name="seats"
                type="number"
                value={vehicleData.seats || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800"
                placeholder="ex: 5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transmission" className="text-sm text-gray-400">
                Boîte de vitesses <span className="text-[#DA1212]">*</span>
              </Label>
              <Select
                name="transmission"
                value={vehicleData.transmission || ""}
                onValueChange={(value) =>
                  handleSelectChange("transmission", value)
                }
              >
                <SelectTrigger className="bg-black border-gray-800">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  {transmissionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelType" className="text-sm text-gray-400">
                Type de carburant <span className="text-[#DA1212]">*</span>
              </Label>
              <Select
                name="fuelType"
                value={vehicleData.fuelType || ""}
                onValueChange={(value) => handleSelectChange("fuelType", value)}
              >
                <SelectTrigger className="bg-black border-gray-800">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  {fuelTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="licenseRequired"
                className="text-sm text-gray-400"
              >
                Permis requis
              </Label>
              <Select
                name="licenseRequired"
                value={vehicleData.licenseRequired || ""}
                onValueChange={(value) =>
                  handleSelectChange("licenseRequired", value)
                }
              >
                <SelectTrigger className="bg-black border-gray-800">
                  <SelectValue placeholder="Sélectionner une option" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="avec">Avec permis</SelectItem>
                  <SelectItem value="sans">Sans permis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="upholstery" className="text-sm text-gray-400">
                Sellerie
              </Label>
              <Select
                name="upholstery"
                value={vehicleData.upholstery || ""}
                onValueChange={(value) =>
                  handleSelectChange("upholstery", value)
                }
              >
                <SelectTrigger className="bg-black border-gray-800">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  {upholsteryTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="critAir" className="text-sm text-gray-400">
                Crit'Air
              </Label>
              <Select
                name="critAir"
                value={vehicleData.critAir || ""}
                onValueChange={(value) => handleSelectChange("critAir", value)}
              >
                <SelectTrigger className="bg-black border-gray-800">
                  <SelectValue placeholder="Sélectionner une vignette" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  {critAirOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emissionClass" className="text-sm text-gray-400">
                Classe d'émission
              </Label>
              <Select
                name="emissionClass"
                value={vehicleData.emissionClass || ""}
                onValueChange={(value) =>
                  handleSelectChange("emissionClass", value)
                }
              >
                <SelectTrigger className="bg-black border-gray-800">
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  {emissionClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm text-gray-400 block mb-2">
                Équipements
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {commonEquipments.map((equipment) => (
                  <div key={equipment} className="flex items-center space-x-2">
                    <Checkbox
                      id={`equipment-${equipment}`}
                      checked={selectedEquipments.includes(equipment)}
                      onCheckedChange={() => handleEquipmentToggle(equipment)}
                    />
                    <Label
                      htmlFor={`equipment-${equipment}`}
                      className="text-sm cursor-pointer"
                    >
                      {equipment}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label
                htmlFor="additionalEquipment"
                className="text-sm text-gray-400"
              >
                Équipements supplémentaires
              </Label>
              <Textarea
                id="additionalEquipment"
                name="additionalEquipment"
                value={vehicleData.additionalEquipment || ""}
                onChange={handleInputChange}
                className="bg-black border-gray-800 min-h-[100px]"
                placeholder="Autres équipements non listés ci-dessus..."
              />
            </div>
          </div>
        </TabsContent>

        {/* Médias */}
        <TabsContent value="media" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-400 block mb-2">
                Photos du véhicule{" "}
                <span className="text-xs">(max 20 fichiers)</span>
              </Label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer">
                  <div className="flex items-center justify-center px-4 py-2 border border-dashed border-gray-700 rounded-md hover:bg-gray-800/30 transition-colors">
                    <Upload size={18} className="mr-2" />
                    <span>Ajouter des photos</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                <span className="text-sm text-gray-400">
                  {vehicleImages.length} / 20 photos
                </span>
              </div>
            </div>

            {vehicleImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {vehicleImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-[4/3] rounded-md overflow-hidden bg-gray-800">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Vehicle image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-6 border-t border-gray-800">
              <Label className="text-sm text-gray-400 block mb-2">
                Modèle 3D (.glb)
              </Label>
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-4">
                  <label className="cursor-pointer">
                    <div className="flex items-center justify-center px-4 py-2 border border-dashed border-gray-700 rounded-md hover:bg-gray-800/30 transition-colors">
                      <Upload size={18} className="mr-2" />
                      <span>Télécharger un modèle 3D</span>
                    </div>
                    <input
                      type="file"
                      accept=".glb"
                      className="hidden"
                      onChange={handleModel3DUpload}
                    />
                  </label>
                  {model3dPreview ? (
                    <div>
                      <p className="text-sm font-medium text-white">
                        Modèle importé
                      </p>
                      <p className="text-xs text-gray-400">
                        {vehicleData.model3dFileName ?? "Fichier personnalisé"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Importez votre fichier .glb (5 Mo max). Il sera visible
                      sur la fiche et dans l'admin.
                    </p>
                  )}
                </div>
                {model3dPreview ? (
                  <div className="rounded-lg border border-gray-800 bg-black/40 p-3">
                    <VehicleModelViewer
                      src={model3dPreview}
                      className="h-48 rounded-xl border-0"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Documents confidentiels */}
        <TabsContent value="documents" className="space-y-4">
          <div className="p-4 bg-gray-800/30 border border-gray-800 rounded-md mb-4">
            <div className="flex items-center text-amber-400 mb-2">
              <FileText size={18} className="mr-2" />
              <span className="font-medium">
                Zone sécurisée - Documents confidentiels
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Les documents téléchargés dans cette section sont strictement
              confidentiels et ne seront jamais visibles sur l'interface
              publique.
            </p>
          </div>

          <div>
            <Label className="text-sm text-gray-400 block mb-2">
              Documents administratifs
            </Label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer">
                <div className="flex items-center justify-center px-4 py-2 border border-dashed border-gray-700 rounded-md hover:bg-gray-800/30 transition-colors">
                  <Upload size={18} className="mr-2" />
                  <span>Ajouter des documents</span>
                </div>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleDocumentUpload}
                />
              </label>
            </div>
          </div>

          {documents.length > 0 && (
            <div className="space-y-2 mt-4">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-800/30 border border-gray-800 rounded-md"
                >
                  <div className="flex items-center">
                    <FileText size={16} className="mr-2 text-gray-400" />
                    <span className="text-sm">{doc.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Footer : Total + Boutons */}
      <div className="space-y-4 pt-6 border-t border-gray-800">
        <div className="mt-2 grid gap-4 md:grid-cols-[2fr,1fr] items-start">
          <div className="space-y-2 text-sm text-gray-400">
            <p>
              Prix mensuel{" "}
              <span className="font-semibold text-white">
                {monthlyPrice.toFixed(0)} € / mois
              </span>
            </p>
            <p className="text-xs text-gray-500">
              Total estimé sur {leaseDuration} mois :{" "}
              <span className="font-semibold text-white">
                {totalPrice.toLocaleString("fr-FR")} €
              </span>{" "}
              hors frais de mise en route, assurances et options facultatives.
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 px-4 py-3 shadow-lg">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              Récapitulatif du contrat
            </p>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-gray-400">Loyer mensuel</span>
              <span className="text-2xl font-semibold text-white">
                {monthlyPrice.toFixed(0)} €
                <span className="text-xs font-normal text-gray-400">
                  {" "}
                  /mois
                </span>
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <span>Total sur {leaseDuration} mois</span>
              <span className="font-medium text-white">
                {totalPrice.toLocaleString("fr-FR")} €
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="bg-[#DA1212] hover:bg-[#B50F0F]">
            {vehicle ? "Mettre à jour" : "Ajouter le véhicule"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default VehicleForm;
