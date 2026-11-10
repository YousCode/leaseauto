// src/pages/Financement.tsx
import React, { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  CarFront,
  Check,
  Clock3,
  HandCoins,
  Search,
  Zap,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimatedNumber, RangeField } from "@/components/sections/FinancingSection";
import { useVehicles } from "@/hooks/useVehicles";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getLenis } from "@/lib/lenis";
import { clampNumber, simulateLinearLoa } from "@/lib/finance";
import { stagger } from "@/lib/motion";

type Solution = {
  title: string;
  pill: string;
  subtitle: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
  titleClass: string;
  iconClass: string;
  dotClass: string;
  highlightClass: string;
  items: string[];
  accentKeys: string[];
};

const SOLUTIONS: Solution[] = [
  {
    title: "LOA",
    pill: "Leasing",
    subtitle: "Idéal pour rouler maintenant, décider ensuite",
    accent: "Flexibilité + option d’achat",
    icon: CarFront,
    titleClass: "text-brand-primary",
    iconClass: "bg-brand-primary-soft text-brand-primary",
    dotClass: "bg-brand-primary",
    highlightClass: "text-brand-primary font-semibold",
    items: [
      "Louez avec option d'achat",
      "Sans apport possible selon profil",
      "Achat ou restitution en fin de contrat",
      "Durées flexibles jusqu’à 84 mois",
    ],
    accentKeys: ["achat", "louez", "apport", "restitution", "84"],
  },
  {
    title: "Crédit Auto",
    pill: "Achat",
    subtitle: "Mensualités fixes, budget maîtrisé",
    accent: "Vous devenez propriétaire",
    icon: HandCoins,
    titleClass: "text-night",
    iconClass: "bg-slate-100 text-night",
    dotClass: "bg-night",
    highlightClass: "text-night font-semibold",
    items: ["Vous êtes propriétaire", "Mensualités fixes", "Durée 12 à 72 mois", "Possibilité pro / société"],
    accentKeys: ["propriétaire", "fixes", "pro", "société"],
  },
];

const HERO_CHIPS = [
  { icon: Clock3, label: "Réponse 24–48h" },
  { icon: Zap, label: "Sans apport possible" },
  { icon: BriefcaseBusiness, label: "Offres VTC / Pro" },
];

const HERO_STATS = [
  { label: "Délai moyen", value: "24–48h", helper: "Dossier complet", accent: false },
  { label: "Sans apport", value: "Possible", helper: "Selon profil", accent: true },
  { label: "Durée LOA", value: "12–84", helper: "Mois", accent: false },
  { label: "Formules", value: "LOA • Crédit", helper: "Conseil & montage", accent: false },
];

const PROCESS_STEPS = [
  { title: "Simuler", desc: "Budget et durée posés en quelques minutes." },
  { title: "Monter le dossier", desc: "Check-list courte, dépôt en ligne, traitement express." },
  { title: "Accord & signature", desc: "Accord de principe, signature électronique." },
  { title: "Mise à disposition", desc: "Retrait ou livraison, rappel des conditions de fin." },
];

const HOW_TO_STEPS = [
  {
    title: "1. Choisir & simuler",
    desc: "Sélectionnez votre véhicule et simulez (LOA 12–84 mois ou crédit 12–72 mois).",
  },
  {
    title: "2. Dossier complet",
    desc: "CNI/passeport, domicile < 3 mois, 3 bulletins, avis d'imposition, RIB. Pros : Kbis + bilans.",
  },
  {
    title: "3. Accord & signature",
    desc: "Analyse, accord de principe, signature électronique, puis livraison ou retrait.",
  },
];

const WHY_ITEMS = [
  "Conseil pro/VTC : formule, kilométrage et garanties adaptés à l’usage.",
  "Process rapide : dossier digitalisé, retour sous 24–48h après réception.",
  "Sans apport possible selon profil pour préserver la trésorerie.",
  "Partenaires finance : on propose la solution LOA ou crédit la plus cohérente.",
];

