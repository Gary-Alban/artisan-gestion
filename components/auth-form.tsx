"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AuthFormProps = {
  mode: "login" | "signup" | "forgot" | "reset";
};

type MessageType = "error" | "success";

type SupabaseLikeError = {
  message?: string;
  code?: string;
  status?: number;
  name?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getAuthErrorMessage(error: unknown, mode: AuthFormProps["mode"]) {
  const authError = error as SupabaseLikeError;
  const rawMessage = authError.message?.toLowerCase() ?? "";
  const code = authError.code?.toLowerCase() ?? "";
  const name = authError.name?.toLowerCase() ?? "";
  const status = authError.status;

  if (
    code.includes("invalid_credentials") ||
    rawMessage.includes("invalid login credentials") ||
    rawMessage.includes("invalid credentials")
  ) {
    return "Aucun compte ne correspond a cet email ou le mot de passe est incorrect.";
  }

  if (
    code.includes("email_not_confirmed") ||
    rawMessage.includes("email not confirmed") ||
    rawMessage.includes("email address not confirmed")
  ) {
    return "Votre compte a ete cree, mais la connexion automatique a echoue. Essayez de vous connecter avec vos identifiants.";
  }

  if (rawMessage.includes("user already registered") || rawMessage.includes("already registered")) {
    return "Un compte existe deja avec cet email. Connectez-vous ou utilisez le lien de mot de passe oublie.";
  }

  if (rawMessage.includes("password should be at least") || rawMessage.includes("weak password")) {
    return "Le mot de passe doit contenir au moins 8 caracteres.";
  }

  if (
    code.includes("same_password") ||
    rawMessage.includes("new password should be different") ||
    rawMessage.includes("different from the old password")
  ) {
    return "Choisissez un mot de passe different de l'ancien.";
  }

  if (rawMessage.includes("invalid email")) {
    return "L'adresse email n'est pas valide.";
  }

  if (
    code.includes("otp_expired") ||
    code.includes("bad_code_verifier") ||
    code.includes("session_not_found") ||
    name.includes("authsessionmissingerror") ||
    rawMessage.includes("session missing") ||
    rawMessage.includes("invalid refresh token") ||
    rawMessage.includes("token has expired") ||
    rawMessage.includes("invalid or expired")
  ) {
    return "Votre lien n'est plus valide ou a expire. Demandez un nouveau lien pour continuer.";
  }

  if (status === 429 || rawMessage.includes("rate limit") || rawMessage.includes("too many")) {
    return "Trop de tentatives. Patientez quelques minutes avant de reessayer.";
  }

  if (
    rawMessage.includes("failed to fetch") ||
    rawMessage.includes("network") ||
    rawMessage.includes("fetch")
  ) {
    return "Connexion impossible. Verifiez votre reseau puis reessayez.";
  }

  if (mode === "forgot") {
    return "Impossible d'envoyer le lien de reinitialisation pour le moment. Reessayez dans quelques instants.";
  }

  if (mode === "signup") {
    return "Impossible de creer le compte pour le moment. Verifiez les informations puis reessayez.";
  }

  if (mode === "reset") {
    return "Impossible de changer le mot de passe pour le moment. Demandez un nouveau lien si celui-ci a expire.";
  }

  return "Impossible de vous connecter pour le moment. Reessayez dans quelques instants.";
}

function getInitialSearchMessage(searchParams: ReturnType<typeof useSearchParams>) {
  return (
    searchParams.get("error") ??
    searchParams.get("error_description") ??
    searchParams.get("message") ??
    ""
  );
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState(getInitialSearchMessage(searchParams));
  const [messageType, setMessageType] = useState<MessageType>("error");
  const [isLoading, setIsLoading] = useState(false);

  function showMessage(type: MessageType, value: string) {
    setMessageType(type);
    setMessage(value);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const supabase = createClient();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedFullName = fullName.trim();

    if (mode !== "reset") {
      if (!normalizedEmail) {
        showMessage("error", "Veuillez renseigner votre email.");
        return;
      }

      if (!isValidEmail(normalizedEmail)) {
        showMessage("error", "L'adresse email n'est pas valide.");
        return;
      }
    }

    if (mode !== "forgot" && !password) {
      showMessage("error", "Veuillez renseigner votre mot de passe.");
      return;
    }

    if ((mode === "signup" || mode === "reset") && password.length < 8) {
      showMessage("error", "Le mot de passe doit contenir au moins 8 caracteres.");
      return;
    }

    if (mode === "signup" && !normalizedFullName) {
      showMessage("error", "Veuillez renseigner votre nom complet.");
      return;
    }

    if (mode === "signup" && !acceptedTerms) {
      showMessage("error", "Vous devez accepter les CGU pour creer votre compte.");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (error) throw error;
        const redirectTo = searchParams.get("redirect");
        const { data: profile } = data.user
          ? await supabase
              .from("profiles")
              .select("is_admin")
              .eq("id", data.user.id)
              .single()
          : { data: null };

        router.push(redirectTo || (profile?.is_admin ? "/admin" : "/dashboard"));
        router.refresh();
      }

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: { data: { full_name: normalizedFullName } },
        });
        if (error) throw error;

        if (data.user && data.user.identities?.length === 0) {
          showMessage("error", "Un compte existe deja avec cet email. Connectez-vous ou utilisez le lien de mot de passe oublie.");
          return;
        }

        showMessage("success", "Compte cree. Vous pouvez maintenant vous connecter.");
      }

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
          redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        });
        if (error) throw error;
        showMessage("success", "Si un compte existe avec cet email, un lien de reinitialisation vient d'etre envoye.");
      }

      if (mode === "reset") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        showMessage("success", "Votre mot de passe a ete mis a jour.");
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      showMessage("error", getAuthErrorMessage(error, mode));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {mode === "signup" && (
        <label className="block text-sm font-medium text-primary">
          Nom complet
          <Input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
          />
        </label>
      )}
      {mode !== "reset" && (
        <label className="block text-sm font-medium text-primary">
          Email
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
        </label>
      )}
      {mode !== "forgot" && (
        <label className="block text-sm font-medium text-primary">
          {mode === "reset" ? "Nouveau mot de passe" : "Mot de passe"}
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </label>
      )}
      {mode === "signup" && (
        <label className="flex items-start gap-2 text-sm text-secondary">
          <input
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
      <Button type="submit" className="w-full" isLoading={isLoading} loadingLabel="Veuillez patienter...">
        {mode === "login" && "Se connecter"}
        {mode === "signup" && "Creer mon compte"}
        {mode === "forgot" && "Recevoir le lien"}
        {mode === "reset" && "Changer le mot de passe"}
      </Button>
      {message && (
        <p
          role={messageType === "error" ? "alert" : "status"}
          aria-live="polite"
          className={cn(
            "rounded-md border px-3 py-2 text-sm",
            messageType === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-800",
          )}
        >
          {message}
        </p>
      )}
    </form>
  );
}
