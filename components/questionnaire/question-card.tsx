"use client";

import { LikertScale } from "@/components/questionnaire/likert-scale";
import type { Question } from "@/lib/types";
import { cn } from "@/lib/utils";

const riskClasses: Record<number, string> = {
  1: "bg-green-100 text-green-800",
  2: "bg-lime-100 text-lime-800",
  3: "bg-yellow-100 text-yellow-800",
  4: "bg-orange-100 text-orange-800",
  5: "bg-red-100 text-red-800",
};

export function QuestionCard({
  question,
  value,
  onChange,
  categoryName,
  questionNumber,
  totalQuestions,
}: {
  question: Question;
  value?: number;
  onChange: (questionId: number, coef: number) => void;
  categoryName: string;
  questionNumber: number;
  totalQuestions: number;
}) {
  return (
    <article
      id={`question-${question.id}`}
      className="rounded-lg border border-primary/10 bg-white p-6 shadow-sm md:p-10"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
            {categoryName}
          </p>
          <p className="mt-2 text-sm font-semibold text-secondary">
            Question {questionNumber} sur {totalQuestions}
          </p>
        </div>
        {question.risk_level && (
          <span
            className={cn(
              "w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold",
              riskClasses[question.risk_level],
            )}
          >
            Risque {question.risk_level}/5
          </span>
        )}
      </div>
      <h2 className="mt-7 font-serif text-3xl leading-tight text-primary md:text-5xl">
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
        <details className="mt-6 rounded-md bg-page px-4 py-3 text-sm text-secondary">
          <summary className="cursor-pointer font-semibold text-primary">
            En savoir plus
          </summary>
          <p className="mt-2 leading-6">{question.explanation}</p>
        </details>
      )}
    </article>
  );
}
