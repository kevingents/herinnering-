"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Lock, Plus } from "lucide-react";
import { createTimeCapsule } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slab } from "@/components/ui/slab";

const TRIGGERS: { value: string; label: string }[] = [
  { value: "date", label: "Op een datum" },
  { value: "years_after", label: "Over een aantal jaar" },
  { value: "event", label: "Bij een gebeurtenis" },
  { value: "after_death", label: "Na mijn overlijden" },
];

const inputClass =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 font-body text-base text-foreground placeholder:text-foreground-muted/70 focus-visible:border-gold/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center gap-2.5 self-start rounded-full bg-forest px-7 font-meta text-xs uppercase tracking-[0.14em] text-cream transition-all hover:brightness-105 disabled:opacity-50"
    >
      {pending ? "Verzegelen…" : (
        <>
          <Lock className="size-4" />
          Verzegel tijdcapsule
        </>
      )}
    </button>
  );
}

export function CapsuleForm({
  slug,
  legacyId,
}: {
  slug: string;
  legacyId: string;
}) {
  const [open, setOpen] = useState(false);
  const [trigger, setTrigger] = useState("date");

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full border border-gold/45 px-7 font-meta text-xs uppercase tracking-[0.14em] text-gold transition-all hover:border-gold/80 hover:bg-gold/[0.06]"
      >
        <Plus className="size-4" />
        Nieuwe tijdcapsule
      </button>
    );
  }

  return (
    <Slab className="p-7 sm:p-8">
      <form action={createTimeCapsule} className="flex flex-col gap-5">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="legacyId" value={legacyId} />

        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Titel</Label>
          <Input id="title" name="title" required placeholder="Bijv. Voor Laura's 18e verjaardag" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="message">Bericht</Label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Schrijf wat je wilt zeggen wanneer dit moment daar is…"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-body text-base leading-relaxed text-foreground placeholder:text-foreground-muted/70 focus-visible:border-gold/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="trigger">Wanneer gaat hij open?</Label>
            <select
              id="trigger"
              name="trigger"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className={inputClass}
            >
              {TRIGGERS.map((t) => (
                <option key={t.value} value={t.value} className="bg-surface text-foreground">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {trigger === "date" ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="unlockDate">Datum</Label>
              <Input id="unlockDate" name="unlockDate" type="date" />
            </div>
          ) : null}

          {trigger === "years_after" ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="yearsAfter">Over hoeveel jaar</Label>
              <Input id="yearsAfter" name="yearsAfter" type="number" min={1} max={100} placeholder="25" />
            </div>
          ) : null}

          {trigger === "event" ? (
            <div className="flex flex-col gap-2">
              <Label htmlFor="unlockCondition">Bij welke gebeurtenis</Label>
              <Input id="unlockCondition" name="unlockCondition" placeholder="Als Laura trouwt" />
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="recipientEmail">Voor wie (e-mail, optioneel)</Label>
          <Input id="recipientEmail" name="recipientEmail" type="email" placeholder="laura@voorbeeld.nl" />
        </div>

        <div className="flex items-center gap-4">
          <SubmitButton />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-meta transition-colors hover:text-foreground"
          >
            Annuleren
          </button>
        </div>
      </form>
    </Slab>
  );
}
