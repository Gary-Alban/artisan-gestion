import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-primary/10 bg-primary py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 text-sm md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" aria-label="Accueil Artisan Gestion">
            <BrandLogo variant="dark" className="w-32" />
          </Link>
          <p className="mt-2 text-white/70">Façonnez votre réussite</p>
          <p className="mt-1 text-white/50">
            © {new Date().getFullYear()} Artisan Gestion. Tous droits réservés.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-white/75">
          <Link href="/mentions-legales">Mentions legales</Link>
          <Link href="/cgu">CGU</Link>
          <Link href="/politique-confidentialite">Confidentialite</Link>
        </nav>
      </div>
    </footer>
  );
}
