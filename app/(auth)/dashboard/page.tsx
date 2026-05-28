import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileText,
  Gauge,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Audit, Profile } from "@/lib/types";
import { BrandLogo } from "@/components/brand-logo";
import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils";

function readMetadataName(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") return null;
  const data = metadata as Record<string, unknown>;

  return (
    data.first_name ??
    data.given_name ??
    data.full_name ??
    data.name ??
    data.display_name ??
    null
  );
}

function getFirstName(...names: unknown[]) {
  for (const name of names) {
    if (typeof name !== "string") continue;
    const firstName = name.trim().split(/\s+/)[0];
    if (firstName) return firstName;
  }

  return null;
}

function formatDate(value: string | null) {
  if (!value) return "Date inconnue";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getScoreTone(score: number | null) {
  if (score === null) {
    return {
      label: "À finaliser",
      className: "border-primary/10 bg-primary/5 text-secondary",
      barClassName: "bg-primary/20",
    };
  }

  if (score >= 75) {
    return {
      label: "Solide",
      className: "border-teal/20 bg-teal/10 text-teal",
      barClassName: "bg-teal",
    };
  }

  if (score >= 50) {
    return {
      label: "À surveiller",
      className: "border-accent/40 bg-accent/15 text-primary",
      barClassName: "bg-accent",
    };
  }

  return {
    label: "Risque élevé",
    className: "border-red-200 bg-red-50 text-red-800",
    barClassName: "bg-red-500",
  };
}

export default async function DashboardPage() {
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
  const currentProfile = profile as Profile | null;
  const { data: audits } = currentProfile?.is_active
    ? await supabase
        .from("audits")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
    : { data: [] };
  const items = (audits ?? []) as Audit[];
  const firstName = getFirstName(
    currentProfile?.full_name,
    readMetadataName(user.user_metadata),
    ...((user.identities ?? []).map((identity) =>
      readMetadataName(identity.identity_data),
    )),
  );
  const completedAudits = items.filter((audit) => audit.status === "completed").length;
  const inProgressAudits = items.length - completedAudits;
  const latestAudit = items[0] ?? null;
  const scoredAudits = items.filter((audit) => typeof audit.final_score === "number");
  const averageScore = scoredAudits.length
    ? Math.round(
        scoredAudits.reduce((total, audit) => total + (audit.final_score ?? 0), 0) /
          scoredAudits.length,
      )
    : null;
  const latestAuditHref = latestAudit ? `/audit/${latestAudit.id}` : "/audit/new";

  const metrics = [
    {
      label: "Audits total",
      value: items.length,
      detail: items.length > 1 ? "dossiers suivis" : "dossier suivi",
      icon: ClipboardList,
    },
    {
      label: "En cours",
      value: inProgressAudits,
      detail: "à reprendre",
      icon: Activity,
    },
    {
      label: "Terminés",
      value: completedAudits,
      detail: "analyses finalisées",
      icon: CheckCircle2,
    },
    {
      label: "Score moyen",
      value: averageScore === null ? "-" : `${averageScore}%`,
      detail: scoredAudits.length ? "sur audits scorés" : "après finalisation",
      icon: Gauge,
    },
  ];

  return (
    <main className="min-h-screen bg-page">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="flex flex-col gap-5 rounded-lg border border-primary/10 bg-white/85 px-4 py-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-4">
            <BrandLogo className="w-32 sm:w-36" priority />
            <div className="hidden h-9 w-px bg-primary/10 sm:block" />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Espace client
              </p>
              <p className="mt-1 text-sm font-semibold text-primary">Tableau de bord</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LogoutButton />
          </div>
        </header>

        <section className="overflow-hidden rounded-lg border border-primary/10 bg-primary text-white shadow-sm">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-10">
            <div className="flex min-h-64 flex-col justify-between gap-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                  Pilotage des audits
                </p>
                <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
                  {currentProfile?.is_active
                    ? firstName
                      ? `Bienvenue ${firstName}`
                      : "Bienvenue"
                    : "Tableau de bord"}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/76 sm:text-lg">
                  {currentProfile?.is_active
                    ? "Gardez une lecture claire de vos audits, reprenez les dossiers en cours et consultez vos résultats sans perdre de temps."
                    : "Votre espace est prêt. L'activation du compte permettra de démarrer et suivre vos audits."}
                </p>
              </div>

              {currentProfile?.is_active && (
                <div className="flex flex-wrap gap-3">
                  <Link href="/audit/new">
                    <Button variant="secondary" className="min-h-12 px-5 shadow-lg shadow-black/10">
                      <Plus size={18} /> Lancer un audit
                    </Button>
                  </Link>
                  {latestAudit && (
                    <Link
                      href={latestAuditHref}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/18 px-5 text-sm font-semibold text-white transition hover:border-accent/70 hover:text-accent"
                    >
                      Reprendre le dernier <ArrowUpRight size={17} />
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between gap-5 border-t border-white/12 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-white/10 text-accent">
                  <ShieldCheck size={24} />
                </div>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  Prochaine action
                </p>
                <h2 className="mt-3 font-serif text-3xl leading-tight">
                  {latestAudit
                    ? latestAudit.status === "completed"
                      ? "Consulter les résultats"
                      : "Continuer l'audit"
                    : currentProfile?.is_active
                      ? "Créer le premier audit"
                      : "Activation en attente"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  {latestAudit
                    ? `${latestAudit.business_name || "Fonds sans nom"} - mis à jour le ${formatDate(
                        latestAudit.updated_at,
                      )}`
                    : currentProfile?.is_active
                      ? "Démarrez un dossier pour suivre son avancement ici."
                      : "Votre accès sera activé après validation."}
                </p>
              </div>

              {currentProfile?.is_active && (
                <Link
                  href={latestAudit ? latestAuditHref : "/audit/new"}
                  className="group inline-flex items-center justify-between gap-4 rounded-md bg-white/9 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
                >
                  <span>{latestAudit ? "Ouvrir le dossier" : "Démarrer maintenant"}</span>
                  <ChevronRight
                    size={18}
                    className="text-accent transition group-hover:translate-x-1"
                  />
                </Link>
              )}
            </div>
          </div>
        </section>

        {currentProfile?.is_active && (
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map(({ label, value, detail, icon: Icon }) => (
              <div
                key={label}
                className="rounded-lg border border-primary/10 bg-white px-5 py-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-secondary">{label}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-primary">
                      {value}
                    </p>
                  </div>
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/5 text-primary">
                    <Icon size={20} />
                  </div>
                </div>
                <p className="mt-4 border-t border-primary/10 pt-3 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                  {detail}
                </p>
              </div>
            ))}
          </section>
        )}

        {!currentProfile?.is_active && (
          <Card className="border-accent/40 bg-accent/10 p-7 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-primary">
                <Clock3 size={22} />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-primary">
                  Votre compte est en attente d'activation.
                </h2>
                <p className="mt-2 max-w-2xl leading-7 text-secondary">
                  Si vous avez payé via Calendly, votre accès sera activé sous 24h.
                </p>
              </div>
            </div>
          </Card>
        )}

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Suivi
              </p>
              <h2 className="mt-2 font-serif text-3xl text-primary">Vos audits</h2>
            </div>
            {currentProfile?.is_active && items.length > 0 && (
              <p className="rounded-md border border-primary/10 bg-white px-3 py-2 text-sm text-secondary">
                {inProgressAudits} en cours / {completedAudits} terminé
                {completedAudits > 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="grid gap-4">
            {items.map((audit) => {
              const scoreTone = getScoreTone(audit.final_score);
              const scoreWidth =
                audit.final_score === null
                  ? 0
                  : Math.max(0, Math.min(100, Math.round(audit.final_score)));

              return (
                <Link key={audit.id} href={`/audit/${audit.id}`} className="group">
                  <Card className="overflow-hidden p-0 transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-md">
                    <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_220px]">
                      <div className="flex gap-4 p-5 sm:p-6">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                          <FileText size={22} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="min-w-0 font-serif text-2xl leading-tight text-primary">
                              {audit.business_name || "Fonds sans nom"}
                            </h3>
                            <span
                              className={
                                audit.status === "completed"
                                  ? "inline-flex items-center gap-1.5 rounded-md bg-teal/10 px-2.5 py-1 text-xs font-semibold text-teal"
                                  : "inline-flex items-center gap-1.5 rounded-md bg-accent/15 px-2.5 py-1 text-xs font-semibold text-primary"
                              }
                            >
                              {audit.status === "completed" ? (
                                <CheckCircle2 size={14} />
                              ) : (
                                <Clock3 size={14} />
                              )}
                              {audit.status === "completed" ? "Terminé" : "En cours"}
                            </span>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-secondary">
                            <span className="inline-flex items-center gap-2">
                              <CalendarDays size={16} />
                              Mis à jour le {formatDate(audit.updated_at)}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <Gauge size={16} />
                              {scoreTone.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-5 border-t border-primary/10 bg-page/55 p-5 lg:border-l lg:border-t-0">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                              Score
                            </p>
                            <span
                              className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold ${scoreTone.className}`}
                            >
                              {formatPercent(audit.final_score)}
                            </span>
                          </div>
                          <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary/10">
                            <div
                              className={`h-full rounded-full ${scoreTone.barClassName}`}
                              style={{ width: `${scoreWidth}%` }}
                            />
                          </div>
                        </div>
                        <ChevronRight
                          className="shrink-0 text-primary/40 transition group-hover:translate-x-1 group-hover:text-accent"
                          size={22}
                        />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
            {items.length === 0 && (
              <Card className="overflow-hidden p-0">
                <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
                  <div className="p-7 sm:p-8">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/5 text-primary">
                      <FileText size={22} />
                    </div>
                    <h3 className="mt-6 font-serif text-3xl leading-tight text-primary">
                      Aucun audit pour le moment
                    </h3>
                    <p className="mt-3 max-w-xl leading-7 text-secondary">
                      Lancez un premier audit pour retrouver ici son avancement, son statut et ses
                      résultats.
                    </p>
                  </div>
                  <div className="flex flex-col justify-between gap-5 border-t border-primary/10 bg-primary p-7 text-white lg:border-l lg:border-t-0 sm:p-8">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                        Démarrage
                      </p>
                      <p className="mt-3 text-sm leading-6 text-white/72">
                        Un audit structure vos points de vigilance et vous aide à prioriser les
                        décisions avant acquisition.
                      </p>
                    </div>
                    {currentProfile?.is_active && (
                      <Link href="/audit/new">
                        <Button variant="secondary" className="min-h-11 w-full px-5">
                          <Plus size={18} /> Créer un audit
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
