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
import { Upload, X, Plus, FileText, Calendar } from "lucide-react";
import { uploadVehicleImages } from "@/lib/uploadVehicleImages";

interface VehicleFormProps {
  vehicle?: Record<string, any>;
  onSubmit: (vehicleData: any) => void;
  onCancel: () => void;
}

const carBrands = [
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Bugatti",
  "Citroën",
  "Cupra",
  "Dacia",
  "DS Automobiles",
  "Ferrari",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "Mini",
  "Nissan",
  "Opel",
  "Peugeot",
  "Porsche",
  "Renault",
  "Rolls-Royce",
  "Seat",
  "Skoda",
  "Subaru",
  "Suzuki",
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
  const [imageUrls, setImageUrls] = useState(
    Array.isArray(vehicle?.images) ? vehicle.images.join("\n") : "",
  );
  const [vehicleImages, setVehicleImages] = useState<File[]>([]);
  const [persistedImages, setPersistedImages] = useState<string[]>(
    Array.isArray(vehicle?.images) ? vehicle.images : [],
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<{ name: string; file: File }[]>(
    [],
  );
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>([]);
  const [model3dPreview, setModel3dPreview] = useState<string | undefined>();

  // Réinitialise le formulaire lorsque l'on ouvre un autre véhicule en édition.
  useEffect(() => {
    setVehicleData(vehicle || {});
    const urls = Array.isArray(vehicle?.images) ? vehicle.images : [];
    setImageUrls(urls.join("\n"));
    setPersistedImages(urls);
    setVehicleImages([]);
    setSelectedEquipments(
      Array.isArray(vehicle?.equipments) ? vehicle.equipments : [],
    );
  }, [vehicle]);

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
        // Ces fichiers ne sont pas envoyés à Supabase ici. Préférer des URLs hébergées.
      } else {
        alert("Vous ne pouvez pas télécharger plus de 20 images");
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (vehicleImages.length + files.length <= 20) {
        setVehicleImages([...vehicleImages, ...files]);
      } else {
        alert("Vous ne pouvez pas télécharger plus de 20 images");
      }
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
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

  useEffect(() => {
    if (model3dPreview && model3dPreview.startsWith("blob:")) {
      URL.revokeObjectURL(model3dPreview);
    }
  }, []);

  const removeImage = (index: number) => {
    const updatedImages = [...vehicleImages];
    updatedImages.splice(index, 1);
    setVehicleImages(updatedImages);
  };

  const handleImageUrlsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setImageUrls(value);
    const urls = value
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);
    setVehicleData({ ...vehicleData, images: urls });
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1);
    setDocuments(updatedDocuments);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    // URLs déjà saisies
    const urlsFromTextarea = (Array.isArray(vehicleData.images)
      ? vehicleData.images
      : imageUrls
          .split("\n")
          .map((u) => u.trim())
          .filter(Boolean)) as string[];

    let uploadedUrls: string[] = [];
    if (vehicleImages.length > 0) {
      setIsUploading(true);
      try {
        const vehicleId =
          vehicleData.slug ||
          vehicleData.id ||
          (vehicleData.title ? vehicleData.title.replace(/\s+/g, "-").toLowerCase() : "vehicule") +
            "-" +
            (crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Date.now());
        uploadedUrls = await uploadVehicleImages(vehicleId, vehicleImages);
      } catch (err: any) {
        // On ne bloque plus la soumission : on logge l'erreur mais on continue avec les URLs déjà saisies.
        const msg = err?.message || "Upload des photos impossible (bucket ou droits ?)";
        console.error("Upload images échoué, on continue sans :", msg);
        setUploadError(msg);
      } finally {
        setIsUploading(false);
      }
    }

    const images = [...urlsFromTextarea, ...uploadedUrls].filter(Boolean);
    const finalImages = images.length > 0 ? images : persistedImages;

    const formData = {
      ...vehicleData,
      images: finalImages,
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

  const inputClass =
    "bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#DA1212] focus:ring-[#DA1212]/30 rounded-lg";
  const selectTriggerClass =
    "bg-white border border-slate-200 text-slate-900 font-semibold rounded-lg focus:border-[#DA1212] focus:ring-[#DA1212]/20";
  const selectContentClass =
    "bg-white border border-slate-200 text-slate-900 rounded-lg shadow-xl";
  const selectItemClass =
    "text-slate-900 font-semibold focus:bg-[#DA1212] focus:text-white data-[highlighted]:bg-[#DA1212]/90 data-[highlighted]:text-white";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-[0_20px_60px_rgba(15,23,42,0.16)]"
    >
      {uploadError ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {uploadError} — Les images drop ne sont pas montées, mais l'annonce sera quand même soumise avec les URLs texte/fallback.
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Créer une annonce</h2>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500 mt-1">
            Formulaire fluide · données clés uniquement
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap gap-2 mb-6 bg-slate-100 border border-slate-200 rounded-xl p-1 md:grid md:grid-cols-4">
          <TabsTrigger
            value="general"
            className="rounded-lg text-slate-700 font-semibold data-[state=active]:bg-[#DA1212] data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            Informations générales
          </TabsTrigger>
          <TabsTrigger
            value="technical"
            className="rounded-lg text-slate-700 font-semibold data-[state=active]:bg-[#DA1212] data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            Caractéristiques techniques
          </TabsTrigger>
          <TabsTrigger
            value="media"
            className="rounded-lg text-slate-700 font-semibold data-[state=active]:bg-[#DA1212] data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            Médias
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="rounded-lg text-slate-700 font-semibold data-[state=active]:bg-[#DA1212] data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            Documents confidentiels
          </TabsTrigger>
        </TabsList>

        {/* Informations générales */}
        <TabsContent
          value="general"
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand" className="text-sm text-slate-600">
                Marque <span className="text-[#DA1212]">*</span>
              </Label>
              <Select
                name="brand"
                value={vehicleData.brand || ""}
                onValueChange={(value) => handleSelectChange("brand", value)}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Sélectionner une marque" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  {carBrands.map((brand) => (
                    <SelectItem key={brand} value={brand} className={selectItemClass}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm text-slate-600">
                Modèle <span className="text-[#DA1212]">*</span>
              </Label>
              <Input
                id="model"
                name="model"
                value={vehicleData.model || ""}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="ex: 3008"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trim" className="text-sm text-slate-600">
                Finition
              </Label>
              <Input
                id="trim"
                name="trim"
                value={vehicleData.trim || ""}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="ex: GT Line"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="version" className="text-sm text-slate-600">
                Version
              </Label>
              <Input
                id="version"
                name="version"
                value={vehicleData.version || ""}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="ex: 1.6 THP 155ch"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm text-slate-600">
                Année modèle <span className="text-[#DA1212]">*</span>
              </Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={vehicleData.year || ""}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="ex: 2023"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="registrationDate"
                className="text-sm text-slate-600"
              >
                Date de mise en circulation (MM/AAAA){" "}
                <span className="text-[#DA1212]">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="registrationDate"
                  name="registrationDate"
                  type="month"
                  value={vehicleData.registrationDate || ""}
                  onChange={handleInputChange}
                  className={`${inputClass} cursor-pointer pr-12 appearance-none focus:shadow-[0_0_0_4px_rgba(218,18,18,0.12)]`}
                  required
                />
                <Calendar
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                  Format MM/AAAA
                </span>
                <span>Sélectionnez mois et année via le calendrier.</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm text-slate-600">
                Prix (€/mois) <span className="text-[#DA1212]">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={vehicleData.price || ""}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="ex: 399"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalPrice" className="text-sm text-slate-600">
                Prix total (€)
              </Label>
              <Input
                id="totalPrice"
                name="totalPrice"
                type="number"
                value={vehicleData.totalPrice || ""}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="ex: 28 990"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-sm text-slate-600">
                Couleur
              </Label>
              <Input
                id="color"
                name="color"
                value={vehicleData.color || ""}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="ex: Noir Perla Nera"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title" className="text-sm text-slate-600">
                Titre de l'annonce <span className="text-[#DA1212]">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={vehicleData.title || ""}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="ex: Peugeot 3008 GT Line 1.6 THP 155ch - Garantie 12 mois"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-sm text-slate-600">
                Description complète
              </Label>
              <Textarea
                id="description"
                name="description"
                value={vehicleData.description || ""}
                onChange={handleInputChange}
                className={`${inputClass} min-h-[150px]`}
                placeholder="Description détaillée du véhicule..."
              />
            </div>
          </div>
        </TabsContent>

        {/* Caractéristiques techniques */}
        <TabsContent
          value="technical"
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm text-slate-600">
                Type de véhicule <span className="text-[#DA1212]">*</span>
              </Label>
              <Select
                name="category"
                value={vehicleData.category || ""}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type} value={type} className={selectItemClass}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage" className="text-sm text-slate-600">
                Kilométrage <span className="text-[#DA1212]">*</span>
              </Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                value={vehicleData.mileage || ""}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="ex: 45000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fiscalPower" className="text-sm text-slate-600">
                Puissance fiscale (CV)
              </Label>
              <Input
                id="fiscalPower"
                name="fiscalPower"
                type="number"
                value={vehicleData.fiscalPower || ""}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="ex: 8"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enginePower" className="text-sm text-slate-600">
                Puissance moteur DIN (ch)
              </Label>
              <Input
                id="enginePower"
                name="enginePower"
                type="number"
                value={vehicleData.enginePower || ""}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="ex: 155"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doors" className="text-sm text-slate-600">
                Nombre de portes
              </Label>
              <Input
                id="doors"
                name="doors"
                type="number"
                value={vehicleData.doors || ""}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="ex: 5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seats" className="text-sm text-slate-600">
                Nombre de places
              </Label>
              <Input
                id="seats"
                name="seats"
                type="number"
                value={vehicleData.seats || ""}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="ex: 5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transmission" className="text-sm text-slate-600">
                Boîte de vitesses <span className="text-[#DA1212]">*</span>
              </Label>
              <Select
                name="transmission"
                value={vehicleData.transmission || ""}
                onValueChange={(value) =>
                  handleSelectChange("transmission", value)
                }
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  {transmissionTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-white font-semibold">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelType" className="text-sm text-slate-600">
                Type de carburant <span className="text-[#DA1212]">*</span>
              </Label>
              <Select
                name="fuelType"
                value={vehicleData.fuelType || ""}
                onValueChange={(value) => handleSelectChange("fuelType", value)}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  {fuelTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-white font-semibold">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="licenseRequired"
                className="text-sm text-slate-600"
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
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Sélectionner une option" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="avec" className={selectItemClass}>Avec permis</SelectItem>
                  <SelectItem value="sans" className={selectItemClass}>Sans permis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="upholstery" className="text-sm text-slate-600">
                Sellerie
              </Label>
              <Select
                name="upholstery"
                value={vehicleData.upholstery || ""}
                onValueChange={(value) =>
                  handleSelectChange("upholstery", value)
                }
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  {upholsteryTypes.map((type) => (
                    <SelectItem key={type} value={type} className={selectItemClass}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm text-slate-600 block mb-2">
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
                className="text-sm text-slate-600"
              >
                Équipements supplémentaires
              </Label>
              <Textarea
                id="additionalEquipment"
                name="additionalEquipment"
                value={vehicleData.additionalEquipment || ""}
                onChange={handleInputChange}
                className={`${inputClass} min-h-[100px]`}
                placeholder="Autres équipements non listés ci-dessus..."
              />
            </div>
          </div>
        </TabsContent>

        {/* Médias */}
        <TabsContent
          value="media"
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-lg"
        >
          <div className="space-y-5">
            <div>
              <Label className="text-sm text-slate-600 block mb-2">
                Drag & Drop des photos (png/jpg, max 6 Mo, 20 fichiers)
              </Label>
              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-6 text-sm transition ${
                  isDragging
                    ? "border-[#DA1212] bg-[#DA1212]/10 text-[#DA1212]"
                    : "border-slate-200 bg-slate-50 text-slate-500 hover:border-[#DA1212]"
                }`}
              >
                <Upload size={20} className="mb-2" />
                <span className="text-center">
                  Glissez-déposez vos photos ici ou cliquez pour sélectionner
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              {(persistedImages.length > 0 || vehicleImages.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {persistedImages.map((image, index) => (
                    <div key={`persisted-${index}`} className="relative group">
                      <div className="aspect-[4/3] rounded-md overflow-hidden bg-slate-100">
                        <img
                          src={image}
                          alt={`Vehicle image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setPersistedImages((prev) => prev.filter((_, i) => i !== index))
                        }
                        className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {vehicleImages.map((image, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <div className="aspect-[4/3] rounded-md overflow-hidden bg-slate-100">
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
              {uploadError && (
                <p className="mt-2 text-sm text-red-500">{uploadError}</p>
              )}
              {isUploading && (
                <p className="mt-2 text-sm text-slate-500">
                  Upload en cours…
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm text-slate-600 block">
                URLs des photos (optionnel) — une par ligne
              </Label>
              <Textarea
                value={imageUrls}
                onChange={handleImageUrlsChange}
                className={`${inputClass} min-h-[140px]`}
                placeholder="https://.../photo1.jpg\nhttps://.../photo2.jpg"
              />
              <p className="text-xs text-slate-500">
                Les URLs et les images déposées seront fusionnées et stockées dans
                `images[]` côté Supabase.
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Documents confidentiels */}
        <TabsContent
          value="documents"
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-lg"
        >
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4">
            <div className="flex items-center text-amber-700 mb-2">
              <FileText size={18} className="mr-2" />
              <span className="font-medium">
                Zone sécurisée - Documents confidentiels
              </span>
            </div>
            <p className="text-sm text-amber-800">
              Les documents téléchargés dans cette section sont strictement
              confidentiels et ne seront jamais visibles sur l'interface
              publique.
            </p>
          </div>

          <div>
            <Label className="text-sm text-slate-600 block mb-2">
              Documents administratifs
            </Label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer">
                <div className="flex items-center justify-center px-4 py-2 border border-dashed border-slate-300 rounded-md hover:bg-slate-100 transition-colors">
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
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-md"
                >
                  <div className="flex items-center">
                    <FileText size={16} className="mr-2 text-slate-500" />
                    <span className="text-sm">{doc.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="text-slate-500 hover:text-slate-900 p-1"
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
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div className="mt-2 grid gap-4 md:grid-cols-[2fr,1fr] items-start">
          <div className="space-y-2 text-sm text-slate-600">
            <p>
              Prix mensuel{" "}
              <span className="font-semibold text-slate-900">
                {monthlyPrice.toFixed(0)} € / mois
              </span>
            </p>
            <p className="text-xs text-slate-500">
              Total estimé sur {leaseDuration} mois :{" "}
              <span className="font-semibold text-slate-900">
                {totalPrice.toLocaleString("fr-FR")} €
              </span>{" "}
              hors frais de mise en route, assurances et options facultatives.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 px-4 py-3 shadow-lg">
            <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
              Récapitulatif du contrat
            </p>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-slate-600">Loyer mensuel</span>
              <span className="text-2xl font-semibold text-slate-900">
                {monthlyPrice.toFixed(0)} €
                <span className="text-xs font-normal text-slate-500">
                  {" "}
                  /mois
                </span>
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
              <span>Total sur {leaseDuration} mois</span>
              <span className="font-medium text-slate-900">
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
