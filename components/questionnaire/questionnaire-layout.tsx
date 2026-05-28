"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Circle,
  CircleDot,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
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
  const [finalizeError, setFinalizeError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [planCategoryId, setPlanCategoryId] = useState<number | null>(null);
  const [showResumePanel, setShowResumePanel] = useState(
    responses.length > 0 && responses.length < questions.length,
  );
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
  const currentQuestionAnswered = currentQuestion ? Boolean(answers[currentQuestion.id]) : false;
  const answeredCount = Object.keys(answers).length;
  const hasQuestions = questions.length > 0;
  const isComplete = hasQuestions && answeredCount === questions.length;
  const progressPercent = hasQuestions ? (answeredCount / questions.length) * 100 : 0;

  const questionsByCategory = useMemo(
    () =>
      new Map(
        orderedCategories.map((category) => [
          category.id,
          orderedQuestions.filter((question) => question.category_id === category.id),
        ]),
      ),
    [orderedCategories, orderedQuestions],
  );

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
  const currentCategoryProgress = activeCategory
    ? progressByCategory.get(activeCategory.id)
    : null;

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
    setShowResumePanel(false);
  }

  function goToQuestionId(questionId: number) {
    const nextIndex = orderedQuestions.findIndex((question) => question.id === questionId);
    if (nextIndex >= 0) {
      goToQuestion(nextIndex);
      setIsPlanOpen(false);
    }
  }

  function getNextQuestionIndex(
    fromIndex: number,
    nextAnswers: Record<number, number> = answers,
  ) {
    const nextMissingIndex = orderedQuestions.findIndex(
      (question, index) => index > fromIndex && !nextAnswers[question.id],
    );
    if (nextMissingIndex >= 0) return nextMissingIndex;

    const firstMissingIndex = orderedQuestions.findIndex((question) => !nextAnswers[question.id]);
    if (firstMissingIndex >= 0) return firstMissingIndex;

    if (fromIndex < orderedQuestions.length - 1) return fromIndex + 1;
    return fromIndex;
  }

  function goToNextUntreatedQuestion() {
    if (!showResumePanel && !currentQuestionAnswered) return;
    if (showResumePanel) {
      goToQuestion(currentQuestionIndex);
      return;
    }
    goToQuestion(getNextQuestionIndex(currentQuestionIndex));
  }

  function openPlan() {
    setShowResumePanel(false);
    setPlanCategoryId(activeCategory?.id ?? null);
    setIsPlanOpen(true);
  }

  function closePlan() {
    setIsPlanOpen(false);
  }

  function continueToFirstUntreatedQuestion() {
    const firstUntreatedIndex = orderedQuestions.findIndex((question) => !answers[question.id]);
    goToQuestion(firstUntreatedIndex >= 0 ? firstUntreatedIndex : currentQuestionIndex);
    closePlan();
  }

  function getQuestionStatus(question: Question) {
    if (question.id === currentQuestion?.id) return "current";
    if (answers[question.id]) return "answered";
    return "empty";
  }

  function QuestionStatusMark({ status }: { status: "answered" | "current" | "empty" }) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center",
          status === "answered" && "text-teal",
          status === "current" && "text-accent",
          status === "empty" && "text-secondary/45",
        )}
      >
        {status === "answered" ? (
          <CheckCircle2 size={17} />
        ) : status === "current" ? (
          <CircleDot size={17} />
        ) : (
          <Circle size={17} />
        )}
      </span>
    );
  }

  function AuditPlan({ compact = false }: { compact?: boolean }) {
    const openedCategoryId = planCategoryId;

    return (
      <div className={cn("space-y-3", compact && "space-y-2")}>
        {orderedCategories.map((category) => {
          const progress = progressByCategory.get(category.id);
          const categoryQuestions = questionsByCategory.get(category.id) ?? [];
          const isOpen = openedCategoryId === category.id;
          const isCompleteCategory = Boolean(
            progress?.total && progress.answered === progress.total,
          );

          return (
            <section key={category.id} className="rounded-md border border-primary/10 bg-white">
              <button
                type="button"
                onClick={() => setPlanCategoryId(isOpen ? null : category.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-md px-3 py-3 text-left text-sm font-semibold text-primary transition hover:bg-primary/4",
                  isOpen && "bg-primary/4",
                )}
                aria-expanded={isOpen}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <ChevronDown
                    size={16}
                    className={cn(
                      "shrink-0 text-secondary transition-transform",
                      isOpen && "rotate-180 text-primary",
                    )}
                  />
                  <span className="min-w-0">
                    <span className="block truncate">{category.name}</span>
                    <span className="mt-1 block h-1 overflow-hidden rounded-full bg-primary/10">
                      <span
                        className="block h-full rounded-full bg-teal"
                        style={{
                          width: `${progress?.total ? ((progress.answered / progress.total) * 100) : 0}%`,
                        }}
                      />
                    </span>
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-xs text-secondary">
                  {isCompleteCategory ? (
                    <CheckCircle2 size={14} className="text-teal" />
                  ) : null}
                  {progress?.answered ?? 0}/{progress?.total ?? 0}
                </span>
              </button>
              {isOpen ? (
                <div className="space-y-1 border-t border-primary/10 p-2">
                  {categoryQuestions.map((question) => {
                    const questionIndex = orderedQuestions.findIndex((item) => item.id === question.id);
                    const status = getQuestionStatus(question);

                    return (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => goToQuestionId(question.id)}
                        className={cn(
                          "flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-xs transition",
                          status === "current"
                            ? "bg-page text-primary"
                            : "text-secondary hover:bg-page hover:text-primary",
                        )}
                        title={question.text}
                      >
                        <QuestionStatusMark status={status} />
                        <span className="min-w-0">
                          <span className="block font-semibold">
                            Question {questionIndex + 1}
                          </span>
                          <span className={cn("block leading-5", compact ? "line-clamp-2" : "line-clamp-1")}>
                            {question.text}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    );
  }

  function saveAnswer(questionId: number, coef: number) {
    const wasAlreadyAnswered = Boolean(answers[questionId]);
    const nextAnswers = { ...answers, [questionId]: coef };

    setAnswers(nextAnswers);
    setSaveError(null);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);

    const answeredQuestionIndex = orderedQuestions.findIndex(
      (question) => question.id === questionId,
    );
    if (!wasAlreadyAnswered && answeredQuestionIndex >= 0) {
      advanceTimer.current = setTimeout(() => {
        goToQuestion(getNextQuestionIndex(answeredQuestionIndex, nextAnswers));
      }, 220);
    }

    clearTimeout(timers.current[questionId]);
    timers.current[questionId] = setTimeout(async () => {
      const supabase = createClient();
      try {
        const { error } = await supabase.from("responses").upsert(
          {
            audit_id: audit.id,
            question_id: questionId,
            coef,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "audit_id,question_id" },
        );

        if (error) {
          setSaveError("Cette reponse n'a pas pu etre enregistree. Elle reste a l'ecran, reessayez avant de quitter.");
        }
      } catch {
        setSaveError("Connexion impossible. Cette reponse n'a pas encore ete enregistree.");
      }
    }, 500);
  }

  async function finalizeAudit() {
    setFinalizeError(null);
    setIsFinalizing(true);
    Object.values(timers.current).forEach(clearTimeout);
    timers.current = {};
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }

    if (!isComplete) {
      setFinalizeError("Repondez a toutes les questions avant de terminer l'audit.");
      setIsFinalizing(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: lastSaveError } = await supabase.from("responses").upsert(
        Object.entries(answers).map(([questionId, coef]) => ({
          audit_id: audit.id,
          question_id: Number(questionId),
          coef,
          updated_at: new Date().toISOString(),
        })),
        { onConflict: "audit_id,question_id" },
      );

      if (lastSaveError) {
        setFinalizeError("Impossible d'enregistrer les dernieres reponses. Reessayez dans un instant.");
        setIsFinalizing(false);
        return;
      }

      const response = await fetch(`/api/audit/${audit.id}/finalize`, { method: "POST" });
      if (response.ok) {
        router.replace(`/audit/${audit.id}/results`);
        return;
      }

      const payload = await response.json().catch(() => null);
      setFinalizeError(payload?.error ?? "Impossible de finaliser l'audit pour le moment.");
    } catch {
      setFinalizeError("Connexion impossible. Verifiez votre reseau puis reessayez.");
    }
    setIsFinalizing(false);
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-page">
      <header className="shrink-0 border-b border-primary/10 bg-white/94 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 md:px-8">
          <div className="flex items-center justify-between gap-4 sm:gap-6">
            <div className="flex min-w-0 items-center gap-4">
              <BrandLogo className="w-20 shrink-0 sm:w-24 md:w-28" priority />
              <p className="hidden min-w-0 truncate text-sm font-semibold text-primary sm:block">
                {audit.business_name ?? "Questionnaire d'audit"}
              </p>
            </div>

            <Button variant="ghost" onClick={openPlan} aria-expanded={isPlanOpen} className="shrink-0 px-3 sm:px-4">
              <Menu size={18} />
              <span className="hidden sm:inline">Menu</span>
            </Button>
          </div>

          {finalizeError ? (
            <p role="alert" className="mt-3 text-sm font-medium text-red-700">
              {finalizeError}
            </p>
          ) : null}
          {saveError ? (
            <p role="alert" className="mt-3 text-sm font-medium text-red-700">
              {saveError}
            </p>
          ) : null}
        </div>
      </header>

      <main className="flex min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-10">
        <div className="mx-auto flex w-full max-w-5xl flex-col justify-center">
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
          ) : showResumePanel ? (
            <div className="mx-auto w-full max-w-3xl py-8 md:py-16">
              <p className="text-sm font-semibold text-teal">Audit en cours</p>
              <h1 className="mt-4 font-serif text-4xl leading-tight text-primary md:text-6xl">
                Reprendre {audit.business_name}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-secondary md:text-lg">
                {answeredCount} question{answeredCount > 1 ? "s" : ""} sur {questions.length} sont deja traitees.
                {activeCategory ? ` Prochaine section : ${activeCategory.name}.` : ""}
              </p>
              <div className="mt-8 max-w-xl">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                  <span>Progression</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary/10">
                  <div
                    className="h-full rounded-full bg-teal transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button onClick={goToNextUntreatedQuestion} className="justify-center px-6 py-3">
                  Continuer <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          ) : currentQuestion ? (
            <>
              {activeCategory ? (
                <div className="mx-auto mb-5 w-full max-w-4xl border-b border-primary/10 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-teal">
                        {activeCategory.name}
                      </p>
                      <span className="hidden h-1 w-1 rounded-full bg-secondary/30 sm:block" />
                      <p className="text-xs font-medium text-secondary">
                        Question {currentQuestionIndex + 1}/{orderedQuestions.length}
                      </p>
                    </div>
                    <p className="text-xs font-medium text-secondary">
                      {currentCategoryProgress?.answered ?? 0}/{currentCategoryProgress?.total ?? 0} repondues
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-primary/10">
                      <div
                        className="h-full rounded-full bg-teal transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-secondary">
                      {answeredCount}/{orderedQuestions.length}
                    </span>
                  </div>
                </div>
              ) : null}

              <QuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={saveAnswer}
              />
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  variant="ghost"
                  disabled={currentQuestionIndex <= 0}
                  onClick={() => goToQuestion(currentQuestionIndex - 1)}
                  className="justify-center"
                >
                  <ArrowLeft size={18} /> Retour
                </Button>
                <div className="flex flex-col items-stretch gap-2 sm:items-end">
                  {!currentQuestionAnswered ? (
                    <p className="text-center text-xs font-medium text-secondary sm:text-right">
                      Repondez pour continuer
                    </p>
                  ) : null}
                  <Button
                    onClick={goToNextUntreatedQuestion}
                    disabled={!currentQuestionAnswered || currentQuestionIndex === getNextQuestionIndex(currentQuestionIndex)}
                    className="justify-center"
                  >
                    Suivant <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>

      {isPlanOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-primary/28 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-xl flex-col overflow-hidden bg-page shadow-2xl">
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-primary/10 bg-white px-4 py-4 md:px-6">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-primary">
                  {audit.business_name ?? "Questionnaire d'audit"}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-secondary">
                  Plan de l'audit
                </p>
              </div>
              <button
                type="button"
                onClick={closePlan}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-primary transition hover:bg-primary/8"
                aria-label="Fermer le plan de l'audit"
              >
                <X size={18} />
              </button>
            </div>

            <div className="shrink-0 border-b border-primary/10 bg-white px-4 py-3 md:px-6">
              <div className="flex flex-col gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-primary">
                    {answeredCount}/{questions.length} questions traitees
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary/10 sm:w-72">
                    <div
                      className="h-full rounded-full bg-teal"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button onClick={continueToFirstUntreatedQuestion} className="justify-center">
                    Continuer <ArrowRight size={18} />
                  </Button>
                  {isComplete ? (
                    <Button
                      onClick={finalizeAudit}
                      isLoading={isFinalizing}
                      loadingLabel="Finalisation..."
                      variant="secondary"
                      className="justify-center"
                    >
                      <CheckCircle2 size={18} /> Terminer
                    </Button>
                  ) : null}
                  <Link href="/dashboard" className="block">
                    <Button variant="ghost" className="w-full justify-center">
                      <LayoutDashboard size={18} /> Tableau de bord
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
              <AuditPlan compact />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
