import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  as?: "h1" | "h2";
  size?: "lg" | "md";
  action?: ReactNode;
  className?: string;
};

/** En-tête de section : sur-titre, titre display, sous-titre, action optionnelle à droite. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  tone = "light",
  align = "left",
  as = "h2",
  size = "lg",
  action,
  className = "",
}: SectionHeadingProps) {
  const Title = as;
  const dark = tone === "dark";
  const centered = align === "center";
  return (
    <Reveal
      as="header"
      className={`mb-12 flex flex-col gap-6 md:mb-16 ${
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      } ${className}`}
    >
      <div className={centered ? "max-w-3xl" : "max-w-2xl"}>
        {eyebrow ? <p className={`eyebrow ${dark ? "eyebrow-dark" : ""}`}>{eyebrow}</p> : null}
        <Title className={`${size === "lg" ? "display-lg" : "display-md"} mt-4 ${dark ? "text-white" : "text-night"}`}>
          {title}
        </Title>
        {subtitle ? (
          <p className={`mt-4 text-base leading-relaxed md:text-lg ${dark ? "text-white/65" : "text-slate-600"}`}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </Reveal>
  );
}

export default SectionHeading;
