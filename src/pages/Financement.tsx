// src/pages/FinancementPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CarFront,
  Clock3,
  HandCoins,
  Receipt,
  ShieldCheck,
  Zap,
  Check,
} from "lucide-react";

type Solution = {
  title: string;
  pill: string;
  subtitle: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
  titleClass: string;
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
    titleClass: "text-[#E52127]",
    dotClass: "bg-[#E52127]",
    highlightClass: "text-[#E52127] font-semibold",
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
    titleClass: "text-slate-900",
    dotClass: "bg-slate-900",
    highlightClass: "text-slate-900 font-semibold",
    items: ["Vous êtes propriétaire", "Mensualités fixes", "Durée 12 à 72 mois", "Possibilité pro / société"],
    accentKeys: ["propriétaire", "fixes", "pro", "société"],
  },
];

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

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const Container = ({ children }: { children: React.ReactNode }) => (
  <section className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">{children}</section>
);

const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
}) => (
  <div
    className={cn(
      "space-y-3",
      align === "center" ? "text-center max-w-3xl mx-auto" : "text-left max-w-3xl",
    )}
  >
    <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p>
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-[1.12]">
      {title}
    </h2>
    {description ? (
    <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed">{description}</p>
    ) : null}
  </div>
);

const Pill = ({
  icon: Icon,
  label,
  tone = "neutral",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone?: "neutral" | "accent";
}) => (
  <div
    className={cn(
      "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] ring-1",
      tone === "accent"
        ? "bg-[#E52127]/10 text-[#b01014] ring-[#E52127]/20"
        : "bg-white/70 text-slate-700 ring-slate-200",
    )}
  >
    <Icon className={cn("h-4 w-4", tone === "accent" ? "text-[#E52127]" : "text-slate-500")} />
    {label}
  </div>
);

const Stat = ({
  label,
  value,
  helper,
  tone = "neutral",
}: {
  label: string;
  value: string;
  helper: string;
  tone?: "neutral" | "accent";
}) => (
  <div
    className={cn(
      "rounded-2xl border p-4 shadow-[0_14px_34px_rgba(15,23,42,0.06)]",
      tone === "accent" ? "bg-[#E52127]/10 border-[#E52127]/15" : "bg-slate-50 border-slate-100",
    )}
  >
    <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
    <p className={cn("mt-1 text-2xl font-black", tone === "accent" ? "text-[#b01014]" : "text-slate-900")}>
      {value}
    </p>
    <p className={cn("mt-1 text-xs", tone === "accent" ? "text-[#b01014]/90" : "text-slate-500")}>{helper}</p>
  </div>
);

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    className={cn(
      "rounded-3xl border border-slate-100 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.06)]",
      className,
    )}
  >
    {children}
  </div>
);

