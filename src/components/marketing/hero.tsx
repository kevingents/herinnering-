"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { InscribedName } from "@/components/brand/inscribed-name";
import { AiDisclaimer } from "@/components/brand/ai-disclaimer";
import { buttonVariants } from "@/components/ui/button";
import { easeStone } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Hero() {
  const reduce = useReducedMotion();

  const enter = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: easeStone, delay: reduce ? 0 : delay },
  });

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-28 text-center">
      {/* soft vignette for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 30%, transparent 45%, rgba(6,7,8,0.65) 100%)",
        }}
      />

      {/* the breathing ember — abstract light, never a drawn candle */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[16%] -translate-x-1/2"
        initial={reduce ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: easeStone }}
      >
        <span className="block h-2.5 w-2.5 rounded-full bg-amber shadow-[0_0_44px_14px_rgba(224,184,118,0.34)] motion-safe:animate-breathe" />
      </motion.div>

      <div className="relative flex flex-col items-center gap-9">
        <InscribedName name="Willem de Vries" years="1948 – 2024" />

        <motion.div className="flex flex-col items-center gap-4" {...enter(1.9)}>
          <p className="font-body text-2xl leading-snug text-foreground sm:text-[1.7rem]">
            Een heel leven, om te bezoeken.
          </p>
          <p className="max-w-xl font-body text-lg italic leading-relaxed text-foreground-muted">
            Loop door een heel leven — verhalen, stemmen, brieven — verteld door
            een herinnering, niet door een verkoper.
          </p>
        </motion.div>

        <motion.div {...enter(2.3)}>
          <a
            href="#uitnodiging"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Kom binnen
          </a>
        </motion.div>
      </div>

      {/* honest, never hidden — anchored at the base, phrased as poetry */}
      <motion.div
        className="absolute inset-x-0 bottom-24 flex justify-center px-6"
        {...enter(2.7)}
      >
        <AiDisclaimer
          name="Willem"
          pronoun="hij"
          className="max-w-lg text-center"
        />
      </motion.div>

      {/* descent hint */}
      <motion.a
        href="#uitnodiging"
        aria-label="Verder"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-foreground-muted/70 transition-colors hover:text-gold"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: reduce ? 0 : 3.1 }}
      >
        <ChevronDown className="size-5 motion-safe:animate-bounce [animation-duration:2.4s]" />
      </motion.a>
    </section>
  );
}
