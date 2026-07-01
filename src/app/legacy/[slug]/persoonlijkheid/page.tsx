import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Fingerprint } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLegacyBySlug, canEditLegacy } from "@/lib/data/legacy";
import { getPersonality } from "@/lib/data/personality";
import { isAiConfigured } from "@/lib/ai/anthropic";
import { Seam } from "@/components/ui/seam";
import { PersoonlijkheidEditor } from "./persoonlijkheid-editor";

export const metadata: Metadata = { title: "Persoonlijkheid" };

export default async function PersoonlijkheidPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const legacy = await getLegacyBySlug(slug);
  if (!legacy) notFound();

  const [personality, canEdit] = await Promise.all([
    getPersonality(legacy.id),
    canEditLegacy(legacy.id),
  ]);
  const completeness = personality?.trainingCompleteness ?? 0;

  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-6 py-10">
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
          <Fingerprint className="size-5" />
        </span>
        <span className="text-meta">Digitale persoonlijkheid</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.015em] text-foreground">
          Hoe {legacy.full_name.split(" ")[0]} klonk
        </h1>
        <p className="mt-4 max-w-xl font-body text-lg italic leading-relaxed text-foreground-muted">
          De toon, humor en waarden die de AI-herinnering kleuren. Dit bepaalt
          alleen hóe er verteld wordt — nooit wat er verteld wordt. Feiten blijven
          altijd gegrond in wat is vastgelegd.
        </p>
      </header>

      <Seam className="mt-12 w-full" />

      <div className="mt-10 flex flex-col gap-3">
        <div className="flex items-center justify-between text-meta text-foreground-muted">
          <span>Profiel ingevuld</span>
          <span>{completeness}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-forest transition-[width] duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      <div className="mt-10">
        <PersoonlijkheidEditor
          slug={legacy.slug}
          legacyId={legacy.id}
          initial={personality}
          canEdit={canEdit}
          aiConfigured={isAiConfigured()}
        />
      </div>

      <p className="mt-16 text-center font-body text-sm italic text-foreground-muted">
        Een stem herkennen is de warmste vorm van herinneren.
      </p>
    </main>
  );
}
