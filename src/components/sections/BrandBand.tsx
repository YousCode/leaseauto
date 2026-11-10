import { useMemo } from "react";
import { Marquee } from "@/components/ui/Marquee";
import { useVehicles } from "@/hooks/useVehicles";

/** Repères déjà affichés ailleurs sur le site (héros, financement). */
const KEYWORDS = ["LOA", "Crédit auto", "Sans apport possible", "Réponse 24–48h", "VTC / Pro", "Livraison à domicile"];
const MIN_BRANDS = 3;

/**
 * Bandeau de transition entre la scène nuit et le contenu clair :
 * marques réellement présentes dans le parc publié (sinon les repères de l'offre).
 */
export function BrandBand() {
  const { data: vehicles = [] } = useVehicles("published");

  const items = useMemo(() => {
    const names = new Set<string>();
    (vehicles as any[]).forEach((v) => {
      const b = typeof v.brand === "string" ? v.brand.trim() : "";
      if (b) names.add(b);
    });
    const brands = [...names];
    const base = brands.length >= MIN_BRANDS ? brands : KEYWORDS;
    // Assez d'éléments pour remplir la largeur avant duplication.
    return base.length < 8 ? [...base, ...base] : base;
  }, [vehicles]);

  return (
    <div className="relative bg-night text-white">
      <Marquee duration={36} className="mask-fade-x border-y border-white/10 py-6 md:py-8">
        {items.map((label, i) => (
          <span key={`${label}-${i}`} className="flex items-center">
            <span className="font-display text-3xl font-bold tracking-tight text-white/85 md:text-5xl">{label}</span>
            <span aria-hidden className="mx-7 h-2 w-2 rounded-full bg-brand-primary-bright md:mx-10" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}

export default BrandBand;
