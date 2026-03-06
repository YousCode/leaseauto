import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { VehicleCard } from "./VehicleCard";
import type { Vehicle } from "@/types/vehicle";
import { useVehicles } from "@/hooks/useVehicles";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";

export const CATEGORY_CONFIG: Record<string, { pill: string; active: string; badge: string; dot: string }> = {
  "SUV":        { pill: "bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-400",         active: "bg-sky-600 text-white border-sky-600",         badge: "bg-sky-100 text-sky-700",       dot: "bg-sky-500" },
  "Citadine":   { pill: "bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-400",       active: "bg-rose-500 text-white border-rose-500",       badge: "bg-rose-100 text-rose-700",     dot: "bg-rose-500" },
  "Utilitaire": { pill: "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400",   active: "bg-amber-500 text-white border-amber-500",     badge: "bg-amber-100 text-amber-700",   dot: "bg-amber-500" },
  "Berline":    { pill: "bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-400",  active: "bg-slate-600 text-white border-slate-600",     badge: "bg-slate-200 text-slate-700",   dot: "bg-slate-500" },
  "Break":      { pill: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400", active: "bg-emerald-600 text-white border-emerald-600", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  "Coupé":      { pill: "bg-violet-50 text-violet-700 border-violet-200 hover:border-violet-400", active: "bg-violet-600 text-white border-violet-600", badge: "bg-violet-100 text-violet-700", dot: "bg-violet-500" },
  "Cabriolet":  { pill: "bg-pink-50 text-pink-700 border-pink-200 hover:border-pink-400",       active: "bg-pink-500 text-white border-pink-500",       badge: "bg-pink-100 text-pink-700",     dot: "bg-pink-500" },
  "Crossover":  { pill: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:border-cyan-400",       active: "bg-cyan-600 text-white border-cyan-600",       badge: "bg-cyan-100 text-cyan-700",     dot: "bg-cyan-500" },
  "Monospace":  { pill: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-400", active: "bg-indigo-600 text-white border-indigo-600", badge: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500" },
  "4x4":        { pill: "bg-stone-100 text-stone-700 border-stone-300 hover:border-stone-500",  active: "bg-stone-600 text-white border-stone-600",     badge: "bg-stone-200 text-stone-700",   dot: "bg-stone-500" },
};

type VehicleListingProps = {
  vehicles?: Vehicle[];
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&auto=format&fit=crop";

export function VehicleListing({ vehicles: override }: VehicleListingProps) {
  const { data: fetchedVehicles = [], isLoading } = useVehicles("published");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get("q") ?? "");
  const [sort, setSort] = useState<"price-asc" | "price-desc" | "year-desc" | "km-asc" | "featured">("featured");
  const [activeCategory, setActiveCategory] = useState<string>("Tous");

  const vehicles = useMemo(() => (override as any[]) || (fetchedVehicles as any[]) || [], [override, fetchedVehicles]);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    if (q !== search) setSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (search.trim()) {
      params.set("q", search);
    } else {
      params.delete("q");
    }
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    (vehicles as any[]).forEach((v) => {
      const cat = v.category || v.type || v.vehicle_type;
      if (cat && typeof cat === "string" && cat.trim()) cats.add(cat.trim());
    });
    return Array.from(cats).sort();
  }, [vehicles]);

  const filtered = useMemo(() => {
    let list = [...vehicles] as any[];

    if (activeCategory !== "Tous") {
      list = list.filter((v) => {
        const cat = v.category || v.type || v.vehicle_type || "";
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
          const av = (a as any).monthly_price ?? (a as any).monthly ?? (a as any).price_loa ?? 0;
          const bv = (b as any).monthly_price ?? (b as any).monthly ?? (b as any).price_loa ?? 0;
          return av - bv;
        });
        break;
      case "price-desc":
        list.sort((a, b) => {
          const av = (a as any).monthly_price ?? (a as any).monthly ?? (a as any).price_loa ?? 0;
          const bv = (b as any).monthly_price ?? (b as any).monthly ?? (b as any).price_loa ?? 0;
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

  return (
    <>
      <Helmet>
        <title>Nos Véhicules Disponibles - Lease Auto</title>
        <meta
          name="description"
          content="Sélection premium Lease Auto : véhicules récents, prêts à partir, contrats transparents et accompagnement dédié."
        />
      </Helmet>

      <section className="bg-brand-light min-h-screen py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <header className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.28em] uppercase text-slate-400">Sélection Lease Auto</p>
              <h1 className="text-2xl md:text-3xl font-heading font-semibold text-brand-navy mt-1">
                Nos véhicules prêts à partir
              </h1>
              <p className="text-sm text-slate-500">
                Sélection issue de notre parc et de notre boutique Leboncoin, présentée simplement.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher marque ou modèle"
                className="bg-white border-slate-200 focus-visible:ring-brand-red"
              />
              <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                <SelectTrigger className="w-full md:w-52 bg-white border-slate-200">
                  <SelectValue placeholder="Trier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Mise en avant</SelectItem>
                  <SelectItem value="price-asc">Prix ↑</SelectItem>
                  <SelectItem value="price-desc">Prix ↓</SelectItem>
                  <SelectItem value="year-desc">Année ↓</SelectItem>
                  <SelectItem value="km-asc">Kilométrage ↑</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </header>

          {availableCategories.length > 0 && (
            <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
              <button
                onClick={() => setActiveCategory("Tous")}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeCategory === "Tous"
                    ? "bg-brand-navy text-white border-brand-navy"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                }`}
              >
                Tous
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeCategory === "Tous" ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>
                  {(vehicles as any[]).length}
                </span>
              </button>
              {availableCategories.map((cat) => {
                const cfg = CATEGORY_CONFIG[cat] ?? {
                  pill: "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400",
                  active: "bg-slate-500 text-white border-slate-500",
                  badge: "bg-slate-100 text-slate-600",
                  dot: "bg-slate-400",
                };
                const count = (vehicles as any[]).filter(
                  (v) => (v.category || v.type || v.vehicle_type) === cat
                ).length;
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(isActive ? "Tous" : cat)}
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      isActive ? cfg.active : cfg.pill
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? "bg-white/70" : cfg.dot}`} />
                    {cat}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${isActive ? "bg-white/20" : cfg.badge}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {isLoading ? (
            <div className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-slate-200 overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-slate-100" />
                  <div className="p-4 space-y-3">
                    <div className="h-2.5 bg-slate-100 rounded-full w-1/4" />
                    <div className="h-4 bg-slate-100 rounded-full w-2/3" />
                    <div className="h-2.5 bg-slate-100 rounded-full w-full" />
                    <div className="h-2.5 bg-slate-100 rounded-full w-3/4" />
                    <div className="h-10 bg-slate-100 rounded-xl w-full mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun véhicule disponible pour le moment.</p>
          ) : (
            <div className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((v: any, index: number) => {
                const monthlyRaw =
                  v.monthly_price ?? v.monthly ?? v.price_loa ?? v.price ?? null;
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
                  <motion.div
                    key={v.slug || v.id || `${v.brand}-${v.model}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut", delay: Math.min(index * 0.06, 0.4) }}
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
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default VehicleListing;
