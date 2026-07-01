import Link from "next/link";
import { Reveal } from "@/components/brand/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Threshold() {
  return (
    <section
      id="begin"
      className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 py-32 text-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 60%, rgba(201,161,90,0.05), transparent 70%)",
        }}
      />

      {/* you leave the way you came in — the lone ember */}
      <span
        aria-hidden
        className="mb-14 block size-2.5 rounded-full bg-amber shadow-[0_0_44px_14px_rgba(224,184,118,0.32)] motion-safe:animate-breathe"
      />

      <Reveal className="flex max-w-2xl flex-col items-center gap-8">
        <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.12] tracking-[-0.015em] text-foreground">
          Wanneer jij er ooit niet meer bent,
          <br />
          blijft jouw verhaal bestaan.
        </h2>
        <p className="max-w-xl font-body text-lg leading-relaxed text-foreground-secondary">
          Begin vandaag met bewaren. Rustig, in je eigen tempo — voor wie er na
          jou nog doorheen wil lopen.
        </p>
        <Link
          href="/begin"
          className={cn(buttonVariants({ variant: "gold", size: "lg" }))}
        >
          Begin jouw nalatenschap
        </Link>
      </Reveal>
    </section>
  );
}
