import { useMemo, useState, useEffect } from "react";
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
import { CarFront, Check, ArrowRight, Calculator } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useInView } from "react-intersection-observer";

const SOLUTIONS = [
  {
    title: "LOA",
    accent: "Flexibilité & choix",
    icon: CarFront,
    color: "text-[#E52127]",
    items: ["Louez avec option d'achat", "Mensualités réduites", "Achat ou retour en fin de contrat"],
    accentKeys: ["achat", "louez"],
  },
];

// Helpers
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const toNumber = (v: string, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

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

const NumberCounter = ({ end, duration = 1.2 }: { end: number; duration?: number }) => {
  const value = useMotionValue(0);
  const formatted = useTransform(value, (latest) => Math.round(latest).toLocaleString("fr-FR"));

  useEffect(() => {
    const controls = animate(value, end, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [end, duration, value]);

  return (
    <motion.span className="text-4xl lg:text-5xl font-black leading-none bg-gradient-to-r from-[#E52127] to-[#b01014] bg-clip-text text-transparent">
      {formatted}
    </motion.span>
  );
};

const FinancingSection = () => {
  const navigate = useNavigate();

  const [price, setPrice] = useState(32000);
  const [duration, setDuration] = useState(48);

  // ✅ Apport 20% par défaut, modifiable
  const [depositPercent, setDepositPercent] = useState(20);

  // (Optionnel) VR 30% modifiable — si tu veux garder fixe, mets const residualPercent = 30;
  const [residualPercent, setResidualPercent] = useState(30);

  const [dialogOpen, setDialogOpen] = useState(false);

  const simulation = useMemo(() => {
    const capital = Math.max(0, price);

    const depositP = clamp(depositPercent, 0, 100);
    const depositAmount = (depositP / 100) * capital;

    const financedAmount = Math.max(0, capital - depositAmount);

    const vrP = clamp(residualPercent, 0, 60); // 60% max par sécurité (à ajuster)
    const residual = (vrP / 100) * financedAmount;

    const financed = Math.max(0, financedAmount - residual);

    if (!financed || duration <= 0) {
      return { monthly: 0, depositAmount: Math.round(depositAmount), residual: Math.round(residual) };
    }

    // Calcul indicatif sans taux (linéaire)
    return {
      monthly: Math.round(financed / duration),
      depositAmount: Math.round(depositAmount),
      residual: Math.round(residual),
    };
  }, [price, duration, depositPercent, residualPercent]);

  const { ref: loaRef } = useInView({ threshold: 0.2 });
  const { ref: simuRef } = useInView({ threshold: 0.3 });

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 py-16 md:py-20 lg:py-32">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#E52127]/5 rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-200/30 rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-24 space-y-5 md:space-y-6"
        >
          <Badge className="inline-flex px-4 py-1.5 bg-white text-slate-700 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            Financement sur mesure
          </Badge>
          <h2 className="text-4xl sm:text-5xl lg:text-[52px] xl:text-[64px] font-black bg-gradient-to-r from-slate-900/95 via-slate-800 to-slate-900/80 bg-clip-text text-transparent tracking-tight leading-tight">
            Trouvez votre <span className="text-[#E52127]">financement LOA</span> auto
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
            100% LOA, calibrée à votre budget : mensualités optimisées et option d'achat claire.
          </p>
          <p className="text-sm text-slate-400 font-medium max-w-md mx-auto">
            Estimations indicatives, non contractuelles — mise à jour continue.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* LOA Features */}
          <motion.div
            ref={loaRef}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative w-full h-full max-w-2xl mx-auto"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 mb-3">Formule LOA</p>
            <div className="relative rounded-3xl bg-white border border-white/60 shadow-2xl hover:shadow-3xl transition-all duration-700 p-6 sm:p-7 md:p-8 lg:p-10 space-y-6 hover:-translate-y-3 hover:scale-[1.02] h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E52127]/3 via-transparent to-slate-50/50 rounded-3xl" />

              <div className="relative z-10 flex items-start gap-4">
                <motion.div
                  className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#E52127] to-[#c3161c] rounded-2xl p-4 shadow-2xl group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <CarFront className="w-7 h-7 lg:w-8 lg:h-8 text-white drop-shadow-sm" />
                </motion.div>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-1">LOA</h3>
                  <p className="text-[#E52127] font-semibold text-lg lg:text-xl bg-[#E52127]/10 px-3 py-1 rounded-full">
                    Flexibilité & choix
                  </p>
                </div>
              </div>

              <div className="relative z-10 divide-y divide-slate-100/80 rounded-2xl bg-white shadow-inner p-1">
                {SOLUTIONS[0].items.map((item, idx) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-start gap-4 px-5 py-4 hover:bg-white/80 hover:translate-x-2 transition-all duration-300 ${
                      idx === 0 ? "rounded-t-2xl" : idx === 2 ? "rounded-b-2xl" : ""
                    }`}
                  >
                    <motion.div
                      className="flex-shrink-0 w-10 h-10 mt-0.5 bg-white rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                    >
                      <Check className="w-5 h-5 text-[#E52127] drop-shadow-sm" />
                    </motion.div>
                    <span className="text-base lg:text-lg text-slate-800 font-medium leading-relaxed">
                      {emphasize(item, SOLUTIONS[0].accentKeys, "text-[#E52127] font-semibold")}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Simulation */}
          <motion.div
            ref={simuRef}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full h-full max-w-2xl mx-auto lg:-translate-y-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 mb-3">Simulation rapide</p>
            <div className="relative rounded-3xl bg-gradient-to-br from-[#f56b70] via-[#e63a43] to-[#c62029] p-[2px] shadow-2xl hover:shadow-[0_28px_70px_rgba(229,33,39,0.35)] transition-all duration-700 h-full">
              <div className="bg-gradient-to-br from-white/18 via-white/12 to-white/10 rounded-3xl p-7 sm:p-8 lg:p-10 relative overflow-hidden border border-white/30 h-full flex flex-col justify-between">
                <div className="relative z-10 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl lg:text-3xl xl:text-4xl font-black text-white leading-tight drop-shadow-lg">
                      Simulez votre LOA
                    </h3>
                    <p className="text-white/90 text-base lg:text-lg leading-relaxed drop-shadow-md">
                      Ajustez vos paramètres et obtenez une estimation immédiate.
                    </p>
                  </div>

                  <div className="bg-white/18 rounded-3xl p-6 sm:p-7 lg:p-10 border border-white/35 shadow-2xl shadow-black/10 hover:shadow-black/20 transition-all duration-500">
                    <div className="flex flex-wrap items-start justify-between gap-6 mb-6 lg:mb-8">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold uppercase tracking-wider text-white/80">Estimation instantanée</p>
                        <div className="flex items-baseline gap-2">
                          <NumberCounter end={simulation.monthly} />
                          <span className="text-2xl font-semibold text-white/90">€ / mois</span>
                        </div>
                      </div>
                      <div className="w-18 h-18 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/20 rounded-3xl flex items-center justify-center shadow-xl">
                        <Calculator className="w-10 h-10 lg:w-12 lg:h-12 text-white drop-shadow-lg" />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      <motion.span
                        className="px-4 py-2 bg-white/30 rounded-2xl text-xs font-bold uppercase tracking-wider text-white border border-white/50 hover:bg-white/40 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        Option d'achat
                      </motion.span>

                      <motion.span
                        className="px-4 py-2 bg-white/30 rounded-2xl text-xs font-bold uppercase tracking-wider text-white border border-white/50 hover:bg-white/40 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        VR {residualPercent}%
                      </motion.span>

                      <motion.span
                        className="px-4 py-2 bg-white/30 rounded-2xl text-xs font-bold uppercase tracking-wider text-white border border-white/50 hover:bg-white/40 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        Apport {depositPercent}%
                      </motion.span>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setDialogOpen(true)}
                      className="w-full h-16 rounded-3xl bg-white text-[#E52127] text-xl font-black shadow-2xl hover:shadow-3xl border-2 border-white/60 transition-all duration-500 hover:bg-white/95 active:scale-[0.98]"
                    >
                      Lancer la simulation <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dialog */}
      <AnimatePresence>
        {dialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/15 z-[1000]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl border border-slate-200 bg-white shadow-2xl shadow-black/20 max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="px-8 pt-10 pb-8 border-b border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#E52127] to-[#c3161c] rounded-2xl flex items-center justify-center shadow-lg">
                        <Calculator className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <DialogTitle className="text-3xl font-black text-slate-900">Simulation LOA</DialogTitle>
                        <DialogDescription className="text-lg text-slate-600 font-medium">
                          Obtenez votre estimation personnalisée en 30 secondes
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="px-8 pb-12 space-y-8">
                    <div className="grid gap-6 lg:grid-cols-3">
                      {/* Prix */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                          Prix véhicule
                        </label>
                        <Input
                          type="number"
                          value={price}
                          min={0}
                          onChange={(e) => setPrice(Math.max(0, toNumber(e.target.value, 0)))}
                          className="h-14 text-lg border-slate-200 shadow-sm focus:border-[#E52127] focus:ring-2 focus:ring-[#E52127]/20"
                          placeholder="32000"
                        />
                      </div>

                      {/* Durée */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                          Durée (mois)
                        </label>
                        <Input
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(clamp(toNumber(e.target.value, 48), 12, 84))}
                          className="h-14 text-lg border-slate-200 shadow-sm focus:border-[#E52127]"
                          placeholder="48"
                        />
                      </div>

                      {/* Apport (%) */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                          Apport (%)
                        </label>
                        <Input
                          type="number"
                          value={depositPercent}
                          min={0}
                          max={100}
                          onChange={(e) => setDepositPercent(clamp(toNumber(e.target.value, 20), 0, 100))}
                          className="h-14 text-lg border-slate-200 shadow-sm focus:border-[#E52127]"
                          placeholder="20"
                        />
                        {/* ✅ Slider + presets */}
                        <input
                          type="range"
                          min={0}
                          max={50}
                          value={depositPercent}
                          onChange={(e) => setDepositPercent(clamp(Number(e.target.value), 0, 100))}
                          className="w-full"
                        />
                        <div className="flex flex-wrap gap-2 pt-1">
                          {[0, 10, 20, 30].map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setDepositPercent(p)}
                              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                depositPercent === p
                                  ? "border-[#E52127] bg-[#E52127]/10 text-[#E52127]"
                                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {p}%
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                  
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="bg-gradient-to-r from-[#E52127]/5 to-[#E52127]/10 rounded-3xl p-8 lg:p-10 border border-[#E52127]/20 shadow-xl"
                    >
                      <div className="flex items-center justify-between gap-6 mb-6">
                        <div className="space-y-2">
                          <p className="text-sm uppercase tracking-wider font-bold text-slate-600">
                            LOA · apport {depositPercent}% · VR {residualPercent}%
                          </p>
                          <div className="flex items-baseline gap-3">
                            <NumberCounter end={simulation.monthly} duration={1.5} />
                            <span className="text-3xl font-bold text-[#E52127]">€ / mois</span>
                          </div>
                        </div>
                        <div className="w-24 h-24 bg-white/30 rounded-3xl flex items-center justify-center shadow-2xl p-2">
                          <CarFront className="w-14 h-14 text-[#E52127] drop-shadow-lg" />
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        Apport :{" "}
                        <span className="font-bold text-[#E52127]">
                          {simulation.depositAmount.toLocaleString("fr-FR")}€
                        </span>
                        {" · "}
                        VR estimée :{" "}
                        <span className="font-bold text-[#E52127]">
                          {simulation.residual.toLocaleString("fr-FR")}€
                        </span>
                        . Simulation indicative hors frais.
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6 bg-slate-50/80 rounded-2xl border border-slate-200">
                      <div className="text-center py-4">
                        <div className="text-2xl font-black text-slate-900">{price.toLocaleString("fr-FR")} €</div>
                        <div className="text-xs uppercase tracking-wider text-slate-500">Prix véhicule</div>
                      </div>
                      <div className="text-center py-4">
                        <div className="text-2xl font-black text-slate-900">{duration} mois</div>
                        <div className="text-xs uppercase tracking-wider text-slate-500">Durée</div>
                      </div>
                      <div className="text-center py-4">
                        <div className="text-2xl font-black text-slate-900">{depositPercent} %</div>
                        <div className="text-xs uppercase tracking-wider text-slate-500">Apport</div>
                      </div>
                    </div>
                  </div>

                  <div className="px-8 pb-10 pt-6 flex flex-col sm:flex-row gap-4 justify-end bg-gradient-to-t from-slate-50/50">
                    <Button
                      variant="outline"
                      className="h-14 px-8 text-lg border-slate-200 hover:bg-white/50 sm:min-w-[140px]"
                      onClick={() => setDialogOpen(false)}
                    >
                      Fermer
                    </Button>
                    <Button
                      className="h-14 px-10 text-lg bg-gradient-to-r from-[#E52127] to-[#c3161c] hover:from-[#c3161c] hover:to-[#a11217] shadow-xl hover:shadow-2xl sm:min-w-[220px]"
                      onClick={() => {
                        setDialogOpen(false);
                        navigate("/financement");
                      }}
                    >
                      Simulation complète <ArrowRight className="ml-2 w-5 h-5 inline transition-all" />
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FinancingSection;