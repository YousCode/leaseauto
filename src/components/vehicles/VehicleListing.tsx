import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { baseTransition, DISTANCE, stagger } from "@/lib/motion";
import { VehicleCard, VehicleCardSkeleton } from "./VehicleCard";
import type { Vehicle } from "@/types/vehicle";
import { useVehicles } from "@/hooks/useVehicles";
import { Helmet } from "react-helmet-async";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";
import { PageHero } from "@/components/ui/PageHero";
import { FooterSection } from "@/components/sections/FooterSection";

const CATEGORY_SECTIONS = [
  "Utilitaire",
  "SUV",
  "Berline",
  "Citadine",
  "Crossover",
  "Monospace",
  "Break",
  "Coupé",
  "Cabriolet",
  "4x4",
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  Utilitaire: "Utilitaires",
  SUV: "SUV",
  Berline: "Berlines",
  Citadine: "Citadines",
  Crossover: "Crossovers",
  Monospace: "Monospaces",
  Break: "Breaks",
  "Coupé": "Coupés",
  Cabriolet: "Cabriolets",
  "4x4": "4x4",
};

const normalizeCategory = (raw: unknown): string | null => {
  if (typeof raw !== "string") return null;
  const base = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
  if (!base) return null;

  const aliases: Record<string, string> = {
    suv: "SUV",
    suvs: "SUV",
    utilitaire: "Utilitaire",
    utilitaires: "Utilitaire",
    fourgon: "Utilitaire",
    fourgonnette: "Utilitaire",
    berline: "Berline",
    berlines: "Berline",
    citadine: "Citadine",
    citadines: "Citadine",
    crossover: "Crossover",
    crossovers: "Crossover",
    monospace: "Monospace",
    monospaces: "Monospace",
    break: "Break",
    breaks: "Break",
    coupe: "Coupé",
    coupes: "Coupé",
    cabriolet: "Cabriolet",
    cabriolets: "Cabriolet",
    "4x4": "4x4",
  };

  return aliases[base] ?? raw.trim();
};

/**
 * Un seul style neutre pour toutes les catégories (DA v2).
 * L'export et sa forme sont conservés : l'admin (VehicleForm) lit encore `dot`.
 */
const NEUTRAL_CATEGORY_STYLE = {
  pill: "chip",
  active: "border-night bg-night text-white",
  badge: "text-slate-400",
  dot: "bg-slate-400",
} as const;

export const CATEGORY_CONFIG: Record<string, { pill: string; active: string; badge: string; dot: string }> =
  Object.fromEntries(CATEGORY_SECTIONS.map((category) => [category, NEUTRAL_CATEGORY_STYLE]));

type VehicleListingProps = {
  vehicles?: Vehicle[];
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&auto=format&fit=crop";

type CategoryChipProps = {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
};

/** Puce de filtre : un seul style neutre, actif = fond nuit. */
function CategoryChip({ label, count, active, onClick }: CategoryChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`chip h-11 shrink-0 gap-2 px-4 text-sm transition-colors duration-300 ease-out ${
        active ? NEUTRAL_CATEGORY_STYLE.active : "hover:border-slate-400"
      }`}
    >
      {label}
      <span className={`num text-xs ${active ? "text-white/60" : NEUTRAL_CATEGORY_STYLE.badge}`}>{count}</span>
    </button>
  );
}

