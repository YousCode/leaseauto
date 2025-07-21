import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import slugify from "slugify";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  ArrowLeft,
  Trash2,
  GripVertical,
  Info,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Validation schema
const vehicleSchema = z.object({
  marque: z.string().min(2, "Marque requise"),
  modele: z.string().min(1, "Modèle requis"),
  annee: z.number().int().gte(1990, "Année minimum 1990"),
  kilometrage: z.number().int().positive("Kilométrage requis"),
  carburant: z.enum(["Essence", "Diesel", "Hybride", "Électrique", "GPL"]),
  prix: z.number().gte(1000, "Prix minimum 1000€"),
  images: z.array(z.string()).min(1, "Au moins une photo requise"),
  boite: z.enum(["Manuelle", "Automatique"]),
  loyer: z.number().optional(),
  description: z.string().optional(),
  equipements: z.array(z.string()).optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

// Common brands with logos
const BRANDS = [
  { name: "Audi", logo: "🅰️" },
  { name: "BMW", logo: "🔵" },
  { name: "Mercedes", logo: "⭐" },
  { name: "Volkswagen", logo: "🚗" },
  { name: "Peugeot", logo: "🦁" },
  { name: "Renault", logo: "🔶" },
  { name: "Citroën", logo: "🔺" },
  { name: "Toyota", logo: "🔴" },
  { name: "Honda", logo: "🅷" },
  { name: "Ford", logo: "🔵" },
  { name: "Opel", logo: "⚡" },
  { name: "Nissan", logo: "🔴" },
  { name: "Hyundai", logo: "🅷" },
  { name: "Kia", logo: "🅺" },
  { name: "Mazda", logo: "Ⓜ️" },
  { name: "Seat", logo: "🅢" },
  { name: "Skoda", logo: "🅢" },
  { name: "Volvo", logo: "🔷" },
  { name: "Fiat", logo: "🔴" },
  { name: "Mini", logo: "🔴" },
  { name: "Alfa Romeo", logo: "🐍" },
  { name: "Jeep", logo: "🚙" },
  { name: "Land Rover", logo: "🟢" },
  { name: "Porsche", logo: "🏁" },
  { name: "Tesla", logo: "⚡" },
];

// Equipment options
const EQUIPMENT_OPTIONS = [
  "Climatisation automatique",
  "GPS intégré",
  "Caméra de recul",
  "Régulateur de vitesse",
  "Phares LED",
  "Bluetooth",
  "Apple CarPlay",
  "Android Auto",
  "Jantes alliage",
  "Aide au stationnement",
  "Détecteur d'angle mort",
  "Système audio premium",
  "Sièges chauffants",
  "Toit ouvrant",
  "Sellerie cuir",
  "Volant chauffant",
  "Démarrage sans clé",
  "Freinage d'urgence automatique",
  "Reconnaissance panneaux",
  "Alerte franchissement ligne",
];

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

// Sortable Image Component
function SortableImage({
  image,
  index,
  onRemove,
}: {
  image: ImageFile;
  index: number;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square rounded-lg overflow-hidden border bg-white"
    >
      <img
        src={image.preview}
        alt={`Preview ${index + 1}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

      {/* Order badge */}
      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
        {index + 1}
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={() => onRemove(image.id)}
        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
      >
        <Trash2 size={14} />
      </button>

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute bottom-2 right-2 p-1 bg-black/50 text-white rounded cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical size={14} />
      </div>
    </div>
  );
}

export default function VehicleForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [equipmentSearch, setEquipmentSearch] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const firstErrorRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<VehicleFormData>>({
    marque: "",
    modele: "",
    annee: new Date().getFullYear(),
    kilometrage: 0,
    carburant: "Essence",
    boite: "Manuelle",
    prix: 0,
    loyer: 0,
    description: "",
    equipements: [],
  });
  const [publishNow, setPublishNow] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Dropzone for images
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Check file count limit
      if (images.length + acceptedFiles.length > 12) {
        toast({
          title: "❌ Limite atteinte",
          description: "Max 12 photos – 6 Mo / photo",
          variant: "destructive",
        });
        return;
      }

      // Check for rejected files (size limit)
      if (rejectedFiles.length > 0) {
        toast({
          title: "❌ Fichiers rejetés",
          description: "Max 12 photos – 6 Mo / photo",
          variant: "destructive",
        });
      }

      const newImages = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      }));

      setImages((prev) => [...prev, ...newImages]);
    },
    [images.length, toast],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 6 * 1024 * 1024, // 6MB
    multiple: true,
  });

  // Remove image
  const removeImage = (id: string) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id);
      const removedImage = prev.find((img) => img.id === id);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }
      return updated;
    });
  };

  // Upload images to Supabase
  const uploadImages = async (files: File[]): Promise<string[]> => {
    const bucket = "vehicle-images";
    const folder = crypto.randomUUID();

    try {
      const urls = await Promise.all(
        files.slice(0, 12).map(async (file, i) => {
          const path = `${folder}/${i}_${file.name}`;
          const { error } = await supabase.storage
            .from(bucket)
            .upload(path, file, { upsert: true });

          if (error) {
            toast({
              title: "❌ Échec upload",
              description: `Échec upload photo ${i + 1} / ${files.length}`,
              variant: "destructive",
            });
            throw error;
          }

          return supabase.storage.from(bucket).getPublicUrl(path).data
            .publicUrl;
        }),
      );

      return urls;
    } catch (error) {
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      // Upload images first
      const imageUrls = await uploadImages(images.map((img) => img.file));

      // Validate form data
      const validatedData = vehicleSchema.parse({
        ...formData,
        images: imageUrls,
      });

      setIsSubmitting(true);

      // Generate slug
      const baseSlug = slugify(
        `${validatedData.marque}-${validatedData.modele}-${validatedData.annee}`,
        { lower: true },
      );
      const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`;

      // Create title
      const title = `${validatedData.marque} ${validatedData.modele} ${validatedData.annee}`;

      // Insert vehicle into database
      const { error } = await supabase.from("vehicles").insert([
        {
          slug,
          title,
          brand: validatedData.marque,
          model: validatedData.modele,
          year: validatedData.annee,
          mileage: validatedData.kilometrage,
          energy: validatedData.carburant,
          gearbox: validatedData.boite,
          price: validatedData.prix,
          monthly: validatedData.loyer,
          description: validatedData.description,
          images: validatedData.images,
          options: validatedData.equipements,
          status: publishNow ? "published" : "draft",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      // Success toast based on status
      toast({
        title: publishNow ? "✅ Annonce publiée" : "✅ Brouillon sauvegardé",
        description: publishNow
          ? "Annonce publiée (visible vitrine)"
          : "Brouillon sauvegardé",
      });

      navigate("/admin/vehicles");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);

        // Toast for validation errors
        toast({
          title: "❌ Erreur de validation",
          description: "Veuillez corriger les champs en rouge",
          variant: "destructive",
        });

        // Scroll to first error
        setTimeout(() => {
          firstErrorRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      } else {
        toast({
          title: "❌ Erreur",
          description: `Erreur : ${error.message}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle equipment
  const toggleEquipment = (equipment: string) => {
    setFormData((prev) => ({
      ...prev,
      equipements: prev.equipements?.includes(equipment)
        ? prev.equipements.filter((e) => e !== equipment)
        : [...(prev.equipements || []), equipment],
    }));
  };

  // Remove equipment
  const removeEquipment = (equipment: string) => {
    setFormData((prev) => ({
      ...prev,
      equipements: prev.equipements?.filter((e) => e !== equipment) || [],
    }));
  };

  // Filter equipment based on search
  const filteredEquipment = EQUIPMENT_OPTIONS.filter((eq) =>
    eq.toLowerCase().includes(equipmentSearch.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-4">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/vehicles")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour
          </Button>
          <h1 className="text-lg font-semibold">Nouvelle annonce</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Photos du véhicule
                <Badge variant="outline" className="text-sm">
                  {images.length} / 12
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors mb-4 h-[180px] md:h-44 flex flex-col items-center justify-center ${
                  isDragActive
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <Camera size={48} className="text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {images.length === 0
                    ? "Glissez vos photos — 12 max (6 Mo)"
                    : "Glissez d'autres photos ou cliquez"}
                </p>
                <Button
                  type="button"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                >
                  Ajouter des photos
                </Button>
              </div>

              {/* Image Grid with Drag & Drop */}
              {images.length > 0 && (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={images.map((img) => img.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((image, index) => (
                        <SortableImage
                          key={image.id}
                          image={image}
                          index={index}
                          onRemove={removeImage}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              {errors.images && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.images}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du véhicule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Brand */}
                <div ref={errors.marque ? firstErrorRef : null}>
                  <Label htmlFor="marque" className="flex items-center gap-1">
                    Marque *
                    <Info size={12} className="text-gray-400" />
                  </Label>
                  <Select
                    value={formData.marque}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, marque: value }))
                    }
                  >
                    <SelectTrigger
                      className={errors.marque ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Sélectionner une marque" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANDS.map((brand) => (
                        <SelectItem key={brand.name} value={brand.name}>
                          <div className="flex items-center gap-2">
                            <span>{brand.logo}</span>
                            <span>{brand.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.marque && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.marque}
                    </p>
                  )}
                </div>

                {/* Model */}
                <div>
                  <Label htmlFor="modele">Modèle *</Label>
                  <Input
                    id="modele"
                    value={formData.modele}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        modele: e.target.value,
                      }))
                    }
                    placeholder="ex: A3, Golf, 308..."
                    className={errors.modele ? "border-red-500" : ""}
                  />
                  {errors.modele && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.modele}
                    </p>
                  )}
                </div>

                {/* Year */}
                <div>
                  <Label htmlFor="annee">Année *</Label>
                  <Select
                    value={formData.annee?.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        annee: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger
                      className={errors.annee ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Année" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 35 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.annee && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.annee}
                    </p>
                  )}
                </div>

                {/* Mileage */}
                <div>
                  <Label htmlFor="kilometrage">Kilométrage *</Label>
                  <div className="relative">
                    <Input
                      id="kilometrage"
                      type="number"
                      value={formData.kilometrage}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          kilometrage: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="45000"
                      className={`pr-8 ${errors.kilometrage ? "border-red-500" : ""}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      km
                    </span>
                  </div>
                  {errors.kilometrage && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.kilometrage}
                    </p>
                  )}
                </div>

                {/* Fuel */}
                <div>
                  <Label htmlFor="carburant">Carburant *</Label>
                  <Select
                    value={formData.carburant}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        carburant: value as VehicleFormData["carburant"],
                      }))
                    }
                  >
                    <SelectTrigger
                      className={errors.carburant ? "border-red-500" : ""}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Essence">Essence</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybride">Hybride</SelectItem>
                      <SelectItem value="Électrique">Électrique</SelectItem>
                      <SelectItem value="GPL">GPL</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.carburant && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.carburant}
                    </p>
                  )}
                </div>

                {/* Gearbox */}
                <div>
                  <Label>Boîte de vitesses *</Label>
                  <div className="flex gap-2 mt-2">
                    {["Manuelle", "Automatique"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            boite: type as VehicleFormData["boite"],
                          }))
                        }
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                          formData.boite === type
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <Label htmlFor="prix">Prix (€) *</Label>
                  <Input
                    id="prix"
                    type="number"
                    value={formData.prix}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        prix: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="15990"
                    min="1000"
                    className={errors.prix ? "border-red-500" : ""}
                  />
                  {errors.prix && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.prix}
                    </p>
                  )}
                </div>

                {/* Monthly rent */}
                <div>
                  <Label htmlFor="loyer">Loyer mensuel (€)</Label>
                  <Input
                    id="loyer"
                    type="number"
                    value={formData.loyer}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        loyer: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="299"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Décrivez votre véhicule en détail..."
                  rows={4}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Vous pouvez utiliser le markdown pour la mise en forme
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Équipements
                <Badge variant="outline">
                  {formData.equipements?.length || 0} sélectionnés
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-4">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <Input
                  placeholder="Rechercher un équipement..."
                  value={equipmentSearch}
                  onChange={(e) => setEquipmentSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Selected equipment badges */}
              {formData.equipements && formData.equipements.length > 0 && (
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">
                    Sélectionnés :
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.equipements.map((equipment) => (
                      <Badge
                        key={equipment}
                        variant="default"
                        className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 pr-1"
                      >
                        {equipment}
                        <button
                          type="button"
                          onClick={() => removeEquipment(equipment)}
                          className="ml-1 hover:bg-red-800 rounded-full p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment pills */}
              <div className="flex flex-wrap gap-2">
                {filteredEquipment.map((equipment) => {
                  const isSelected = formData.equipements?.includes(equipment);
                  return (
                    <button
                      key={equipment}
                      type="button"
                      onClick={() => toggleEquipment(equipment)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        isSelected
                          ? "bg-red-100 text-red-800 border border-red-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle size={14} className="inline mr-1" />
                      )}
                      {equipment}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="publish-now"
                    className="text-base font-medium"
                  >
                    Publier maintenant
                  </Label>
                  <p className="text-sm text-gray-500">
                    {publishNow
                      ? "L'annonce sera visible publiquement"
                      : "L'annonce sera sauvegardée en brouillon"}
                  </p>
                </div>
                <Switch
                  id="publish-now"
                  checked={publishNow}
                  onCheckedChange={setPublishNow}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Sticky Submit Button (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg md:hidden">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-red-600 hover:bg-red-700 h-12 text-lg font-medium"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer"
          )}
        </Button>
      </div>

      {/* Desktop Submit Button */}
      <div className="hidden md:block max-w-4xl mx-auto px-4 pb-6">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-red-600 hover:bg-red-700 h-12 text-lg font-medium"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer"
          )}
        </Button>
      </div>
    </div>
  );
}
