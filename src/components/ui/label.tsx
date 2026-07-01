import * as React from "react";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-meta select-none text-foreground-secondary",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
