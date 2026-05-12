import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { calculateScores, type CategoryScore } from "@/lib/scoring";
import type { Audit, Category, Profile, Question, ResponseRow } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { ScoreGauge } from "@/components/results/score-gauge";
import { CategoryScoreBar } from "@/components/results/category-score-bar";
import { cn, formatPercent } from "@/lib/utils";

function scoreStatus(score: number) {
  if (score < 40) {
    return {
      label: "Priorite critique",
      text: "Les fondamentaux demandent une reprise rapide avant de poursuivre.",
      className: "border-red-200 bg-red-50 text-red-800",
    };
  }
  if (score < 60) {
    return {
      label: "Zone de vigilance",
      text: "Plusieurs points structurants meritent un plan d'action court terme.",
      className: "border-orange-200 bg-orange-50 text-orange-800",
    };
  }
  if (score < 75) {
    return {
      label: "Socle correct",
      text: "La gestion est en place, avec quelques leviers faciles a renforcer.",
      className: "border-amber-200 bg-amber-50 text-amber-800",
    };
  }
  return {
    label: "Gestion solide",
    text: "Les pratiques sont globalement robustes et peuvent etre optimisees.",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  };
}

function scoreLabel(score: number) {
  if (score < 40) return "Critique";
  if (score < 60) return "A renforcer";
  if (score < 75) return "Correct";
  return "Solide";
}

