import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import VehicleCard, { VehicleCardProps } from "@/components/vehicles/VehicleCard";
import { useVehicles } from "@/hooks/useVehicles";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BrandLogo } from "@/lib/BrandLogo";
import LazyImage from "@/components/ui/LazyImage";
import type { LucideIcon } from "lucide-react";
import {
  CarFront,
  Building2,
  Gauge,
  Zap,
  MapPin,
  GaugeCircle,
  Calendar,
} from "lucide-react";

/**
 * Section "Nos Véhicules" — Version simple & épurée (inspiration BMW)
 * - Palette neutre (noir / blanc / gris)
 * - Pas d'animations ni gradients
 * - Sélecteur minimaliste + cartes sobres
 */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&q=80";

const KNOWN_CATEGORIES = [
  "suv",
  "citadines",
  "hybrides",
  "electriques",
  "autres",
] as const;

type VehicleCategory = typeof KNOWN_CATEGORIES[number];
type DisplayCategory = Exclude<VehicleCategory, "autres">;
type TabsValue = "all" | DisplayCategory;

type DisplayTabConfig = {
  value: TabsValue;
  label: string;
  icon: LucideIcon;
};

type QuickViewStat = { label: string; value: string; icon: LucideIcon };

type VehicleListItem = VehicleCardProps & {
  category: VehicleCategory;
  year?: string | number;
  mileage?: number | string;
  energy?: string;
  color?: string;
  trim?: string;
  registration?: string;
};

type PublishedVehicle = {
  id: string;
  slug?: string | null;
  images?: string[] | null;
  title?: string | null;
  brand?: string | null;
  model?: string | null;
  price?: number | string | null;
  monthly?: number | string | null;
  city?: string | null;
  created_at?: string | null;
  year?: string | number | null;
  mileage?: number | string | null;
  kilometers?: number | string | null;
  energy?: string | null;
  category?: string | null;
  color?: string | null;
  trim?: string | null;
  registration?: string | null;
};

type MockVehicle = {
  id: string;
  slug: string;
  image: string;
  name: string;
  brand: string;
  model: string;
  price: string;
  monthly: string;
  city: string;
  date: string;
  category: VehicleCategory;
  year: string;
  mileage: number;
  energy?: string;
  color: string;
  trim: string;
  registration: string;
};

const DISPLAY_TABS: DisplayTabConfig[] = [
  { value: "all", label: "Tous", icon: CarFront },
  { value: "suv", label: "SUV", icon: CarFront },
  { value: "citadines", label: "Citadines", icon: Building2 },
  { value: "hybrides", label: "Hybrides", icon: Gauge },
  { value: "electriques", label: "Électriques", icon: Zap },
];

const isVehicleCategory = (value: string): value is VehicleCategory =>
  (KNOWN_CATEGORIES as readonly string[]).includes(value as VehicleCategory);

const normaliseCategory = (value?: string | null) => {
  if (!value) return null;
  const lower = value.toLowerCase();
  return isVehicleCategory(lower) ? lower : null;
};

const includesAny = (source: string, terms: string[]) =>
  terms.some((term) => source.includes(term));

