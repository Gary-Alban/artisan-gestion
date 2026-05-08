import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { BrandLogo } from "@/components/brand-logo";
import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <Link href="/" aria-label="Accueil Artisan Gestion">
          <BrandLogo className="mb-8 w-40" priority />
        </Link>
        <h1 className="font-serif text-3xl text-primary">Mot de passe oublie</h1>
        <p className="mt-2 text-sm text-secondary">
          Recevez un lien Supabase de reinitialisation.
        </p>
        <div className="mt-6">
          <Suspense>
            <AuthForm mode="forgot" />
          </Suspense>
        </div>
        <p className="mt-5 text-sm text-secondary">
          <Link href="/login" className="underline">Retour connexion</Link>
        </p>
      </Card>
    </main>
  );
}
