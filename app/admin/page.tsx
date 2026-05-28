import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock3, FileText, UsersRound } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import type { Audit, Profile } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPercent } from "@/lib/utils";

type AuditWithProfile = Audit & {
  profiles: Pick<Profile, "email"> | null;
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const [{ data: profiles }, { data: audits }, { data: latestAudits }] = await Promise.all([
    supabase.from("profiles").select("id, email, is_active, is_admin, created_at"),
    supabase.from("audits").select("*"),
    supabase
      .from("audits")
      .select("*, profiles(email)")
      .eq("status", "completed")
      .order("completed_at", { ascending: false, nullsFirst: false })
      .limit(5),
  ]);

  const users = (profiles ?? []) as Profile[];
  const auditRows = (audits ?? []) as Audit[];
  const completedAudits = auditRows.filter((audit) => audit.status === "completed");
  const inProgressAudits = auditRows.filter((audit) => audit.status === "in_progress");
  const newAudits = completedAudits.filter((audit) => !audit.viewed_by_admin).length;
  const metrics = [
    {
      label: "Utilisateurs",
      value: users.length,
      detail: "comptes crees",
      icon: UsersRound,
    },
    {
      label: "Actifs",
      value: users.filter((profile) => profile.is_active).length,
      detail: "comptes actives",
      icon: CheckCircle2,
    },
    {
      label: "Audits termines",
      value: completedAudits.length,
      detail: "rapports finalises",
      icon: FileText,
    },
    {
      label: "En cours",
      value: inProgressAudits.length,
      detail: "questionnaires ouverts",
      icon: Clock3,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Administration
          </p>
          <h1 className="mt-2 font-serif text-4xl text-primary">Dashboard</h1>
        </div>
        <Badge variant={newAudits ? "warning" : "secondary"} className="w-fit">
          {newAudits} nouvel{newAudits > 1 ? "s" : ""} audit{newAudits > 1 ? "s" : ""}
        </Badge>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, detail, icon: Icon }) => (
          <Card key={label} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-secondary">{label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-primary">
                  {value}
                </p>
              </div>
              <div className="grid size-10 shrink-0 place-items-center rounded-md bg-primary/5 text-primary">
                <Icon size={20} />
              </div>
            </div>
            <p className="mt-4 border-t border-primary/10 pt-3 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
              {detail}
            </p>
          </Card>
        ))}
      </section>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-primary/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl text-primary">Derniers audits termines</h2>
            <p className="mt-1 text-sm text-secondary">Acces rapide aux rapports clients.</p>
          </div>
          <Link
            href="/admin/audits"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-accent"
          >
            Voir tous <ArrowUpRight size={16} />
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-primary/5">
              <TableHead>Fonds</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="text-right">Acces</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {((latestAudits ?? []) as AuditWithProfile[]).map((audit) => (
              <TableRow key={audit.id}>
                <TableCell className="font-semibold text-primary">
                  <span>{audit.business_name || "Fonds sans nom"}</span>
                  {!audit.viewed_by_admin && (
                    <Badge variant="warning" className="ml-2">
                      Nouveau
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{audit.profiles?.email ?? "-"}</TableCell>
                <TableCell>{formatDate(audit.completed_at)}</TableCell>
                <TableCell>{formatPercent(audit.final_score)}</TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/admin/audits/${audit.id}`}
                    className="font-semibold text-primary transition hover:text-accent"
                  >
                    Ouvrir
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {(latestAudits ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Aucun audit termine pour le moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
