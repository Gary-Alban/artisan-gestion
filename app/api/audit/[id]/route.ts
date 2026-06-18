import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Audit introuvable." }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Votre session a expire. Reconnectez-vous." },
      { status: 401 },
    );
  }

  const { data: audit, error: auditError } = await supabase
    .from("audits")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (auditError) {
    return NextResponse.json({ error: auditError.message }, { status: 500 });
  }

  if (!audit) {
    return NextResponse.json(
      { error: "Audit introuvable ou deja supprime." },
      { status: 404 },
    );
  }

  let adminSupabase: ReturnType<typeof createAdminClient>;
  try {
    adminSupabase = createAdminClient();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Configuration Supabase admin invalide.",
      },
      { status: 500 },
    );
  }

  const { error } = await adminSupabase
    .from("audits")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/dashboard");
  return NextResponse.json({ ok: true });
}
