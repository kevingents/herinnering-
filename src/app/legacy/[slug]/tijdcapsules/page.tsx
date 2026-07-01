import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowLeft, Lock, LockOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLegacyBySlug } from "@/lib/data/legacy";
import { getTimeCapsules, type TimeCapsule } from "@/lib/data/capsules";
import { Slab } from "@/components/ui/slab";
import { Seam } from "@/components/ui/seam";
import { CapsuleForm } from "./capsule-form";

export const metadata: Metadata = { title: "Tijdcapsules" };

function describeTrigger(c: TimeCapsule): string {
  switch (c.trigger) {
    case "date":
      return c.unlock_date
        ? `Gaat open op ${format(new Date(c.unlock_date), "d MMMM yyyy", { locale: nl })}`
        : "Gaat open op een datum";
    case "years_after":
      return c.years_after
        ? `Gaat open over ${c.years_after} jaar`
        : "Gaat open na een aantal jaar";
    case "after_death":
      return "Gaat open na overlijden";
    case "event":
      return c.unlock_condition ?? "Gaat open bij een gebeurtenis";
    default:
      return "Verzegeld";
  }
}

export default async function TijdcapsulesPage({
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

  const capsules = await getTimeCapsules(legacy.id);

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
          className="mb-8 inline-flex size-12 items-center justify-center rounded-full border border-gold/25 bg-gold/[0.06] text-gold"
        >
          <Lock className="size-5" />
        </span>
        <span className="text-meta">Tijdcapsules</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.015em] text-foreground">
          Berichten voor later
        </h1>
        <p className="mt-4 max-w-xl font-body text-lg italic leading-relaxed text-foreground-muted">
          Verzegel een bericht dat pas op het juiste moment mag worden geopend —
          een verjaardag, een mijlpaal, of ooit later.
        </p>
      </header>

      <Seam className="mt-12 w-full" />

      {error ? (
        <div className="mt-8 rounded-xl border border-danger/40 bg-danger/[0.08] px-5 py-4 font-body text-sm text-foreground-secondary">
          {error}
        </div>
      ) : null}

      <div className="mt-10 flex justify-center">
        <CapsuleForm slug={legacy.slug} legacyId={legacy.id} />
      </div>

      <section className="mt-12">
        {capsules.length === 0 ? (
          <p className="text-center font-body text-lg italic text-foreground-muted">
            Nog geen tijdcapsules. Verzegel de eerste.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {capsules.map((c) => (
              <Slab key={c.id} className="p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-3">
                  {c.is_unlocked ? (
                    <LockOpen className="size-4 text-gold" />
                  ) : (
                    <Lock className="size-4 text-gold" />
                  )}
                  <span className="text-meta text-gold">
                    {c.is_unlocked ? "Geopend" : "Verzegeld"}
                  </span>
                  <span className="text-meta text-foreground-muted">
                    {describeTrigger(c)}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl leading-snug text-foreground">
                  {c.title}
                </h3>
                {c.recipient_email ? (
                  <p className="mt-2 text-meta text-foreground-muted">
                    Voor {c.recipient_email}
                  </p>
                ) : null}
                {!c.is_unlocked ? (
                  <p className="mt-3 font-body text-[0.95rem] italic text-foreground-muted">
                    De inhoud blijft verborgen tot het moment daar is.
                  </p>
                ) : c.message ? (
                  <p className="mt-3 whitespace-pre-line font-body text-[1.0625rem] leading-relaxed text-foreground-secondary">
                    {c.message}
                  </p>
                ) : null}
              </Slab>
            ))}
          </div>
        )}
      </section>

      <p className="mt-16 text-center font-body text-sm italic text-foreground-muted">
        Sommige woorden zijn bedoeld voor een later moment.
      </p>
    </main>
  );
}
