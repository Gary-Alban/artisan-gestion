import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QuestionnaireLayout } from "@/components/questionnaire/questionnaire-layout";
import type { Audit, Category, Profile, Question, ResponseRow } from "@/lib/types";

export default async function AuditPage({
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
  if ((audit as Audit).status === "completed") redirect(`/audit/${id}/results`);

  return (
    <QuestionnaireLayout
      audit={audit as Audit}
      categories={(categories ?? []) as Category[]}
      questions={(questions ?? []) as Question[]}
      responses={(responses ?? []) as Pick<ResponseRow, "question_id" | "coef">[]}
    />
  );
}
