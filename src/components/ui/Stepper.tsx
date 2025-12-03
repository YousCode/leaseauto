import { Check } from "lucide-react";
import clsx from "clsx";

interface StepperProps {
  steps: string[];
  current: number;
  accentColor?: string;
  completedColor?: string;
}

export default function Stepper({
  steps,
  current,
  accentColor = "#E10600",
  completedColor = "#16a34a",
}: StepperProps) {
  return (
    <ol className="mb-8 flex items-center gap-3 overflow-x-auto">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={label}
            className={clsx(
              "flex min-w-[8rem] flex-1 flex-col items-center text-[0.75rem] md:text-xs",
            )}
          >
            <div
              className={clsx(
                "mb-2 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                done || active ? "text-white border-transparent" : "border-[#d1d5db] text-[#9ca3af]",
              )}
              style={{
                backgroundColor: done
                  ? completedColor
                  : active
                    ? accentColor
                    : "transparent",
              }}
            >
              {done ? <Check size={16} /> : i + 1}
            </div>
            <span
              className={clsx(
                "text-center leading-tight",
                done ? "text-[#9ba3af]" : active ? "text-[#101828] font-semibold" : "text-[#9ca3af]",
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
