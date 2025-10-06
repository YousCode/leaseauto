import { Icon } from "@iconify/react";
import type { IconifyIcon } from "@iconify/react";
import simple from "@iconify-json/simple-icons/icons.json";

export function BrandLogo({
  brand,
  size = 32,
  className = "",
}: {
  brand: string | undefined;
  size?: number;
  className?: string;
}) {
  if (!brand) return null;

  // slug simple-icons = minuscule sans espace/accents
  const slug = brand
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // accents
    .replace(/[^a-z0-9]/g, "") // keep alphanum
    .replace(/benz$/, ""); // ex : Mercedes Benz → mercedes

  const data = (simple as Record<string, IconifyIcon>)[`si-${slug}`];

  if (!data)
    return (
      <Icon icon="mdi:car" width={size} height={size} className={className} />
    );

  return <Icon icon={data} width={size} height={size} className={className} />;
}
