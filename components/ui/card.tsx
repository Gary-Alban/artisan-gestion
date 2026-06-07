import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-primary/10 bg-white p-6 shadow-sm transition duration-300",
        className,
      )}
      {...props}
    />
  );
}
