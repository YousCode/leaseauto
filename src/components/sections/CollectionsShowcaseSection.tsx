import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type SimpleCollection = {
  title: string;
  description: string;
  details: string;
  image: string;
  to: string;
};

const SIMPLE_COLLECTIONS: SimpleCollection[] = [
  {
    title: "Daily chic",
    description: "Citadines, compactes et SUV urbains prêts à rouler en ville.",
    details: "Finitions S-Line, packs confort, assistance connectée.",
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
    to: "/vehicules?collection=daily",
  },
  {
    title: "Business électrique",
    description: "Berlines et crossovers silencieux pour dirigeants et VTC.",
    details: "Recharge incluse, fiscalité optimisée, sièges lounge.",
    image:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=800&q=80",
    to: "/services/vehicules-electriques",
  },
  {
    title: "Week-end vibrant",
    description: "Coupés et cabriolets iconiques pour s’échapper sans contrainte.",
    details: "Toits panoramiques, packs son premium, livraisons flexibles.",
    image:
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80",
    to: "/vehicules?collection=weekend",
  },
];

export function CollectionsShowcaseSection() {
  return (
    <section className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
            rubriques claires
          </p>
          <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl">
            Trois univers pour aller à l’essentiel
          </h2>
          <p className="text-lg text-gray-600">
            Feuilletez, choisissez, réservez. Chaque rubrique résume vraiment ce que vous obtenez.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {SIMPLE_COLLECTIONS.map((collection) => (
            <article
              key={collection.title}
              className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-[#f9fafc] p-6 md:flex-row md:items-center"
            >
              <div className="h-32 w-full overflow-hidden rounded-2xl md:h-28 md:w-40">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm uppercase tracking-wide text-gray-400">rubrique</p>
                <h3 className="text-2xl font-semibold text-gray-900">{collection.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{collection.description}</p>
                <p className="text-sm text-gray-500">{collection.details}</p>
              </div>
              <Link
                to={collection.to}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900"
              >
                Ouvrir la rubrique
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CollectionsShowcaseSection;
