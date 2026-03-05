import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { VehicleCard } from "./VehicleCard";
import type { Vehicle } from "@/types/vehicle";
import { useVehicles } from "@/hooks/useVehicles";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";

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

  const filtered = useMemo(() => {
    let list = [...vehicles] as any[];

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
  }, [vehicles, search, sort]);

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
