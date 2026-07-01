"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";
import { answerQuestion } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center gap-2.5 self-start rounded-full bg-gradient-to-b from-[#d9ba7e] to-[#c9a15a] px-7 font-meta text-xs uppercase tracking-[0.14em] text-background transition-all duration-200 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold disabled:opacity-50"
    >
      {pending ? "Bewaren…" : (
        <>
          Bewaar &amp; volgende
          <ArrowRight className="size-4" />
        </>
      )}
    </button>
  );
}

export function InterviewAnswerForm({
  slug,
  legacyId,
  name,
  pendingId,
}: {
  slug: string;
  legacyId: string;
  name: string;
  pendingId: string;
}) {
  return (
    <form action={answerQuestion} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="legacyId" value={legacyId} />
      <input type="hidden" name="name" value={name} />
      <input type="hidden" name="pendingId" value={pendingId} />
      <textarea
        name="answerText"
        rows={6}
        required
        autoFocus
        placeholder="Neem de tijd. Vertel in je eigen woorden…"
        className="w-full rounded-2xl border border-border bg-surface px-5 py-4 font-body text-lg leading-relaxed text-foreground placeholder:text-foreground-muted/70 focus-visible:border-gold/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      />
      <SubmitButton />
    </form>
  );
}
