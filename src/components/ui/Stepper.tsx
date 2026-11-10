import { Check } from "lucide-react";
import clsx from "clsx";

interface StepperProps {
  steps: string[];
  current: number;
  /** Couleur de l'étape active (défaut : rouge marque) */
  accentColor?: string;
  /** Couleur des étapes terminées (défaut : nuit) */
  completedColor?: string;
}

/**
 * Fil d'étapes horizontal : pastille numérotée + libellé, reliés par un trait.
 * Étape active en rouge marque, étapes faites en nuit avec une coche.
 */
export default function Stepper({ steps, current, accentColor, completedColor }: StepperProps) {
  return (
    <ol className="mb-10 grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const first = i === 0;
        const last = i === steps.length - 1;
        return (
          <li
            key={label}
            aria-current={active ? "step" : undefined}
            className="flex flex-col items-center gap-3 text-center"
          >
            <div className="flex w-full items-center">
              <span
                aria-hidden
                className={clsx(
                  "h-0.5 flex-1 transition-colors duration-500",
                  first ? "opacity-0" : done || active ? "bg-night" : "bg-slate-200",
                )}
              />
              <span
                className={clsx(
                  "num mx-2 grid h-11 w-11 shrink-0 place-items-center rounded-full border font-display text-sm font-semibold transition-colors duration-500",
                  done && "border-night bg-night text-white",
                  active && "border-brand-primary bg-brand-primary text-white",
                  !done && !active && "border-slate-300 bg-white text-slate-500",
                )}
                style={
                  done && completedColor
                    ? { backgroundColor: completedColor, borderColor: completedColor }
                    : active && accentColor
                      ? { backgroundColor: accentColor, borderColor: accentColor }
                      : undefined
                }
              >
                {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
                {done ? <span className="sr-only">Étape terminée :</span> : null}
              </span>
              <span
                aria-hidden
                className={clsx(
                  "h-0.5 flex-1 transition-colors duration-500",
                  last ? "opacity-0" : done ? "bg-night" : "bg-slate-200",
                )}
              />
            </div>
            <span
              className={clsx(
                "px-1 text-xs leading-tight sm:text-sm",
                active ? "font-semibold text-night" : done ? "font-medium text-slate-700" : "text-slate-500",
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
