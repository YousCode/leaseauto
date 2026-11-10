import { Link } from "react-router-dom";
import { ArrowUpRight, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const PHONE_DISPLAY = "01 84 21 83 93";
const PHONE_HREF = "tel:0184218393";

type CtaBandSectionProps = {
  /** Fond autour du bloc : celui de la section qui précède. */
  tone?: "paper" | "white";
};

/** Appel à l'action final : grand bloc « nuit » arrondi, posé sur le fond de la page. */
export function CtaBandSection({ tone = "paper" }: CtaBandSectionProps) {
  return (
    <section className={`${tone === "paper" ? "bg-paper" : "bg-white"} px-3 pb-3 md:px-6 md:pb-6`}>
      <div className="grain relative mx-auto max-w-[1560px] overflow-hidden rounded-[36px] bg-night text-white md:rounded-[48px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full bg-brand-ink/60 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-56 -left-32 h-[440px] w-[440px] rounded-full bg-brand-primary/25 blur-[130px]"
        />

        <div className="container-x relative z-10 py-16 md:py-24 lg:py-28">
          <Reveal>
            <p className="eyebrow eyebrow-dark">Prêt à démarrer ?</p>
            <h2 className="display-xl mt-6 max-w-[14ch]">Parlez-nous de votre projet</h2>
          </Reveal>

          <Reveal
            delay={0.1}
            className="mt-10 flex flex-col gap-8 border-t border-white/15 pt-8 md:mt-14 lg:flex-row lg:items-center lg:justify-between"
          >
            <p className="max-w-md text-base leading-relaxed text-white/65 md:text-lg">
              Réponse sous 24–48h ouvrées. Agence à Épinay-sur-Seine, du lundi au samedi.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href={PHONE_HREF} className="btn btn-ghost-dark btn-lg">
                <Phone />
                <span className="num">{PHONE_DISPLAY}</span>
              </a>
              <Link to="/contact" className="btn btn-primary btn-lg">
                Demander une offre
                <ArrowUpRight />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default CtaBandSection;
