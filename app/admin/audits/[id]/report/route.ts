import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin";
import { calculateScores } from "@/lib/scoring";
import { auditFileName, buildAuditWorkbook } from "@/lib/excel";
import type { Audit, Category, Question, ResponseRow } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { supabase, user, profile } = await getAdminContext();

  if (!user) {
    return NextResponse.json({ error: "Non authentifie." }, { status: 401 });
  }

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Acces refuse." }, { status: 403 });
  }

  const [
    { data: audit },
    { data: categories },
    { data: questions },
    { data: responses },
  ] = await Promise.all([
    supabase.from("audits").select("*").eq("id", id).single(),
    supabase.from("categories").select("*").order("display_order"),
    supabase.from("questions").select("*").order("display_order"),
    supabase.from("responses").select("question_id, coef").eq("audit_id", id),
  ]);

  if (!audit) {
    return NextResponse.json({ error: "Audit introuvable." }, { status: 404 });
  }

  const payload = {
    audit: audit as Audit,
    categories: (categories ?? []) as Category[],
    questions: (questions ?? []) as Question[],
    responses: (responses ?? []) as Pick<ResponseRow, "question_id" | "coef">[],
    scores: calculateScores({
      categories: (categories ?? []) as Category[],
      questions: (questions ?? []) as Question[],
      responses: (responses ?? []) as Pick<ResponseRow, "question_id" | "coef">[],
    }),
  };
  const workbook = buildAuditWorkbook(payload);
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${auditFileName(payload.audit)}"`,
    },
  });
}
