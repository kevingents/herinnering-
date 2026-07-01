"use client";

import { useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
import { createLegacy } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-forest px-7 font-meta text-xs uppercase tracking-[0.14em] text-cream transition-all duration-200 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold disabled:opacity-50"
    >
      {pending ? "Bezig…" : (
        <>
          <Plus className="size-4" />
          Nalatenschap aanmaken
        </>
      )}
    </button>
  );
}

export function CreateLegacyForm() {
  return (
    <form action={createLegacy} className="flex flex-col gap-3">
      <Label htmlFor="fullName">Naam van de persoon</Label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id="fullName"
          name="fullName"
          required
          placeholder="Bijv. Willem de Vries"
          className="sm:flex-1"
        />
        <SubmitButton />
      </div>
    </form>
  );
}
