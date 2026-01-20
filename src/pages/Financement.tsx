import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CarFront, ClipboardCheck, HandCoins } from "lucide-react";

const SOLUTIONS = [
  {
    title: "Crédit Auto",
    accent: "Idéal pour acheter",
    icon: HandCoins,
    color: "text-slate-800",
    items: ["Vous êtes propriétaire", "Mensualités fixes", "Durée 12 à 72 mois"],
    accentKeys: ["propriétaire"],
  },
  {
    title: "LOA",
    accent: "Flexibilité & choix",
    icon: CarFront,
    color: "text-[#E52127]",
    items: ["Louez avec option d'achat", "Mensualités réduites", "Achat ou retour en fin de contrat"],
    accentKeys: ["achat", "louez"],
  },
  {
    title: "LLD",
    accent: "Tout inclus",
    icon: ClipboardCheck,
    color: "text-slate-800",
    items: ["Location longue durée", "Entretien inclus", "Aucun souci de revente"],
    accentKeys: ["location", "entretien", "revente"],
  },
];

const emphasize = (text: string, keys: string[], highlightClass: string) => {
  const lower = text.toLowerCase();
  const key = keys.find((k) => lower.includes(k));
  if (!key) return text;
  return (
    <>
      {text.split(new RegExp(`(${key})`, "i")).map((part, idx) =>
        part.toLowerCase() === key ? (
          <span key={idx} className={highlightClass}>
            {part}
          </span>
        ) : (
          <span key={idx}>{part}</span>
        ),
      )}
    </>
  );
};

const FinancementPage = () => {
  return (
    <div className="bg-gradient-to-b from-[#f5f7fb] to-white text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <div className="text-center space-y-3">
          <Badge className="bg-slate-100 text-slate-700">Financement sur mesure</Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Trouvez votre <span className="text-[#E52127]">financement</span> auto
          </h1>
          <p className="text-slate-600 text-base md:text-lg">
            Des solutions sur mesure pour rouler en toute sérénité.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:gap-6 md:grid-cols-3">
          {SOLUTIONS.map((solution) => (
            <div
              key={solution.title}
              className="rounded-3xl border border-slate-200 bg-white shadow-[0_15px_40px_rgba(15,23,42,0.06)] p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <solution.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className={`text-xl font-semibold ${solution.color}`}>{solution.title}</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                {solution.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className={`mt-0.5 h-2 w-2 rounded-full ${solution.color.replace("text", "bg")}`} />
                    <span>{emphasize(item, solution.accentKeys, solution.color)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <div className="rounded-xl bg-gradient-to-r from-slate-500/15 to-slate-400/15 text-center text-sm font-semibold text-slate-800 py-2">
                  {solution.accent}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-r from-[#E52127] to-[#c3161c] p-[1px] shadow-[0_20px_45px_rgba(229,33,39,0.35)]">
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-gradient-to-r from-[#e92b31] to-[#c3161c] px-6 py-10 text-center text-white">
            <p className="text-2xl md:text-3xl font-bold">Simulez votre mensualité !</p>
            <p className="text-white/80 text-sm md:text-base">
              Obtenez une estimation rapide et gratuite.
            </p>
            <Button className="mt-2 h-11 rounded-full bg-white px-6 text-[#E52127] hover:bg-white/90">
              Faire une simulation →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinancementPage;
