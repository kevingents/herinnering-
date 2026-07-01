import { cn } from "@/lib/utils";

/** An inlaid gold seam — a divider that fades to transparent at both ends. */
function Seam({ className }: { className?: string }) {
  return <div aria-hidden className={cn("seam mx-auto w-3/5", className)} />;
}

export { Seam };
