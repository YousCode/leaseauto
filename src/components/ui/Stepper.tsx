import { Check } from "lucide-react";
import clsx from "clsx";

interface StepperProps {
  steps: string[];
  current: number;
}
export default function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="flex items-center mb-8 overflow-x-auto">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={label}
            className={clsx(
              "flex-1 min-w-[7rem] flex flex-col items-center text-xs",
            )}
          >
            <div
              className={clsx(
                "w-8 h-8 rounded-full flex justify-center items-center mb-1",
                done && "bg-green-600 text-white",
                active && "bg-red-600 text-white",
                !done && !active && "border border-gray-300 text-gray-400",
              )}
            >
              {done ? <Check size={16} /> : i + 1}
            </div>
            <span
              className={clsx(
                done
                  ? "text-gray-500"
                  : active
                    ? "text-gray-900 font-medium"
                    : "text-gray-400",
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
