import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.0";
import { Resend } from "https://esm.sh/resend@6.5.1";
import * as XLSX from "https://esm.sh/xlsx@0.18.5";

type Category = {
  id: number;
  slug: string;
  name: string;
  display_order: number;
  weight_percent: number;
};

type Question = {
  id: number;
  category_id: number;
  text: string;
  explanation: string | null;
  weight: number;
  risk_level: number | null;
};

type ResponseRow = {
  question_id: number;
  coef: number;
};

function score(categories: Category[], questions: Question[], responses: ResponseRow[]) {
  const coefByQuestion = new Map(responses.map((response) => [response.question_id, response.coef]));
  const rows = categories.map((category) => {
    const categoryQuestions = questions.filter((question) => question.category_id === category.id);
    const raw = categoryQuestions.reduce(
      (sum, question) => sum + question.weight * (coefByQuestion.get(question.id) ?? 0),
      0,
    );
    const max = categoryQuestions.reduce((sum, question) => sum + question.weight * 5, 0);
    const percent = max ? (raw / max) * 100 : 0;
    return { category, percent, contribution: percent * (category.weight_percent / 100) };
  });
  return { rows, final: rows.reduce((sum, row) => sum + row.contribution, 0) };
}

serve(async (request) => {
  const { auditId } = await request.json();
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);
  const adminEmail = Deno.env.get("ADMIN_EMAIL")!;
  const appUrl =
    Deno.env.get("APP_URL") ??
    Deno.env.get("NEXT_PUBLIC_SITE_URL") ??
    new URL(request.url).origin;

  const { data: audit, error: auditError } = await supabase
    .from("audits")
    .select("*, profiles(email)")
    .eq("id", auditId)
    .single();
  if (auditError) return new Response(auditError.message, { status: 500 });

  const [{ data: categories }, { data: questions }, { data: responses }] = await Promise.all([
    supabase.from("categories").select("*").order("display_order"),
    supabase.from("questions").select("*").order("display_order"),
    supabase.from("responses").select("question_id, coef").eq("audit_id", auditId),
  ]);

  const result = score(categories ?? [], questions ?? [], responses ?? []);
  const coefByQuestion = new Map((responses ?? []).map((response) => [response.question_id, response.coef]));
  const categoryById = new Map((categories ?? []).map((category) => [category.id, category]));
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet([
      ...result.rows.map((row) => ({
        "Categorie": row.category.name,
        "Score %": Math.round(row.percent),
        "Poids %": row.category.weight_percent,
        "Contribution au score final": Math.round(row.contribution * 100) / 100,
      })),
      {
        "Categorie": "Score Global",
        "Score %": "",
        "Poids %": "",
        "Contribution au score final": Math.round(result.final),
      },
    ]),
    "Synthese",
  );

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet((questions ?? []).map((question) => ({
      "Categorie": categoryById.get(question.category_id)?.name ?? "",
      "Question": question.text,
      "Reponse (1-5)": coefByQuestion.get(question.id) ?? "",
      "Poids question": question.weight,
      "Score brut": (coefByQuestion.get(question.id) ?? 0) * question.weight,
      "Niveau risque": question.risk_level ?? "",
      "Explication": question.explanation ?? "",
    }))),
    "Detail par question",
  );

  const attachment = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
  const details = result.rows
    .map((row) => `- ${row.category.name} : ${Math.round(row.percent)}%`)
    .join("\n");
  const adminLink = `${appUrl.replace(/\/$/, "")}/admin/audits/${auditId}`;

  await resend.emails.send({
    from: "Artisan Gestion <audit@artisan-gestion.fr>",
    to: [adminEmail],
    subject: `Nouvel audit termine - ${audit.business_name}`,
    text: `Bonjour Gary-Alban,

Un client vient de finaliser un audit pre-acquisition.

Client : ${audit.profiles.email}
Fonds audite : ${audit.business_name}

Score global : ${Math.round(result.final)}% (niveau de conformite)

Detail par categorie :
${details}

Acces administrateur :
${adminLink}

Le rapport Excel est joint a cet email.

A tres vite`,
    attachments: [
      {
        filename: `audit-${String(audit.business_name ?? "fonds").replaceAll(" ", "-")}.xlsx`,
        content: attachment,
      },
    ],
  });

  return Response.json({ ok: true });
});
