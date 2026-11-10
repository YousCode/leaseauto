import { useEffect, useMemo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, CarFront, Check, Clock3, Zap } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { clampNumber, simulateLinearLoa } from "@/lib/finance";
import { EASE } from "@/lib/motion";

const SOLUTIONS = [
  {
    title: "LOA",
    accent: "Flexibilité & choix",
    icon: CarFront,
    items: ["Louez avec option d'achat", "Mensualités réduites", "Achat ou retour en fin de contrat"],
  },
];

const REASSURANCE = [
  { icon: Clock3, label: "Réponse 24–48h", helper: "Après dossier complet" },
  { icon: Zap, label: "Sans apport possible", helper: "Selon profil et véhicule" },
  { icon: BriefcaseBusiness, label: "Offres VTC / Pro", helper: "Durée, kilométrage, garanties adaptés à l’usage" },
];

const DEFAULT_LOA_DURATION_MONTHS = 60;

/** Bornes des curseurs (la durée et l'apport reprennent les bornes du simulateur). */
const PRICE_RANGE = { min: 5000, max: 120000, step: 500 };
const DURATION_RANGE = { min: 12, max: 84, step: 12 };
const DEPOSIT_RANGE = { min: 0, max: 50, step: 1 };

const formatEuro = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} €`;
const finiteOr = (n: unknown, fallback: number) => (typeof n === "number" && Number.isFinite(n) ? n : fallback);

/** Nombre qui glisse vers sa nouvelle valeur (décoratif : la valeur lue est fournie à côté). */
export const AnimatedNumber = ({ value, className }: { value: number; className?: string }) => {
  const reduce = useReducedMotion();
  const current = useMotionValue(value);
  const text = useTransform(current, (latest) => Math.round(latest).toLocaleString("fr-FR"));

  useEffect(() => {
    if (reduce) {
      current.set(value);
      return;
    }
    const controls = animate(current, value, { duration: 0.45, ease: EASE });
    return () => controls.stop();
  }, [value, reduce, current]);

  return (
    <motion.span aria-hidden className={className}>
      {text}
    </motion.span>
  );
};

/**
 * Zone tactile de 44 px (bordure transparente), piste de 6 px, anneau de focus sur le pouce,
 * pouce et piste Firefox passés en rouge clair pour le fond nuit.
 */
const RANGE_NIGHT_CLASS = [
  "finance-range box-content block w-full border-y-[19px] border-transparent",
  "[&::-webkit-slider-thumb]:border-brand-primary-bright [&::-moz-range-thumb]:border-brand-primary-bright",
  "[&::-moz-range-track]:bg-white/15 [&::-moz-range-progress]:bg-brand-primary-bright",
  "[&:focus-visible::-webkit-slider-thumb]:outline [&:focus-visible::-webkit-slider-thumb]:outline-2",
  "[&:focus-visible::-webkit-slider-thumb]:outline-offset-2 [&:focus-visible::-webkit-slider-thumb]:outline-white",
  "[&:focus-visible::-moz-range-thumb]:outline [&:focus-visible::-moz-range-thumb]:outline-2",
  "[&:focus-visible::-moz-range-thumb]:outline-offset-2 [&:focus-visible::-moz-range-thumb]:outline-white",
].join(" ");

type RangeFieldProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  /** Valeur lisible (« 32 000 € », « 60 mois »…) */
  display: string;
  minLabel: string;
  maxLabel: string;
  onChange: (value: number) => void;
  /** Remplace l'affichage de la valeur (ex. champ de saisie) */
  valueSlot?: ReactNode;
};

/** Curseur de simulation pour fond nuit : libellé, valeur, piste remplie jusqu'à la valeur. */
export const RangeField = ({
  id,
  label,
  value,
  min,
  max,
  step,
  display,
  minLabel,
  maxLabel,
  onChange,
  valueSlot,
}: RangeFieldProps) => {
  const fill = max > min ? ((clampNumber(value, min, max) - min) / (max - min)) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-white/65">
          {label}
        </label>
        {valueSlot ?? (
          <output htmlFor={id} className="num font-display text-lg font-semibold text-white">
            {display}
          </output>
        )}
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={clampNumber(value, min, max)}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={display}
        className={RANGE_NIGHT_CLASS}
        style={{
          background: `linear-gradient(to right, var(--brand-primary-bright) ${fill}%, rgb(255 255 255 / 0.16) ${fill}%) content-box`,
        }}
      />
      <div aria-hidden className="num -mt-1.5 flex justify-between text-xs text-white/55">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};

const FinancingSection = () => {
  const [price, setPrice] = useLocalStorage<number>("leaseauto:simu:price", 32000);
  const [duration, setDuration] = useLocalStorage<number>("leaseauto:simu:duration", DEFAULT_LOA_DURATION_MONTHS);
  const [depositPercent, setDepositPercent] = useLocalStorage<number>("leaseauto:simu:depositPercent", 20);
  const [residualPercent] = useLocalStorage<number>("leaseauto:simu:residualPercent", 30);

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
    [safePrice, safeDuration, safeDeposit, safeResidual],
  );

  const loa = SOLUTIONS[0];
  const LoaIcon = loa.icon;

  return (
    <section className="section bg-paper">
      <div className="container-x">
        <SectionHeading
          eyebrow="Financement sur mesure"
          title="Trouvez votre financement LOA auto"
          subtitle="100% LOA, calibrée à votre budget : mensualités optimisées et option d'achat claire."
        />

        <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
          {/* Simulateur en direct */}
          <Reveal className="lg:col-span-7">
            <div className="surface-night grain relative flex h-full flex-col overflow-hidden p-6 sm:p-8 lg:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full bg-brand-ink/70 blur-[110px]"
              />

              <div className="relative z-10 flex flex-1 flex-col">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="eyebrow eyebrow-dark font-sans">Simulation rapide</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="chip-dark">Option d'achat</span>
                    <span className="chip-dark num">VR {safeResidual}%</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
                  <div>
                    <p className="text-sm font-medium text-white/65">Mensualité estimée</p>
                    <p className="mt-2 flex flex-wrap items-baseline gap-x-3" aria-live="polite" aria-atomic="true">
                      <span className="sr-only">{formatEuro(simulation.monthly)} par mois</span>
                      <span aria-hidden className="display-xl num whitespace-nowrap text-white">
                        <AnimatedNumber value={simulation.monthly} />
                        {" €"}
                      </span>
                      <span aria-hidden className="font-display text-xl font-semibold text-white/65">
                        / mois
                      </span>
                    </p>
                  </div>

                  <dl className="flex gap-8 xl:border-l xl:border-white/10 xl:pl-5">
                    <div>
                      <dt className="text-xs text-white/55">Apport</dt>
                      <dd className="num mt-1 font-display text-xl font-semibold text-white">
                        {formatEuro(simulation.depositAmount)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-white/55">Valeur résiduelle</dt>
                      <dd className="num mt-1 font-display text-xl font-semibold text-white">
                        {formatEuro(simulation.residual)}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-8 grid gap-4 border-t border-white/10 pt-7">
                  <RangeField
                    id="home-simu-price"
                    label="Prix du véhicule"
                    value={safePrice}
                    {...PRICE_RANGE}
                    display={formatEuro(safePrice)}
                    minLabel={formatEuro(PRICE_RANGE.min)}
                    maxLabel={formatEuro(PRICE_RANGE.max)}
                    onChange={(v) => setPrice(Math.max(0, v))}
                  />
                  <RangeField
                    id="home-simu-duration"
                    label="Durée"
                    value={safeDuration}
                    {...DURATION_RANGE}
                    display={`${safeDuration} mois`}
                    minLabel={`${DURATION_RANGE.min} mois`}
                    maxLabel={`${DURATION_RANGE.max} mois`}
                    onChange={(v) => setDuration(clampNumber(v, 12, 84))}
                  />
                  <RangeField
                    id="home-simu-deposit"
                    label="Apport"
                    value={safeDeposit}
                    {...DEPOSIT_RANGE}
                    display={`${safeDeposit} %`}
                    minLabel={`${DEPOSIT_RANGE.min} %`}
                    maxLabel={`${DEPOSIT_RANGE.max} %`}
                    onChange={(v) => setDepositPercent(clampNumber(v, 0, 100))}
                  />
                </div>

                <div className="mt-auto flex flex-col gap-5 pt-8 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link to="/financement" className="btn btn-primary">
                      Simulation complète
                      <ArrowRight />
                    </Link>
                    <Link to="/contact" className="btn btn-ghost-dark">
                      Parler à un conseiller
                    </Link>
                  </div>
                  <p className="text-xs leading-relaxed text-white/55 xl:max-w-[13rem] xl:text-right">
                    Estimations indicatives, non contractuelles.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 lg:col-span-5 lg:grid-rows-[auto_1fr] lg:gap-5">
            {/* Formule LOA */}
            <Reveal delay={0.08}>
              <article className="surface flex h-full flex-col p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">Formule LOA</p>
                    <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-night">{loa.title}</h3>
                  </div>
                  <span
                    aria-hidden
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-primary-soft text-brand-primary"
                  >
                    <LoaIcon className="h-6 w-6" />
                  </span>
                </div>
                <p className="mb-6 mt-1 text-sm font-medium text-slate-600">{loa.accent}</p>

                <ul className="divide-y divide-slate-200/80 border-t border-slate-200/80">
                  {loa.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 py-3.5 text-base font-medium text-night last:pb-0">
                      <span
                        aria-hidden
                        className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-primary text-white"
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>

            {/* Réassurance */}
            <Reveal delay={0.16}>
              <ul className="flex h-full flex-col divide-y divide-white/10 rounded-[28px] bg-brand-ink px-6 py-3 text-white sm:px-8">
                {REASSURANCE.map(({ icon: Icon, label, helper }) => (
                  <li key={label} className="flex flex-1 items-center gap-4 py-4">
                    <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-display text-lg font-semibold leading-tight">{label}</span>
                      <span className="mt-0.5 block text-sm text-white/65">{helper}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancingSection;
