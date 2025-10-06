import { Icon } from "@iconify/react";
import simpleIcons from "@iconify-json/simple-icons/icons.json";

interface BrandLogoProps {
  brand?: string;
  size?: number;
  className?: string;
}

/** Renvoie le composant <Icon> prêt à être rendu */
export function BrandLogo({ brand, size = 32, className = "" }: BrandLogoProps) {
  if (!brand) {
    return <Icon icon="mdi:car" width={size} height={size} className={className} />;
  }

  // slug simple-icons = nom en minuscules sans espace
  const slug = brand
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") // enlève accents & espaces
    .replace(/benz$/, ""); // ex: "Mercedes Benz" → "mercedes"

  const data = (simpleIcons as any).icons[slug];

  // fallback générique (icône voiture)
  if (!data) {
    return <Icon icon="mdi:car" width={size} height={size} className={className} />;
  }

  return <Icon icon={`si:${slug}`} width={size} height={size} className={className} />;
}

/** Returns the icon key for a brand logo */
export function getBrandLogoIcon(brand?: string): string {
  if (!brand) {
    return "mdi:car";
  }

  // slug simple-icons = nom en minuscules sans espace
  const slug = brand
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") // enlève accents & espaces
    .replace(/benz$/, ""); // ex: "Mercedes Benz" → "mercedes"

  const iconKey = `si:${slug}`;
  const data = (simpleIcons as any).icons[slug];

  // fallback générique (icône voiture)
  if (!data) {
    return "mdi:car";
  }

  return iconKey;
}

// Keep the old function for backward compatibility
export const getBrandLogo = (brand?: string) => {
  // This is now deprecated, use getBrandLogoIcon instead
  return getBrandLogoIcon(brand);
};