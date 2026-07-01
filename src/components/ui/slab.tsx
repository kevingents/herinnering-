import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A "slab" — the card primitive. Content inscribed into stone that floats a
 * millimetre off the wall (soft drop shadow + inset top highlight).
 */
function Slab({
  className,
  featured = false,
  ...props
}: React.ComponentProps<"div"> & { featured?: boolean }) {
  return (
    <div
      className={cn(
        "slab p-8 sm:p-10",
        featured && "shadow-[var(--shadow-slab),var(--shadow-ambient-gold),inset_0_1px_0_rgba(237,230,216,0.04)]",
        className,
      )}
      {...props}
    />
  );
}

export { Slab };
