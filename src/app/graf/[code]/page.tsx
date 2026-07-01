import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Candlelight } from "@/components/atmosphere/candlelight";
import { InscribedName } from "@/components/brand/inscribed-name";
import { AiDisclaimer } from "@/components/brand/ai-disclaimer";
import { Seam } from "@/components/ui/seam";
import { categoryIcon } from "@/lib/legacy-categories";
import {
  getMemorialByCode,
  getMemorialEvents,
  registerScan,
} from "@/lib/data/memorial";
import { MemorialChat } from "./memorial-chat";

function year(date: string | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? null : String(d.getFullYear());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const memorial = await getMemorialByCode(code);
  if (!memorial) return { title: "Gedenkplek" };
  return {
    title: `${memorial.full_name} — Ter nagedachtenis`,
    description:
      memorial.headline ?? `Een herinnering aan ${memorial.full_name}.`,
  };
}

export default async function GrafPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const memorial = await getMemorialByCode(code);
  if (!memorial) notFound();

  after(async () => {
    await registerScan(code);
  });

  const events = await getMemorialEvents(memorial.legacyId);
  const birthYear = year(memorial.birth_date);
  const deathYear = year(memorial.death_date);
  const lifespan = birthYear ? `${birthYear} – ${deathYear ?? ""}` : null;
  const firstName = memorial.full_name.split(" ")[0] || memorial.full_name;

  return (
    <>
      <Candlelight />
      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center px-6 py-16">
        <span
          aria-hidden
          className="mb-12 block size-2.5 rounded-full bg-amber shadow-[0_0_44px_14px_rgba(224,184,118,0.34)] motion-safe:animate-breathe"
        />
        <span className="text-meta">Ter nagedachtenis</span>

        <div className="mt-6">
          <InscribedName
            name={memorial.full_name}
            years={lifespan ?? undefined}
          />
        </div>

        {memorial.headline ? (
          <p className="mt-6 max-w-xl text-center font-body text-lg italic leading-relaxed text-foreground-secondary">
            {memorial.headline}
          </p>
        ) : null}

        <AiDisclaimer
          name={firstName}
          className="mt-8 max-w-lg text-center"
        />

        <Seam className="mt-12 w-full" />

        {/* the honest AI chat — the heart of grafmodus */}
        <div className="mt-12 w-full">
          <MemorialChat code={code} name={memorial.full_name} />
        </div>

        {/* a glimpse of the life */}
        {events.length > 0 ? (
          <section className="mt-16 w-full">
            <div className="flex items-center gap-4">
              <span className="text-meta">Een glimp van dit leven</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <ul className="mt-6 flex flex-col gap-4">
              {events.map((e, i) => {
                const Icon = categoryIcon(e.category);
                const y = year(e.event_date);
                return (
                  <li key={i} className="flex items-baseline gap-3">
                    <Icon className="size-4 shrink-0 translate-y-0.5 text-gold/80" />
                    {y ? (
                      <span className="font-display text-base tracking-wide text-gold">
                        {y}
                      </span>
                    ) : null}
                    <span className="font-body text-[1.0625rem] text-foreground-secondary">
                      {e.title}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <p className="mt-16 text-center font-body text-sm italic text-foreground-muted">
          {format(new Date(), "d MMMM yyyy", { locale: nl })} · je bezoekt niet
          alleen een graf, je bezoekt een heel leven.
        </p>
      </main>
    </>
  );
}
