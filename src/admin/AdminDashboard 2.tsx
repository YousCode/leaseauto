import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  LogOut,
  Trash2,
  Plus,
  Upload,
  X,
  Loader2,
  Camera,
  ChevronLeft,
  ChevronRight,
  Car,
  Calendar,
  Settings,
  Euro,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { FinanceSection } from "./FinanceSection";

interface Vehicle {
  id: number;
  images: string[];
  title: string;
  brand: string;
  model: string;
  version: string;
  year: string;
  mileage: string;
  energy: string;
  gearbox: string;
  doors: string;
  seats: string;
  fiscalPower: string;
  dinPower: string;
  power: string;
  color: string;
  firstHand: string;
  inspection: string;
  warranty: string;
  price: string;
  monthly: string;
  city: string;
  description: string;
  options: string[];
  date: string;
  downPayment: string;
  duration: string;
  residualValue: string;
  extendedWarranty: string;
  registrationDate: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<Partial<Vehicle>>({
    images: [],
    title: "",
    brand: "",
    model: "",
    version: "",
    year: "",
    mileage: "",
    energy: "",
    gearbox: "",
    doors: "",
    power: "",
    color: "",
    firstHand: "",
    inspection: "",
    warranty: "",
    price: "",
    monthly: "",
    city: "Épinay-sur-Seine 93800",
    description: "",
    options: [],
    downPayment: "3000",
    duration: "48",
    residualValue: "6000",
    extendedWarranty: "",
    registrationDate: "",
    seats: "",
    fiscalPower: "",
    dinPower: "",
  });

  // Finance section state
  const [apport, setApport] = useState(3000);
  const [duree, setDuree] = useState(48);
  const [valeurRes, setValeurRes] = useState(6000);
  const [showVR, setShowVR] = useState(true); // For now, always show VR slider

  const availableOptions = [
    "Climatisation",
    "Régulateur de vitesse",
    "Système de navigation GPS",
    "Aide au stationnement",
    "Caméra de recul",
    "Jantes alliage",
    "Bluetooth",
    "Apple CarPlay / Android Auto",
    "Phares LED / Xenon",
    "Détecteur de pluie",
    "Contrôle pression des pneus",
    "Fixations ISOFIX",
    "Alerte franchissement de ligne",
    "Capteur d'angle mort",
    "Bouton démarrage",
    "Smart Key (entrée sans clé)",
    "Système Start & Stop",
    "Éclairage d'ambiance",
    "Wifi embarqué",
  ];

