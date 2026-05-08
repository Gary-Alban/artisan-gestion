"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthFormProps = {
  mode: "login" | "signup" | "forgot";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");
    const supabase = createClient();
    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (error) throw error;
        router.push(searchParams.get("redirect") || "/dashboard");
        router.refresh();
      }

      if (mode === "signup") {
        if (!acceptedTerms) {
          setMessage("Vous devez accepter les CGU pour creer votre compte.");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        setMessage("Compte cree. Confirmez votre email avant de vous connecter.");
      }

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) throw error;
        setMessage("Un lien de reinitialisation vient de vous etre envoye.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === "signup" && (
        <label className="block text-sm font-medium text-primary">
          Nom complet
          <Input value={fullName} onChange={(event) => setFullName(event.target.value)} />
        </label>
      )}
      <label className="block text-sm font-medium text-primary">
        Email
        <Input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      {mode !== "forgot" && (
        <label className="block text-sm font-medium text-primary">
          Mot de passe
          <Input
            required
            minLength={8}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
      )}
      {mode === "signup" && (
        <label className="flex items-start gap-2 text-sm text-secondary">
          <input
            required
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            className="mt-1"
          />
          <span>
            J'accepte les <Link className="underline" href="/cgu">CGU</Link> et la{" "}
            <Link className="underline" href="/politique-confidentialite">
              politique de confidentialite
            </Link>
            .
          </span>
        </label>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {mode === "login" && "Se connecter"}
        {mode === "signup" && "Creer mon compte"}
        {mode === "forgot" && "Recevoir le lien"}
      </Button>
      {message && <p className="text-sm text-secondary">{message}</p>}
    </form>
  );
}
