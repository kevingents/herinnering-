import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLegacyBySlug } from "@/lib/data/legacy";
import { AiDisclaimer } from "@/components/brand/ai-disclaimer";
import { Seam } from "@/components/ui/seam";
import { LegacyChat } from "./chat";

export const metadata: Metadata = { title: "Gesprek" };

export default async function GesprekPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const legacy = await getLegacyBySlug(slug);
  if (!legacy) notFound();

  const firstName = legacy.full_name.split(" ")[0] || legacy.full_name;

  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-6 py-10">
      <Link
        href={`/legacy/${legacy.slug}`}
        className="inline-flex items-center gap-2 text-meta transition-colors hover:text-gold"
      >
        <ArrowLeft className="size-3.5" />
        {legacy.full_name}
      </Link>

      <header className="mt-14 flex flex-col items-center text-center">
        <span
          aria-hidden
          className="mb-8 block size-2.5 rounded-full bg-amber shadow-[0_0_40px_12px_rgba(224,184,118,0.32)] motion-safe:animate-breathe"
        />
        <span className="text-meta">Gesprek</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.015em] text-foreground">
          Praat met een herinnering aan {firstName}
        </h1>
        <AiDisclaimer name={firstName} className="mt-5 max-w-lg text-center" />
      </header>

      <Seam className="mt-12 w-full" />

      <div className="mt-10">
        <LegacyChat legacyId={legacy.id} name={legacy.full_name} />
      </div>

      <p className="mt-16 text-center font-body text-sm italic text-foreground-muted">
        Antwoorden komen uit wat er is vastgelegd — nooit verzonnen.
      </p>
    </main>
  );
}
