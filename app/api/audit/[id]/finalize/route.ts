import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateScores } from "@/lib/scoring";
import type { Audit, Category, Question, ResponseRow } from "@/lib/types";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [{ data: audit }, { data: categories }, { data: questions }, { data: responses }] =
    await Promise.all([
      supabase.from("audits").select("*").eq("id", id).eq("user_id", user.id).single(),
      supabase.from("categories").select("*").order("display_order"),
      supabase.from("questions").select("*").order("display_order"),
      supabase.from("responses").select("question_id, coef").eq("audit_id", id),
    ]);

  if (!audit) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if ((responses ?? []).length !== (questions ?? []).length) {
    return NextResponse.json({ error: "Audit incomplet" }, { status: 400 });
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
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const { error: functionError } = await supabase.functions.invoke("send-audit-report", {
    body: { auditId: (audit as Audit).id },
  });

  if (functionError) {
    return NextResponse.json(
      { error: "Audit finalise, email non envoye", detail: functionError.message },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
