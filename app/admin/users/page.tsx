import { requireAdmin } from "@/lib/admin";
import type { Audit, Profile } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { UsersTable, type AdminUserRow } from "./users-table";

export default async function AdminUsersPage() {
  const { supabase } = await requireAdmin();
  const [{ data: profiles }, { data: audits }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, is_active, is_admin, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("audits").select("id, user_id"),
  ]);

  const auditCountByUser = new Map<string, number>();
  ((audits ?? []) as Pick<Audit, "id" | "user_id">[]).forEach((audit) => {
    auditCountByUser.set(audit.user_id, (auditCountByUser.get(audit.user_id) ?? 0) + 1);
  });

  const users: AdminUserRow[] = ((profiles ?? []) as Profile[]).map((profile) => ({
    id: profile.id,
    email: profile.email,
    created_at: profile.created_at,
    is_active: profile.is_active,
    is_admin: profile.is_admin,
    audit_count: auditCountByUser.get(profile.id) ?? 0,
  }));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          Administration
        </p>
        <h1 className="mt-2 font-serif text-4xl text-primary">Utilisateurs</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary">
          Activation des comptes clients et suivi du nombre d'audits par utilisateur.
        </p>
      </header>

      <Card className="overflow-hidden">
        <UsersTable users={users} />
      </Card>
    </div>
  );
}
