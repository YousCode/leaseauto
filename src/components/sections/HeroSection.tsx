import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUICK_VEHICLES = [
  {
    id: 1,
    label: "SUV premium",
    name: "Range Rover Sport D350",
    price: "990 € / mois",
    image: "/images/vehicles/range-rover.jpg",
  },
  {
    id: 2,
    label: "Business électrique",
    name: "Mercedes EQE AMG Line",
    price: "890 € / mois",
    image: "/images/vehicles/mercedes-eqe.jpg",
  },
  {
    id: 3,
    label: "GT iconique",
    name: "Porsche 911 Carrera",
    price: "1 450 € / mois",
    image: "/images/vehicles/porsche-911.jpg",
  },
];

export function HeroSection() {
  const [budget, setBudget] = useState(600);

  const handleQuickSearch = () => {
    const params = new URLSearchParams();
    params.set("maxPrice", budget.toString());
    window.location.href = `/catalogue?${params.toString()}`;
  };

  return (
    <section className="relative bg-brand-light/80">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-brand-light to-white" />

      <div className="relative container mx-auto px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-12 items-center">
        <div className="space-y-8">
          <p className="text-xs tracking-[0.28em] uppercase text-slate-500">
            Leasing simplifié
          </p>

          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-brand-navy leading-tight">
            Choisissez votre voiture,
            <br />
            <span className="text-brand-red">Lease Auto</span> s’occupe du reste.
          </h1>

          <p className="text-slate-600 max-w-xl text-sm md:text-base">
            Démarches simplifiées, contrats transparents, sélection courte de véhicules prêts à partir.
            Un accompagnement humain, sans jargon, pour un leasing clair et élégant.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              asChild
              className="bg-brand-red hover:bg-brand-red/90 text-white rounded-full px-8 h-11 shadow-md"
            >
              <Link to="/catalogue">
                Voir la sélection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="outline"
              className="rounded-full h-11 border-slate-300 text-slate-700 bg-white/60 hover:bg-white"
              asChild
            >
              <Link to="/contact">Parler à un conseiller</Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 pt-2 text-xs md:text-sm text-slate-600">
            <BadgeIcon label="Contrats transparents" />
            <BadgeIcon label="Livraison rapide" />
            <BadgeIcon label="Conseiller dédié" />
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_18px_60px_rgba(15,23,42,0.15)] p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] tracking-[0.28em] uppercase text-slate-400">
                  Sélection rapide
                </p>
                <h2 className="text-sm md:text-base font-semibold text-slate-900">
                  3 modèles disponibles immédiatement
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Réservez en ligne, récupérez votre véhicule sans paperasse inutile.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {QUICK_VEHICLES.map((v) => (
                <button
                  key={v.id}
                  className="w-full flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-brand-red/30 transition-colors px-3 py-2.5 text-left"
                  onClick={() => (window.location.href = `/vehicules/${v.id}`)}
                >
                  <div className="h-10 w-14 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0">
                    <img src={v.image} alt={v.name} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{v.label}</p>
                    <p className="text-sm font-medium text-slate-900 truncate">{v.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-800">{v.price}</p>
                    <p className="text-[11px] text-slate-400">Sans apport</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Filtrer par budget</span>
                <span className="font-medium text-slate-800">{budget} € / mois max</span>
              </div>
              <input
                type="range"
                min={200}
                max={1500}
                step={50}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-brand-red"
              />
              <Button
                size="sm"
                className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-full h-9 text-xs"
                onClick={handleQuickSearch}
              >
                <Search className="h-3.5 w-3.5 mr-1.5" />
                Voir les offres dans mon budget
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BadgeIcon({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">
      <CheckCircle2 className="h-3.5 w-3.5 text-brand-blue" />
      <span className="text-[11px] text-slate-600">{label}</span>
    </span>
  );
}

export default HeroSection;