  const brands = [
    "Audi",
    "BMW",
    "Citroën",
    "Dacia",
    "Fiat",
    "Ford",
    "Honda",
    "Hyundai",
    "Kia",
    "Mercedes-Benz",
    "Nissan",
    "Opel",
    "Peugeot",
    "Renault",
    "Seat",
    "Skoda",
    "Toyota",
    "Volkswagen",
    "Volvo",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) =>
    (currentYear - i).toString(),
  );

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin");
  };

  const onDrop = (acceptedFiles: File[]) => {
    const currentImages = form.images || [];
    if (currentImages.length + acceptedFiles.length > 9) {
      toast({
        title: "Limite atteinte",
        description: "Vous ne pouvez ajouter que 9 photos maximum.",
        variant: "destructive",
      });
      return;
    }

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setForm((prev) => ({
          ...prev,
          images: [...(prev.images || []), result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleOptionChange = (option: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      options: checked
        ? [...(prev.options || []), option]
        : (prev.options || []).filter((opt) => opt !== option),
    }));
  };

  const addVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    const requiredFields = [
      "title",
      "brand",
      "model",
      "year",
      "mileage",
      "energy",
      "gearbox",
      "doors",
      "seats",
      "fiscalPower",
      "dinPower",
      "color",
      "firstHand",
      "inspection",
      "price",
      "monthly",
      "description",
      "registrationDate",
    ];

    const missingFields = requiredFields.filter(
      (field) => !form[field as keyof Vehicle],
    );

    if (missingFields.length > 0 || !form.images?.length) {
      toast({
        title: "Champs manquants",
        description:
          "Veuillez remplir tous les champs obligatoires et ajouter au moins une photo.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newVehicle: Vehicle = {
      id: Date.now(),
      images: form.images || [],
      title: form.title || "",
      brand: form.brand || "",
      model: form.model || "",
      version: form.version || "",
      year: form.year || "",
      mileage: form.mileage || "",
      energy: form.energy || "",
      gearbox: form.gearbox || "",
      doors: form.doors || "",
      seats: form.seats || "",
      fiscalPower: form.fiscalPower || "",
      dinPower: form.dinPower || "",
      power: form.power || "",
      color: form.color || "",
      firstHand: form.firstHand || "",
      inspection: form.inspection || "",
      warranty: form.warranty || "",
      price: form.price || "",
      monthly: form.monthly || "",
      city: form.city || "Épinay-sur-Seine 93800",
      description: form.description || "",
      options: form.options || [],
      date: new Date().toLocaleDateString("fr-FR"),
      downPayment: apport.toString(),
      duration: duree.toString(),
      residualValue: valeurRes.toString(),
      extendedWarranty: form.extendedWarranty || "",
      registrationDate: form.registrationDate || "",
    };

    setVehicles([...vehicles, newVehicle]);

    // Reset form
    setForm({
      images: [],
      title: "",
      brand: "",
      model: "",
      version: "",
      year: "",
      mileage: "",
      energy: "",
      gearbox: "",
      doors: "",
      power: "",
      color: "",
      firstHand: "",
      inspection: "",
      warranty: "",
      price: "",
      monthly: "",
      city: "Épinay-sur-Seine 93800",
      description: "",
      options: [],
      downPayment: "3000",
      duration: "48",
      residualValue: "6000",
      extendedWarranty: "",
      registrationDate: "",
      seats: "",
      fiscalPower: "",
      dinPower: "",
    });

    // Reset finance sliders
    setApport(3000);
    setDuree(48);
    setValeurRes(6000);

    setIsLoading(false);
    toast({
      title: "Succès !",
      description: "Véhicule ajouté avec succès.",
    });
  };

  const deleteVehicle = (id: number) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
    toast({
      title: "Véhicule supprimé",
      description: "Le véhicule a été supprimé avec succès.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      {/* Header */}
      <header className="bg-white shadow-sm border-b py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin — Gestion des Véhicules
        </h1>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-gray-600 hover:text-gray-900"
        >
          <LogOut size={18} className="mr-2" /> Déconnexion
        </Button>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Formulaire d'ajout */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-semibold text-gray-900">
              <Plus size={24} className="mr-3" />
              Déposer une annonce véhicule
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Créez une annonce professionnelle pour votre véhicule
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={addVehicle} className="space-y-8">
              {/* Section Photos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Camera className="mr-2" size={20} />
                  Photos du véhicule *
                </h3>
                <p className="text-sm text-gray-600">
                  Ajoutez jusqu'à 9 photos de qualité pour valoriser votre
                  véhicule
                </p>

                {/* Drag & Drop Zone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? "border-[#E50914] bg-red-50 scale-[1.02]"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-3">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    {isDragActive ? (
                      <p className="text-[#E50914] font-medium text-lg">
                        Déposez vos images ici...
                      </p>
                    ) : (
                      <div>
                        <p className="text-gray-700 font-medium text-lg">
                          Glissez-déposez vos images ici
                        </p>
                        <p className="text-gray-500">
                          ou cliquez pour sélectionner des fichiers
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Maximum 9 photos • JPG, PNG acceptés
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grid Preview */}
                {form.images && form.images.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {form.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square"
                        >
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border-2 border-gray-200 group-hover:border-gray-300 transition-all"
                          />
                          <Button
                            type="button"
                            onClick={() => removeImage(index)}
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </Button>
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {index + 1}/9
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Carousel Preview */}
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-3">
                        Aperçu carousel :
                      </p>
                      <Carousel className="w-full max-w-md mx-auto">
                        <CarouselContent>
                          {form.images.map((image, index) => (
                            <CarouselItem key={index}>
                              <div className="aspect-video">
                                <img
                                  src={image}
                                  alt={`Carousel ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </div>
                  </div>
                )}
              </div>

              {/* Section Informations générales */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                  <Car className="mr-2" size={20} />
                  Informations générales
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de l'annonce *
                    </label>
                    <Input
                      type="text"
                      placeholder="ex: Peugeot 3008 GT Line 1.6 PureTech 180ch"
                      value={form.title || ""}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      className="w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marque *
                    </label>
                    <Select
                      value={form.brand || ""}
                      onValueChange={(value) =>
                        setForm({ ...form, brand: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une marque" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modèle *
                    </label>
                    <Input
                      type="text"
                      placeholder="ex: 3008"
                      value={form.model || ""}
                      onChange={(e) =>
                        setForm({ ...form, model: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Version / Finition
                    </label>
                    <Input
                      type="text"
                      placeholder="ex: GT Line, Sport, Elegance"
                      value={form.version || ""}
                      onChange={(e) =>
                        setForm({ ...form, version: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Année de mise en circulation *
                    </label>
                    <Select
                      value={form.year || ""}
                      onValueChange={(value) =>
                        setForm({ ...form, year: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez l'année" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kilométrage *
                    </label>
                    <Input
                      type="number"
                      placeholder="ex: 45000"
                      value={form.mileage || ""}
                      onChange={(e) =>
                        setForm({ ...form, mileage: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Énergie *
                    </label>
                    <Select
                      value={form.energy || ""}
                      onValueChange={(value) =>
                        setForm({ ...form, energy: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type de carburant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Essence">Essence</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Hybride">Hybride</SelectItem>
                        <SelectItem value="Electrique">Électrique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Boîte de vitesse *
                    </label>
                    <Select
                      value={form.gearbox || ""}
                      onValueChange={(value) =>
                        setForm({ ...form, gearbox: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type de boîte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manuelle">Manuelle</SelectItem>
                        <SelectItem value="Automatique">Automatique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de portes *
                    </label>
                    <Select
                      value={form.doors || ""}
                      onValueChange={(value) =>
                        setForm({ ...form, doors: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Nombre de portes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 portes</SelectItem>
                        <SelectItem value="3">3 portes</SelectItem>
                        <SelectItem value="4">4 portes</SelectItem>
                        <SelectItem value="5">5 portes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de places *
                    </label>
                    <Select
                      value={form.seats || ""}
                      onValueChange={(value) =>
                        setForm({ ...form, seats: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Nombre de places" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 places</SelectItem>
                        <SelectItem value="4">4 places</SelectItem>
                        <SelectItem value="5">5 places</SelectItem>
                        <SelectItem value="7">7 places</SelectItem>
                        <SelectItem value="9">9 places</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Puissance fiscale (CV) *
                    </label>
                    <Input
                      type="number"
                      placeholder="ex: 8"
                      value={form.fiscalPower || ""}
                      onChange={(e) =>
                        setForm({ ...form, fiscalPower: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Puissance DIN (ch) *
                    </label>
                    <Input
                      type="number"
                      placeholder="ex: 155"
                      value={form.dinPower || ""}
                      onChange={(e) =>
                        setForm({ ...form, dinPower: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur extérieure *
                    </label>
                    <Input
                      type="text"
                      placeholder="ex: Noir Perla Nera"
                      value={form.color || ""}
                      onChange={(e) =>
                        setForm({ ...form, color: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Première main *
                    </label>
                    <Select
                      value={form.firstHand || ""}
                      onValueChange={(value) =>
                        setForm({ ...form, firstHand: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Première main ?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oui">Oui</SelectItem>
                        <SelectItem value="Non">Non</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contrôle technique *
                    </label>
                    <Select
                      value={form.inspection || ""}
                      onValueChange={(value) =>
                        setForm({ ...form, inspection: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="État du contrôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ok">OK</SelectItem>
                        <SelectItem value="à prévoir">À prévoir</SelectItem>
                        <SelectItem value="Neuf">Neuf</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garantie
                    </label>
                    <Input
                      type="text"
                      placeholder="ex: 12 mois constructeur"
                      value={form.warranty || ""}
                      onChange={(e) =>
                        setForm({ ...form, warranty: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de mise en circulation *
                    </label>
                    <Input
                      type="date"
                      value={form.registrationDate || ""}
                      onChange={(e) =>
                        setForm({ ...form, registrationDate: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix *
                    </label>
                    <Input
                      type="number"
                      placeholder="25000"
                      value={form.price || ""}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loyer / mois *
                    </label>
                    <Input
                      type="number"
                      placeholder="399"
                      value={form.monthly || ""}
                      onChange={(e) =>
                        setForm({ ...form, monthly: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <Input
                      type="text"
                      value={form.city || ""}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <Textarea
                      placeholder="Décrivez votre véhicule en détail : état, historique, points forts..."
                      value={form.description || ""}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      rows={6}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                  <Settings className="mr-2" size={20} />
                  Options et équipements
                </h3>
                <p className="text-sm text-gray-600">
                  Sélectionnez les équipements présents sur votre véhicule
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableOptions.map((option) => (
                    <div
                      key={option}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Checkbox
                        id={option}
                        checked={(form.options || []).includes(option)}
                        onCheckedChange={(checked) =>
                          handleOptionChange(option, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={option}
                        className="text-sm font-medium text-gray-700 cursor-pointer flex-1"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Financement */}
              <FinanceSection
                apport={apport}
                setApport={setApport}
                duree={duree}
                setDuree={setDuree}
                valeurRes={valeurRes}
                setValeurRes={setValeurRes}
                showVR={showVR}
                extendedWarranty={form.extendedWarranty || ""}
                setExtendedWarranty={(value) =>
                  setForm({ ...form, extendedWarranty: value })
                }
              />

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#E50914] hover:bg-[#B50F0F] text-white py-4 text-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Ajout en cours...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Ajouter le véhicule
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Liste des véhicules */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Véhicules en ligne ({vehicles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vehicles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Camera className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <p className="text-lg font-medium">Aucun véhicule en ligne</p>
                <p className="text-sm">
                  Utilisez le formulaire ci-dessus pour ajouter votre premier
                  véhicule.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Carousel des images */}
                      <div className="lg:w-1/3">
                        {vehicle.images.length > 0 && (
                          <Carousel className="w-full">
                            <CarouselContent>
                              {vehicle.images.map((image, index) => (
                                <CarouselItem key={index}>
                                  <div className="aspect-video">
                                    <img
                                      src={image}
                                      alt={`${vehicle.title} - ${index + 1}`}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                          </Carousel>
                        )}
                      </div>

                      {/* Informations du véhicule */}
                      <div className="lg:w-2/3 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {vehicle.title}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                              <span>
                                {vehicle.brand} {vehicle.model}
                              </span>
                              <span>•</span>
                              <span>{vehicle.year}</span>
                              <span>•</span>
                              <span>{vehicle.mileage} km</span>
                              <span>•</span>
                              <span>{vehicle.energy}</span>
                              <span>•</span>
                              <span>{vehicle.gearbox}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => deleteVehicle(vehicle.id)}
                            variant="destructive"
                            size="sm"
                            className="bg-[#E50914] hover:bg-[#B50F0F]"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Supprimer
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Prix:</span>
                            <p className="font-semibold text-lg text-[#E50914]">
                              {vehicle.price} €
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Loyer:</span>
                            <p className="font-semibold text-lg text-[#E50914]">
                              {vehicle.monthly} €/mois
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Couleur:</span>
                            <p className="font-medium">{vehicle.color}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Contrôle:</span>
                            <p className="font-medium">{vehicle.inspection}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {vehicle.description}
                          </p>
                        </div>

                        {vehicle.options.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Équipements:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {vehicle.options.map((option, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                                >
                                  {option}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-3 border-t text-xs text-gray-500">
                          <span>{vehicle.city}</span>
                          <span>Ajouté le {vehicle.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
