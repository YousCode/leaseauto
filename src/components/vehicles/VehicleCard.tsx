import { Link } from "react-router-dom";
import { ArrowUpRight, Gauge, Settings2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

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

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&auto=format&fit=crop";

const HIGHLIGHT_CONFIG = {
  nouveau: { label: "Nouveau", tone: "bg-white text-night" },
  dispo: { label: "Disponible immédiatement", tone: "bg-night/80 text-white" },
  promo: { label: "Offre du moment", tone: "bg-brand-primary text-white" },
} as const;

/** Une valeur vide ou un tiret de remplacement ne mérite pas de puce. */
const hasValue = (value?: string | null): value is string =>
  typeof value === "string" && value.trim().length > 0 && value.trim() !== "—";

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
  const name = `${brand || "Marque"} ${model || "Modèle"}`;

  return (
    <Link
      to={`/vehicules/${slug}`}
      className="surface group flex h-full flex-col p-2 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-slate-300"
    >
      {/* Média */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-slate-100">
        <img
          src={imageUrl || FALLBACK_IMAGE}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
          sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
        />

        {highlightCfg ? (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm",
              highlightCfg.tone,
            )}
          >
            {highlightCfg.label}
          </span>
        ) : null}

        {year ? (
          <span className="num absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-night backdrop-blur-sm">
            {year}
          </span>
        ) : null}
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-5 md:px-4 md:pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{brand || "Marque"}</p>
        <h3 className="mt-1.5 font-display text-xl font-semibold leading-tight text-night">{model || "Modèle"}</h3>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {mileage != null ? (
            <li className="chip num gap-1 px-2.5">
              <Gauge aria-hidden className="h-3.5 w-3.5 text-slate-400" />
              {mileage.toLocaleString("fr-FR")} km
            </li>
          ) : null}
          {hasValue(energy) ? (
            <li className="chip gap-1 px-2.5">
              <Zap aria-hidden className="h-3.5 w-3.5 text-slate-400" />
              {energy}
            </li>
          ) : null}
          {hasValue(transmission) ? (
            <li className="chip gap-1 px-2.5">
              <Settings2 aria-hidden className="h-3.5 w-3.5 text-slate-400" />
              {transmission}
            </li>
          ) : null}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <div>
            <p className="text-xs text-slate-500">À partir de</p>
            <p className="num mt-1 font-display text-[1.75rem] font-semibold leading-none text-night">
              {typeof monthlyPrice === "number" ? Math.round(monthlyPrice).toLocaleString("fr-FR") : "—"}
              <span className="ml-1 font-sans text-sm font-normal text-slate-500">€/mois</span>
            </p>
          </div>

          <span
            aria-hidden
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-night text-white transition-colors duration-300 ease-out group-hover:bg-brand-primary"
          >
            <ArrowUpRight className="h-[18px] w-[18px] transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Squelette de chargement aux mêmes proportions que la carte. */
export function VehicleCardSkeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("surface animate-pulse p-2", className)}>
      <div className="aspect-[16/10] rounded-[20px] bg-slate-100" />
      <div className="px-3 pb-3 pt-5 md:px-4 md:pb-4">
        <div className="h-2.5 w-1/4 rounded-full bg-slate-100" />
        <div className="mt-3 h-5 w-2/3 rounded-full bg-slate-100" />
        <div className="mt-5 flex gap-1.5">
          <div className="h-6 w-20 rounded-full bg-slate-100" />
          <div className="h-6 w-16 rounded-full bg-slate-100" />
          <div className="h-6 w-24 rounded-full bg-slate-100" />
        </div>
        <div className="mt-7 flex items-end justify-between">
          <div className="h-7 w-28 rounded-full bg-slate-100" />
          <div className="h-11 w-11 rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default VehicleCard;
