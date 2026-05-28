"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatPercent } from "@/lib/utils";

export type AdminAuditRow = {
  id: string;
  business_name: string | null;
  client_email: string;
  completed_at: string | null;
  updated_at: string;
  final_score: number | null;
  status: "in_progress" | "completed";
  viewed_by_admin: boolean;
};

const filters = [
  { value: "all", label: "Tous" },
  { value: "in_progress", label: "En cours" },
  { value: "completed", label: "Termines" },
] as const;

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function AuditsTable({ audits }: { audits: AdminAuditRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const filteredAudits = useMemo(() => {
    if (filter === "all") return audits;
    return audits.filter((audit) => audit.status === filter);
  }, [audits, filter]);

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-md border border-primary/10 bg-white p-1 shadow-sm">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={cn(
              "min-h-9 rounded px-3 text-sm font-semibold transition",
              filter === item.value
                ? "bg-primary text-white"
                : "text-secondary hover:bg-primary/5 hover:text-primary",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fonds</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Completion</TableHead>
            <TableHead>Score global</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAudits.map((audit) => (
            <TableRow
              key={audit.id}
              tabIndex={0}
              role="link"
              onClick={() => router.push(`/admin/audits/${audit.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  router.push(`/admin/audits/${audit.id}`);
                }
              }}
              className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <TableCell className="font-semibold text-primary">
                {audit.business_name || "Fonds sans nom"}
                {!audit.viewed_by_admin && audit.status === "completed" && (
                  <Badge variant="warning" className="ml-2">
                    Nouveau
                  </Badge>
                )}
              </TableCell>
              <TableCell>{audit.client_email}</TableCell>
              <TableCell>
                {formatDate(audit.status === "completed" ? audit.completed_at : audit.updated_at)}
              </TableCell>
              <TableCell>{formatPercent(audit.final_score)}</TableCell>
              <TableCell>
                <Badge variant={audit.status === "completed" ? "success" : "warning"}>
                  {audit.status === "completed" ? "Termine" : "En cours"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {filteredAudits.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Aucun audit pour ce filtre.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
