"use client";

import { cn } from "@/lib/utils";

const labels = [
  "Pas du tout",
  "Plutot non",
  "Neutre",
  "Plutot oui",
  "Totalement",
];

const toneClasses = [
  "hover:border-red-200 hover:bg-red-50",
  "hover:border-orange-200 hover:bg-orange-50",
  "hover:border-slate-200 hover:bg-slate-50",
  "hover:border-teal-light/40 hover:bg-teal-light/10",
  "hover:border-teal/40 hover:bg-teal/10",
];

export function LikertScale({
  value,
  onChange,
  questionId,
}: {
  value?: number;
  onChange: (value: number) => void;
  questionId: number;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={`Reponse question ${questionId}`}
      className="grid gap-3 sm:grid-cols-5"
    >
      {labels.map((label, index) => {
        const option = index + 1;
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={value === option}
            onClick={() => onChange(option)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") onChange(Math.min(5, (value ?? 1) + 1));
              if (event.key === "ArrowLeft") onChange(Math.max(1, (value ?? 1) - 1));
            }}
            className={cn(
              "min-h-20 rounded-md border px-3 py-3 text-left outline-none transition focus:ring-4 focus:ring-accent/30 sm:text-center",
              value === option
                ? "border-primary bg-primary text-white shadow-sm"
                : "border-primary/12 bg-white text-secondary shadow-sm " + toneClasses[index],
            )}
          >
            <span
              className={cn(
                "mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold sm:mx-auto",
                value === option ? "bg-white text-primary" : "bg-page text-primary",
              )}
            >
              {option}
            </span>
            <span className="block text-sm font-semibold leading-tight">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
