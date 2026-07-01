"use client";

import { useFormStatus } from "react-dom";
import { Mail } from "lucide-react";
import { signInWithOtp } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-b from-[#d9ba7e] to-[#c9a15a] font-meta text-xs uppercase tracking-[0.14em] text-background transition-all duration-200 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold disabled:opacity-50"
    >
      {pending ? (
        "Even geduld…"
      ) : (
        <>
          <Mail className="size-4" />
          Stuur een magische link
        </>
      )}
    </button>
  );
}

export function LoginForm() {
  return (
    <form action={signInWithOtp} className="flex flex-col gap-3">
      <Label htmlFor="email">E-mailadres</Label>
      <Input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="jij@voorbeeld.nl"
      />
      <SubmitButton />
      <p className="mt-2 text-center font-body text-sm text-foreground-muted">
        We sturen je een veilige inloglink. Geen wachtwoord nodig.
      </p>
    </form>
  );
}
