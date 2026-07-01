import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Slab } from "@/components/ui/slab";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Aanmelden",
  description: "Meld je aan bij Everloom.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  return (
    <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <div className="mb-10 flex flex-col items-center text-center">
          <span
            aria-hidden
            className="mb-8 block size-2.5 rounded-full bg-amber shadow-[0_0_40px_12px_rgba(224,184,118,0.32)] motion-safe:animate-breathe"
          />
          <h1 className="font-display text-[clamp(2rem,5vw,2.75rem)] leading-tight tracking-[-0.015em] text-foreground">
            Welkom terug
          </h1>
          <p className="mt-3 font-body text-base italic leading-relaxed text-foreground-muted">
            Meld je aan om verder te bouwen aan een heel leven.
          </p>
        </div>

        {sent ? (
          <div className="mb-6 rounded-xl border border-gold/30 bg-gold/[0.06] px-5 py-4 text-center font-body text-sm text-foreground-secondary">
            Check je e-mail — we hebben je een magische link gestuurd.
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-xl border border-danger/40 bg-danger/[0.08] px-5 py-4 text-center font-body text-sm text-foreground-secondary">
            {error}
          </div>
        ) : null}

        <Slab className="p-8 sm:p-10">
          <LoginForm />
        </Slab>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-meta transition-colors hover:text-gold"
          >
            <ArrowLeft className="size-3.5" />
            Terug naar home
          </Link>
        </div>
      </div>
    </main>
  );
}
