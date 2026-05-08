import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Audit, Profile } from "@/lib/types";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: audits }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("audits")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }),
  ]);

  const currentProfile = profile as Profile | null;
  const items = (audits ?? []) as Audit[];
  const firstName = currentProfile?.full_name?.split(" ")[0] || "client";

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <BrandLogo className="mb-5 w-36" priority />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Espace client
          </p>
          <h1 className="font-serif text-4xl text-primary">
            {currentProfile?.is_active
              ? `Bienvenue ${firstName}, commencez un nouvel audit`
              : "Tableau de bord"}
          </h1>
        </div>
        {currentProfile?.is_active && (
          <Link href="/audit/new">
            <Button variant="secondary">
              <Plus size={18} /> Nouvel audit
            </Button>
          </Link>
        )}
      </div>

      {!currentProfile?.is_active && (
        <Card className="mt-8 border-accent/40 bg-accent/10">
          <h2 className="font-serif text-2xl text-primary">
            Votre compte est en attente d'activation.
          </h2>
          <p className="mt-2 text-secondary">
            Si vous avez paye via Calendly, votre acces sera active sous 24h.
          </p>
        </Card>
      )}

      <div className="mt-8 grid gap-4">
        {items.map((audit) => (
          <Link key={audit.id} href={`/audit/${audit.id}`}>
            <Card className="flex flex-col gap-3 transition hover:border-accent md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-serif text-2xl text-primary">
                  {audit.business_name || "Fonds sans nom"}
                </h2>
                <p className="text-sm text-secondary">
                  {audit.status === "completed" ? "Termine" : "En cours"}
                </p>
              </div>
              <div className="text-sm font-semibold text-primary">
                Score : {formatPercent(audit.final_score)}
              </div>
            </Card>
          </Link>
        ))}
        {items.length === 0 && (
          <Card>
            <p className="text-secondary">Aucun audit pour le moment.</p>
          </Card>
        )}
      </div>
    </main>
  );
}