export function VehicleListing({ vehicles: override }: VehicleListingProps) {
  const { data: fetchedVehicles = [], isLoading } = useVehicles("published");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get("q") ?? "");
  const [sort, setSort] = useState<"price-asc" | "price-desc" | "year-desc" | "km-asc" | "featured">("featured");
  const [activeCategory, setActiveCategory] = useState<string>(
    normalizeCategory(searchParams.get("category")) ?? "Tous",
  );

  const vehicles = useMemo(() => (override as any[]) || (fetchedVehicles as any[]) || [], [override, fetchedVehicles]);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const category = normalizeCategory(searchParams.get("category")) ?? "Tous";
    if (q !== search) setSearch(q);
    if (category !== activeCategory) setActiveCategory(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (search.trim()) {
      params.set("q", search);
    } else {
      params.delete("q");
    }
    if (activeCategory !== "Tous") {
      params.set("category", activeCategory);
    } else {
      params.delete("category");
    }
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeCategory]);

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    (vehicles as any[]).forEach((v) => {
      const cat = normalizeCategory(v.category || v.type || v.vehicle_type);
      if (cat) cats.add(cat);
    });
    return Array.from(cats).sort();
  }, [vehicles]);

  const displayedCategories = useMemo(() => {
    const known = [...CATEGORY_SECTIONS].filter(
      (cat) => availableCategories.includes(cat) || cat === activeCategory,
    );
    const extra = availableCategories.filter((cat) => !CATEGORY_SECTIONS.includes(cat as any));
    return [...known, ...extra];
  }, [availableCategories, activeCategory]);

  const filtered = useMemo(() => {
    let list = [...vehicles] as any[];

    if (activeCategory !== "Tous") {
      list = list.filter((v) => {
        const cat = normalizeCategory(v.category || v.type || v.vehicle_type || "");
        return cat === activeCategory;
      });
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((v) => {
        const brand = (v.brand || "").toLowerCase();
        const model = (v.model || v.title || "").toLowerCase();
        return brand.includes(s) || model.includes(s);
      });
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => {
          const av = (a as any).monthly ?? (a as any).monthly_price ?? (a as any).price_loa ?? 0;
          const bv = (b as any).monthly ?? (b as any).monthly_price ?? (b as any).price_loa ?? 0;
          return av - bv;
        });
        break;
      case "price-desc":
        list.sort((a, b) => {
          const av = (a as any).monthly ?? (a as any).monthly_price ?? (a as any).price_loa ?? 0;
          const bv = (b as any).monthly ?? (b as any).monthly_price ?? (b as any).price_loa ?? 0;
          return bv - av;
        });
        break;
      case "year-desc":
        list.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
        break;
      case "km-asc":
        list.sort((a, b) => (a.mileage ?? 0) - (b.mileage ?? 0));
        break;
      case "featured":
      default:
        list.sort((a, b) => (Number((b as any).featured) || 0) - (Number((a as any).featured) || 0));
    }

    return list;
  }, [vehicles, search, sort, activeCategory]);

  const hasActiveFilters = search.trim().length > 0 || activeCategory !== "Tous";

  return (
    <>
      <Helmet>
        <title>Nos Véhicules Disponibles - Lease Auto</title>
        <meta
          name="description"
          content="Sélection premium Lease Auto : véhicules récents, prêts à partir, contrats transparents et accompagnement dédié."
        />
      </Helmet>

      <PageHero
        eyebrow="Sélection Lease Auto"
        title="Nos véhicules prêts à partir"
        subtitle="Sélection issue de notre parc et de notre boutique Leboncoin, présentée simplement."
      >
        <div className="relative min-w-0 flex-1 basis-64">
          <Search aria-hidden className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher marque ou modèle"
            aria-label="Rechercher marque ou modèle"
            className="field rounded-full border-transparent pl-12 pr-5"
          />
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger
            aria-label="Trier"
            className="h-12 w-full gap-3 rounded-full border-white/25 bg-white/5 px-5 text-sm font-medium text-white shadow-none transition-colors hover:border-white/50 focus:ring-white/60 sm:w-56"
          >
            <SelectValue placeholder="Trier" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="featured">Mise en avant</SelectItem>
            <SelectItem value="price-asc">Prix ↑</SelectItem>
            <SelectItem value="price-desc">Prix ↓</SelectItem>
            <SelectItem value="year-desc">Année ↓</SelectItem>
            <SelectItem value="km-asc">Kilométrage ↑</SelectItem>
          </SelectContent>
        </Select>
      </PageHero>

      <section className="bg-paper pb-20 pt-8 md:pb-28 md:pt-10">
        <div className="container-x">
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-center md:justify-between">
            {availableCategories.length > 0 ? (
              <div
                role="group"
                aria-label="Catégories"
                className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
              >
                <CategoryChip
                  label="Tous"
                  count={(vehicles as any[]).length}
                  active={activeCategory === "Tous"}
                  onClick={() => setActiveCategory("Tous")}
                />
                {displayedCategories.map((cat) => {
                  const count = (vehicles as any[]).filter(
                    (v) => normalizeCategory(v.category || v.type || v.vehicle_type) === cat,
                  ).length;
                  const isActive = activeCategory === cat;
                  return (
                    <CategoryChip
                      key={cat}
                      label={CATEGORY_LABELS[cat] ?? cat}
                      count={count}
                      active={isActive}
                      onClick={() => setActiveCategory(isActive ? "Tous" : cat)}
                    />
                  );
                })}
              </div>
            ) : (
              <span />
            )}
            {!isLoading ? (
              <p className="num shrink-0 text-sm text-slate-500" aria-live="polite">
                {filtered.length} {filtered.length > 1 ? "véhicules" : "véhicule"}
              </p>
            ) : null}
          </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <VehicleCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="surface flex flex-col items-start gap-5 p-7 md:p-10">
              <p className="lead">Aucun véhicule disponible pour le moment.</p>
              {hasActiveFilters ? (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("Tous");
                  }}
                >
                  Réinitialiser les filtres
                </button>
              ) : null}
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((v: any, index: number) => {
                const monthlyRaw =
                  v.monthly ?? v.monthly_price ?? v.price_loa ?? v.price ?? null;
                const monthlyPrice = typeof monthlyRaw === "number" ? monthlyRaw : null;

                const primaryImage =
                  (Array.isArray(v.images) && v.images.length > 0 && v.images[0]) ||
                  v.image ||
                  v.main_image_url ||
                  PLACEHOLDER_IMAGE;

                const energy =
                  typeof v.energy === "string" && v.energy.trim().length > 0
                    ? v.energy
                    : typeof v.fuel === "string"
                    ? v.fuel
                    : "—";

                const transmission =
                  typeof v.transmission === "string" && v.transmission.trim().length > 0
                    ? v.transmission
                    : typeof v.gearbox === "string" && v.gearbox.trim().length > 0
                    ? v.gearbox
                    : "—";

                return (
                  <motion.li
                    key={v.slug || v.id || `${v.brand}-${v.model}`}
                    initial={{ opacity: 0, y: DISTANCE }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...baseTransition, delay: stagger(index, 0.06, 0.4) }}
                  >
                    <VehicleCard
                      slug={v.slug || String(v.id)}
                      imageUrl={primaryImage}
                      brand={v.brand || "Marque"}
                      model={v.model || v.title || "Modèle"}
                      year={v.year || undefined}
                      mileage={v.mileage || undefined}
                      energy={energy}
                      transmission={transmission}
                      monthlyPrice={monthlyPrice}
                      highlight={
                        v.highlight ||
                        (v.new_arrival
                          ? "nouveau"
                          : v.availability === "immediate"
                          ? "dispo"
                          : v.featured
                          ? "promo"
                          : null)
                      }
                    />
                  </motion.li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <FooterSection />
    </>
  );
}

export default VehicleListing;
