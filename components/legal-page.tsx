import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="mx-auto min-h-screen max-w-3xl px-6 py-14">
        <Link href="/" className="text-sm font-semibold text-primary underline">
          Retour accueil
        </Link>
        <h1 className="mt-8 font-serif text-4xl text-primary">{title}</h1>
        <div className="mt-6 space-y-4 leading-7 text-secondary">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
