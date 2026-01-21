import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type ProOffer = {
  kicker: string;
  title: string;
  description: string;
  details: string;
  image: string;
  to: string;
  tags: string[];
  badge?: string;
};

const PRO_OFFERS: ProOffer[] = [
  {
    kicker: "OFFRE VTC",
    title: "Véhicules pour chauffeurs VTC",
    description:
      "Berlines et crossovers adaptés aux plateformes VTC : confort passagers, consommation maîtrisée, critères respectés.",
    details:
      "Dossier simplifié • Financement possible sans apport selon profil • Livraison rapide.",
    image:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=80",
    to: "/financement?profil=vtc",
    tags: ["VTC", "Électrique / Hybride", "Confort"],
    badge: "Réponse 24–48h",
  },
  {
    kicker: "ENTREPRISE",
    title: "Véhicules pour entreprises & indépendants",
    description:
      "Pour sociétés, artisans et indépendants : berlines, SUV et utilitaires légers selon votre activité.",
    details:
      "Achat ou financement pro • Optimisation du budget • Accompagnement administratif.",
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=900&q=80",
    to: "/financement?profil=entreprise",
    tags: ["Entreprise", "Indépendant", "Usage pro"],
    badge: "Étude personnalisée",
  },
  {
    kicker: "ACHAT PRO",
    title: "Achat de véhicule professionnel",
    description:
      "Vous souhaitez être propriétaire : sélection, contrôle du véhicule et solutions d’achat adaptées.",
    details:
      "Achat comptant ou crédit • Reprise possible • Conseil et suivi dédiés.",
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80",
    to: "/vehicules?usage=professionnel",
    tags: ["Achat", "Crédit pro", "Reprise"],
    badge: "Accompagnement complet",
  },
];

export function CollectionsShowcaseSection() {
  return (
    <section className="relative border-t border-gray-100 bg-gradient-to-b from-white via-[#f7f9fc] to-white">
      <div
        className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-slate-100/60 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20 space-y-12">
        {/* Header */}
        <div className="flex flex-col gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Offres professionnelles
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Des solutions claires pour les professionnels
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto">
            Chauffeur VTC, entreprise ou indépendant : choisissez votre besoin.
            Nous vous accompagnons sur le véhicule, le financement et le dossier,
            avec une réponse rapide et adaptée à votre activité.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-5">
          {PRO_OFFERS.map((offer) => (
            <Link
              key={offer.title}
              to={offer.to}
              className="group block"
              aria-label={`Voir ${offer.title}`}
            >
              <article className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-[0_22px_56px_rgba(15,23,42,0.12)] md:flex-row md:items-center md:gap-7">
                {/* Image */}
                <div className="relative h-36 w-full overflow-hidden rounded-2xl md:h-32 md:w-52 ring-1 ring-slate-100">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  {offer.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 ring-1 ring-slate-200">
                      {offer.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">
                    {offer.kicker}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-2xl font-black text-slate-900">
                      {offer.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {offer.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-slate-700">{offer.description}</p>
                  <p className="text-sm text-slate-500">{offer.details}</p>
                </div>

                {/* CTA */}
                <div className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition group-hover:border-[#E52127] group-hover:text-[#E52127] md:self-auto">
                  Voir l’offre
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Bottom reassurance */}
        <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            Dossier rapide
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            Financement professionnel
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            Véhicules conformes VTC
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            Accompagnement humain
          </span>
        </div>
      </div>
    </section>
  );
}

export default CollectionsShowcaseSection;