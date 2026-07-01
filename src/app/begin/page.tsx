import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Beginnen",
  description:
    "Begin met het bewaren van jouw levensverhaal. We openen binnenkort.",
};

export default function BeginPage() {
  return (
    <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center">
      <span
        aria-hidden
        className="mb-12 block size-2.5 rounded-full bg-amber shadow-[0_0_44px_14px_rgba(224,184,118,0.32)] motion-safe:animate-breathe"
      />

      <span className="text-meta">Levend Graf</span>
      <h1 className="mt-6 max-w-xl font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.12] tracking-[-0.015em] text-foreground">
        Het begin van een heel leven
      </h1>
      <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-foreground-secondary">
        We bouwen aan een rustige, waardige plek om jouw herinneringen, stem en
        verhalen te bewaren. Binnenkort kun je hier beginnen.
      </p>

      <Link
        href="/"
        className={cn(buttonVariants({ variant: "outline" }), "mt-12")}
      >
        <ArrowLeft className="size-4" />
        Terug
      </Link>
    </main>
  );
}
