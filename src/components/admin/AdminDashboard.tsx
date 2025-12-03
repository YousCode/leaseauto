import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import slugify from "slugify";
import VehicleModelViewer from "@/components/vehicles/VehicleModelViewer";
import { MOCK_VEHICLES } from "@/components/sections/VehicleListingsSection";
import type { VehicleCardProps } from "@/components/vehicles/VehicleCard";
import { BrandLogo } from "@/lib/BrandLogo";
import { useVehicles } from "@/hooks/useVehicles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import VehicleForm from "./VehicleForm";
import {
  ArrowUpRight,
  Eye,
  LogOut,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

type AdminStatus = "published" | "review" | "draft";
type StatusFilter = AdminStatus | "all";

type AdminVehicle = VehicleCardProps & {
  id: string;
  status: AdminStatus;
  leads: number;
  visits: number;
  updatedAt: string;
  origin: "remote" | "local";
  city?: string | null;
  energy?: string | null;
  mileage?: number | string;
  year?: string | number;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80";

const STATUS_ORDER: AdminStatus[] = ["published", "review", "draft"];

const STATUS_CONFIG: Record<
  AdminStatus,
  { label: string; badge: string; dot: string; cta: string }
> = {
  published: {
    label: "En ligne",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
    cta: "Mettre en pause",
  },
  review: {
    label: "À vérifier",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
    cta: "Publier",
  },
  draft: {
    label: "Brouillon",
    badge: "bg-neutral-200 text-neutral-800",
    dot: "bg-neutral-500",
    cta: "Mettre en ligne",
  },
};

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "published", label: "En ligne" },
  { value: "review", label: "En vérif" },
  { value: "draft", label: "Brouillons" },
];

const formatPrice = (value?: string | number | null) => {
  if (value == null) return "Prix sur demande";
  const numeric =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^\d]/g, ""));
  if (!Number.isFinite(numeric)) return "Prix sur demande";
  return `${numeric.toLocaleString("fr-FR")} €`;
};

const formatMonthly = (value?: string | number | null) => {
  const price = formatPrice(value);
  return price === "Prix sur demande" ? price : `${price}/mois`;
};

const formatMileage = (value?: string | number | null) => {
  if (value == null) return "Kilométrage à préciser";
  if (typeof value === "number") return `${value.toLocaleString("fr-FR")} km`;
  if (typeof value === "string" && value.trim().length > 0) {
    return value.includes("km") ? value : `${value} km`;
  }
  return "Kilométrage à préciser";
};

const formatUpdatedLabel = (iso?: string) => {
  if (!iso) return "Aujourd'hui";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
    });
  } catch {
    return "Aujourd'hui";
  }
};

