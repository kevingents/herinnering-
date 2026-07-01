import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLegacyBySlug, getLifeEvents } from "@/lib/data/legacy";
import { Seam } from "@/components/ui/seam";
import { LegacyTimeline } from "./legacy-timeline";
import { AddEventForm } from "./add-event-form";

export const metadata: Metadata = { title: "Levenslijn" };

function year(date: string | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? null : String(d.getFullYear());
}

export default async function LegacyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const legacy = await getLegacyBySlug(slug);
  if (!legacy) notFound();

  const events = await getLifeEvents(legacy.id);
  const birthYear = year(legacy.birth_date);
  const deathYear = year(legacy.death_date);
  const lifespan = birthYear
    ? `${birthYear} – ${deathYear ?? "heden"}`
    : null;

  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-6 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-meta transition-colors hover:text-gold"
      >
        <ArrowLeft className="size-3.5" />
        Dashboard
      </Link>

      <header className="mt-14 flex flex-col items-center text-center">
        <span className="text-meta">Levenslijn</span>
        <h1 className="text-gilded mt-4 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.04] tracking-[-0.02em]">
          {legacy.full_name}
        </h1>
        {lifespan ? (
          <p className="mt-4 font-display text-lg tracking-wide text-foreground-muted">
            {lifespan}
          </p>
        ) : null}
        {legacy.headline ? (
          <p className="mt-4 max-w-xl font-body text-lg italic leading-relaxed text-foreground-secondary">
            {legacy.headline}
          </p>
        ) : null}
      </header>

      <Seam className="mt-12 w-full" />

      <nav className="mt-10 flex items-center justify-center gap-3">
        <span className="rounded-full border border-gold/40 bg-gold/[0.06] px-5 py-2 text-meta text-gold">
          Levenslijn
        </span>
        <Link
          href={`/legacy/${legacy.slug}/interview`}
          className="rounded-full border border-border px-5 py-2 text-meta text-foreground-muted transition-colors hover:border-gold/50 hover:text-gold"
        >
          AI-interview
        </Link>
        <Link
          href={`/legacy/${legacy.slug}/stem`}
          className="rounded-full border border-border px-5 py-2 text-meta text-foreground-muted transition-colors hover:border-gold/50 hover:text-gold"
        >
          Stem
        </Link>
        <Link
          href={`/legacy/${legacy.slug}/grafmodus`}
          className="rounded-full border border-border px-5 py-2 text-meta text-foreground-muted transition-colors hover:border-gold/50 hover:text-gold"
        >
          Grafmodus
        </Link>
      </nav>

      {error ? (
        <div className="mt-8 rounded-xl border border-danger/40 bg-danger/[0.08] px-5 py-4 font-body text-sm text-foreground-secondary">
          {error}
        </div>
      ) : null}

      <div className="mt-10 flex justify-center">
        <AddEventForm slug={legacy.slug} legacyId={legacy.id} />
      </div>

      <LegacyTimeline events={events} />

      <p className="mt-16 text-center font-body text-sm italic text-foreground-muted">
        Elk hoofdstuk dat je toevoegt, maakt het leven completer.
      </p>
    </main>
  );
}
