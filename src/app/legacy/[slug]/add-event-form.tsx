"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
import { createLifeEvent } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slab } from "@/components/ui/slab";
import {
  LIFE_EVENT_CATEGORIES,
  CATEGORY_LABEL,
} from "@/lib/legacy-categories";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-gradient-to-b from-[#d9ba7e] to-[#c9a15a] px-7 font-meta text-xs uppercase tracking-[0.14em] text-background transition-all duration-200 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold disabled:opacity-50"
    >
      {pending ? "Bezig…" : (
        <>
          <Plus className="size-4" />
          Toevoegen
        </>
      )}
    </button>
  );
}

export function AddEventForm({
  slug,
  legacyId,
}: {
  slug: string;
  legacyId: string;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full border border-gold/45 px-7 font-meta text-xs uppercase tracking-[0.14em] text-gold transition-all duration-200 hover:border-gold/80 hover:bg-gold/[0.06]"
      >
        <Plus className="size-4" />
        Gebeurtenis toevoegen
      </button>
    );
  }

  return (
    <Slab className="p-7 sm:p-8">
      <form action={createLifeEvent} className="flex flex-col gap-5">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="legacyId" value={legacyId} />

        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Titel</Label>
          <Input id="title" name="title" required placeholder="Bijv. Geboren in Haarlem" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Categorie</Label>
            <select
              id="category"
              name="category"
              defaultValue="milestone"
              className="h-12 w-full rounded-xl border border-border bg-surface px-4 font-body text-base text-foreground focus-visible:border-gold/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {LIFE_EVENT_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-surface text-foreground">
                  {CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="eventDate">Datum</Label>
            <Input id="eventDate" name="eventDate" type="date" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Beschrijving</Label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Vertel wat er gebeurde…"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-body text-base leading-relaxed text-foreground placeholder:text-foreground-muted/70 focus-visible:border-gold/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          />
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
