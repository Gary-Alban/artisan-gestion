"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Audit, Category, Question, ResponseRow } from "@/lib/types";
import { BrandLogo } from "@/components/brand-logo";
import { QuestionCard } from "@/components/questionnaire/question-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  audit: Audit;
  categories: Category[];
  questions: Question[];
  responses: Pick<ResponseRow, "question_id" | "coef">[];
};

export function QuestionnaireLayout({
  audit,
  categories,
  questions,
  responses,
}: Props) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(
    Object.fromEntries(responses.map((response) => [response.question_id, response.coef])),
  );
  const [isFinalizing, setIsFinalizing] = useState(false);
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const orderedCategories = categories
    .slice()
    .sort((a, b) => a.display_order - b.display_order);
  const orderedQuestions = questions
    .slice()
    .sort((a, b) => a.display_order - b.display_order);
  const currentQuestion = orderedQuestions[currentQuestionIndex];
  const activeCategory = orderedCategories.find(
    (category) => category.id === currentQuestion?.category_id,
  );
  const answeredCount = Object.keys(answers).length;
  const hasQuestions = questions.length > 0;
  const isComplete = hasQuestions && answeredCount === questions.length;
  const progressPercent = hasQuestions ? (answeredCount / questions.length) * 100 : 0;

  const progressByCategory = useMemo(
    () =>
      new Map(
        orderedCategories.map((category) => {
          const total = questions.filter((q) => q.category_id === category.id).length;
          const answered = questions.filter(
            (q) => q.category_id === category.id && answers[q.id],
          ).length;
          return [category.id, { total, answered }];
        }),
      ),
    [answers, orderedCategories, questions],
  );

  useEffect(() => {
    const firstMissing = orderedQuestions.find((question) => !answers[question.id]);
    if (firstMissing) {
      setCurrentQuestionIndex(orderedQuestions.findIndex((question) => question.id === firstMissing.id));
    }
  }, []);

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, []);

  function goToQuestion(index: number) {
    setCurrentQuestionIndex(Math.min(Math.max(index, 0), orderedQuestions.length - 1));
  }

  function goToCategory(categoryId: number) {
    const firstQuestionIndex = orderedQuestions.findIndex(
      (question) => question.category_id === categoryId,
    );
    if (firstQuestionIndex >= 0) goToQuestion(firstQuestionIndex);
  }

  function saveAnswer(questionId: number, coef: number) {
    setAnswers((current) => ({ ...current, [questionId]: coef }));
    clearTimeout(timers.current[questionId]);
    timers.current[questionId] = setTimeout(async () => {
      const supabase = createClient();
      await supabase.from("responses").upsert(
        {
          audit_id: audit.id,
          question_id: questionId,
          coef,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "audit_id,question_id" },
      );
    }, 500);
  }

  async function finalizeAudit() {
    setIsFinalizing(true);
    const response = await fetch(`/api/audit/${audit.id}/finalize`, { method: "POST" });
    setIsFinalizing(false);
    if (response.ok) {
      router.push(`/audit/${audit.id}/results`);
      router.refresh();
    }
  }

  return (
    <div className="grid min-h-screen bg-page lg:grid-cols-[300px_1fr]">
      <aside className="hidden border-r border-primary/10 bg-white p-5 lg:block">
        <BrandLogo className="mb-8 w-36" priority />
        <h1 className="font-serif text-2xl text-primary">Audit guide</h1>
        <p className="mt-1 text-sm text-secondary">{audit.business_name}</p>
        <nav className="mt-8 space-y-2">
          {orderedCategories.map((category) => {
            const progress = progressByCategory.get(category.id);
            const isActive = activeCategory?.id === category.id;
            return (
              <button
                key={category.id}
                onClick={() => goToCategory(category.id)}
                className={cn(
                  "group w-full rounded-md border px-3 py-3 text-left text-sm transition",
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-transparent text-primary hover:border-primary/10 hover:bg-primary/5",
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-semibold leading-snug">{category.name}</span>
                  {(progress?.answered ?? 0) === (progress?.total ?? 0) && progress?.total ? (
                    <CheckCircle2 size={16} className="shrink-0 text-accent" />
                  ) : null}
                </span>
                <span className="mt-2 block text-xs opacity-75">
                  {progress?.answered ?? 0}/{progress?.total ?? 0} repondues
                </span>
                <span className="mt-2 block h-1 overflow-hidden rounded-full bg-white/20 group-hover:bg-primary/10">
                  <span
                    className={cn("block h-full rounded-full", isActive ? "bg-accent" : "bg-teal")}
                    style={{
                      width: `${progress?.total ? ((progress.answered / progress.total) * 100) : 0}%`,
                    }}
                  />
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex min-h-screen flex-col">
        <header className="border-b border-primary/10 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-white">
                <ClipboardCheck size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">
                  Progression {answeredCount}/{questions.length}
                </p>
                <p className="text-sm text-secondary">
                  {activeCategory?.name ?? "Questionnaire"}
                </p>
              </div>
            </div>
            <div className="min-w-0 flex-1 md:max-w-sm">
              <div className="h-2 overflow-hidden rounded-full bg-primary/10">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            {isComplete && (
              <Button onClick={finalizeAudit} disabled={isFinalizing} variant="secondary">
                <CheckCircle2 size={18} /> Terminer l'audit
              </Button>
            )}
          </div>
        </header>

        <div className="border-b border-primary/10 bg-white px-4 py-3 lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {orderedCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => goToCategory(category.id)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-2 text-xs font-semibold",
                  activeCategory?.id === category.id
                    ? "border-primary bg-primary text-white"
                    : "border-primary/10 text-primary",
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <section className="flex flex-1 items-center px-4 py-6 md:px-8 md:py-10">
          <div className="mx-auto w-full max-w-5xl">
            {!hasQuestions ? (
              <div className="rounded-lg border border-primary/10 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-2xl text-primary">
                  Questionnaire indisponible
                </h2>
                <p className="mt-3 text-sm leading-6 text-secondary">
                  Aucune question n'est disponible dans Supabase pour le moment.
                  Lancez le seed des categories et questions, puis rechargez l'audit.
                </p>
              </div>
            ) : currentQuestion ? (
              <>
                <QuestionCard
                  key={currentQuestion.id}
                  question={currentQuestion}
                  value={answers[currentQuestion.id]}
                  onChange={saveAnswer}
                  categoryName={activeCategory?.name ?? "Audit"}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={orderedQuestions.length}
                />
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    variant="ghost"
                    disabled={currentQuestionIndex <= 0}
                    onClick={() => goToQuestion(currentQuestionIndex - 1)}
                    className="justify-center"
                  >
                    <ArrowLeft size={18} /> Precedente
                  </Button>
                  <div className="flex items-center justify-center gap-2">
                    {orderedQuestions.map((question, index) => (
                      <button
                        key={question.id}
                        type="button"
                        aria-label={`Aller a la question ${index + 1}`}
                        onClick={() => goToQuestion(index)}
                        className={cn(
                          "h-2.5 rounded-full transition-all",
                          index === currentQuestionIndex
                            ? "w-8 bg-primary"
                            : answers[question.id]
                              ? "w-2.5 bg-accent"
                              : "w-2.5 bg-primary/20",
                        )}
                      />
                    ))}
                  </div>
                  <Button
                    variant={answers[currentQuestion.id] ? "primary" : "ghost"}
                    disabled={currentQuestionIndex >= orderedQuestions.length - 1}
                    onClick={() => goToQuestion(currentQuestionIndex + 1)}
                    className="justify-center"
                  >
                    Suivante <ArrowRight size={18} />
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
