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
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-primary text-white hover:bg-primary/92",
        variant === "secondary" && "bg-accent text-primary hover:bg-accent/90",
        variant === "ghost" && "text-primary hover:bg-primary/8",
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
