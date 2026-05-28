"use client";

import { LikertScale } from "@/components/questionnaire/likert-scale";
import type { Question } from "@/lib/types";
import { cn } from "@/lib/utils";

const riskClasses: Record<number, string> = {
  1: "bg-teal/10 text-teal",
  2: "bg-teal/10 text-teal",
  3: "bg-accent/20 text-primary",
  4: "bg-orange-50 text-orange-700",
  5: "bg-red-50 text-red-700",
};

export function QuestionCard({
  question,
  value,
  onChange,
}: {
  question: Question;
  value?: number;
  onChange: (questionId: number, coef: number) => void;
}) {
  return (
    <article
      id={`question-${question.id}`}
      className="mx-auto w-full max-w-4xl py-2 md:py-6"
    >
      <div className="flex justify-end">
        {question.risk_level && (
          <span
            className={cn(
              "w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
              riskClasses[question.risk_level],
            )}
          >
            Risque {question.risk_level}/5
          </span>
        )}
      </div>
      <h2 className="mt-6 font-serif text-4xl leading-tight text-primary md:text-5xl">
        {question.text}
      </h2>
      <div className="mt-8">
        <LikertScale
          questionId={question.id}
          value={value}
          onChange={(coef) => onChange(question.id, coef)}
        />
      </div>
      {question.explanation && (
        <details className="mt-6 rounded-md border border-primary/10 bg-white/70 px-4 py-3 text-sm text-secondary">
          <summary className="cursor-pointer font-semibold text-primary">
            En savoir plus
          </summary>
          <p className="mt-2 leading-6">{question.explanation}</p>
        </details>
      )}
    </article>
  );
}
