import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Download, ShieldAlert, ShieldCheck, ShieldMinus } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { calculateScores } from "@/lib/scoring";
import type { Audit, Category, Profile, Question, ResponseRow } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CategoryScoreBar } from "@/components/results/category-score-bar";
import { ScoreGauge } from "@/components/results/score-gauge";
import { cn } from "@/lib/utils";

type AuditWithProfile = Audit & {
  profiles: Pick<Profile, "email"> | null;
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function riskStatus(coef: number | undefined) {
  if (!coef) {
    return {
      label: "Non renseigne",
      icon: ShieldMinus,
      className: "border-primary/10 bg-primary/5 text-secondary",
    };
  }
  if (coef <= 2) {
    return {
      label: "Risque fort",
      icon: ShieldAlert,
      className: "border-red-200 bg-red-50 text-red-800",
    };
  }
  if (coef === 3) {
    return {
      label: "Maitrise",
      icon: ShieldMinus,
      className: "border-accent/40 bg-accent/15 text-primary",
    };
  }
  return {
    label: "Risque faible",
    icon: ShieldCheck,
    className: "border-teal/20 bg-teal/10 text-teal",
  };
}

function RiskBadge({ coef }: { coef: number | undefined }) {
  const status = riskStatus(coef);
  const Icon = status.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold",
        status.className,
      )}
    >
      <Icon size={14} />
      {status.label}
    </span>
  );
}

export default async function AdminAuditDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const [
    { data: audit },
    { data: categories },
    { data: questions },
    { data: responses },
  ] = await Promise.all([
    supabase.from("audits").select("*, profiles(email)").eq("id", id).single(),
    supabase.from("categories").select("*").order("display_order"),
    supabase.from("questions").select("*").order("display_order"),
    supabase.from("responses").select("question_id, coef").eq("audit_id", id),
  ]);

  if (!audit) redirect("/admin/audits");

  await supabase
    .from("audits")
    .update({ viewed_by_admin: true })
    .eq("id", id);

  const auditRow = audit as AuditWithProfile;
  const categoryRows = (categories ?? []) as Category[];
  const questionRows = (questions ?? []) as Question[];
  const responseRows = (responses ?? []) as Pick<ResponseRow, "question_id" | "coef">[];
  const scores = calculateScores({
    categories: categoryRows,
    questions: questionRows,
    responses: responseRows,
  });
  const coefByQuestion = new Map(responseRows.map((response) => [response.question_id, response.coef]));
  const categoryById = new Map(categoryRows.map((category) => [category.id, category.name]));

  return (
    <div className="space-y-8">
      <Link
        href="/admin/audits"
        className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold text-secondary transition hover:bg-primary/5 hover:text-primary"
      >
        <ArrowLeft size={17} />
        Tous les audits
      </Link>

      <section className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <Card className="flex items-center justify-center p-8">
          <ScoreGauge score={scores.finalScore} />
        </Card>
        <Card className="p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Badge variant={auditRow.status === "completed" ? "success" : "warning"}>
                {auditRow.status === "completed" ? "Termine" : "En cours"}
              </Badge>
              <h1 className="mt-4 font-serif text-4xl leading-tight text-primary">
                {auditRow.business_name || "Fonds sans nom"}
              </h1>
              <div className="mt-4 grid gap-2 text-sm text-secondary sm:grid-cols-2">
                <p>
                  <span className="font-semibold text-primary">Client :</span>{" "}
                  {auditRow.profiles?.email ?? "-"}
                </p>
                <p>
                  <span className="font-semibold text-primary">Date :</span>{" "}
                  {formatDate(auditRow.completed_at ?? auditRow.updated_at)}
                </p>
              </div>
            </div>
            <a
              href={`/admin/audits/${auditRow.id}/report`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-primary transition hover:bg-accent/90 lg:shrink-0"
            >
              <Download size={17} />
              Télécharger le rapport Excel
            </a>
          </div>
        </Card>
      </section>

      <Card className="p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mt-1 font-serif text-2xl text-primary">Scores par categorie</h2>
          </div>
          <p className="text-sm text-secondary">Contribution ponderee au score final</p>
        </div>
        <div className="mt-7 grid gap-4">
          {scores.categoryScores.map((item) => (
            <CategoryScoreBar key={item.category.id} item={item} showWeight />
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-primary/10 p-6 sm:p-8">
          <h2 className="mt-1 font-serif text-2xl text-primary">Questions et reponses</h2>
        </div>
        <div className="divide-y divide-primary/10">
          {questionRows.map((question) => {
            const coef = coefByQuestion.get(question.id);
            const rawScore = coef ? coef * question.weight : null;

            return (
              <article
                key={question.id}
                className="grid gap-5 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_220px]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {categoryById.get(question.category_id) ?? "Sans categorie"}
                    </Badge>
                    <RiskBadge coef={coef} />
                  </div>
                  <h3 className="mt-3 text-base font-semibold leading-7 text-primary">
                    {question.text}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-secondary">
                    {question.explanation ?? "Aucune explication renseignee."}
                  </p>
                </div>

                <dl className="grid grid-cols-3 gap-2 self-start rounded-md bg-primary/5 p-4 text-center sm:max-w-sm lg:grid-cols-1 lg:text-left">
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary">
                      Reponse
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-primary">{coef ?? "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary">
                      Poids
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-primary">{question.weight}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary">
                      Score
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-primary">{rawScore ?? "-"}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
