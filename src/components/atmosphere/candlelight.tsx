"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * A soft pool of candlelight that trails the cursor with a lazy spring, lighting
 * the stone as it passes. On touch / reduced-motion it settles to a still warm
 * glow so the candle never dies and the grieving are never made to chase light.
 *
 * Rendered behind page content (z-0); page content sits on `relative z-10`.
 */
export function Candlelight() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 24, mass: 1 });
  const sy = useSpring(y, { stiffness: 60, damping: 24, mass: 1 });

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    x.set(window.innerWidth / 2);
    y.set(window.innerHeight * 0.4);
    if (!fine) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, x, y]);

  if (reduce) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(340px circle at 50% 38%, rgba(201,161,90,0.06), transparent 72%)",
        }}
      />
    );
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute left-0 top-0 -ml-[340px] -mt-[340px] h-[680px] w-[680px] rounded-full will-change-transform"
        style={{ x: sx, y: sy, mixBlendMode: "screen" }}
      >
        <div
          className="h-full w-full motion-safe:animate-breathe"
          style={{
            background:
              "radial-gradient(circle, rgba(201,161,90,0.09) 0%, rgba(201,161,90,0.035) 38%, transparent 70%)",
          }}
        />
      </motion.div>
    </div>
  );
}
