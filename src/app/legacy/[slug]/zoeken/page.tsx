import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  BookOpenText,
  FileText,
  MessagesSquare,
  Search,
  Users,
  Waypoints,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLegacyBySlug } from "@/lib/data/legacy";
import { searchLegacy } from "@/lib/data/search";
import { Slab } from "@/components/ui/slab";
import { Seam } from "@/components/ui/seam";

export const metadata: Metadata = { title: "Zoeken" };

function ResultGroup({
  icon: Icon,
  label,
  items,
}: {
  icon: typeof Search;
  label: string;
  items: { key: string; title: string; snippet?: string | null }[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <Icon className="size-4 text-gold" />
        <span className="text-meta">
          {label} · {items.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((it) => (
          <Slab key={it.key} className="p-5">
            <p className="font-body text-[1.0625rem] text-foreground">
              {it.title}
            </p>
            {it.snippet ? (
              <p className="mt-1 line-clamp-2 font-body text-[0.95rem] text-foreground-muted">
                {it.snippet}
              </p>
            ) : null}
          </Slab>
        ))}
      </div>
    </section>
  );
}

export default async function ZoekenPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { slug } = await params;
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const legacy = await getLegacyBySlug(slug);
  if (!legacy) notFound();

  const results = query ? await searchLegacy(legacy.id, query) : null;

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
          className="mb-8 inline-flex size-12 items-center justify-center rounded-full border border-gold/25 bg-gold/[0.06] text-gold"
        >
          <Search className="size-5" />
        </span>
        <span className="text-meta">Zoeken</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.015em] text-foreground">
          Doorzoek dit leven
        </h1>
      </header>

      <form method="get" className="mt-10 flex items-center gap-3">
        <input
          name="q"
          defaultValue={query}
          autoFocus
          placeholder="Zoek op personen, plaatsen, woorden, jaartallen…"
          className="h-12 flex-1 rounded-full border border-border bg-surface px-5 font-body text-base text-foreground placeholder:text-foreground-muted/70 focus-visible:border-gold/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        />
        <button
          type="submit"
          aria-label="Zoek"
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-forest text-cream transition-all hover:brightness-105"
        >
          <Search className="size-4" />
        </button>
      </form>

      <Seam className="mt-10 w-full" />

      <div className="mt-8">
        {!results ? (
          <p className="text-center font-body text-lg italic text-foreground-muted">
            Typ iets om te zoeken in herinneringen, gebeurtenissen, mensen en
            documenten.
          </p>
        ) : results.total === 0 ? (
          <p className="text-center font-body text-lg italic text-foreground-muted">
            Niets gevonden voor &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <div className="flex flex-col gap-8">
            <ResultGroup
              icon={Waypoints}
              label="Gebeurtenissen"
              items={results.events.map((e) => ({
                key: e.id,
                title: e.title,
                snippet: e.description,
              }))}
            />
            <ResultGroup
              icon={BookOpenText}
              label="Herinneringen"
              items={results.memories.map((m) => ({
                key: m.id,
                title: m.title || "Herinnering",
                snippet: m.body,
              }))}
            />
            <ResultGroup
              icon={MessagesSquare}
              label="Interview"
              items={results.answers.map((a) => ({
                key: a.id,
                title: a.question_text,
                snippet: a.answer_text,
              }))}
            />
            <ResultGroup
              icon={Users}
              label="Mensen"
              items={results.people.map((p) => ({
                key: p.id,
                title: p.name,
                snippet: p.relation,
              }))}
            />
            <ResultGroup
              icon={FileText}
              label="Documenten"
              items={results.documents.map((d) => ({
                key: d.id,
                title: d.caption || d.file_name || "Document",
              }))}
            />
          </div>
        )}
      </div>
    </main>
  );
}
