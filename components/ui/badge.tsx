import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "success" | "warning" | "danger";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        variant === "default" && "border-primary/10 bg-primary/5 text-primary",
        variant === "secondary" && "border-secondary/15 bg-secondary/8 text-secondary",
        variant === "success" && "border-teal/20 bg-teal/10 text-teal",
        variant === "warning" && "border-accent/40 bg-accent/15 text-primary",
        variant === "danger" && "border-red-200 bg-red-50 text-red-800",
        className,
      )}
      {...props}
    />
  );
}
