"use client";

import { useFormStatus } from "react-dom";
import { Send } from "lucide-react";
import { inviteMember } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROLE_OPTIONS: { value: string; label: string }[] = [
  { value: "viewer", label: "Mag meelezen" },
  { value: "contributor", label: "Mag bijdragen" },
  { value: "admin", label: "Mag beheren" },
];

const selectClass =
  "h-12 w-full rounded-xl border border-border bg-surface px-4 font-body text-base text-foreground focus-visible:border-gold/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center gap-2.5 self-start rounded-full bg-forest px-7 font-meta text-xs uppercase tracking-[0.14em] text-cream transition-all hover:bg-forest-deep disabled:opacity-50"
    >
      {pending ? "Versturen…" : (
        <>
          <Send className="size-4" />
          Uitnodigen
        </>
      )}
    </button>
  );
}

export function InviteForm({
  slug,
  legacyId,
}: {
  slug: string;
  legacyId: string;
}) {
  return (
    <form action={inviteMember} className="flex flex-col gap-5">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="legacyId" value={legacyId} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">E-mailadres</Label>
        <Input id="email" name="email" type="email" required placeholder="naam@voorbeeld.nl" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="relation">Relatie (optioneel)</Label>
          <Input id="relation" name="relation" placeholder="Bijv. dochter" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="role">Rechten</Label>
          <select id="role" name="role" defaultValue="viewer" className={selectClass}>
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value} className="bg-surface text-foreground">
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
