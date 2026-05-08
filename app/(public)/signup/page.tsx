import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { BrandLogo } from "@/components/brand-logo";
import { Card } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <Link href="/" aria-label="Accueil Artisan Gestion">
          <BrandLogo className="mb-8 w-40" priority />
        </Link>
        <h1 className="font-serif text-3xl text-primary">Inscription</h1>
        <p className="mt-2 text-sm text-secondary">
          Votre compte sera active apres validation du paiement Calendly.
        </p>
        <div className="mt-6">
          <Suspense>
            <AuthForm mode="signup" />
          </Suspense>
        </div>
        <p className="mt-5 text-sm text-secondary">
          Deja inscrit ? <Link href="/login" className="underline">Connexion</Link>
        </p>
      </Card>
    </main>
  );
}