function riskTone(riskLevel: number | null) {
  if (!riskLevel) return "bg-primary/5 text-secondary";
  if (riskLevel >= 4) return "bg-red-50 text-red-700";
  if (riskLevel >= 3) return "bg-orange-50 text-orange-700";
  return "bg-teal/10 text-teal";
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function ScoreInsight({ category }: { category: CategoryScore | undefined }) {
  if (!category) return null;

  return (
    <div className="flex items-start gap-3 rounded-md bg-accent/15 p-4">
      <div className="grid size-9 shrink-0 place-items-center rounded-md bg-white text-primary">
        <CircleAlert size={18} />
      </div>
      <div>
        <p className="text-sm font-semibold text-primary">Priorite : {category.category.name}</p>
        <p className="mt-1 text-sm leading-5 text-secondary">
          Score le plus bas ({formatPercent(category.scorePercent)}), a traiter en premier.
        </p>
      </div>
    </div>
  );
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: profile },
    { data: audit },
    { data: categories },
    { data: questions },
    { data: responses },
  ] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("audits").select("*").eq("id", id).eq("user_id", user.id).single(),
      supabase.from("categories").select("*").order("display_order"),
      supabase.from("questions").select("*").order("display_order"),
      supabase.from("responses").select("question_id, coef").eq("audit_id", id),
    ]);

  if (!(profile as Profile | null)?.is_active) redirect("/dashboard");
  if (!audit) redirect("/dashboard");

  const scores = calculateScores({
    categories: (categories ?? []) as Category[],
    questions: (questions ?? []) as Question[],
    responses: (responses ?? []) as Pick<ResponseRow, "question_id" | "coef">[],
  });
  const auditRow = audit as Audit;
  const allQuestions = (questions ?? []) as Question[];
  const allResponses = (responses ?? []) as Pick<ResponseRow, "question_id" | "coef">[];
  const status = scoreStatus(scores.finalScore);
  const weakestCategory = scores.categoryScores
    .slice()
    .sort((a, b) => a.scorePercent - b.scorePercent)[0];
  const strongestCategory = scores.categoryScores
    .slice()
    .sort((a, b) => b.scorePercent - a.scorePercent)[0];
  const coefByQuestion = new Map(
    allResponses.map((r) => [r.question_id, r.coef]),
  );
  const categoryById = new Map(
    ((categories ?? []) as Category[]).map((category) => [category.id, category.name]),
  );

  return (
    <main className="min-h-screen bg-page">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold text-primary transition hover:bg-primary/5"
        >
          <ArrowLeft size={17} />
          Tableau de bord
        </Link>

        <section className="mt-5 overflow-hidden rounded-lg border border-primary/10 bg-white shadow-sm">
          <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[300px_1fr] lg:items-center">
            <div className="flex justify-center lg:justify-start">
              <ScoreGauge score={scores.finalScore} />
            </div>
            <div>
              <div
                className={cn(
                  "inline-flex rounded-full border px-3 py-1 text-sm font-semibold",
                  status.className,
                )}
              >
                {status.label}
              </div>
              <h1 className="mt-4 font-serif text-3xl leading-tight text-primary sm:text-4xl">
                Resultats de l'audit
              </h1>
              <p className="mt-2 text-lg font-semibold text-primary">
                {auditRow.business_name ?? "Entreprise auditee"}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-secondary">
                {status.text} Les categories ci-dessous permettent d'identifier les forces,
                les zones fragiles et les priorites a reprendre.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <div className="rounded-md bg-primary px-4 py-3 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-75">
                    Niveau
                  </p>
                  <p className="mt-1 text-lg font-semibold">{scoreLabel(scores.finalScore)}</p>
                </div>
                <div className="rounded-md bg-primary/5 px-4 py-3 text-primary">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                    Questionnaire
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {allResponses.length}/{allQuestions.length} reponses
                  </p>
                </div>
                <div className="rounded-md bg-accent/25 px-4 py-3 text-primary">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                    Finalise le
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    {formatDate(auditRow.completed_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
          <Card>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-secondary">
                  Synthese
                </p>
                <h2 className="mt-1 font-serif text-2xl text-primary">
                  Scores par categorie
                </h2>
              </div>
              <p className="text-sm text-secondary">
                Contribution ponderee au score final
              </p>
            </div>
            <div className="mt-6 grid gap-3">
              {scores.categoryScores.map((item) => (
                <CategoryScoreBar key={item.category.id} item={item} />
              ))}
            </div>
            <div className="mt-5">
              <ScoreInsight category={weakestCategory} />
            </div>
          </Card>

          <div className="space-y-4">
            <div className="rounded-lg border border-primary/10 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                Point fort
              </p>
              <div className="mt-3 flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-md bg-teal/10 text-teal">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <p className="font-semibold text-primary">
                    {strongestCategory?.category.name ?? "-"}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-secondary">
                    {strongestCategory
                      ? `${formatPercent(strongestCategory.scorePercent)} sur cette categorie.`
                      : "Aucune categorie disponible."}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-primary/10 bg-primary p-4 text-white shadow-sm">
              <CheckCircle2 size={20} className="text-accent" />
              <p className="mt-3 font-semibold">Audit finalise</p>
              <p className="mt-1 text-sm leading-5 text-white/75">
                Derniere mise a jour le {formatDate(auditRow.updated_at)}.
              </p>
            </div>
          </div>
        </section>

        <Card className="mt-5 overflow-hidden p-0">
          <div className="border-b border-primary/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-secondary">
              Reponses
            </p>
            <h2 className="mt-1 font-serif text-2xl text-primary">Detail des questions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-primary/5 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                <tr>
                  <th className="px-6 py-3">Categorie</th>
                  <th className="px-4 py-3">Question</th>
                  <th className="px-4 py-3 text-center">Reponse</th>
                  <th className="px-4 py-3 text-center">Poids</th>
                  <th className="px-6 py-3 text-center">Risque</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10 text-secondary">
                {allQuestions.map((question) => (
                  <tr key={question.id} className="bg-white transition hover:bg-primary/5">
                    <td className="px-6 py-4 align-top font-semibold text-primary">
                      {categoryById.get(question.category_id)}
                    </td>
                    <td className="px-4 py-4 align-top leading-6">{question.text}</td>
                    <td className="px-4 py-4 text-center align-top">
                      <span className="inline-flex min-w-9 justify-center rounded-full bg-primary/5 px-3 py-1 font-semibold text-primary">
                        {coefByQuestion.get(question.id) ?? "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center align-top">{question.weight}</td>
                    <td className="px-6 py-4 text-center align-top">
                      <span
                        className={cn(
                          "inline-flex min-w-9 justify-center rounded-full px-3 py-1 font-semibold",
                          riskTone(question.risk_level),
                        )}
                      >
                        {question.risk_level ?? "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}
