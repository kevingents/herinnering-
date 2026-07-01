import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-xl border border-border bg-surface px-4 py-2 font-body text-base text-foreground shadow-[inset_0_1px_0_rgba(237,230,216,0.03)] transition-colors placeholder:text-foreground-muted/70 focus-visible:border-gold/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