const buildVehicleFromForm = (
  payload: Record<string, any>,
  base?: AdminVehicle | null,
): AdminVehicle => {
  const composedName =
    payload.title?.trim() ||
    [payload.brand, payload.model, payload.version]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    base?.name ||
    "Véhicule";
  const slug =
    payload.slug ||
    base?.slug ||
    slugify(composedName, {
      lower: true,
      strict: true,
      locale: "fr",
    });

  return {
    id: base?.id ?? crypto.randomUUID(),
    slug,
    name: composedName,
    brand: payload.brand ?? base?.brand,
    price: payload.price ?? base?.price ?? null,
    monthly:
      payload.monthly ??
      payload.monthlyRent ??
      payload.rent ??
      base?.monthly ??
      null,
    image:
      (Array.isArray(payload.images) && payload.images[0]) ||
      base?.image ||
      FALLBACK_IMAGE,
    model3dUrl: payload.model3dUrl ?? base?.model3dUrl,
    city: payload.city ?? base?.city ?? "Épinay-sur-Seine 93800",
    energy: payload.energy ?? base?.energy,
    year: payload.year ?? base?.year,
    mileage: payload.mileage ?? base?.mileage,
    status: base?.status ?? "draft",
    leads: base?.leads ?? 0,
    visits: base?.visits ?? 0,
    updatedAt: new Date().toISOString(),
    origin: base?.origin ?? "local",
  };
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: remoteData = [], isLoading } = useVehicles();
  const [createdVehicles, setCreatedVehicles] = useState<AdminVehicle[]>([]);
  const [overrides, setOverrides] = useState<Record<string, AdminVehicle>>({});
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<AdminVehicle | null>(
    null,
  );

  const remoteVehicles = useMemo<AdminVehicle[]>(() => {
    if (!Array.isArray(remoteData) || remoteData.length === 0) {
      return MOCK_VEHICLES.map((vehicle, index) => ({
        id: vehicle.id ?? `mock-${index}`,
        slug: vehicle.slug,
        name: vehicle.name,
        brand: vehicle.brand,
        price: vehicle.price,
        monthly: vehicle.monthly,
        image: vehicle.image,
        model3dUrl: vehicle.model3dUrl,
        city: vehicle.city,
        energy: vehicle.energy,
        year: vehicle.year,
        mileage: vehicle.mileage,
        status: STATUS_ORDER[index % STATUS_ORDER.length],
        leads: 12 + index * 4,
        visits: 180 + index * 23,
        updatedAt: new Date(Date.now() - index * 36 * 60 * 60 * 1000).toISOString(),
        origin: "remote",
      }));
    }

    return remoteData.map((vehicle: Record<string, any>, index: number) => {
      const name =
        vehicle.title ||
        [vehicle.brand, vehicle.model, vehicle.version]
          .filter(Boolean)
          .join(" ")
          .trim() ||
        `Véhicule ${index + 1}`;
      const slug =
        vehicle.slug ||
        slugify(name, {
          lower: true,
          strict: true,
          locale: "fr",
        });
      const primaryImage =
        (Array.isArray(vehicle.images) && vehicle.images[0]) || FALLBACK_IMAGE;
      const status: AdminStatus =
        vehicle.status === "published"
          ? "published"
          : vehicle.status === "draft"
            ? "draft"
            : "review";

      return {
        id: vehicle.id ?? `remote-${index}`,
        slug,
        name,
        brand: vehicle.brand ?? undefined,
        price: vehicle.price ?? null,
        monthly: vehicle.monthly ?? null,
        image: primaryImage,
        model3dUrl: vehicle.model3d_url ?? undefined,
        city: vehicle.city ?? "Paris",
        energy: vehicle.energy ?? undefined,
        year: vehicle.year ?? undefined,
        mileage: vehicle.mileage ?? vehicle.kilometers ?? undefined,
        status,
        leads: vehicle.leads ?? 6 + index * 3,
        visits: vehicle.visits ?? 110 + index * 19,
        updatedAt:
          vehicle.updated_at ?? vehicle.created_at ?? new Date().toISOString(),
        origin: "remote",
      };
    });
  }, [remoteData]);

  const mergedVehicles = useMemo(() => {
    const remoteWithOverrides = remoteVehicles.map(
      (vehicle) => overrides[vehicle.id] ?? vehicle,
    );
    return [...createdVehicles, ...remoteWithOverrides];
  }, [createdVehicles, overrides, remoteVehicles]);

  const counts = useMemo(() => {
    return mergedVehicles.reduce(
      (acc, vehicle) => {
        acc.all += 1;
        acc[vehicle.status] += 1;
        return acc;
      },
      { all: 0, published: 0, review: 0, draft: 0 },
    );
  }, [mergedVehicles]);

  const filteredVehicles = useMemo(() => {
    const term = search.trim().toLowerCase();
    return mergedVehicles.filter((vehicle) => {
      if (filterStatus !== "all" && vehicle.status !== filterStatus) {
        return false;
      }
      if (!term) return true;
      const haystack = `${vehicle.name ?? ""} ${vehicle.brand ?? ""} ${
        vehicle.city ?? ""
      }`.toLowerCase();
      return haystack.includes(term);
    });
  }, [mergedVehicles, filterStatus, search]);

  const metrics = useMemo(() => {
    const leads = mergedVehicles.reduce((sum, vehicle) => sum + vehicle.leads, 0);
    const visits = mergedVehicles.reduce(
      (sum, vehicle) => sum + vehicle.visits,
      0,
    );
    return {
      published: counts.published,
      drafts: counts.draft,
      leads,
      visits,
    };
  }, [counts, mergedVehicles]);

  const handleCreate = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  const handleEdit = (vehicle: AdminVehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (payload: any) => {
    const nextVehicle = buildVehicleFromForm(payload, editingVehicle);
    if (editingVehicle) {
      if (editingVehicle.origin === "local") {
        setCreatedVehicles((prev) =>
          prev.map((vehicle) =>
            vehicle.id === editingVehicle.id ? nextVehicle : vehicle,
          ),
        );
      } else {
        setOverrides((prev) => ({
          ...prev,
          [editingVehicle.id]: nextVehicle,
        }));
      }
      toast({
        title: "Annonce mise à jour",
        description: `${nextVehicle.name} a été actualisé.`,
      });
    } else {
      setCreatedVehicles((prev) => [nextVehicle, ...prev]);
      toast({
        title: "Annonce créée",
        description: `${nextVehicle.name} est prête à être publiée.`,
      });
    }
    setIsFormOpen(false);
    setEditingVehicle(null);
  };

  const updateVehicleStatus = useCallback(
    (id: string, status: AdminStatus) => {
      setCreatedVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle.id === id ? { ...vehicle, status } : vehicle,
        ),
      );
      setOverrides((prev) => {
        const current =
          prev[id] ?? remoteVehicles.find((vehicle) => vehicle.id === id);
        if (!current) return prev;
        return { ...prev, [id]: { ...current, status } };
      });
    },
    [remoteVehicles],
  );

  const handleArchive = (id: string) => {
    updateVehicleStatus(id, "draft");
    toast({
      title: "Annonce archivée",
      description: "Vous pourrez la republier depuis vos brouillons.",
    });
  };

  const handleStatusToggle = (vehicle: AdminVehicle) => {
    const nextStatus =
      vehicle.status === "published"
        ? "draft"
        : vehicle.status === "draft"
          ? "published"
          : "published";
    updateVehicleStatus(vehicle.id, nextStatus);
  };

  const handleView = (vehicle: AdminVehicle) => {
    if (vehicle.slug) {
      navigate(`/vehicules/${vehicle.slug}`);
    } else {
      navigate("/vehicules");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3] text-neutral-900">
      <header className="border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">
              Espace marchand
            </p>
            <h1 className="mt-1 text-3xl font-semibold">
              Gestion des annonces
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Déconnexion
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Retour au site
            </Button>
            <Button
              className="bg-[#ff6e14] text-white hover:bg-[#e65d05]"
              onClick={handleCreate}
            >
              <Plus className="mr-2 h-4 w-4" />
              Déposer une annonce
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 bg-gradient-to-br from-white to-neutral-50 shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-neutral-500">En ligne</p>
                <p className="text-3xl font-semibold">{metrics.published}</p>
                <span className="text-xs text-neutral-500">
                  annonces actives
                </span>
              </div>
              <Sparkles className="h-10 w-10 text-[#ff6e14]" />
            </CardContent>
          </Card>
          <Card className="border-0 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-neutral-500">Brouillons</p>
                <p className="text-3xl font-semibold">{metrics.drafts}</p>
                <span className="text-xs text-neutral-500">
                  en attente de publication
                </span>
              </div>
              <ShieldCheck className="h-10 w-10 text-neutral-600" />
            </CardContent>
          </Card>
          <Card className="border-0 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-neutral-500">Leads 30 derniers jours</p>
                <p className="text-3xl font-semibold">{metrics.leads}</p>
                <span className="text-xs text-neutral-500">contacts qualifiés</span>
              </div>
              <Users className="h-10 w-10 text-neutral-600" />
            </CardContent>
          </Card>
          <Card className="border-0 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-neutral-500">Vues cumulées</p>
                <p className="text-3xl font-semibold">{metrics.visits}</p>
                <span className="text-xs text-neutral-500">
                  visites certifiées
                </span>
              </div>
              <Eye className="h-10 w-10 text-neutral-600" />
            </CardContent>
          </Card>
        </section>

        <section className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 px-6 py-5">
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilterStatus(value)}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                    filterStatus === value
                      ? "bg-black text-white shadow-sm"
                      : "bg-neutral-100 text-neutral-600 hover:text-neutral-900",
                  ].join(" ")}
                >
                  {label}
                  <span className="ml-2 text-xs text-neutral-500">
                    {value === "all"
                      ? counts.all
                      : counts[value as AdminStatus]}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Rechercher un modèle"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="px-6 py-10 text-center text-sm text-neutral-500">
              Synchronisation en cours...
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="px-6 py-16 text-center text-sm text-neutral-500">
              Aucune annonce ne correspond à vos filtres. Relancez une recherche
              ou ajoutez un véhicule.
            </div>
          ) : (
            <div className="space-y-6 px-6 py-8">
              {filteredVehicles.map((vehicle) => (
                <motion.article
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="grid gap-6 rounded-3xl border border-neutral-100 bg-white/80 p-6 shadow-sm lg:grid-cols-[260px,1fr,220px]"
                >
                  <div className="space-y-3">
                    <VehicleModelViewer
                      src={vehicle.model3dUrl}
                      className="h-52 rounded-2xl border-0"
                    />
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>
                        Mis à jour le {formatUpdatedLabel(vehicle.updatedAt)}
                      </span>
                      {vehicle.model3dUrl ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-600">
                          GLB prêt
                        </span>
                      ) : (
                        <span className="rounded-full bg-neutral-100 px-3 py-1 font-semibold">
                          Photo
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap items-start gap-3">
                      <BrandLogo brand={vehicle.brand} size={28} />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">
                            {vehicle.name}
                          </h3>
                          <Badge
                            className={[
                              "flex items-center gap-1",
                              STATUS_CONFIG[vehicle.status].badge,
                            ].join(" ")}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${STATUS_CONFIG[vehicle.status].dot}`}
                            />
                            {STATUS_CONFIG[vehicle.status].label}
                          </Badge>
                        </div>
                        <p className="mt-1 flex items-center text-sm text-neutral-500">
                          <MapPin className="mr-1 h-4 w-4" />
                          {vehicle.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-neutral-600">
                      {vehicle.energy && (
                        <span className="rounded-full bg-neutral-100 px-3 py-1">
                          {vehicle.energy}
                        </span>
                      )}
                      {vehicle.year && (
                        <span className="rounded-full bg-neutral-100 px-3 py-1">
                          {vehicle.year}
                        </span>
                      )}
                      {vehicle.mileage && (
                        <span className="rounded-full bg-neutral-100 px-3 py-1">
                          {formatMileage(vehicle.mileage)}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <p className="text-3xl font-semibold">
                        {formatPrice(vehicle.price)}
                      </p>
                      {vehicle.monthly ? (
                        <span className="rounded-full bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white">
                          {formatMonthly(vehicle.monthly)}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleView(vehicle)}
                      >
                        Voir sur le site
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button variant="ghost" onClick={() => handleEdit(vehicle)}>
                        Modifier
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-neutral-500"
                        onClick={() => handleStatusToggle(vehicle)}
                      >
                        {STATUS_CONFIG[vehicle.status].cta}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-4 rounded-3xl bg-neutral-50/80 p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-sm">
                        <span className="text-neutral-500">Leads 30j</span>
                        <span className="font-semibold">{vehicle.leads}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-sm">
                        <span className="text-neutral-500">Vues</span>
                        <span className="font-semibold">{vehicle.visits}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 text-sm">
                        <span className="text-neutral-500">Contacts directs</span>
                        <span className="font-semibold">
                          {Math.max(1, Math.round(vehicle.leads * 0.35))}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button className="bg-[#ff6e14] text-white hover:bg-[#e65d05]">
                        Booster la visibilité
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-neutral-500"
                        onClick={() => handleArchive(vehicle.id)}
                      >
                        Archiver
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border border-neutral-200 bg-white p-0 sm:max-w-4xl">
          <DialogHeader className="border-b border-neutral-200 px-6 py-4 text-left">
            <DialogTitle className="text-2xl font-semibold">
              {editingVehicle ? "Modifier l'annonce" : "Créer une annonce"}
            </DialogTitle>
          </DialogHeader>
          <div className="bg-neutral-950 p-6 text-white">
            <VehicleForm
              vehicle={editingVehicle ?? undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
