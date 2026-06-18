"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type DeleteAuditButtonProps = {
  auditId: string;
  auditName: string;
};

export function DeleteAuditButton({ auditId, auditName }: DeleteAuditButtonProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const label = auditName.trim() || "cet audit";
    const confirmed = window.confirm(
      `Supprimer definitivement ${label} ? Toutes les reponses associees seront aussi supprimees.`,
    );

    if (!confirmed) return;

    setMessage(null);
    startTransition(async () => {
      const response = await fetch(`/api/audit/${auditId}`, { method: "DELETE" });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setMessage(payload?.error ?? "Impossible de supprimer cet audit.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        variant="ghost"
        isLoading={isPending}
        loadingLabel="Suppression"
        onClick={handleDelete}
        className="min-h-10 px-3 text-red-700 hover:bg-red-50 hover:text-red-800"
        aria-label={`Supprimer l'audit ${auditName}`}
      >
        <Trash2 size={16} />
        Supprimer
      </Button>
      {message && (
        <p role="alert" className="max-w-64 text-right text-xs font-semibold text-red-700">
          {message}
        </p>
      )}
    </div>
  );
}
