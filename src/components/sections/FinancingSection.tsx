import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CarFront, ClipboardCheck } from "lucide-react";

const SOLUTIONS = [
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

const FinancingSection = () => {
  const navigate = useNavigate();
  const [price, setPrice] = useState(32000);
  const [duration, setDuration] = useState(48);
  const [rate, setRate] = useState(4.2);
  const [dialogOpen, setDialogOpen] = useState(false);

  const simulation = useMemo(() => {
    const capital = Math.max(0, price);
    const monthlyRate = rate / 100 / 12;
    const residualFactor = 0.3; // LOA focus
    const residual = capital * residualFactor;
    const financed = Math.max(0, capital - residual);
    if (!financed || duration <= 0) return { monthly: 0 };
    if (monthlyRate === 0) return { monthly: Math.round(financed / duration) };
    const factor = (monthlyRate * Math.pow(1 + monthlyRate, duration)) / (Math.pow(1 + monthlyRate, duration) - 1);
    return { monthly: Math.round(financed * factor) };
  }, [price, duration, rate]);

  return (
    <section className="bg-gradient-to-b from-[#f7f9fc] via-white to-[#f6f9ff]">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-16 space-y-10">
        <div className="text-center space-y-3">
          <Badge className="bg-slate-100 text-slate-700 shadow-sm">Financement sur mesure</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Trouvez votre <span className="text-[#E52127]">financement</span> auto
          </h2>
          <p className="text-slate-600 text-base md:text-lg max-w-3xl mx-auto">
            LOA ou LLD, on calibre le contrat et le budget pour une expérience sans surprise.
          </p>
        </div>

        <div className="grid gap-5 md:gap-6 md:grid-cols-2">
          {SOLUTIONS.map((solution) => (
            <div
              key={solution.title}
              className="rounded-3xl border border-slate-200/70 bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.08)] p-6 md:p-7 flex flex-col gap-4 transition duration-200 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.12)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 shadow-inner">
                  <solution.icon className="h-6 w-6" />
                </div>
                <p className={`text-xl font-semibold ${solution.color}`}>{solution.title}</p>
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
                <div className="rounded-xl bg-gradient-to-r from-slate-500/10 to-slate-400/10 text-center text-sm font-semibold text-slate-800 py-2">
                  {solution.accent}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#e52b2f] via-[#d91c23] to-[#b01014] p-[1px] shadow-[0_26px_60px_rgba(229,33,39,0.28)]">
          <div className="rounded-3xl bg-gradient-to-br from-[#ec353a] via-[#d91c23] to-[#b01014] px-6 py-9 text-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold">Simulez votre mensualité !</p>
                <p className="text-white/80 text-sm md:text-base">
                  Calibrée pour nos contrats LOA. Ajustez le budget et obtenez une estimation.
                </p>
              </div>
              <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-inner">
                LOA (focus)
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">Prix du véhicule (€)</p>
                <Input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value) || 0)}
                  className="border-white/30 bg-white/10 text-white placeholder:text-white/60 focus-visible:ring-white/70"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">Durée (mois)</p>
                <Input
                  type="number"
                  min={12}
                  max={84}
                  step={6}
                  value={duration}
                  onChange={(e) => setDuration(Math.min(84, Math.max(12, Number(e.target.value) || 12)))}
                  className="border-white/30 bg-white/10 text-white placeholder:text-white/60 focus-visible:ring-white/70"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">Taux (%)</p>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={rate}
                  onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
                  className="border-white/30 bg-white/10 text-white placeholder:text-white/60 focus-visible:ring-white/70"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3 text-center">
              <p className="text-sm text-white/80">Estimation indicative, hors assurances et frais.</p>
              <div className="flex flex-col items-center gap-2 rounded-full bg-white px-6 py-3 text-[#E52127] shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b51a1f]">Mensualité estimée</p>
                <p className="text-3xl font-bold leading-tight">
                  {simulation.monthly.toLocaleString("fr-FR")} € / mois
                </p>
              </div>
              <Button
                onClick={() => setDialogOpen(true)}
                className="mt-2 h-11 rounded-full bg-white px-6 text-[#E52127] hover:bg-white/90"
              >
                Faire une simulation détaillée →
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Simulation rapide</DialogTitle>
            <DialogDescription>
              Résumé indicatif LOA. Ajustez vos paramètres ou ouvrez la page dédiée pour plus de détails.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex justify-between">
              <span>Mode</span>
              <span className="font-semibold uppercase">LOA</span>
            </div>
            <div className="flex justify-between">
              <span>Prix du véhicule</span>
              <span className="font-semibold">{price.toLocaleString("fr-FR")} €</span>
            </div>
            <div className="flex justify-between">
              <span>Durée</span>
              <span className="font-semibold">{duration} mois</span>
            </div>
            <div className="flex justify-between">
              <span>Taux indicatif</span>
              <span className="font-semibold">{rate}%</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-sm font-semibold text-slate-800">Mensualité estimée</span>
              <span className="text-xl font-bold text-[#E52127]">
                {simulation.monthly.toLocaleString("fr-FR")} € / mois
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Fermer
            </Button>
            <Button
              className="bg-[#E52127] text-white hover:bg-[#c3161c]"
              onClick={() => {
                setDialogOpen(false);
                navigate("/financement");
              }}
            >
              Accéder à la page simulation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FinancingSection;
