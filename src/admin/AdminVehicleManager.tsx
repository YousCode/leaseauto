// @ts-nocheck
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import slugify from "slugify";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Plus, Eye, EyeOff, ExternalLink, Search, Car } from "lucide-react";
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
  const [selectedVehicle, setSelectedVehicle] = useState<ExtendedVehicleProps | null>(null);
  const [showConfidentialInfo, setShowConfidentialInfo] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const formatDeletionError = (raw: any) => {
    const message = raw?.message || raw?.toString?.() || "Erreur inconnue";
    if (message.toLowerCase().includes("storage.delete_object")) {
      return "Suppression bloquée côté Supabase (fonction storage.delete_object absente).";
    }
    if (message.toLowerCase().includes("permission") || message.toLowerCase().includes("policy")) {
      return "Droits insuffisants pour supprimer ce véhicule (RLS).";
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
    if (!id && !slug) return;
    const label = title || `${brand ?? ""} ${model ?? ""}`.trim() || "ce véhicule";
    const confirmed = window.confirm(`Supprimer définitivement "${label}" ?`);
    if (!confirmed) return;

    try {
      setDeletingId(id || slug || null);
      await vehicleService.delete({ id, slug });
      const hideKey = id || slug;
      if (hideKey) setHiddenIds((prev) => new Set([...prev, hideKey]));
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      toast({ title: "Véhicule supprimé", description: label });
    } catch (error: any) {
      toast({ title: "Suppression impossible", description: formatDeletionError(error), variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSubmit = async (vehicleData: ExtendedVehicleProps) => {
    const baseSlug =
      vehicleData.slug ||
      slugify(
        vehicleData.title || `${vehicleData.brand ?? ""} ${vehicleData.model ?? ""} ${vehicleData.version ?? ""}`,
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
      slug: uniqueSlug,
      title: safeTitle,
      status: "published",
      brand: vehicleData.brand ?? null,
      model: vehicleData.model ?? null,
      category: vehicleData.category ?? null,
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
        toast({ title: "Annonce mise à jour", description: safeTitle });
      } else {
        await vehicleService.create(payload as any);
        toast({ title: "Annonce créée", description: safeTitle });
      }
      qc.invalidateQueries({ queryKey: ["vehicles"], exact: false });
      setIsAddVehicleOpen(false);
      setSelectedVehicle(null);
    } catch (error: any) {
      try {
        localStorage.setItem("lastFailedVehiclePayload", JSON.stringify({ vehicleData, payload }));
      } catch {}
      const reason = error?.message || "Vérifiez les colonnes Supabase ou les règles RLS.";
      alert(`Impossible d'enregistrer l'annonce : ${reason}`);
      toast({ title: "Enregistrement impossible", description: reason, variant: "destructive" });
    }
  };

  const getPrimaryImage = (vehicle: any) => {
    if (Array.isArray(vehicle.images) && vehicle.images.length > 0) return vehicle.images[0];
    if (vehicle.image) return vehicle.image;
    return null;
  };

  const formatAmount = (value: any) => {
    if (value === null || value === undefined) return null;
    const n = typeof value === "number" ? value : Number(String(value).replace(/[^\d.,]/g, "").replace(",", "."));
    if (!Number.isFinite(n) || n === 0) return null;
    return Math.round(n).toLocaleString("fr-FR");
  };

  const formatMileage = (value: any) => {
    if (!value) return null;
    const n = typeof value === "number" ? value : Number(String(value).replace(/[^\d]/g, ""));
    if (!n) return null;
    return `${n.toLocaleString("fr-FR")} km`;
  };

  const visibleVehicles = useMemo(() => {
    return (remoteVehicles as ExtendedVehicleProps[]).filter((v) => {
      const key = v.id || v.slug;
      return key ? !hiddenIds.has(key) : true;
    });
  }, [remoteVehicles, hiddenIds]);

  const filteredVehicles = useMemo(() => {
    let list = [...visibleVehicles];
    if (statusFilter === "published") list = list.filter((v: any) => v.status === "published");
    if (statusFilter === "draft") list = list.filter((v: any) => v.status !== "published");
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((v: any) => {
        const brand = (v.brand || "").toLowerCase();
        const model = (v.model || v.title || "").toLowerCase();
        return brand.includes(s) || model.includes(s);
      });
    }
    return list;
  }, [visibleVehicles, search, statusFilter]);

  const publishedCount = visibleVehicles.filter((v: any) => v.status === "published").length;
  const draftCount = visibleVehicles.filter((v: any) => v.status !== "published").length;

  return (
    <>
      <div className="min-h-screen bg-[#f7f8fb]">
        <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#DA1212] font-medium">Admin</p>
              <h1 className="text-2xl font-bold mt-0.5 text-slate-900">Parc véhicules</h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfidentialInfo(!showConfidentialInfo)}
                className="border-slate-200 text-slate-600 bg-white hover:bg-slate-50 text-xs"
              >
                {showConfidentialInfo ? <EyeOff size={14} className="mr-1.5" /> : <Eye size={14} className="mr-1.5" />}
                Immatriculations
              </Button>
              <Button
                size="sm"
                className="bg-[#DA1212] hover:bg-[#b50f0f] shadow-sm shadow-[#da1212]/30 text-sm"
                onClick={handleAddVehicle}
              >
                <Plus size={15} className="mr-1.5" /> Nouveau
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { label: "Total", value: visibleVehicles.length, color: "text-slate-900" },
              { label: "En ligne", value: publishedCount, color: "text-emerald-600" },
              { label: "Archivés", value: draftCount, color: "text-amber-500" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-xl border border-slate-200 px-4 py-3">
                <p className="text-[11px] uppercase tracking-widest text-slate-400 font-medium">{label}</p>
                <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
              </div>
            ))}
          </motion.div>

          {/* Search + Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher marque ou modèle…"
                className="pl-8 bg-white border-slate-200 text-sm h-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-full sm:w-40 bg-white border-slate-200 h-9 text-sm">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="published">En ligne</SelectItem>
                <SelectItem value="draft">Hors ligne</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Vehicle list */}
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-3 animate-pulse">
                  <div className="flex gap-3 items-center">
                    <div className="w-20 h-14 rounded-lg bg-slate-100 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-100 rounded-full w-1/3" />
                      <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                      <div className="flex gap-1.5">
                        <div className="h-5 w-12 bg-slate-100 rounded-full" />
                        <div className="h-5 w-16 bg-slate-100 rounded-full" />
                      </div>
                    </div>
                    <div className="w-20 h-6 bg-slate-100 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-200 py-16 text-center">
              <Car size={32} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">
                {search ? "Aucun résultat pour cette recherche" : "Aucun véhicule"}
              </p>
              {!search && (
                <Button className="mt-4 bg-[#DA1212] hover:bg-[#b50f0f]" size="sm" onClick={handleAddVehicle}>
                  <Plus size={14} className="mr-1.5" /> Ajouter un véhicule
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-medium px-1">
                {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? "s" : ""}
                {search ? ` pour "${search}"` : ""}
              </p>
              <AnimatePresence>
                {filteredVehicles.map((vehicle: any, index: number) => {
                  const key = vehicle.id || vehicle.slug;
                  const isDeleting = deletingId === key;
                  const img = getPrimaryImage(vehicle);
                  const monthly = formatAmount(vehicle.monthly ?? vehicle.monthly_price ?? vehicle.price_loa);
                  const brand = vehicle.brand || "—";
                  const model = vehicle.model || vehicle.title || "—";
                  const title = `${brand} ${model}`.trim();

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut", delay: Math.min(index * 0.03, 0.25) }}
                      className={`group relative bg-white rounded-xl border border-slate-200 p-3 transition-shadow hover:shadow-md hover:border-slate-300 ${isDeleting ? "opacity-50" : ""}`}
                    >
                      {isDeleting && (
                        <div className="absolute inset-0 rounded-xl bg-white/70 backdrop-blur-sm flex items-center justify-center z-10">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <div className="h-2.5 w-2.5 animate-ping rounded-full bg-red-400" />
                            Suppression…
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 items-center">
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                          {img ? (
                            <img src={img} alt={title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full grid place-items-center text-slate-300">
                              <Car size={18} />
                            </div>
                          )}
                          {showConfidentialInfo && vehicle.registration && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-[9px] text-white font-mono leading-tight text-center px-1">
                                {vehicle.registration}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                              {brand}
                            </span>
                            {vehicle.category && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                                {vehicle.category}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-slate-900 truncate leading-tight mt-0.5">
                            {model}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {vehicle.year && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600">
                                {vehicle.year}
                              </span>
                            )}
                            {formatMileage(vehicle.mileage) && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600">
                                {formatMileage(vehicle.mileage)}
                              </span>
                            )}
                            {vehicle.energy && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600">
                                {vehicle.energy}
                              </span>
                            )}
                            {vehicle.city && (
                              <span className="text-[10px] text-slate-400">{vehicle.city}</span>
                            )}
                          </div>
                        </div>

                        {/* Price + Status */}
                        <div className="flex-shrink-0 text-right hidden sm:block">
                          {monthly ? (
                            <>
                              <p className="text-base font-bold text-slate-900">{monthly} €</p>
                              <p className="text-[10px] text-slate-400">/mois</p>
                            </>
                          ) : (
                            <p className="text-sm text-slate-300">—</p>
                          )}
                          <div className="mt-1">
                            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                              vehicle.status === "published"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${vehicle.status === "published" ? "bg-emerald-500" : "bg-amber-400"}`} />
                              {vehicle.status === "published" ? "En ligne" : "Hors ligne"}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditVehicle(vehicle)}
                            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
                            title="Modifier"
                          >
                            <Pencil size={13} />
                          </button>
                          {vehicle.slug && (
                            <button
                              onClick={() => window.open(`/vehicules/${vehicle.slug}`, "_blank")}
                              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                              title="Voir l'annonce"
                            >
                              <ExternalLink size={13} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteVehicle(vehicle)}
                            disabled={isDeleting}
                            className="p-2 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Mobile: price + status row */}
                      <div className="sm:hidden flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        {monthly ? (
                          <span className="text-sm font-bold text-slate-900">{monthly} €<span className="text-xs font-normal text-slate-400">/mois</span></span>
                        ) : <span />}
                        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                          vehicle.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${vehicle.status === "published" ? "bg-emerald-500" : "bg-amber-400"}`} />
                          {vehicle.status === "published" ? "En ligne" : "Hors ligne"}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

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
    </>
  );
};

export default AdminVehicleManager;
