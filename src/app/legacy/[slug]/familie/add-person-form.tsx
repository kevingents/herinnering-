"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, UserPlus } from "lucide-react";
import { addPerson } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slab } from "@/components/ui/slab";
import { RELATIONS } from "@/lib/relations";

const inputClass =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 font-body text-base text-foreground focus-visible:border-gold/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center gap-2.5 self-start rounded-full bg-forest px-7 font-meta text-xs uppercase tracking-[0.14em] text-cream transition-all hover:bg-forest-deep disabled:opacity-50"
    >
      {pending ? "Bezig…" : (
        <>
          <UserPlus className="size-4" />
          Toevoegen
        </>
      )}
    </button>
  );
}

export function AddPersonForm({
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
        className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full border border-forest/40 px-7 font-meta text-xs uppercase tracking-[0.14em] text-forest transition-all hover:border-forest/70 hover:bg-forest/[0.06]"
      >
        <Plus className="size-4" />
        Familielid toevoegen
      </button>
    );
  }

  return (
    <Slab className="p-7 sm:p-8">
      <form action={addPerson} className="flex flex-col gap-5">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="legacyId" value={legacyId} />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Naam</Label>
            <Input id="name" name="name" required placeholder="Bijv. Laura de Vries" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="relation">Relatie</Label>
            <select id="relation" name="relation" defaultValue="kind" className={inputClass}>
              {RELATIONS.map((r) => (
                <option key={r.key} value={r.key} className="bg-surface text-foreground">
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="notes">Notitie (optioneel)</Label>
          <Input id="notes" name="notes" placeholder="Iets wat je wilt onthouden" />
        </div>

        <div className="flex items-center gap-4">
          <SubmitButton />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-meta transition-colors hover:text-gold"
          >
            Annuleren
          </button>
        </div>
      </form>
    </Slab>
  );
}