const normaliseMileage = (
  primary?: number | string | null,
  fallback?: number | string | null,
) => {
  const candidates = [primary, fallback];
  for (const value of candidates) {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return undefined;
};

const categorizeVehicle = (vehicle: PublishedVehicle): VehicleCategory => {
  const directCategory = normaliseCategory(vehicle.category);
  if (directCategory) return directCategory;

  const energy = (vehicle.energy ?? "").toLowerCase();
  const brand = (vehicle.brand ?? "").toLowerCase();
  const model = (vehicle.model ?? "").toLowerCase();
  const title = (vehicle.title ?? "").toLowerCase();
  const searchable = `${title} ${brand} ${model}`;

  if (
    includesAny(energy, ["électrique", "electrique", "electric"]) ||
    includesAny(brand, ["tesla"])
  )
    return "electriques";

  if (includesAny(energy, ["hybride", "hybrid"])) return "hybrides";

  if (includesAny(searchable, ["suv", "x2", "x3", "kodiaq", "c-hr", "q5", "gla"]))
    return "suv";

  if (includesAny(searchable, ["a1", "série 1", "serie 1", "polo", "clio", "208", "fiesta"]))
    return "citadines";

  return "autres";
};

const toStringOrDefault = (value: unknown, fallback: string): string => {
  if (typeof value === "number") return value.toString();
  if (typeof value === "string" && value.trim().length > 0) return value;
  return fallback;
};

const numericFromMixed = (value?: string | number | null) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim().length > 0) {
    const cleaned = value.replace(/[^\d]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const formatCurrency = (value?: string | number | null, suffix = "€") => {
  const numeric = numericFromMixed(value);
  if (numeric !== null) return `${numeric.toLocaleString("fr-FR")} ${suffix}`.trim();
  if (typeof value === "string" && value.trim().length > 0)
    return value.includes(suffix) ? value : `${value} ${suffix}`.trim();
  return "Prix sur demande";
};

const formatMonthlyPayment = (value?: string | number | null) => {
  const formatted = formatCurrency(value, "€");
  return formatted === "Prix sur demande" ? formatted : `${formatted}/mois`;
};

const formatMileageValue = (value?: string | number | null) => {
  const numeric = numericFromMixed(value);
  if (numeric !== null) return `${numeric.toLocaleString("fr-FR")} km`;
  if (typeof value === "string" && value.trim().length > 0)
    return value.includes("km") ? value : `${value} km`;
  return "Kilométrage à confirmer";
};

const formatDisplayDate = (value?: string | null) => {
  if (!value) return "Ajouté récemment";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Ajouté récemment";
  return parsed.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// ----------- MOCK -----------
export const MOCK_VEHICLES: ReadonlyArray<MockVehicle> = [
  {
    id: "1",
    slug: "bmw-x2",
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=640&q=80",
    name: "BMW X2 F39 SDRIVE 20iA 192 CH M SPORT",
    brand: "BMW",
    model: "X2",
    price: "26990",
    monthly: "548",
    city: "Épinay-sur-Seine 93800",
    date: "2024-01-15",
    category: "suv",
    year: "2022",
    mileage: 25000,
    energy: "Essence",
    color: "Noir",
    trim: "M Sport",
    registration: "AB-123-CD",
  },
  {
    id: "2",
    slug: "tesla-model-3",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=640&q=80",
    name: "TESLA MODEL 3 STANDARD PLUS RWD MY22",
    brand: "Tesla",
    model: "Model 3",
    price: "27990",
    monthly: "493",
    city: "Levallois-Perret 92300",
    date: "2024-01-05",
    category: "electriques",
    year: "2022",
    mileage: 18000,
    energy: "Électrique",
    color: "Blanc",
    trim: "Standard Plus",
    registration: "EF-456-GH",
  },
  {
    id: "3",
    slug: "audi-a1",
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=640&q=80",
    name: "AUDI A1 SPORTBACK 30 TFSI 110 CH ADVANCED",
    brand: "Audi",
    model: "A1",
    price: "26990",
    monthly: "466",
    city: "Paris 75017",
    date: "2024-02-01",
    category: "citadines",
    year: "2023",
    mileage: 12000,
    energy: "Essence",
    color: "Rouge",
    trim: "Advanced",
    registration: "IJ-789-KL",
  },
];

const STATIC_VEHICLES: VehicleListItem[] = MOCK_VEHICLES.map(
  ({
    slug,
    image,
    name,
    price,
    monthly,
    city,
    date,
    category,
    brand,
    year,
    mileage,
    energy,
    color,
    trim,
    registration,
  }) => ({
    slug,
    image,
    name,
    brand,
    price,
    monthly,
    city,
    date,
    category,
    year,
    mileage,
    energy,
    color,
    trim,
    registration,
  }),
);

type CategoryCountMap = Record<DisplayCategory, number> & { all: number };

// Sélecteur minimaliste
const CategorySelector = ({
  active,
  onChange,
  counts,
}: {
  active: TabsValue;
  onChange: (v: TabsValue) => void;
  counts: CategoryCountMap;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current?.querySelector<HTMLButtonElement>(
      `[data-value="${active}"]`
    );
    if (el && containerRef.current) {
      const parent = containerRef.current;
      const elLeft = el.offsetLeft;
      const elRight = elLeft + el.offsetWidth;
      const parentLeft = parent.scrollLeft;
      const parentRight = parentLeft + parent.clientWidth;
      if (elLeft < parentLeft || elRight > parentRight) {
        parent.scrollTo({ left: elLeft - 16, behavior: "smooth" });
      }
    }
  }, [active]);

  return (
    <div className="mb-8 border-y border-neutral-200 bg-white py-3">
      <LayoutGroup>
        <div
          ref={containerRef}
          className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto px-2 [scrollbar-width:none] [-ms-overflow-style:none]"
        >
          {DISPLAY_TABS.map(({ value, label, icon: Icon }) => {
            const count = value === "all" ? counts.all : counts[value];
            const isActive = active === value;
            return (
              <button
                key={value}
                data-value={value}
                onClick={() => onChange(value)}
                className={[
                  "relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20",
                  isActive
                    ? "border-neutral-900 text-white"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900",
                ].join(" ")}
                aria-pressed={isActive}
              >
                {isActive ? (
                  <motion.span
                    layoutId="category-active-pill"
                    className="absolute inset-0 -z-10 bg-neutral-900"
                    transition={{ type: "spring", stiffness: 360, damping: 32 }}
                  />
                ) : null}
                <span className="relative z-10 inline-flex items-center gap-2">
                  <Icon size={16} />
                  <span>{label}</span>
                  <span
                    className={[
                      "ml-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                      isActive
                        ? "border-white/40 bg-white/10 text-white"
                        : "border-neutral-200 bg-neutral-100 text-neutral-600",
                    ].join(" ")}
                  >
                    {count}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
};

const VehicleListingsSection = () => {
  const navigate = useNavigate();
  const { data: publishedVehicles = [] } = useVehicles("published");
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCat = searchParams.get("cat");
  const initialTab: TabsValue =
    (urlCat === null
      ? "all"
      : (isVehicleCategory(urlCat)
          ? (urlCat as DisplayCategory)
          : (urlCat as TabsValue))) || "all";

  const [activeTab, setActiveTab] = useState<TabsValue>(initialTab);
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleListItem | null>(null);

  // sync URL when activeTab changes
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (activeTab === "all") next.delete("cat");
    else next.set("cat", activeTab);
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const publishedVehicleItems = useMemo<VehicleListItem[]>(() => {
    if (!publishedVehicles?.length) return [];

    return (publishedVehicles as PublishedVehicle[]).map((vehicle) => {
      const category = categorizeVehicle(vehicle);
      const primaryImage =
        (Array.isArray(vehicle.images) && vehicle.images[0]) || FALLBACK_IMAGE;
      const mileage = normaliseMileage(vehicle.mileage, vehicle.kilometers);
      const year =
        typeof vehicle.year === "number" || typeof vehicle.year === "string"
          ? vehicle.year.toString()
          : undefined;

      return {
        slug: vehicle.slug ?? vehicle.id,
        image: primaryImage,
        name: vehicle.title ?? "Véhicule",
        brand: vehicle.brand ?? undefined,
        price: toStringOrDefault(vehicle.price, "0"),
        monthly: toStringOrDefault(vehicle.monthly, "0"),
        city: vehicle.city ?? "Paris",
        date: vehicle.created_at ?? new Date().toISOString(),
        year,
        mileage,
        energy: vehicle.energy ?? undefined,
        color: vehicle.color ?? undefined,
        trim: vehicle.trim ?? undefined,
        registration: vehicle.registration ?? undefined,
        category,
      };
    });
  }, [publishedVehicles]);

  const vehicles =
    publishedVehicleItems.length > 0 ? publishedVehicleItems : STATIC_VEHICLES;

  const categoryCounts = useMemo<CategoryCountMap>(() => {
    const counts: CategoryCountMap = {
      all: vehicles.length,
      suv: 0,
      citadines: 0,
      hybrides: 0,
      electriques: 0,
    };
    vehicles.forEach((v) => {
      if (v.category !== "autres") counts[v.category] += 1;
    });
    return counts;
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    if (activeTab === "all") return vehicles;
    return vehicles.filter((v) => v.category === activeTab);
  }, [activeTab, vehicles]);

  const quickViewData = useMemo(() => {
    if (!selectedVehicle) return null;

    const fallbackDate = selectedVehicle.date ?? new Date().toISOString();
    const capitalise = (value?: string) =>
      value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : undefined;

    const city = selectedVehicle.city ?? "Disponible dans toute la France";
    const mileage = formatMileageValue(selectedVehicle.mileage);
    const year =
      selectedVehicle.year?.toString() ??
      new Date(fallbackDate).getFullYear().toString();
    const energy = capitalise(selectedVehicle.energy) ?? "Motorisation à préciser";
    const color = capitalise(selectedVehicle.color);
    const trim = selectedVehicle.trim;

    const stats: QuickViewStat[] = [
      { label: "Localisation", value: city, icon: MapPin },
      { label: "Kilométrage", value: mileage, icon: GaugeCircle },
      { label: "Mise en circulation", value: year, icon: Calendar },
      { label: "Énergie", value: energy, icon: Zap },
      color ? { label: "Couleur", value: color, icon: CarFront } : null,
      trim ? { label: "Finition", value: trim, icon: CarFront } : null,
    ].filter((stat): stat is QuickViewStat => Boolean(stat && stat.value));

    return {
      price: formatCurrency(selectedVehicle.price),
      monthly: formatMonthlyPayment(selectedVehicle.monthly),
      mileage,
      addedAt: formatDisplayDate(fallbackDate),
      city,
      energy,
      year,
      color,
      trim,
      registration: selectedVehicle.registration,
      stats,
    };
  }, [selectedVehicle]);

  const handleTabChange = useCallback((value: TabsValue) => setActiveTab(value), []);
  const handleVehicleCardClick = useCallback(
    (vehicle: VehicleListItem) => setSelectedVehicle(vehicle),
    [],
  );
  const handleDialogOpenChange = useCallback((open: boolean) => {
    if (!open) setSelectedVehicle(null);
  }, []);
  const handleGoToDetails = useCallback(
    (vehicle?: VehicleListItem | null) => {
      if (!vehicle?.slug) return;
      setSelectedVehicle(null);
      navigate(`/vehicules/${vehicle.slug}`);
    },
    [navigate],
  );
  const handleBookAppointment = useCallback(() => {
    setSelectedVehicle(null);
    navigate("/contact");
  }, [navigate]);

  return (
    <section id="vehicles" className="bg-white py-20">
      <div className="relative mx-auto max-w-6xl px-4">
        {/* Titre sobre */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mb-8"
        >
          <h2 className="text-3xl font-light tracking-tight text-neutral-900 md:text-4xl">
            Nos véhicules
          </h2>
          <p className="mt-2 text-[14px] text-neutral-600">
            Sélection récente, disponible immédiatement.
          </p>
        </motion.header>

        {/* Sélecteur */}
        <CategorySelector
          active={activeTab}
          onChange={handleTabChange}
          counts={categoryCounts}
        />

        {/* Résultats */}
        <motion.div
          key={`count-${filteredVehicles.length}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="mb-6 text-sm text-neutral-600"
        >
          {filteredVehicles.length}{" "}
          {filteredVehicles.length > 1 ? "véhicules" : "véhicule"} disponibles
        </motion.div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${activeTab}-${filteredVehicles.length}`}
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="grid gap-10 sm:grid-cols-2 xl:grid-cols-3"
          >
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle, index) => {
                const slug = vehicle.slug ?? `vehicle-${index + 1}`;
                const vehicleWithSlug: VehicleListItem = { ...vehicle, slug };
                return (
                  <VehicleCard
                    key={slug}
                    {...vehicleWithSlug}
                    onClick={() => handleVehicleCardClick(vehicleWithSlug)}
                  />
                );
              })
            ) : (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="col-span-full rounded-lg border border-neutral-200 bg-white py-16 text-center"
              >
                <p className="mx-auto max-w-xl text-base text-neutral-500">
                  Nous préparons encore des modèles pour cette catégorie. Laissez-nous un
                  message et un conseiller vous proposera une sélection sur-mesure.
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Quick View minimaliste */}
        <Dialog open={Boolean(selectedVehicle)} onOpenChange={handleDialogOpenChange}>
          <DialogContent className="max-w-5xl overflow-hidden rounded-xl border border-neutral-200 bg-white p-0 shadow-sm">
            {selectedVehicle && quickViewData ? (
              <div className="grid gap-0 lg:grid-cols-[3fr,2fr]">
                <motion.div
                  initial={{ opacity: 0.6, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative overflow-hidden bg-neutral-100"
                >
                  <LazyImage
                    src={selectedVehicle.image ?? FALLBACK_IMAGE}
                    alt={selectedVehicle.name ?? "Véhicule"}
                    containerClassName="h-full w-full"
                    className="h-full w-full object-cover"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
                  className="flex flex-col gap-6 px-8 py-8"
                >
                  <DialogHeader className="space-y-2">
                    <div className="flex items-center gap-3">
                      <BrandLogo brand={selectedVehicle.brand} size={28} />
                      <DialogTitle className="text-xl font-medium text-neutral-900">
                        {selectedVehicle.name}
                      </DialogTitle>
                    </div>
                    <DialogDescription className="text-xs text-neutral-500">
                      {selectedVehicle.brand
                        ? `Configuration ${selectedVehicle.brand} préparée et contrôlée.`
                        : "Sélection reconditionnée et garantie 12 mois."}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="rounded-lg border border-neutral-200 bg-white p-4">
                    <div className="flex flex-wrap items-center gap-4 text-neutral-900">
                      <span className="text-2xl font-semibold">
                        {quickViewData.price}
                      </span>
                      <span className="rounded-full border border-neutral-300 px-3 py-1 text-sm font-medium">
                        {quickViewData.monthly}
                      </span>
                      <span className="text-[11px] uppercase tracking-wide text-neutral-500">
                        Garantie 12 mois incluse
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {quickViewData.stats.map(({ label, value, icon: IconComponent }, idx) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 * idx }}
                        className="flex items-center gap-3 rounded border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900"
                      >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-neutral-100 text-neutral-900">
                          <IconComponent size={18} strokeWidth={1.8} />
                        </span>
                        <div className="flex flex-col">
                          <span className="text-[11px] uppercase tracking-wide text-neutral-500">
                            {label}
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {quickViewData.registration ? (
                    <div className="rounded border border-dashed border-neutral-300 bg-white px-3 py-2 text-[11px] uppercase tracking-wide text-neutral-500">
                      Immatriculation: {quickViewData.registration}
                    </div>
                  ) : null}

                  <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => handleGoToDetails(selectedVehicle)}
                      className="inline-flex flex-1 items-center justify-center rounded-md bg-black px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-white"
                    >
                      Voir l'offre complète
                    </button>
                    <button
                      type="button"
                      onClick={handleBookAppointment}
                      className="inline-flex flex-1 items-center justify-center rounded-md border border-neutral-300 bg-white px-5 py-3 text-[12px] font-semibold uppercase tracking-wide text-neutral-900"
                    >
                      Réserver un essai
                    </button>
                  </div>

                  <p className="text-center text-[11px] text-neutral-500">
                    Ajouté le {quickViewData.addedAt}
                  </p>
                </motion.div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export { VehicleListingsSection };
export default VehicleListingsSection;
