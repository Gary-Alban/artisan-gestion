import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calculateScores } from "@/lib/scoring";
import type { Audit, Category, Profile, Question, ResponseRow } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { ScoreGauge } from "@/components/results/score-gauge";
import { CategoryScoreBar } from "@/components/results/category-score-bar";

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
  const coefByQuestion = new Map(
    ((responses ?? []) as Pick<ResponseRow, "question_id" | "coef">[]).map((r) => [
      r.question_id,
      r.coef,
    ]),
  );
  const categoryById = new Map(
    ((categories ?? []) as Category[]).map((category) => [category.id, category.name]),
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link href="/dashboard" className="text-sm font-semibold text-primary underline">
        Retour tableau de bord
      </Link>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <Card className="lg:w-72">
          <ScoreGauge score={scores.finalScore} />
        </Card>
        <Card className="flex-1">
          <h1 className="font-serif text-3xl text-primary">
            Resultats - {(audit as Audit).business_name}
          </h1>
          <div className="mt-8 space-y-5">
            {scores.categoryScores.map((item) => (
              <CategoryScoreBar key={item.category.id} item={item} />
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 overflow-x-auto">
        <h2 className="font-serif text-2xl text-primary">Detail des questions</h2>
        <table className="mt-5 w-full min-w-[760px] text-left text-sm">
          <thead className="text-primary">
            <tr className="border-b">
              <th className="py-2">Categorie</th>
              <th>Question</th>
              <th>Reponse</th>
              <th>Poids</th>
              <th>Risque</th>
            </tr>
          </thead>
          <tbody className="text-secondary">
            {((questions ?? []) as Question[]).map((question) => (
              <tr key={question.id} className="border-b border-primary/8">
                <td className="py-3">{categoryById.get(question.category_id)}</td>
                <td>{question.text}</td>
                <td>{coefByQuestion.get(question.id) ?? "-"}</td>
                <td>{question.weight}</td>
                <td>{question.risk_level ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </main>
  );
}
