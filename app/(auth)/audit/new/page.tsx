import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { NewAuditForm } from "@/components/new-audit-form";
import type { Profile } from "@/lib/types";

export default async function NewAuditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!(profile as Profile | null)?.is_active) redirect("/dashboard");

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6 py-10">
      <Card className="w-full">
        <h1 className="font-serif text-3xl text-primary">Nouvel audit</h1>
        <p className="mt-2 text-secondary">
          Renseignez le nom du fonds de commerce audite.
        </p>
        <div className="mt-6">
          <NewAuditForm userId={user.id} />
        </div>
      </Card>
    </main>
  );
}
