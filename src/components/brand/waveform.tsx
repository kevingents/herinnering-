"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A warm amber voice-carving that breathes at ~0.3Hz — the felt sense that
 * "their voice is still here." Never a technical VU meter.
 */
export function Waveform({
  bars = 56,
  className,
}: {
  bars?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  // Deterministic, organic-looking heights (no randomness → no hydration drift).
  const heights = useMemo(
    () =>
      Array.from({ length: bars }, (_, i) => {
        const wave =
          0.35 +
          0.34 * Math.abs(Math.sin(i * 0.55)) +
          0.3 * Math.abs(Math.sin(i * 0.17 + 1.3));
        return Math.min(1, wave);
      }),
    [bars],
  );

  return (
    <div
      aria-hidden
      className={cn("flex h-16 items-center justify-center gap-[3px]", className)}
    >
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-amber/80"
          style={{ height: `${Math.round(h * 100)}%` }}
          initial={false}
          animate={
            reduce
              ? undefined
              : { scaleY: [1, 0.62 + h * 0.4, 1], opacity: [0.7, 1, 0.7] }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (i % 12) * 0.09,
                }
          }
        />
      ))}
    </div>
  );
}
