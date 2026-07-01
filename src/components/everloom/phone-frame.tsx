import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A light phone mockup frame for app previews. */
export function PhoneFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full max-w-[264px] rounded-[2.4rem] border-[7px] border-[#2f3a2b] bg-cream shadow-[0_30px_60px_-25px_rgba(60,75,54,0.55)]",
        className,
      )}
    >
      <div className="absolute left-1/2 top-2.5 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-[#2f3a2b]/40" />
      <div className="h-full overflow-hidden rounded-[1.9rem] bg-cream pt-7">
        {children}
      </div>
    </div>
  );
}
