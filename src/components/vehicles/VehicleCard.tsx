import { Link } from "react-router-dom";
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
  return (
    <article className="group bg-white rounded-2xl shadow-[0_14px_40px_rgba(15,23,42,0.08)] overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-1">
      <Link to={`/vehicules/${slug}`} className="relative block aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&auto=format&fit=crop"}
          alt={`${brand || "Marque"} ${model || "Modèle"}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
          fetchPriority="auto"
        />
        {highlight && (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-medium text-white",
              highlight === "nouveau" && "bg-emerald-500",
              highlight === "dispo" && "bg-brand-blue",
              highlight === "promo" && "bg-brand-red",
            )}
          >
            {highlight === "nouveau" && "Nouveau"}
            {highlight === "dispo" && "Disponible immédiatement"}
            {highlight === "promo" && "Offre du moment"}
          </span>
        )}
      </Link>

      <div className="flex flex-col gap-3 px-4 pt-4 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{brand || "Marque"}</p>
          <h3 className="text-base md:text-lg font-semibold text-slate-900 leading-snug">{model || "Modèle"}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span>{year || "—"}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>{typeof mileage === "number" ? mileage.toLocaleString("fr-FR") : "—"} km</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>{energy || "—"}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>{transmission || "—"}</span>
        </div>

        <div className="flex items-end justify-between mt-1">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">À partir de</p>
            <p className="text-xl font-semibold text-slate-900">
              {typeof monthlyPrice === "number" ? monthlyPrice.toLocaleString("fr-FR") : "—"} €
              <span className="text-xs text-slate-500 font-normal"> / mois</span>
            </p>
          </div>

          <Link
            to={`/vehicules/${slug}`}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 h-9 text-xs font-medium text-slate-800 bg-white hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
          >
            Voir le véhicule
          </Link>
        </div>
      </div>
    </article>
  );
}

export default VehicleCard;
