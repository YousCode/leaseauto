import { useMemo } from "react";
import { VehicleCard } from "./VehicleCard";
import type { Vehicle } from "@/types/vehicle";
import { useVehicles } from "@/hooks/useVehicles";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type VehicleListingProps = {
  vehicles?: Vehicle[];
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&auto=format&fit=crop";

export function VehicleListing({ vehicles: override }: VehicleListingProps) {
  const { data: fetchedVehicles = [], isLoading } = useVehicles("published");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"price-asc" | "price-desc" | "year-desc" | "km-asc" | "featured">("featured");

  const vehicles = useMemo(() => override || fetchedVehicles || [], [override, fetchedVehicles]);

  const filtered = useMemo(() => {
    let list = [...vehicles];

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
        list.sort(
          (a, b) =>
            (a.monthly_price ?? (a as any).monthly ?? a.price_loa ?? 0) -
            (b.monthly_price ?? (b as any).monthly ?? b.price_loa ?? 0),
        );
        break;
      case "price-desc":
        list.sort(
          (a, b) =>
            (b.monthly_price ?? (b as any).monthly ?? b.price_loa ?? 0) -
            (a.monthly_price ?? (a as any).monthly ?? a.price_loa ?? 0),
        );
        break;
      case "year-desc":
        list.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
        break;
      case "km-asc":
        list.sort((a, b) => (a.mileage ?? 0) - (b.mileage ?? 0));
        break;
      case "featured":
      default:
        list.sort((a, b) => (Number(b.featured) || 0) - (Number(a.featured) || 0));
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
            <p className="text-sm text-slate-500">Chargement des véhicules...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun véhicule disponible pour le moment.</p>
          ) : (
            <div className="grid gap-6 md:gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((v) => {
                const monthlyRaw =
                  (v as any).monthly_price ?? v.monthly ?? v.price_loa ?? v.price ?? null;
                const monthlyPrice = typeof monthlyRaw === "number" ? monthlyRaw : null;

                return (
                  <VehicleCard
                    key={v.id ?? v.slug ?? Math.random()}
                    slug={v.slug || String(v.id)}
                    imageUrl={
                      (v as any).main_image_url ||
                      (Array.isArray(v.images) ? v.images[0] : undefined) ||
                      PLACEHOLDER_IMAGE
                    }
                    brand={v.brand || "Marque"}
                    model={v.model || v.title || "Modèle"}
                    year={v.year || undefined}
                    mileage={v.mileage || undefined}
                    energy={(v.energy || "").toString() || "—"}
                    transmission={(v.transmission || (v as any).gearbox || "—").toString()}
                    monthlyPrice={monthlyPrice}
                    highlight={
                      (v.highlight as any) ||
                      (v.new_arrival
                        ? "nouveau"
                        : v.availability === "immediate"
                        ? "dispo"
                        : v.featured
                        ? "promo"
                        : null)
                    }
                  />
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
