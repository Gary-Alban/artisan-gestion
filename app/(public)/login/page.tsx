import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { BrandLogo } from "@/components/brand-logo";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <Link href="/" aria-label="Accueil Artisan Gestion">
          <BrandLogo className="mb-8 w-40" priority />
        </Link>
        <h1 className="font-serif text-3xl text-primary">Connexion</h1>
        <p className="mt-2 text-sm text-secondary">
          Accedez a votre espace d'audit pre-acquisition.
        </p>
        <div className="mt-6">
          <Suspense>
            <AuthForm mode="login" />
          </Suspense>
        </div>
        <div className="mt-5 flex justify-between text-sm text-secondary">
          <Link href="/signup" className="underline">Creer un compte</Link>
          <Link href="/forgot-password" className="underline">Mot de passe oublie</Link>
        </div>
      </Card>
    </main>
  );
}
