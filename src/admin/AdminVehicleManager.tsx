// @ts-nocheck
import { useMemo, useState } from "react";
import slugify from "slugify";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import type { VehicleCardProps } from "@/components/vehicles/VehicleCard";
import VehicleForm from "./VehicleForm";
import { useVehicles } from "@/hooks/useVehicles";
import { vehicleService } from "@/services/vehicleService";
import { useToast } from "@/components/ui/use-toast";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&q=80&auto=format&fit=crop";

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
  const { data: remoteVehicles = [], isLoading } = useVehicles();
  const qc = useQueryClient();
  const { toast } = useToast();
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

  const handleDeleteVehicle = async (vehicle: ExtendedVehicleProps) => {
    const { id, slug, title, brand, model } = vehicle;
    if (!id && !slug) {
      toast({
        title: "❌ Suppression impossible",
        description: "Identifiant manquant pour ce véhicule.",
        variant: "destructive",
      });
      return;
    }

    const label = title || `${brand ?? ""} ${model ?? ""}`.trim() || "ce véhicule";
    const confirmed = window.confirm(
      `Supprimer définitivement ${label} ? Cette action est irréversible.`,
    );
    if (!confirmed) {
      toast({
        title: "Suppression annulée",
        description: "Aucune action n'a été réalisée.",
      });
      return;
    }

    try {
      await vehicleService.delete({ id, slug });
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      toast({
        title: "✅ Véhicule supprimé",
        description: `${label} a été retiré.`,
      });
    } catch (error: any) {
      toast({
        title: "❌ Suppression impossible",
        description: error?.message ?? "Vérifie les droits Supabase (RLS).",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (vehicleData: ExtendedVehicleProps) => {
    const baseSlug =
      vehicleData.slug ||
      slugify(
        vehicleData.title ||
          `${vehicleData.brand ?? ""} ${vehicleData.model ?? ""} ${vehicleData.version ?? ""}`,
        { lower: true, strict: true, locale: "fr" },
      );
    const uniqueSlug =
      baseSlug && baseSlug.trim().length > 0
        ? baseSlug
        : `vehicule-${crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Date.now()}`;

    const images =
      (vehicleData.images && vehicleData.images.length > 0
        ? vehicleData.images
        : vehicleData.image
          ? [vehicleData.image]
          : [FALLBACK_IMAGE]) || [FALLBACK_IMAGE];
    const priceNumber =
      typeof vehicleData.price === "string"
        ? Number(vehicleData.price.replace(/[^\d]/g, "")) || null
        : vehicleData.price ?? null;
    const monthlyNumber =
      typeof vehicleData.monthly === "string"
        ? Number(vehicleData.monthly.replace(/[^\d]/g, "")) || priceNumber
        : vehicleData.monthly ?? priceNumber;
    const safeTitle =
      vehicleData.title ||
      `${vehicleData.brand ?? ""} ${vehicleData.model ?? ""} ${vehicleData.version ?? ""}`.trim() ||
      uniqueSlug;

    const payload = {
      // Colonnes présentes dans la table Supabase "vehicles"
      slug: uniqueSlug,
      title: safeTitle,
      status: "published",
      brand: vehicleData.brand ?? null,
      model: vehicleData.model ?? null,
      price: vehicleData.totalPrice
        ? Number(vehicleData.totalPrice) || priceNumber
        : priceNumber,
      monthly: monthlyNumber,
      year: vehicleData.year ? Number(vehicleData.year) : null,
      mileage: vehicleData.mileage ? Number(vehicleData.mileage) : null,
      energy: vehicleData.fuelType ?? vehicleData.energy ?? null,
      gearbox: vehicleData.transmission ?? vehicleData.gearbox ?? null,
      color: vehicleData.color ?? null,
      doors: vehicleData.doors ? Number(vehicleData.doors) : null,
      city: vehicleData.city ?? null,
      power_din: vehicleData.enginePower ? Number(vehicleData.enginePower) : null,
      power_fiscal: vehicleData.fiscalPower ? Number(vehicleData.fiscalPower) : null,
      critair: vehicleData.critAir ? Number(vehicleData.critAir) : null,
      description: vehicleData.description ?? null,
      options: vehicleData.equipments ?? vehicleData.options ?? null,
      images,
    };

    try {
      if (selectedVehicle?.id) {
        await vehicleService.update(selectedVehicle.id, payload as any);
        toast({
          title: "Annonce mise à jour",
          description: `${vehicleData.title || baseSlug} a été mise à jour.`,
        });
      } else {
        await vehicleService.create(payload as any);
        toast({
          title: "Annonce créée",
          description: `${vehicleData.title || baseSlug} est publiée.`,
        });
      }

      qc.invalidateQueries({ queryKey: ["vehicles"], exact: false });
      setIsAddVehicleOpen(false);
      setSelectedVehicle(null);
    } catch (error: any) {
      try {
        localStorage.setItem(
          "lastFailedVehiclePayload",
          JSON.stringify({ vehicleData, payload }),
        );
      } catch {
        // ignore storage errors
      }
      const reason =
        error?.message ||
        "Insertion bloquée (vérifie RLS Supabase ou les colonnes obligatoires).";
      alert(`Impossible d'enregistrer l'annonce : ${reason}`);
      toast({
        title: "Enregistrement impossible",
        description: reason,
        variant: "destructive",
      });
    }
  };

  const toggleConfidentialInfo = () => {
    setShowConfidentialInfo(!showConfidentialInfo);
  };

  const totalVehicles = useMemo(
    () => (Array.isArray(remoteVehicles) ? remoteVehicles.length : 0),
    [remoteVehicles],
  );

  const formatMileage = (value: number | string | null | undefined) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "number") return `${value.toLocaleString()} km`;
    if (typeof value === "string") return value.includes("km") ? value : `${value} km`;
    return "N/A";
  };

  const formatAmount = (
    value: number | string | null | undefined,
    suffix: "/mois" | "€" | string = "€",
  ) => {
    if (value === null || value === undefined) return "N/A";
    const numeric =
      typeof value === "number" ? value : Number(String(value).replace(/[^\d]/g, ""));
    if (!Number.isFinite(numeric)) return String(value);
    const formatted = numeric.toLocaleString();
    return suffix ? `${formatted} ${suffix}` : formatted;
  };

  // Compat helper (évite toute régression si une référence à l’ancien nom subsiste)
  const formatPrice = formatAmount;

  const getPrimaryImage = (vehicle: any) => {
    if (vehicle.image) return vehicle.image;
    if (Array.isArray(vehicle.images) && vehicle.images.length > 0) {
      return vehicle.images[0];
    }
    return null;
  };

  const publishedCount = remoteVehicles.filter((v: any) => v.status === "published").length;
  const draftCount = remoteVehicles.filter((v: any) => v.status !== "published").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1020] via-[#0d1224] to-[#0b0f1c] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#7f8bb0]">Admin</p>
            <h1 className="text-3xl font-bold mt-2">Parc véhicules</h1>
            <p className="text-sm text-gray-400">Pilote les annonces, photos et statuts en un coup d’œil.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={toggleConfidentialInfo}
              className="border-white/10 bg-white/5 hover:bg-white/10"
            >
              {showConfidentialInfo ? (
                <>
                  <EyeOff size={16} className="mr-2" /> Masquer infos immatriculation
                </>
              ) : (
                <>
                  <Eye size={16} className="mr-2" /> Afficher infos immatriculation
                </>
              )}
            </Button>
            <Button
              className="bg-gradient-to-r from-[#DA1212] to-[#f43f5e] hover:opacity-90 shadow-lg shadow-[#da1212]/30"
              onClick={handleAddVehicle}
            >
              <Plus size={18} className="mr-2" /> Nouveau véhicule
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardContent className="py-4">
              <p className="text-xs uppercase text-gray-400">Total</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold">{totalVehicles}</span>
                <Badge className="bg-white/10 text-white border-white/20">Toutes</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardContent className="py-4">
              <p className="text-xs uppercase text-gray-400">En ligne</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold text-emerald-300">{publishedCount}</span>
                <Badge className="bg-emerald-500/10 text-emerald-200 border-emerald-500/30">Publié</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardContent className="py-4">
              <p className="text-xs uppercase text-gray-400">Brouillons / à revoir</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold text-amber-300">{draftCount}</span>
                <Badge className="bg-amber-500/10 text-amber-200 border-amber-500/30">Hors ligne</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          {remoteVehicles.map((vehicle: any) => (
            <div
              key={vehicle.id}
              className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 hover:border-[#DA1212]/40 hover:shadow-[0_10px_50px_-20px_rgba(218,18,18,0.7)] transition"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-52 h-36 overflow-hidden rounded-xl bg-black/40 border border-white/5">
                  {getPrimaryImage(vehicle) ? (
                    <img
                      src={getPrimaryImage(vehicle) as string}
                      alt={vehicle.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-gray-500 text-sm">
                      Pas de photo
                    </div>
                  )}
                  {showConfidentialInfo && (
                    <div className="absolute top-2 left-2 rounded-full bg-black/60 px-3 py-1 text-xs text-amber-200 border border-amber-500/30">
                      <Shield size={12} className="inline mr-1" />
                      {vehicle.registration || "Immat. non renseignée"}
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    {(vehicle.images ?? []).slice(0, 3).map((img: string, idx: number) => (
                      <span
                        key={idx}
                        className="h-8 w-8 rounded-lg border border-white/20 overflow-hidden bg-black/40"
                      >
                        <img src={img} alt={`v-thumb-${idx}`} className="w-full h-full object-cover" />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                        {vehicle.brand || "Marque"} · {vehicle.model || "Modèle"}
                      </p>
                      <h3 className="text-xl font-semibold">{vehicle.title || vehicle.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
                        <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                          {vehicle.year || "Année ?"}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                          {formatMileage(vehicle.mileage)}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                          {vehicle.energy || vehicle.fuel || "Énergie ?"}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
                          {vehicle.gearbox || vehicle.transmission || "Boîte ?"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                          Loyer mensuel
                        </p>
                        <div className="text-2xl font-bold text-white">
                          {formatAmount(
                            vehicle.monthly ??
                              (vehicle as any).monthly_price ??
                              (vehicle as any).price_loa ??
                              (vehicle as any).price_lld ??
                              vehicle.price ??
                              null,
                            "/mois",
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
                          Prix total
                        </p>
                        <div className="text-base font-semibold text-gray-200">
                          {formatAmount(
                            vehicle.price ?? (vehicle as any).totalPrice ?? null,
                            "€",
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge
                      className={`border ${
                        vehicle.status === "published"
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-200"
                          : "bg-amber-500/15 border-amber-500/30 text-amber-200"
                      }`}
                    >
                      {vehicle.status === "published" ? "Publié" : "Hors ligne"}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      {vehicle.city || "Ville non renseignée"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(vehicle.options || []).slice(0, 4).map((opt: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-200"
                      >
                        {opt}
                      </span>
                    ))}
                    {(vehicle.options || []).length > 4 && (
                      <span className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400">
                        +{(vehicle.options || []).length - 4} options
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white bg-white/5 hover:bg-white/10"
                      onClick={() => handleEditVehicle(vehicle)}
                    >
                      <Pencil size={14} className="mr-2" /> Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-400/40 text-red-200 bg-red-500/10 hover:bg-red-500/20"
                      onClick={() => handleDeleteVehicle(vehicle)}
                    >
                      <Trash2 size={14} className="mr-2" /> Supprimer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white bg-white/5 hover:bg-white/10"
                      onClick={() => (vehicle.slug ? window.open(`/vehicules/${vehicle.slug}`, "_blank") : null)}
                    >
                      Aperçu public
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {remoteVehicles.length === 0 && (
            <Card className="bg-white/5 border-dashed border-white/10 text-center py-10">
              <CardContent>
                <p className="text-lg font-semibold">Aucun véhicule pour le moment</p>
                <p className="text-sm text-gray-400 mb-4">
                  Ajoute ta première annonce pour la voir apparaître ici.
                </p>
                <Button
                  className="bg-gradient-to-r from-[#DA1212] to-[#f43f5e]"
                  onClick={handleAddVehicle}
                >
                  <Plus size={16} className="mr-2" /> Ajouter un véhicule
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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
// @ts-nocheck
