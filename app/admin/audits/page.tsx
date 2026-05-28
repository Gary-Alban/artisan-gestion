import { requireAdmin } from "@/lib/admin";
import type { Audit, Profile } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { AuditsTable, type AdminAuditRow } from "./audits-table";

type AuditWithProfile = Audit & {
  profiles: Pick<Profile, "email"> | null;
};

export default async function AdminAuditsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("audits")
    .select("*, profiles(email)")
    .order("updated_at", { ascending: false });

  const audits: AdminAuditRow[] = ((data ?? []) as AuditWithProfile[]).map((audit) => ({
    id: audit.id,
    business_name: audit.business_name,
    client_email: audit.profiles?.email ?? "-",
    completed_at: audit.completed_at,
    updated_at: audit.updated_at,
    final_score: audit.final_score,
    status: audit.status,
    viewed_by_admin: audit.viewed_by_admin,
  }));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Administration
        </p>
        <h1 className="mt-2 font-serif text-4xl text-primary">Audits</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary">
          Consultation des audits en cours et termines, avec signalement des rapports non lus.
        </p>
      </header>

      <Card className="overflow-hidden">
        <AuditsTable audits={audits} />
      </Card>
    </div>
  );
}
