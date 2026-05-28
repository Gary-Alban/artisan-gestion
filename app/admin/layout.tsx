import Link from "next/link";
import { ArrowLeft, ClipboardList, LayoutDashboard, UsersRound } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { BrandLogo } from "@/components/brand-logo";
import { LogoutButton } from "@/components/logout-button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Utilisateurs", icon: UsersRound },
  { href: "/admin/audits", label: "Audits", icon: ClipboardList },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-page">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-b border-primary/10 bg-white/95 px-5 py-5 shadow-sm lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-6 lg:py-7">
          <div className="flex items-center justify-between gap-4 lg:block">
            <Link href="/admin" className="inline-flex">
              <BrandLogo className="w-32" priority />
            </Link>
            <div className="lg:hidden">
              <LogoutButton className="px-3" />
            </div>
          </div>
          <nav className="mt-5 flex gap-2 overflow-x-auto lg:mt-10 lg:flex-col lg:overflow-visible">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-semibold text-primary transition hover:bg-primary/5 lg:w-full"
              >
                <Icon size={18} className="text-accent" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 hidden border-t border-primary/10 pt-5 lg:mt-auto lg:block">
            <Link
              href="/dashboard"
              className="inline-flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-semibold text-secondary transition hover:bg-primary/5 hover:text-primary"
            >
              <ArrowLeft size={18} className="text-accent" />
              Espace client
            </Link>
            <LogoutButton className="mt-2 w-full justify-start px-3 text-secondary hover:text-primary" />
          </div>
        </aside>

        <section className="min-w-0 px-5 py-7 sm:px-7 lg:px-10 lg:py-10">
          {children}
        </section>
      </div>
    </main>
  );
}
