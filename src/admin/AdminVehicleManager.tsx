// @ts-nocheck
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  const formatDeletionError = (raw: any) => {
    const message = raw?.message || raw?.toString?.() || "Erreur inconnue";
    if (message.toLowerCase().includes("storage.delete_object")) {
      return "Suppression bloquée côté Supabase (fonction storage.delete_object absente). Vérifie le trigger ou l'extension Storage dans la base avant de réessayer.";
    }
    if (message.toLowerCase().includes("permission") || message.toLowerCase().includes("policy")) {
      return "Droits insuffisants pour supprimer ce véhicule (RLS ou rôle). Connecte-toi en admin ou ajuste les politiques Supabase.";
    }
    return message;
  };

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
      setDeletingId(id || slug || null);
      await vehicleService.delete({ id, slug });
      const hideKey = id || slug;
      if (hideKey) {
        setHiddenIds((prev) => {
          const next = new Set(prev);
          next.add(hideKey);
          return next;
        });
      }
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      toast({
        title: "✅ Véhicule supprimé",
        description: `${label} a été retiré.`,
      });
    } catch (error: any) {
      toast({
        title: "❌ Suppression impossible",
        description: formatDeletionError(error),
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
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
        ? Number(vehicleData.monthly.replace(/[^\d]/g, "")) || null
        : vehicleData.monthly ?? null;
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
      // Le prix persistant est uniquement celui saisi dans "Prix (€/mois)".
      price: priceNumber,
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

  const visibleVehicles = useMemo(() => {
    return (remoteVehicles as ExtendedVehicleProps[]).filter((v) => {
      const key = v.id || v.slug;
      return key ? !hiddenIds.has(key) : true;
    });
  }, [remoteVehicles, hiddenIds]);

  const totalVehicles = useMemo(
    () => (Array.isArray(visibleVehicles) ? visibleVehicles.length : 0),
    [visibleVehicles],
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

  const publishedCount = visibleVehicles.filter((v: any) => v.status === "published").length;
  const draftCount = visibleVehicles.filter((v: any) => v.status !== "published").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="min-h-screen bg-[#f7f8fb] text-slate-900"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#DA1212]">Admin</p>
            <h1 className="text-3xl font-bold mt-2 text-slate-900">Parc véhicules</h1>
            <p className="text-sm text-slate-600">Pilote les annonces, photos et statuts en un coup d’œil.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={toggleConfidentialInfo}
              className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
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
              className="bg-[#DA1212] hover:bg-[#b50f0f] shadow-lg shadow-[#da1212]/30"
              onClick={handleAddVehicle}
            >
              <Plus size={18} className="mr-2" /> Nouveau véhicule
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total", value: totalVehicles, badge: "Toutes", badgeCls: "bg-slate-100 text-slate-700 border-slate-200", valCls: "" },
            { label: "En ligne", value: publishedCount, badge: "Publié", badgeCls: "bg-emerald-100 text-emerald-700 border-emerald-200", valCls: "text-emerald-600" },
            { label: "Brouillons / à revoir", value: draftCount, badge: "Hors ligne", badgeCls: "bg-amber-100 text-amber-700 border-amber-200", valCls: "text-amber-600" },
          ].map(({ label, value, badge, badgeCls, valCls }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: "easeOut", delay: 0.08 + i * 0.07 }}
            >
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardContent className="py-4">
                  <p className="text-xs uppercase text-slate-500">{label}</p>
                  <div className="flex items-end justify-between">
                    <span className={`text-2xl font-semibold ${valCls}`}>{value}</span>
                    <Badge className={badgeCls}>{badge}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
        <div className="grid gap-4">
          {isLoading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-52 h-36 rounded-xl bg-slate-100 flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-3 w-1/4 rounded-full bg-slate-100" />
                      <div className="h-5 w-1/2 rounded-full bg-slate-100" />
                      <div className="flex gap-2">
                        <div className="h-6 w-16 rounded-full bg-slate-100" />
                        <div className="h-6 w-16 rounded-full bg-slate-100" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <div className="h-8 w-24 rounded-lg bg-slate-100" />
                        <div className="h-8 w-20 rounded-lg bg-slate-100" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {visibleVehicles.map((vehicle: any, index: number) => {
            const key = vehicle.id || vehicle.slug;
            const isDeleting = deletingId === key;
            return (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28, ease: "easeOut", delay: Math.min(index * 0.06, 0.35) }}
              className={[
                "group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.12)] hover:shadow-[0_18px_45px_rgba(218,18,18,0.12)] transition-shadow",
                isDeleting ? "opacity-60 blur-[0.2px]" : "",
              ].join(" ")}
            >
              {isDeleting && (
                <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center z-10">
                  <div className="flex items-center gap-2 text-sm text-white">
                    <div className="h-3 w-3 animate-ping rounded-full bg-red-400" />
                    Suppression en cours...
                  </div>
                </div>
              )}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-52 h-36 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                  {getPrimaryImage(vehicle) ? (
                    <img
                      src={getPrimaryImage(vehicle) as string}
                      alt={vehicle.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-slate-400 text-sm">
                      Pas de photo
                    </div>
                  )}
                  {showConfidentialInfo && (
                    <div className="absolute top-2 left-2 rounded-full bg-white/90 px-3 py-1 text-xs text-amber-700 border border-amber-200">
                      <Shield size={12} className="inline mr-1" />
                      {vehicle.registration || "Immat. non renseignée"}
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    {(vehicle.images ?? []).slice(0, 3).map((img: string, idx: number) => (
                      <span
                        key={idx}
                        className="h-8 w-8 rounded-lg border border-white overflow-hidden bg-white"
                      >
                        <img src={img} alt={`v-thumb-${idx}`} className="w-full h-full object-cover" />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        {vehicle.brand || "Marque"} · {vehicle.model || "Modèle"}
                      </p>
                      <h3 className="text-xl font-semibold text-slate-900">{vehicle.title || vehicle.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-slate-600">
                        <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">
                          {vehicle.year || "Année ?"}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">
                          {formatMileage(vehicle.mileage)}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">
                          {vehicle.energy || vehicle.fuel || "Énergie ?"}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">
                          {vehicle.gearbox || vehicle.transmission || "Boîte ?"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Loyer mensuel
                        </p>
                        <div className="text-2xl font-bold text-slate-900">
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
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          Prix total
                        </p>
                        <div className="text-base font-semibold text-slate-900">
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
                          ? "bg-emerald-100 border-emerald-200 text-emerald-700"
                          : "bg-amber-100 border-amber-200 text-amber-700"
                      }`}
                    >
                      {vehicle.status === "published" ? "Publié" : "Hors ligne"}
                    </Badge>
                    <span className="text-sm text-slate-500">
                      {vehicle.city || "Ville non renseignée"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(vehicle.options || []).slice(0, 4).map((opt: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700"
                      >
                        {opt}
                      </span>
                    ))}
                    {(vehicle.options || []).length > 4 && (
                      <span className="text-xs px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-500">
                        +{(vehicle.options || []).length - 4} options
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
                      onClick={() => handleEditVehicle(vehicle)}
                    >
                      <Pencil size={14} className="mr-2" /> Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-700 bg-red-50 hover:bg-red-100"
                      disabled={isDeleting}
                      onClick={() => handleDeleteVehicle(vehicle)}
                    >
                      <Trash2 size={14} className="mr-2" />
                      {isDeleting ? "Suppression..." : "Supprimer"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
                      onClick={() => (vehicle.slug ? window.open(`/vehicules/${vehicle.slug}`, "_blank") : null)}
                    >
                      Aperçu public
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

          {remoteVehicles.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white border-dashed border-slate-200 text-center py-10">
                <CardContent>
                  <p className="text-lg font-semibold text-slate-900">Aucun véhicule pour le moment</p>
                  <p className="text-sm text-slate-500 mb-4">
                    Ajoute ta première annonce pour la voir apparaître ici.
                  </p>
                  <Button
                    className="bg-[#DA1212] hover:bg-[#b50f0f]"
                    onClick={handleAddVehicle}
                  >
                    <Plus size={16} className="mr-2" /> Ajouter un véhicule
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
        </AnimatePresence>
      </div>
    </motion.div>

      <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] sm:max-w-5xl bg-white text-slate-900 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0">
          <DialogHeader className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur px-6 py-4">
            <DialogTitle className="text-xl font-semibold text-slate-900">
              {selectedVehicle ? "Modifier le véhicule" : "Ajouter un véhicule"}
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-5">
            <VehicleForm
              vehicle={selectedVehicle || undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsAddVehicleOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVehicleManager;
// @ts-nocheck
