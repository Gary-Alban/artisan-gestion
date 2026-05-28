"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewAuditForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const normalizedBusinessName = businessName.trim();

    if (!normalizedBusinessName) {
      setError("Veuillez renseigner le nom du fonds.");
      return;
    }

    setIsLoading(true);
    setError("");
    const supabase = createClient();

    try {
      const { data, error: insertError } = await supabase
        .from("audits")
        .insert({ user_id: userId, business_name: normalizedBusinessName })
        .select("id")
        .single();

      if (insertError) {
        setError("Impossible de creer l'audit pour le moment. Reessayez dans quelques instants.");
        return;
      }

      if (!data?.id) {
        setError("L'audit a ete cree, mais son identifiant est introuvable. Rechargez le tableau de bord.");
        return;
      }

      router.push(`/audit/${data.id}`);
    } catch {
      setError("Connexion impossible. Verifiez votre reseau puis reessayez.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <label className="block text-sm font-medium text-primary">
        Nom du fonds
        <Input
          value={businessName}
          onChange={(event) => setBusinessName(event.target.value)}
        />
      </label>
      <Button type="submit" isLoading={isLoading} loadingLabel="Creation en cours...">
        Creer l'audit
      </Button>
      {error && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}