const FinancementPage = () => {
  return (
    <div id="top" className="relative text-slate-900">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#f4f7fb] via-white to-[#f8fbff]" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 0%, rgba(229,33,39,0.12), transparent 38%), radial-gradient(circle at 90% 10%, rgba(15,23,42,0.08), transparent 40%), radial-gradient(circle at 30% 100%, rgba(229,33,39,0.10), transparent 42%)",
        }}
      />

      <div className="py-10 sm:py-12 md:py-16">
        <Container>
          {/* HERO */}
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white text-slate-800 border border-slate-200 shadow-sm">
                  Financement sur mesure
                </Badge>
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  LOA • Crédit auto (sans LLD)
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.05]">
                  Trouvez votre <span className="text-[#E52127]">financement</span> auto
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                  Particulier, <span className="font-semibold text-slate-800">VTC</span>, société : une offre claire,
                  un dossier guidé et une réponse rapide pour LOA ou crédit auto.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Pill icon={Clock3} label="Réponse 24–48h" />
                <Pill icon={Zap} label="Sans apport possible" tone="accent" />
                <Pill icon={BriefcaseBusiness} label="Offres VTC / Pro" />
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Button
                  onClick={() => scrollToId("simulation")}
                  className="h-11 rounded-full bg-[#E52127] px-6 text-white hover:bg-[#c3161c]"
                >
                  Lancer la simulation <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="h-11 rounded-full border-slate-300 text-slate-900 hover:bg-slate-100"
                  >
                    Parler à un conseiller
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                * Estimations indicatives. Conditions selon profil, véhicule et partenaire financier.
              </p>
            </div>

            {/* RIGHT PANEL */}
            <div className="lg:col-span-5">
              <Card className="p-4 sm:p-5 bg-white/80 backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="Délai moyen" value="24–48h" helper="Dossier complet" />
                  <Stat label="Sans apport" value="Possible" helper="Selon profil" tone="accent" />
                  <Stat label="Durée LOA" value="12–84" helper="Mois" />
                  <Stat label="Formules" value="LOA • Crédit" helper="Conseil & montage" />
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E52127]/10">
                      <BadgeCheck className="h-5 w-5 text-[#E52127]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">Pro & VTC : montage optimisé</p>
                      <p className="text-sm text-slate-600">
                        Durée, kilométrage, garanties : on adapte à votre usage pro.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                          VTC
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                          Pro / société
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                          Kilométrage
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* SOLUTIONS */}
          <div className="mt-14 sm:mt-16">
            <SectionHeader
              eyebrow="Choisir la bonne formule"
              title={
                <>
                  Deux options, <span className="text-[#E52127]">très claires</span>
                </>
              }
              description={
                <>LOA pour la flexibilité. Crédit auto pour devenir propriétaire. On choisit selon votre budget et usage.</>
              }
            />

            <div className="mt-8 grid gap-5 md:gap-6 md:grid-cols-2">
              {SOLUTIONS.map((solution) => (
                <div
                  key={solution.title}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-6 shadow-[0_16px_44px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#E52127]/[0.07] blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 shadow-inner">
                        <solution.icon className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className={cn("text-xl font-black", solution.titleClass)}>{solution.title}</p>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                            {solution.pill}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{solution.subtitle}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                    <ul className="space-y-2 text-sm text-slate-700">
                      {solution.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className={cn("mt-1 h-2 w-2 rounded-full", solution.dotClass)} />
                          <span>{emphasize(item, solution.accentKeys, solution.highlightClass)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <div className="rounded-xl bg-gradient-to-r from-slate-500/12 to-slate-400/12 text-center text-sm font-semibold text-slate-800 py-2">
                      {solution.accent}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIMULATION CTA */}
          <div className="mt-10 sm:mt-12" id="simulation">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#E52127] to-[#c3161c] p-[1px] shadow-[0_22px_54px_rgba(229,33,39,0.28)]">
              <div className="relative rounded-3xl bg-gradient-to-r from-[#ff2d34] to-[#c3161c] px-6 py-10 sm:px-10 sm:py-12 text-center text-white">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.25]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 20% 10%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 80% 90%, rgba(255,255,255,0.18), transparent 42%)",
                  }}
                />
                <div className="relative mx-auto max-w-2xl space-y-3">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">Simulez votre mensualité</p>
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                    LOA ou crédit auto : estimation rapide. Pour les pros/VTC, on ajuste selon l’usage.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <Button
                      onClick={() => scrollToId("demande-financement")}
                      className="h-11 rounded-full bg-white px-6 text-[#E52127] hover:bg-white/90"
                    >
                      Faire une simulation <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Link to="/contact">
                      <Button
                        variant="outline"
                        className="h-11 rounded-full border-white/40 bg-white/10 text-white hover:bg-white/15"
                      >
                        Être rappelé
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-5 flex flex-wrap justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
                    <span className="rounded-full bg-white/15 px-3 py-1">VTC / Pro</span>
                    <span className="rounded-full bg-white/15 px-3 py-1">Sans apport possible</span>
                    <span className="rounded-full bg-white/15 px-3 py-1">Réponse 24–48h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PROCESS */}
          <div className="mt-12 sm:mt-14 grid gap-4 lg:grid-cols-4 lg:items-stretch">
            {[
              { title: "Simuler & cadrer", desc: "Budget et durée posés en quelques minutes." },
              { title: "Monter le dossier", desc: "Check-list simple, dépôt en ligne, traitement express." },
              { title: "Accord & signature", desc: "Accord de principe, signature électronique." },
              { title: "Mise à disposition", desc: "Retrait ou livraison avec brief de fin de contrat." },
            ].map((step, idx) => (
              <div
                key={step.title}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E52127]/10 text-[#b01014] text-sm font-black">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-bold text-slate-900">{step.title}</p>
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* HOW TO */}
          <div className="mt-12 sm:mt-14" id="demande-financement">
            <Card className="p-6 sm:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-2xl space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Demande de financement auto
                  </p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                    Obtenir votre financement LOA / crédit auto
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Parcours simple : simulation, dossier, accord, signature, mise à disposition.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 border border-slate-200">
                  <span className="rounded-full bg-[#E52127]/10 px-3 py-1 text-[#E52127]">LOA</span>
                  <span className="rounded-full bg-slate-200/60 px-3 py-1 text-slate-800">Crédit auto</span>
                  <span className="rounded-full bg-slate-200/60 px-3 py-1 text-slate-800">Pro / VTC</span>
                  <span className="rounded-full bg-slate-200/60 px-3 py-1 text-slate-800">Réponse rapide</span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
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
                ].map((s) => (
                  <div key={s.title} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <p className="text-sm font-bold text-slate-900">{s.title}</p>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Financement LOA</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Crédit auto</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">VTC / Pro</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Sans apport selon profil</span>
              </div>
            </Card>
          </div>

          {/* WHY + FAQ */}
          <div className="mt-10 sm:mt-12 grid gap-6 lg:grid-cols-2">
            <Card className="p-6 sm:p-8">
              <div className="space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Pourquoi choisir LeaseAuto
                </p>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Pro & transparent</h3>

                <ul className="space-y-3 text-sm sm:text-base text-slate-700">
                  {[
                    "Conseil pro/VTC : formule, kilométrage, garanties adaptés à l’usage.",
                    "Process rapide : dossier digitalisé, retour 24–48h après réception complète.",
                    "Sans apport possible : selon profil, pour préserver votre trésorerie.",
                    "Partenaires finance : on cherche la solution la plus cohérente LOA ou crédit.",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#E52127]/10">
                        <Check className="h-4 w-4 text-[#E52127]" />
                      </span>
                      <span className="leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">FAQ express</p>
                <div className="space-y-4 text-sm sm:text-base text-slate-700">
                  {[
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
                  ].map((item) => (
                    <div key={item.q} className="rounded-2xl border border-slate-100 bg-slate-50/40 p-4">
                      <p className="font-bold text-slate-900">{item.q}</p>
                      <p className="mt-1 text-slate-600 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* CTA */}
          <div className="mt-10 sm:mt-12">
            <Card className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Prêt à démarrer</p>
                  <h4 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    Parlez à un expert financement
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Analyse rapide, montage du dossier et simulation LOA / crédit auto.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/contact">
                    <Button className="h-11 rounded-full bg-[#E52127] px-5 text-white hover:bg-[#c3161c]">
                      Contact rapide
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="h-11 rounded-full border-slate-300 text-slate-900 hover:bg-slate-100"
                    onClick={() => scrollToId("simulation")}
                  >
                    Revoir la simulation
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default FinancementPage;