const FAQ_ITEMS = [
  {
    q: "Quel délai pour un accord ?",
    a: "Après dossier complet, l’accord peut tomber sous 24–48h ouvrées selon le partenaire.",
  },
  {
    q: "Faut-il un apport ?",
    a: "LOA sans apport possible selon profil et véhicule.",
  },
  {
    q: "Fin de LOA : comment ça se passe ?",
    a: "Vous rachetez (option d’achat) ou restituez selon le contrat.",
  },
  {
    q: "VTC / Pro : c’est adapté ?",
    a: "Oui. Durée, kilométrage, garanties ajustés à l’usage pro/VTC.",
  },
];

const DEPOSIT_PRESETS = [0, 10, 20, 30];

/** Bornes des curseurs ; la saisie au clavier garde les bornes du simulateur (prix ≥ 0, 12–84 mois, 0–100 %). */
const PRICE_RANGE = { min: 5000, max: 120000, step: 500 };
const DURATION_RANGE = { min: 12, max: 84, step: 12 };
const DEPOSIT_RANGE = { min: 0, max: 50, step: 1 };
const DEFAULT_LOA_DURATION_MONTHS = 60;

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const emphasize = (text: string, keys: string[], highlightClass: string) => {
  const lower = text.toLowerCase();
  const key = keys.find((k) => lower.includes(k.toLowerCase()));
  if (!key) return text;

  const re = new RegExp(`(${escapeRegExp(key)})`, "ig");
  const parts = text.split(re);

  return (
    <>
      {parts.map((part, idx) =>
        part.toLowerCase() === key.toLowerCase() ? (
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

/** Hauteur réservée au header flottant quand on défile vers une ancre. */
const ANCHOR_OFFSET = 96;

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  // Cible calculée sur la position réelle : reste juste même si Lenis n'a pas encore vu un défilement natif.
  const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - ANCHOR_OFFSET);
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(top);
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const toNumber = (v: string, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const finiteOr = (n: unknown, fallback: number) => (typeof n === "number" && Number.isFinite(n) ? n : fallback);
const formatEuro = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} €`;

/**
 * Saisie numérique sur fond nuit. La valeur est appliquée en direct tant qu'elle reste dans les bornes,
 * puis ramenée dans les bornes à la sortie du champ (on peut donc taper « 48 » sans que « 4 » soit corrigé).
 */
const NumberBox = ({
  value,
  min,
  max,
  unit,
  label,
  onCommit,
}: {
  value: number;
  min: number;
  max: number;
  unit: string;
  label: string;
  onCommit: (value: number) => void;
}) => {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft((current) => (Number(current) === value && current !== "" ? current : String(value)));
  }, [value]);

  const commit = () => {
    const next = clampNumber(toNumber(draft === "" ? String(value) : draft, value), min, max);
    onCommit(next);
    setDraft(String(next));
  };

  return (
    <span className="flex items-center gap-2">
      <input
        type="number"
        inputMode="numeric"
        aria-label={label}
        value={draft}
        min={min}
        max={Number.isFinite(max) ? max : undefined}
        onChange={(e) => {
          const raw = e.target.value;
          setDraft(raw);
          const n = Number(raw);
          if (raw !== "" && Number.isFinite(n) && n >= min && n <= max) onCommit(n);
        }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
        }}
        className="num h-11 w-28 rounded-full border border-white/15 bg-white/5 px-4 text-right font-display text-lg font-semibold text-white transition-colors [appearance:textfield] focus:border-white focus:outline-none focus-visible:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <span aria-hidden className="w-9 text-sm font-medium text-white/65">
        {unit}
      </span>
    </span>
  );
};

const FinancementPage = () => {
  const [price, setPrice] = useLocalStorage<number>("leaseauto:simu:price", 32000);
  const [duration, setDuration] = useLocalStorage<number>("leaseauto:simu:duration", DEFAULT_LOA_DURATION_MONTHS);
  const [depositPercent, setDepositPercent] = useLocalStorage<number>("leaseauto:simu:depositPercent", 20);
  const [residualPercent] = useLocalStorage<number>("leaseauto:simu:residualPercent", 30);
  const navigate = useNavigate();
  const { data: vehicles = [] } = useVehicles("published");
  const [query, setQuery] = useState("");

  const safePrice = Math.max(0, finiteOr(price, 32000));
  const safeDuration = clampNumber(finiteOr(duration, DEFAULT_LOA_DURATION_MONTHS), 12, 84);
  const safeDeposit = clampNumber(finiteOr(depositPercent, 20), 0, 100);
  const safeResidual = finiteOr(residualPercent, 30);

  const simulation = useMemo(
    () =>
      simulateLinearLoa({
        price: safePrice,
        durationMonths: safeDuration,
        depositPercent: safeDeposit,
        residualPercent: safeResidual,
      }),
    [safeDeposit, safeDuration, safePrice, safeResidual],
  );

  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const suggestions = useMemo(() => {
    if (!normalizedQuery) return [];
    return vehicles
      .filter((v: any) => {
        const brand = (v.brand || "").toLowerCase();
        const model = (v.model || v.title || "").toLowerCase();
        return brand.includes(normalizedQuery) || model.includes(normalizedQuery);
      })
      .slice(0, 5);
  }, [vehicles, normalizedQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;
    navigate(`/vehicules?q=${encodeURIComponent(term)}`);
  };

  const handleSelectSuggestion = (slug?: string | null) => {
    if (!slug) return;
    navigate(`/vehicules/${slug}`);
  };

  return (
    <div id="top" className="bg-white text-night">
      <main>
        <PageHero
          eyebrow="Financement sur mesure"
          title="Trouvez votre financement auto"
          subtitle={
            <>
              Particulier, <span className="font-semibold text-white">VTC</span> ou société : LOA ou crédit auto, on
              prépare et on obtient l’accord vite.
            </>
          }
          aside={
            <div>
              <dl className="grid grid-cols-2 gap-3">
                {HERO_STATS.map((stat) => (
                  <div key={stat.label} className="rounded-[20px] border border-white/10 bg-white/5 p-5">
                    <dt className="text-xs font-medium text-white/60">{stat.label}</dt>
                    <dd className="mt-3">
                      <span
                        className={cn(
                          "num block font-display text-2xl font-bold leading-none tracking-tight sm:text-[1.7rem]",
                          stat.accent ? "text-brand-primary-bright" : "text-white",
                        )}
                      >
                        {stat.value}
                      </span>
                      <span className="mt-2 block text-xs text-white/60">{stat.helper}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-white/55">
                * Estimations indicatives. Conditions selon profil, véhicule et partenaire financier.
              </p>
            </div>
          }
        >
          <ul className="flex w-full flex-wrap gap-2">
            {HERO_CHIPS.map(({ icon: Icon, label }) => (
              <li key={label} className="chip-dark">
                <Icon aria-hidden className="h-3.5 w-3.5 text-brand-primary-bright" />
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-3 flex w-full flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => scrollToId("simulation")} className="btn btn-primary btn-lg">
              Lancer la simulation
              <ArrowRight />
            </button>
            <Link to="/contact" className="btn btn-ghost-dark btn-lg">
              Parler à un conseiller
            </Link>
          </div>
        </PageHero>

        {/* RECHERCHE + MONTAGE VTC / PRO */}
        <section className="relative z-20 bg-white pt-12 md:pt-16">
          <div className="container-x grid gap-4 lg:grid-cols-12 lg:gap-5">
            <Reveal className="lg:col-span-7">
              <div className="surface h-full p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold text-night">
                  <label htmlFor="financement-search">Rechercher un véhicule</label>
                </h2>
                <div className="relative mt-5">
                  <form onSubmit={handleSearchSubmit} role="search" className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <Search
                        aria-hidden
                        className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        id="financement-search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        type="text"
                        autoComplete="off"
                        placeholder="Rechercher un véhicule (ex : Audi RS3, GLC, Model 3)"
                        className="field h-14 rounded-full pl-14 pr-5 text-base"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg">
                      Rechercher
                    </button>
                  </form>
                  {normalizedQuery ? (
                    <div
                      data-lenis-prevent
                      className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 divide-y divide-slate-100 overflow-y-auto rounded-[20px] border border-slate-200 bg-white"
                    >
                      {suggestions.length === 0 ? (
                        <p className="px-5 py-4 text-sm text-slate-600">Aucun véhicule trouvé pour “{query}”.</p>
                      ) : (
                        suggestions.map((v: any) => (
                          <button
                            key={v.slug || v.id}
                            type="button"
                            onClick={() => handleSelectSuggestion(v.slug || v.id)}
                            className="flex min-h-[52px] w-full items-center justify-between gap-3 px-5 py-3 text-left transition-colors hover:bg-paper"
                          >
                            <span className="text-sm font-semibold text-night">
                              {v.brand || "Marque"} {v.model || v.title || ""}
                            </span>
                            <span className="num shrink-0 text-xs text-slate-500">
                              {v.city ? `${v.city} • ` : ""}
                              {typeof v.price === "number" ? `${v.price.toLocaleString("fr-FR")} €` : "Voir le détail"}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-5">
              <div className="flex h-full items-start gap-4 rounded-[28px] bg-paper p-6 sm:p-8">
                <span
                  aria-hidden
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-primary-soft text-brand-primary"
                >
                  <BadgeCheck className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold text-night">Montage optimisé VTC / Pro</h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Durée, kilométrage, garanties adaptés à l’usage.
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {["VTC", "Pro / société", "Kilométrage"].map((tag) => (
                      <li key={tag} className="chip">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FORMULES */}
        <section className="section bg-white">
          <div className="container-x">
            <SectionHeading
              eyebrow="Choisir la bonne formule"
              title="Deux options, très claires"
              subtitle="LOA = flexibilité. Crédit auto = propriété. On choisit selon budget et usage."
              action={<span className="chip">LOA • Crédit auto (sans LLD)</span>}
            />

            <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
              {SOLUTIONS.map((solution, idx) => (
                <Reveal key={solution.title} delay={stagger(idx)}>
                  <article className="flex h-full flex-col rounded-[28px] bg-paper p-6 sm:p-9">
                    <div className="flex items-start justify-between gap-4">
                      <span
                        aria-hidden
                        className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-2xl", solution.iconClass)}
                      >
                        <solution.icon className="h-6 w-6" />
                      </span>
                      <span className="chip">{solution.pill}</span>
                    </div>

                    <h3 className={cn("mt-8 font-display text-3xl font-bold tracking-tight", solution.titleClass)}>
                      {solution.title}
                    </h3>
                    <p className="mt-2 text-base text-slate-600">{solution.subtitle}</p>

                    <ul className="mb-8 mt-6 divide-y divide-slate-300/60 border-y border-slate-300/60 text-base text-slate-700">
                      {solution.items.map((item) => (
                        <li key={item} className="flex items-center gap-3 py-3.5">
                          <span aria-hidden className={cn("h-2 w-2 shrink-0 rounded-full", solution.dotClass)} />
                          <span>{emphasize(item, solution.accentKeys, solution.highlightClass)}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-auto rounded-2xl bg-white px-5 py-3.5 text-center text-sm font-semibold text-night">
                      {solution.accent}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* SIMULATION */}
        <section id="simulation" className="bg-white pb-20 md:pb-28">
          <div className="container-x">
            <Reveal>
              <div className="surface-night grain relative overflow-hidden p-6 sm:p-10 lg:p-14">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-ink/70 blur-[120px]"
                />

                <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
                  <div className="lg:col-span-7">
                    <p className="eyebrow eyebrow-dark">Simulation LOA</p>
                    <h2 className="display-md mt-4 text-white">Simulation rapide</h2>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-white/65">
                      2 minutes pour voir la mensualité en LOA ou crédit auto. On ajuste si vous êtes VTC / pro.
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {["VTC / Pro", "Sans apport", "24–48h"].map((tag) => (
                        <li key={tag} className="chip-dark">
                          {tag}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 grid gap-5 border-t border-white/10 pt-8">
                      <RangeField
                        id="simu-price"
                        label="Prix véhicule"
                        value={safePrice}
                        {...PRICE_RANGE}
                        display={formatEuro(safePrice)}
                        minLabel={formatEuro(PRICE_RANGE.min)}
                        maxLabel={formatEuro(PRICE_RANGE.max)}
                        onChange={(v) => setPrice(Math.max(0, v))}
                        valueSlot={
                          <NumberBox
                            label="Prix véhicule, saisie en euros"
                            unit="€"
                            value={safePrice}
                            min={0}
                            max={Number.POSITIVE_INFINITY}
                            onCommit={(v) => setPrice(Math.max(0, v))}
                          />
                        }
                      />
                      <RangeField
                        id="simu-duration"
                        label="Durée (mois)"
                        value={safeDuration}
                        {...DURATION_RANGE}
                        display={`${safeDuration} mois`}
                        minLabel={`${DURATION_RANGE.min} mois`}
                        maxLabel={`${DURATION_RANGE.max} mois`}
                        onChange={(v) => setDuration(clampNumber(v, 12, 84))}
                        valueSlot={
                          <NumberBox
                            label="Durée, saisie en mois"
                            unit="mois"
                            value={safeDuration}
                            min={12}
                            max={84}
                            onCommit={(v) => setDuration(clampNumber(v, 12, 84))}
                          />
                        }
                      />
                      <div>
                        <RangeField
                          id="simu-deposit"
                          label="Apport (%)"
                          value={safeDeposit}
                          {...DEPOSIT_RANGE}
                          display={`${safeDeposit} %`}
                          minLabel={`${DEPOSIT_RANGE.min} %`}
                          maxLabel={`${DEPOSIT_RANGE.max} %`}
                          onChange={(v) => setDepositPercent(clampNumber(v, 0, 100))}
                          valueSlot={
                            <NumberBox
                              label="Apport, saisie en pourcentage"
                              unit="%"
                              value={safeDeposit}
                              min={0}
                              max={100}
                              onCommit={(v) => setDepositPercent(clampNumber(v, 0, 100))}
                            />
                          }
                        />
                        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Apport, valeurs rapides">
                          {DEPOSIT_PRESETS.map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setDepositPercent(p)}
                              aria-pressed={safeDeposit === p}
                              className={cn(
                                "num h-11 min-w-[3.5rem] rounded-full border px-4 text-sm font-semibold transition-colors duration-300",
                                safeDeposit === p
                                  ? "border-white bg-white text-night"
                                  : "border-white/20 text-white/80 hover:border-white hover:text-white",
                              )}
                            >
                              {p}%
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="flex h-full flex-col rounded-[20px] border border-white/10 bg-white/5 p-6 sm:p-8">
                      <p className="num text-sm font-medium text-white/65">
                        LOA · apport {safeDeposit}% · VR {safeResidual}%
                      </p>
                      <p className="mt-4 flex flex-wrap items-baseline gap-x-3" aria-live="polite" aria-atomic="true">
                        <span className="sr-only">{formatEuro(simulation.monthly)} par mois</span>
                        <span aria-hidden className="display-lg num text-white">
                          <AnimatedNumber value={simulation.monthly} />
                          {" €"}
                        </span>
                        <span aria-hidden className="font-display text-lg font-semibold text-white/65">
                          / mois
                        </span>
                      </p>

                      <dl className="num mt-8 divide-y divide-white/10 border-y border-white/10 text-sm">
                        {[
                          { label: "Apport", value: formatEuro(simulation.depositAmount) },
                          { label: "VR estimée", value: formatEuro(simulation.residual) },
                          { label: "Prix véhicule", value: formatEuro(safePrice) },
                          { label: "Durée", value: `${safeDuration} mois` },
                        ].map((row) => (
                          <div key={row.label} className="flex items-baseline justify-between gap-4 py-3.5">
                            <dt className="text-white/65">{row.label}</dt>
                            <dd className="font-display text-base font-semibold text-white">{row.value}</dd>
                          </div>
                        ))}
                      </dl>
                      <p className="mt-4 text-xs leading-relaxed text-white/55">Simulation indicative hors frais.</p>

                      <div className="mt-auto flex flex-col gap-3 pt-8">
                        <button
                          type="button"
                          onClick={() => scrollToId("demande-financement")}
                          className="btn btn-primary btn-lg w-full"
                        >
                          Déposer mon dossier
                          <ArrowRight />
                        </button>
                        <Link to="/contact" className="btn btn-ghost-dark btn-lg w-full">
                          Être rappelé
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ÉTAPES + DEMANDE DE FINANCEMENT */}
        <section id="demande-financement" className="section bg-paper">
          <div className="container-x">
            <SectionHeading
              eyebrow="Demande de financement auto"
              title="Obtenir votre financement LOA / crédit auto"
              subtitle="Parcours simple : simulation, dossier, accord, signature, livraison."
              action={
                <Link to="/dossier" className="btn btn-dark">
                  Déposer un dossier
                  <ArrowUpRight />
                </Link>
              }
            />

            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {PROCESS_STEPS.map((step, idx) => (
                <Reveal as="li" key={step.title} delay={stagger(idx)}>
                  <div className="surface h-full p-6 sm:p-7">
                    <span aria-hidden className="num font-display text-5xl font-bold leading-none text-brand-primary">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold text-night sm:mt-8">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </ol>

            <Reveal className="mt-4 lg:mt-5">
              <div className="surface p-6 sm:p-10">
                <ul className="flex flex-wrap gap-2">
                  {["LOA", "Crédit auto", "Pro / VTC", "Réponse rapide"].map((tag, idx) => (
                    <li
                      key={tag}
                      className={cn("chip", idx === 0 && "border-transparent bg-brand-primary-soft text-brand-primary")}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-slate-200">
                  {HOW_TO_STEPS.map((s) => (
                    <div key={s.title} className="md:px-8 md:first:pl-0 md:last:pr-0">
                      <h3 className="font-display text-xl font-semibold text-night">{s.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                    </div>
                  ))}
                </div>

                <ul className="mt-8 flex flex-wrap gap-2 border-t border-slate-200 pt-6">
                  {["Financement LOA", "Crédit auto", "VTC / Pro", "Sans apport selon profil"].map((tag) => (
                    <li key={tag} className="chip bg-paper">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* POURQUOI + FAQ */}
        <section className="section bg-white">
          <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-5">
              <p className="eyebrow">Pourquoi choisir LeaseAuto</p>
              <h2 className="display-md mt-4 text-night">Pro & transparent</h2>
              <ul className="mt-8 space-y-5 text-base text-slate-700">
                {WHY_ITEMS.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-primary text-white"
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-7">
              <p className="eyebrow">Questions fréquentes</p>
              <h2 className="display-md mt-4 text-night">FAQ express</h2>
              <div className="mt-8 grid gap-3">
                {FAQ_ITEMS.map((item) => (
                  <div key={item.q} className="rounded-[20px] bg-paper p-5 sm:p-6">
                    <h3 className="font-display text-lg font-semibold text-night">{item.q}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 sm:text-base">{item.a}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-paper py-16 md:py-20">
          <div className="container-x">
            <Reveal>
              <div className="surface flex flex-col gap-8 p-6 sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:p-14">
                <div className="max-w-2xl">
                  <p className="eyebrow">Prêt à démarrer</p>
                  <h2 className="display-md mt-4 text-night">Parlez à un expert financement</h2>
                  <p className="lead mt-4">Analyse rapide, montage du dossier et simulation LOA / crédit auto.</p>
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                  <Link to="/contact" className="btn btn-primary btn-lg">
                    Contact rapide
                    <ArrowUpRight />
                  </Link>
                  <button type="button" onClick={() => scrollToId("simulation")} className="btn btn-ghost btn-lg">
                    Revoir la simulation
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* flow-root : la marge haute du pied de page reste sur fond papier */}
      <div className="flow-root bg-paper">
        <FooterSection />
      </div>
    </div>
  );
};

export default FinancementPage;
