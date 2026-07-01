"use client";

import { motion, useReducedMotion } from "framer-motion";
import { easeStone } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The hero gesture: a human name resolves from blur to sharp over ~1.6s, its
 * letters tightening and gilding as a life "comes into focus"; a hairline gold
 * clasp-line then draws itself beneath, like closing a keepsake box.
 */
export function InscribedName({
  name,
  years,
  className,
}: {
  name: string;
  years?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className={cn("text-center", className)}>
      <motion.h1
        className="font-display text-[clamp(3.5rem,9vw,7.5rem)] leading-[1.02] tracking-[-0.02em] text-forest-deep"
        initial={
          reduce
            ? { opacity: 0 }
            : { opacity: 0, filter: "blur(14px)", letterSpacing: "0.06em" }
        }
        animate={
          reduce
            ? { opacity: 1 }
            : { opacity: 1, filter: "blur(0px)", letterSpacing: "-0.02em" }
        }
        transition={{ duration: reduce ? 0.5 : 1.6, ease: easeStone }}
      >
        {name}
      </motion.h1>

      <svg
        aria-hidden
        viewBox="0 0 320 2"
        fill="none"
        preserveAspectRatio="none"
        className="mx-auto mt-7 h-[2px] w-[min(320px,62%)]"
      >
        <motion.line
          x1="0"
          y1="1"
          x2="320"
          y2="1"
          stroke="url(#clasp-line)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: reduce ? 0.3 : 0.9,
            ease: easeStone,
            delay: reduce ? 0.2 : 1.3,
          }}
        />
        <defs>
          <linearGradient
            id="clasp-line"
            x1="0"
            x2="320"
            y1="0"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#8a6e4d" stopOpacity="0" />
            <stop offset="0.5" stopColor="#8a6e4d" />
            <stop offset="1" stopColor="#8a6e4d" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {years ? (
        <motion.p
          className="mt-6 font-display text-lg tracking-wide text-foreground-muted"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: easeStone, delay: reduce ? 0.3 : 1.9 }}
        >
          {years}
        </motion.p>
      ) : null}
    </div>
  );
}
