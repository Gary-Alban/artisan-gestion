import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-primary/10 bg-primary py-9 text-white">
      <div className="section-shell flex flex-col gap-6 text-sm md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" aria-label="Accueil Artisan Gestion">
            <BrandLogo variant="dark" className="w-32" />
          </Link>
          <p className="mt-2 text-white/70">Façonnez votre réussite</p>
          <p className="mt-1 text-white/50">
            © {new Date().getFullYear()} Artisan Gestion. Tous droits réservés.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-3 text-white/75">
          <Link className="transition hover:text-accent" href="/mentions-legales">Mentions légales</Link>
          <Link className="transition hover:text-accent" href="/cgu">CGV / CGU</Link>
          <Link className="transition hover:text-accent" href="/politique-confidentialite">Confidentialité</Link>
        </nav>
      </div>
    </footer>
  );
}
