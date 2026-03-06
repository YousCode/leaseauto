// @ts-nocheck
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import VehicleCard from "@/components/vehicles/VehicleCard";
import { useVehicles } from "@/hooks/useVehicles";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&auto=format&fit=crop";

const PREVIEW_COUNT = 6;

const VehicleListingsSection = () => {
  const { data: publishedVehicles = [], isLoading } = useVehicles("published");

  const featured = useMemo(() => {
    const list = [...(publishedVehicles as any[])];
    // Featured first, then by recency
    list.sort((a, b) => (Number(b.featured) || 0) - (Number(a.featured) || 0));
    return list.slice(0, PREVIEW_COUNT);
  }, [publishedVehicles]);

  return (
    <section className="bg-brand-light py-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <p className="text-[11px] tracking-[0.28em] uppercase text-slate-400 font-medium">
              Sélection Lease Auto
            </p>
            <h2 className="text-2xl md:text-3xl font-heading font-semibold text-brand-navy mt-1">
              Nos coups de cœur du moment
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-lg">
              Véhicules récents, contrôlés et prêts à partir — avec financement sur-mesure.
            </p>
          </div>
          <Link
            to="/vehicules"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:gap-3 transition-all duration-200 flex-shrink-0"
          >
            Voir toute la sélection
            <ArrowRight size={15} />
          </Link>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-slate-100 overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-slate-100" />
                <div className="p-4 space-y-3">
                  <div className="h-2.5 bg-slate-100 rounded-full w-1/4" />
                  <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                  <div className="h-2.5 bg-slate-100 rounded-full w-3/4" />
                  <div className="h-9 bg-slate-100 rounded-full w-full mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            Aucun véhicule disponible pour le moment.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((v: any, index: number) => {
              const primaryImage =
                (Array.isArray(v.images) && v.images.length > 0 && v.images[0]) ||
                v.image ||
                v.main_image_url ||
                FALLBACK_IMAGE;

              const monthlyRaw = v.monthly_price ?? v.monthly ?? v.price_loa ?? v.price ?? null;
              const monthlyPrice = typeof monthlyRaw === "number"
                ? Math.round(monthlyRaw)
                : monthlyRaw !== null ? Math.round(Number(String(monthlyRaw).replace(/[^\d.]/g, ""))) || null : null;

              const energy =
                typeof v.energy === "string" && v.energy.trim().length > 0
                  ? v.energy
                  : typeof v.fuel === "string" ? v.fuel : null;

              const transmission =
                typeof v.transmission === "string" && v.transmission.trim().length > 0
                  ? v.transmission
                  : typeof v.gearbox === "string" && v.gearbox.trim().length > 0
                  ? v.gearbox
                  : null;

              const highlight =
                v.highlight ||
                (v.new_arrival ? "nouveau" : v.availability === "immediate" ? "dispo" : v.featured ? "promo" : null);

              return (
                <motion.div
                  key={v.slug || v.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: Math.min(index * 0.07, 0.35) }}
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
                    highlight={highlight}
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {!isLoading && featured.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <Link
              to="/vehicules"
              className="inline-flex items-center gap-2.5 bg-brand-navy text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#0d1929] transition-colors duration-200 shadow-[0_8px_24px_rgba(11,17,32,0.2)] hover:shadow-[0_12px_32px_rgba(11,17,32,0.28)]"
            >
              Voir les {(publishedVehicles as any[]).length} véhicules disponibles
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export { VehicleListingsSection };
export default VehicleListingsSection;
