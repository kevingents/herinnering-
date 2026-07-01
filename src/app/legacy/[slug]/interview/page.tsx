import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Quote, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLegacyBySlug } from "@/lib/data/legacy";
import { getInterviewState } from "@/lib/data/interview";
import { isAiConfigured } from "@/lib/ai/anthropic";
import { Slab } from "@/components/ui/slab";
import { Seam } from "@/components/ui/seam";
import { InterviewAnswerForm } from "./interview-answer-form";
import { startOrAdvance } from "./actions";

export const metadata: Metadata = { title: "AI-interview" };

export default async function InterviewPage({
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

  const { answered, pending } = await getInterviewState(legacy.id);
  const aiOn = isAiConfigured();

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
        <span className="text-meta">AI-interview</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.015em] text-foreground">
          Duizenden vragen, één leven
        </h1>
        <p className="mt-4 max-w-xl font-body text-lg italic leading-relaxed text-foreground-muted">
          Neem rustig de tijd. Elk antwoord dat je geeft, wordt bewaard als deel
          van het verhaal — nooit alsof iemand anders het vertelt.
        </p>
        <p className="mt-3 text-meta text-foreground-muted/70">
          {aiOn
            ? "De AI stelt vervolgvragen op basis van je antwoorden"
            : "Vaste vragen · AI-vervolgvragen staan uit tot de sleutel is ingesteld"}
        </p>
      </header>

      <Seam className="mt-12 w-full" />

      {error ? (
        <div className="mt-8 rounded-xl border border-danger/40 bg-danger/[0.08] px-5 py-4 font-body text-sm text-foreground-secondary">
          {error}
        </div>
      ) : null}

      {/* transcript so far */}
      {answered.length > 0 ? (
        <ol className="mt-10 flex flex-col gap-8">
          {answered.map((qa) => (
            <li key={qa.id} className="flex flex-col gap-3">
              <p className="flex items-start gap-2.5 font-display text-lg leading-snug text-gold">
                <Quote className="mt-1 size-4 shrink-0 text-gold/60" />
                {qa.question_text}
              </p>
              <p className="whitespace-pre-line pl-[26px] font-body text-[1.0625rem] leading-relaxed text-foreground-secondary">
                {qa.answer_text}
              </p>
            </li>
          ))}
        </ol>
      ) : null}

      {/* the open question, or a start button */}
      <div className="mt-12">
        {pending ? (
          <Slab featured className="p-7 sm:p-9">
            <div className="flex items-center gap-2.5">
              <Sparkles className="size-4 text-gold" />
              <span className="text-meta">
                Vraag {answered.length + 1}
              </span>
            </div>
            <p className="mt-4 font-display text-2xl leading-snug text-foreground">
              {pending.question_text}
            </p>
            <InterviewAnswerForm
              slug={legacy.slug}
              legacyId={legacy.id}
              name={legacy.full_name}
              pendingId={pending.id}
            />
          </Slab>
        ) : (
          <form
            action={startOrAdvance}
            className="flex flex-col items-center gap-4 text-center"
          >
            <input type="hidden" name="slug" value={legacy.slug} />
            <input type="hidden" name="legacyId" value={legacy.id} />
            <input type="hidden" name="name" value={legacy.full_name} />
            {answered.length > 0 ? (
              <p className="font-body text-lg italic text-foreground-muted">
                Mooi. Klaar voor de volgende vraag?
              </p>
            ) : null}
            <button
              type="submit"
              className="inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-gradient-to-b from-[#d9ba7e] to-[#c9a15a] px-9 font-meta text-[0.8rem] uppercase tracking-[0.14em] text-background transition-all duration-200 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold"
            >
              {answered.length > 0 ? "Volgende vraag" : "Begin het interview"}
            </button>
          </form>
        )}
      </div>

      <p className="mt-16 text-center font-body text-sm italic text-foreground-muted">
        Je kunt altijd stoppen en later verdergaan. Alles blijft bewaard.
      </p>
    </main>
  );
}
