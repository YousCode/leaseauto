import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowRight, Gauge, Zap, Settings2 } from "lucide-react";

export type VehicleCardProps = {
  slug: string;
  imageUrl?: string | null;
  brand?: string | null;
  model?: string | null;
  year?: number | null;
  mileage?: number | null;
  energy?: string | null;
  transmission?: string | null;
  monthlyPrice?: number | null;
  highlight?: "nouveau" | "dispo" | "promo" | null;
};

const HIGHLIGHT_CONFIG = {
  nouveau: { label: "Nouveau", bg: "bg-emerald-500" },
  dispo: { label: "Disponible immédiatement", bg: "bg-brand-blue" },
  promo: { label: "Offre du moment", bg: "bg-brand-red" },
};

export function VehicleCard({
  slug,
  imageUrl,
  brand,
  model,
  year,
  mileage,
  energy,
  transmission,
  monthlyPrice,
  highlight,
}: VehicleCardProps) {
  const highlightCfg = highlight ? HIGHLIGHT_CONFIG[highlight] : null;

  return (
    <Link
      to={`/vehicules/${slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_24px_rgba(11,17,32,0.07)] hover:shadow-[0_20px_50px_rgba(229,33,39,0.18),0_6px_20px_rgba(11,17,32,0.1)] hover:-translate-y-1.5 hover:border-red-100 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&auto=format&fit=crop"}
          alt={`${brand || "Marque"} ${model || "Modèle"}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
        />
        {/* Dark gradient at bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Badge highlight */}
        {highlightCfg && (
          <span className={cn(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm",
            highlightCfg.bg
          )}>
            {highlightCfg.label}
          </span>
        )}

        {/* Year tag bottom-left */}
        {year && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-slate-800 shadow-sm">
            {year}
          </span>
        )}
      </div>

      {/* Red accent line on hover */}
      <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-brand-red to-red-400 transition-all duration-500 ease-out" />

      {/* Content */}
      <div className="px-4 pt-3.5 pb-4 flex flex-col gap-3">
        {/* Brand + Model */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400 font-medium">
            {brand || "Marque"}
          </p>
          <h3 className="text-[15px] font-bold text-brand-navy leading-snug mt-0.5 group-hover:text-brand-red transition-colors duration-200">
            {model || "Modèle"}
          </h3>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          {mileage != null && (
            <span className="flex items-center gap-1">
              <Gauge size={11} className="text-slate-400" />
              {mileage.toLocaleString("fr-FR")} km
            </span>
          )}
          {energy && (
            <span className="flex items-center gap-1">
              <Zap size={11} className="text-slate-400" />
              {energy}
            </span>
          )}
          {transmission && (
            <span className="flex items-center gap-1">
              <Settings2 size={11} className="text-slate-400" />
              {transmission}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-medium">À partir de</p>
            <p className="text-xl font-bold text-brand-navy leading-none mt-0.5">
              {typeof monthlyPrice === "number"
                ? Math.round(monthlyPrice).toLocaleString("fr-FR")
                : "—"}
              <span className="text-sm font-normal text-slate-400"> €/mois</span>
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 bg-brand-red text-white text-[11px] font-semibold px-3.5 py-2 rounded-full group-hover:bg-[#b50f0f] transition-colors duration-200 flex-shrink-0">
            Voir
            <ArrowRight size={11} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default VehicleCard;
