import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateScores } from "@/lib/scoring";
import type { Category, Question, ResponseRow } from "@/lib/types";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Votre session a expire. Reconnectez-vous." }, { status: 401 });
  }

  const [
    { data: audit, error: auditError },
    { data: categories, error: categoriesError },
    { data: questions, error: questionsError },
    { data: responses, error: responsesError },
  ] =
    await Promise.all([
      supabase.from("audits").select("*").eq("id", id).eq("user_id", user.id).single(),
      supabase.from("categories").select("*").order("display_order"),
      supabase.from("questions").select("*").order("display_order"),
      supabase.from("responses").select("question_id, coef").eq("audit_id", id),
    ]);

  if (auditError || !audit) {
    return NextResponse.json({ error: "Audit introuvable ou inaccessible." }, { status: 404 });
  }

  if (categoriesError || questionsError || responsesError) {
    return NextResponse.json(
      { error: "Impossible de charger les donnees de l'audit pour le moment." },
      { status: 500 },
    );
  }

  if ((responses ?? []).length !== (questions ?? []).length) {
    return NextResponse.json(
      { error: "Audit incomplet. Repondez a toutes les questions avant de terminer." },
      { status: 400 },
    );
  }

  const scores = calculateScores({
    categories: (categories ?? []) as Category[],
    questions: (questions ?? []) as Question[],
    responses: (responses ?? []) as Pick<ResponseRow, "question_id" | "coef">[],
  });

  const { error: updateError } = await supabase
    .from("audits")
    .update({
      status: "completed",
      category_scores: scores.categoryScoreMap,
      final_score: scores.finalScore,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (updateError) {
    return NextResponse.json(
      { error: "Impossible d'enregistrer le resultat final pour le moment." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
