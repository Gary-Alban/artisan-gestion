import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export function LegalPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main>
      <section className="bg-primary text-white">
        <SiteHeader />
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-36">
          <Link
            href="/"
            className="inline-flex text-sm font-semibold text-accent transition hover:text-accent/80"
          >
            Retour accueil
          </Link>
          <div className="mt-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Informations juridiques
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">{title}</h1>
            <p className="mt-6 text-lg leading-8 text-white/74">{description}</p>
          </div>
        </div>
      </section>

      <section className="bg-page py-16 md:py-24">
        <article className="mx-auto max-w-4xl px-6">
          <div className="border-t-4 border-accent bg-white p-6 shadow-sm sm:p-10 md:p-12">
            <div className="space-y-10 leading-7 text-secondary [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:leading-tight [&_h2]:text-primary [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-primary [&_li]:pl-1 [&_p]:max-w-3xl [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
              {children}
            </div>
          </div>
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2>{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function LegalNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-accent bg-page px-5 py-4 text-sm leading-6 text-secondary">
      {children}
    </div>
  );
}
