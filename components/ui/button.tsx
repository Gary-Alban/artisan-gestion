import * as React from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
  loadingLabel?: string;
};

export function Button({
  className,
  children,
  disabled,
  isLoading = false,
  loadingLabel,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
        variant === "primary" && "bg-primary text-white shadow-sm hover:bg-primary/92 hover:shadow-md",
        variant === "secondary" && "bg-accent text-primary shadow-sm hover:bg-accent/90 hover:shadow-md",
        variant === "ghost" && "text-primary hover:bg-primary/8 hover:shadow-none",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <LoaderCircle aria-hidden="true" size={17} className="shrink-0 animate-spin" />
      ) : null}
      {isLoading && loadingLabel ? loadingLabel : children}
    </button>
  );
}
