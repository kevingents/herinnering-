"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { easeStone, revealViewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Scroll-reveal: content fades + rises once as it enters, chiseled into place. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn(className)}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{ duration: 0.6, ease: easeStone, delay }}
    >
      {children}
    </motion.div>
  );
}
