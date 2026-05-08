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
    setIsLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("audits")
      .insert({ user_id: userId, business_name: businessName })
      .select("id")
      .single();

    setIsLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    router.push(`/audit/${data.id}`);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-medium text-primary">
        Nom du fonds
        <Input
          required
          value={businessName}
          onChange={(event) => setBusinessName(event.target.value)}
        />
      </label>
      <Button type="submit" disabled={isLoading}>
        Creer l'audit
      </Button>
      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  );
}
