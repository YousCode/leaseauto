import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import LazyImage from "@/components/ui/LazyImage";
import { BrandLogo } from "@/lib/BrandLogo";

export interface VehicleCardProps {
  slug?: string;
  image?: string;
  name?: string;
  brand?: string;
  price?: string | number | null;
  monthly?: string | number | null;
  city?: string | null;
  date?: string | null;      // ISO
  energy?: string | null;    // "Électrique", "Hybride", "Essence", ...
  onClick?: () => void;      // utilisé par la Quick View
}

/* Helpers */
const formatMoney = (v?: string | number | null) => {
  if (v == null) return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/[^\d]/g, ""));
  if (!Number.isFinite(n)) return null;
  return n.toLocaleString("fr-FR") + "\u00A0€";
};

const toneByEnergy: Record<string, string> = {
  "électrique": "bg-emerald-600 text-white",
  "electrique": "bg-emerald-600 text-white",
  "hybride": "bg-sky-600 text-white",
  "essence": "bg-neutral-900 text-white",
  "diesel": "bg-neutral-700 text-white",
};

const isNewSince = (iso?: string | null, days = 45) => {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < days * 24 * 60 * 60 * 1000;
};

const VehicleCard = ({
  slug = "vehicule",
  image = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
  name = "Véhicule",
  brand,
  price,
  monthly,
  city,
  date,
  energy,
  onClick,
}: VehicleCardProps) => {
  const { ref, isIntersecting } = useIntersectionObserver(0.15);

  const priceLabel = formatMoney(price);
  const monthlyLabel = formatMoney(monthly);
  const formattedDate = date
    ? new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  const energyTone =
    (energy && toneByEnergy[energy.toLowerCase()]) ||
    (energy ? "bg-neutral-900 text-white" : "");

  const showNew = isNewSince(date);

  const handleClick = () => {
    onClick?.();
  };

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={isIntersecting ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{
        layout: { type: "spring", stiffness: 360, damping: 42 },
        duration: 0.3,
        ease: "easeOut",
      }}
      whileHover={{ y: -6, boxShadow: "0px 18px 35px rgba(15,23,42,0.12)" }}
      whileTap={{ scale: 0.995 }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 focus-within:ring-2 focus-within:ring-neutral-900/10"
      onClick={handleClick}
      aria-label={name}
    >
      {/* Image 16/9 */}
      <figure className="relative aspect-[16/9] overflow-hidden">
        <LazyImage
          src={image}
          alt={name}
          containerClassName="h-full w-full"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />

        {/* Pastilles (énergie + nouveau) */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {energy ? (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${energyTone}`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Motorisation ${energy}`}
            >
              {energy}
            </span>
          ) : null}
          {showNew ? (
            <span
              className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-neutral-900 shadow"
              onClick={(e) => e.stopPropagation()}
            >
              Nouveau
            </span>
          ) : null}
        </div>

        {/* Overlay montant /mois (si dispo) */}
        {monthlyLabel ? (
          <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-sm">
            {monthlyLabel}
            <span className="opacity-80">/mois</span>
          </div>
        ) : null}
      </figure>

      {/* Contenu */}
      <div className="flex flex-1 flex-col gap-3 px-4 py-5">
        {/* Titre + logo */}
        <div className="mb-1 flex items-start gap-2">
          <BrandLogo brand={brand} size={20} className="mt-0.5 shrink-0" />
          <h3 className="flex-1 line-clamp-2 text-sm font-medium leading-snug text-neutral-900">
            {name}
          </h3>
        </div>

        {/* Prix comptant + rappel mensuel (si pas d’overlay) */}
        <div className="flex flex-wrap items-baseline gap-3">
          {priceLabel ? (
            <span className="text-[20px] font-semibold tracking-tight text-neutral-900">
              {priceLabel}
            </span>
          ) : (
            <span className="text-[14px] text-neutral-500">Prix sur demande</span>
          )}
          {!monthlyLabel ? null : (
            <span className="rounded-full border border-neutral-300 px-2.5 py-1 text-[12px] font-medium text-neutral-700">
              {monthlyLabel}
              <span className="opacity-80">/mois</span>
            </span>
          )}
        </div>

        {/* Localisation + date */}
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-neutral-500">
          {city && (
            <span className="inline-flex items-center gap-1" aria-label={`Localisation ${city}`}>
              <MapPin size={14} className="shrink-0" />
              {city}
            </span>
          )}
          {formattedDate && (
            <>
              <span className="inline-block h-[14px] w-px bg-neutral-300" aria-hidden />
              <span className="inline-flex items-center gap-1" aria-label={`Ajouté le ${formattedDate}`}>
                <Calendar size={14} className="shrink-0" />
                {formattedDate}
              </span>
            </>
          )}
        </div>

        {/* CTA */}
        <Link
          to={`/vehicules/${slug}`}
          className="mt-auto inline-flex items-center justify-center gap-1 rounded-full border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Voir la fiche de ${name}`}
        >
          Voir le véhicule
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </motion.article>
  );
};

export default VehicleCard;
