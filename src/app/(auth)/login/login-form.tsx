"use client";

import { useFormStatus } from "react-dom";
import { Mail } from "lucide-react";
import { signInWithOtp, signInWithProvider } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function SubmitButton({
  children,
  className,
  variant = "gold",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "gold" | "outline";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full font-meta text-xs uppercase tracking-[0.14em] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold disabled:opacity-50",
        variant === "gold"
          ? "bg-forest text-cream hover:brightness-105"
          : "border border-border text-foreground-secondary hover:border-gold/50 hover:text-foreground",
        className,
      )}
    >
      {pending ? "Even geduld…" : children}
    </button>
  );
}

const PROVIDERS: { id: string; label: string; icon: React.ReactNode }[] = [
  {
    id: "google",
    label: "Doorgaan met Google",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
        <path
          fill="currentColor"
          d="M21.35 11.1H12v3.83h5.35c-.23 1.5-1.62 4.4-5.35 4.4a5.83 5.83 0 0 1 0-11.66c1.86 0 3.1.79 3.82 1.47l2.6-2.5C16.9 3.6 14.7 2.6 12 2.6a9.4 9.4 0 1 0 0 18.8c5.43 0 9-3.8 9-9.16 0-.62-.07-1.1-.15-1.54Z"
        />
      </svg>
    ),
  },
  {
    id: "apple",
    label: "Doorgaan met Apple",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
        <path
          fill="currentColor"
          d="M16.4 12.9c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.9-3.6 2.2-1.5 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.7 2.2 1.1 0 1.5-.7 2.8-.7 1.3 0 1.6.7 2.8.7 1.1 0 1.9-1.1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.4-.1 0-2.2-.9-2.2-3.7ZM14.3 6.3c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2Z"
        />
      </svg>
    ),
  },
  {
    id: "azure",
    label: "Doorgaan met Microsoft",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
        <path fill="currentColor" d="M3 3h8.5v8.5H3V3Zm9.5 0H21v8.5h-8.5V3ZM3 12.5h8.5V21H3v-8.5Zm9.5 0H21V21h-8.5v-8.5Z" />
      </svg>
    ),
  },
];

export function LoginForm() {
  return (
    <div className="flex flex-col gap-7">
      {/* Magic link */}
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
        <SubmitButton className="mt-1">
          <Mail className="size-4" />
          Stuur een magische link
        </SubmitButton>
      </form>

      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-meta">of</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* OAuth providers */}
      <div className="flex flex-col gap-3">
        {PROVIDERS.map((p) => (
          <form key={p.id} action={signInWithProvider}>
            <input type="hidden" name="provider" value={p.id} />
            <SubmitButton variant="outline">
              {p.icon}
              {p.label}
            </SubmitButton>
          </form>
        ))}
      </div>
    </div>
  );
}
