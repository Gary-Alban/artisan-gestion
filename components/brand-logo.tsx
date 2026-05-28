import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "light" | "dark";
  className?: string;
  priority?: boolean;
};

export function BrandLogo({
  variant = "light",
  className,
  priority = false,
}: BrandLogoProps) {
  const isDark = variant === "dark";

  return (
    <Image
      src={isDark ? "/logo-ag-marine-crop.png" : "/logo-ag-clair-transparent.png"}
      alt="Artisan Gestion - Faconnez votre reussite"
      width={isDark ? 1200 : 820}
      height={isDark ? 760 : 560}
      priority={priority}
      className={cn("h-auto w-36 object-contain", className)}
    />
  );
}
