"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 24) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-accent/15 bg-primary/92 backdrop-blur transition-transform duration-300 ease-out",
        isVisible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <header className="section-shell flex items-center justify-between py-2.5 sm:py-3">
        <Link href="/" aria-label="Accueil Artisan Gestion">
          <BrandLogo variant="dark" priority className="w-20 sm:w-28" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/72 md:flex">
          <Link href="#process" className="transition hover:text-accent">
            Comment ça marche
          </Link>
          <Link href="#categories" className="transition hover:text-accent">
            Catégories
          </Link>
          <Link href="#calendly" className="transition hover:text-accent">
            Contact
          </Link>
        </nav>
        <Link
          href="/login"
          className="premium-action rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-primary transition duration-300 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-lg hover:shadow-black/10"
        >
          Se connecter
        </Link>
      </header>
    </div>
  );
}
