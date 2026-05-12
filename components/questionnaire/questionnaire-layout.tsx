"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ClipboardCheck, LayoutDashboard } from "lucide-react";
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
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const orderedCategories = useMemo(
    () => categories.slice().sort((a, b) => a.display_order - b.display_order),
    [categories],
  );
  const categoryOrderById = useMemo(
    () => new Map(orderedCategories.map((category) => [category.id, category.display_order])),
    [orderedCategories],
  );
  const orderedQuestions = useMemo(
    () =>
      questions.slice().sort((a, b) => {
        const categoryOrderA = categoryOrderById.get(a.category_id) ?? Number.MAX_SAFE_INTEGER;
        const categoryOrderB = categoryOrderById.get(b.category_id) ?? Number.MAX_SAFE_INTEGER;

        if (categoryOrderA !== categoryOrderB) return categoryOrderA - categoryOrderB;
        if (a.display_order !== b.display_order) return a.display_order - b.display_order;
        return a.id - b.id;
      }),
    [categoryOrderById, questions],
  );
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
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
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
    if (advanceTimer.current) clearTimeout(advanceTimer.current);

    const answeredQuestionIndex = orderedQuestions.findIndex(
      (question) => question.id === questionId,
    );
    if (answeredQuestionIndex >= 0 && answeredQuestionIndex < orderedQuestions.length - 1) {
      advanceTimer.current = setTimeout(() => {
        goToQuestion(answeredQuestionIndex + 1);
      }, 220);
    }

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
    <div className="grid min-h-screen bg-page lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-primary/10 bg-white p-5 lg:block">
        <BrandLogo className="mb-8 w-36" priority />
        <h1 className="font-serif text-2xl text-primary">Audit guide</h1>
        <p className="mt-1 text-sm leading-5 text-secondary">{audit.business_name}</p>
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
            <span>Progression</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <nav className="mt-8 space-y-1">
          {orderedCategories.map((category) => {
            const progress = progressByCategory.get(category.id);
            const isActive = activeCategory?.id === category.id;
            return (
              <button
                key={category.id}
                onClick={() => goToCategory(category.id)}
                className={cn(
                  "group w-full rounded-md px-3 py-3 text-left text-sm transition",
                  isActive
                    ? "bg-primary text-white"
                    : "text-primary hover:bg-primary/5",
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
        <header className="border-b border-primary/10 bg-white/90 px-4 py-3 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/5 text-primary">
                <ClipboardCheck size={20} />
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
            <div className="hidden min-w-0 flex-1 md:block md:max-w-sm">
              <div className="h-2 overflow-hidden rounded-full bg-primary/10">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost">
                  <LayoutDashboard size={18} /> Tableau de bord
                </Button>
              </Link>
              {isComplete && (
                <Button onClick={finalizeAudit} disabled={isFinalizing} variant="secondary">
                  <CheckCircle2 size={18} /> Terminer l'audit
                </Button>
              )}
            </div>
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

        <section className="flex flex-1 items-center px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-4xl">
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
                <div className="mt-6 flex justify-start">
                  <Button
                    variant="ghost"
                    disabled={currentQuestionIndex <= 0}
                    onClick={() => goToQuestion(currentQuestionIndex - 1)}
                    className="justify-center"
                  >
                    <ArrowLeft size={18} /> Retour
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
