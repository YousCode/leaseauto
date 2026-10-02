import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";

const PHONE_DISPLAY = "01 84 21 83 93";
const PHONE_HREF = "tel:0184218393";

export function CtaBandSection() {
  return (
    <section className="bg-brand-navy py-16 md:py-20 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-xl">
          <p className="text-[11px] tracking-[0.28em] uppercase text-white/50 font-medium">Prêt à démarrer ?</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-heading font-semibold">
            Parlez-nous de votre projet
          </h2>
          <p className="mt-3 text-sm md:text-base text-white/70">
            Réponse sous 24–48h ouvrées. Agence à Épinay-sur-Seine, du lundi au samedi.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            <Phone className="h-4 w-4" />
            {PHONE_DISPLAY}
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-7 py-3.5 text-sm font-bold hover:bg-brand-primary-dark transition-colors"
          >
            Demander une offre
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CtaBandSection;
