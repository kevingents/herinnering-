import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowLeft, AudioLines } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLegacyBySlug } from "@/lib/data/legacy";
import { getVoiceSamples } from "@/lib/data/voice";
import { emotionLabel } from "@/lib/voice-emotions";
import { Slab } from "@/components/ui/slab";
import { Seam } from "@/components/ui/seam";
import { Waveform } from "@/components/brand/waveform";
import { VoiceRecorder } from "./voice-recorder";

export const metadata: Metadata = { title: "Stem" };

export default async function StemPage({
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

  const samples = await getVoiceSamples(legacy.id);

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
        <span className="text-meta">Stem</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.015em] text-foreground">
          Je stem, precies zoals hij klinkt
        </h1>
        <p className="mt-4 max-w-xl font-body text-lg italic leading-relaxed text-foreground-muted">
          Neem iets op in verschillende stemmingen. Later klinkt het weer zoals
          het was.
        </p>
      </header>

      <Seam className="mt-12 w-full" />

      <div className="mt-10">
        <VoiceRecorder slug={legacy.slug} legacyId={legacy.id} />
      </div>

      {/* opnames */}
      <section className="mt-14">
        <div className="flex items-center gap-4">
          <span className="text-meta">Opnames</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {samples.length === 0 ? (
          <p className="mt-8 text-center font-body text-lg italic text-foreground-muted">
            Nog geen opnames. Neem de eerste op.
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {samples.map((s) => (
              <Slab key={s.id} className="p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-3">
                  <AudioLines className="size-4 text-gold" />
                  <span className="font-display text-lg tracking-wide text-gold">
                    {emotionLabel(s.emotion)}
                  </span>
                  <span className="text-meta text-foreground-muted">
                    {format(new Date(s.created_at), "d MMMM yyyy", { locale: nl })}
                    {s.duration ? ` · ${s.duration}s` : ""}
                  </span>
                </div>

                <div className="mt-5 opacity-80">
                  <Waveform bars={40} />
                </div>

                {s.url ? (
                  <audio controls src={s.url} className="mt-4 w-full" />
                ) : (
                  <p className="mt-4 text-meta text-foreground-muted">
                    Opname niet beschikbaar
                  </p>
                )}

                {s.transcript ? (
                  <p className="mt-4 font-body text-[1.0625rem] italic leading-relaxed text-foreground-secondary">
                    &ldquo;{s.transcript}&rdquo;
                  </p>
                ) : null}
              </Slab>
            ))}
          </div>
        )}
      </section>

      <p className="mt-16 text-center font-body text-sm italic text-foreground-muted">
        Elke opname wordt zorgvuldig en versleuteld bewaard.
      </p>
    </main>
  );
}
