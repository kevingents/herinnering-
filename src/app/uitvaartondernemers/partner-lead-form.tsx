"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitPartnerLead } from "./actions";

const field =
  "h-12 w-full rounded-xl border border-sand bg-white px-4 font-meta text-base text-cream-ink placeholder:text-cream-ink/40 focus-visible:border-forest/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest";

export function PartnerLeadForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const res = await submitPartnerLead(new FormData(e.currentTarget));
    if (res && "error" in res) {
      setError(res.error);
      setStatus("idle");
      return;
    }
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-forest/30 bg-[#fdfbf6] p-10 text-center">
        <CheckCircle2 className="size-8 text-forest" />
        <h3 className="font-display text-2xl text-forest-deep">Dank je wel</h3>
        <p className="font-meta text-[0.95rem] text-cream-ink/70">
          We nemen binnen twee werkdagen contact met je op.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-sand bg-[#fdfbf6] p-7 sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Naam" className={field} />
        <input name="organization" placeholder="Uitvaartonderneming" className={field} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="email" type="email" required placeholder="E-mailadres" className={field} />
        <input name="phone" placeholder="Telefoon (optioneel)" className={field} />
      </div>
      <textarea
        name="message"
        rows={4}
        placeholder="Waar kunnen we mee helpen?"
        className="w-full rounded-xl border border-sand bg-white px-4 py-3 font-meta text-base leading-relaxed text-cream-ink placeholder:text-cream-ink/40 focus-visible:border-forest/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
      />
      {error ? <p className="font-meta text-sm text-[#a3492c]">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex h-12 items-center justify-center gap-2.5 self-start rounded-full bg-forest px-7 font-meta text-sm text-cream transition-colors hover:bg-forest-deep disabled:opacity-50"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Versturen…
          </>
        ) : (
          "Plan een kennismaking"
        )}
      </button>
      <p className="font-meta text-xs text-cream-ink/50">
        We gebruiken je gegevens alleen om contact op te nemen. Zie ons{" "}
        <a href="/privacy" className="underline hover:text-forest">
          privacybeleid
        </a>
        .
      </p>
    </form>
  );
}
