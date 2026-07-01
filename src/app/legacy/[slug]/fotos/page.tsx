import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLegacyBySlug } from "@/lib/data/legacy";
import { getGallery } from "@/lib/data/media";
import { Seam } from "@/components/ui/seam";
import { PhotoUploader } from "./photo-uploader";

export const metadata: Metadata = { title: "Foto's & video's" };

export default async function FotosPage({
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

  const items = await getGallery(legacy.id);

  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-6 py-10">
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
          <ImageIcon className="size-5" />
        </span>
        <span className="text-meta">Foto&apos;s &amp; video&apos;s</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.015em] text-foreground">
          Je mooiste momenten
        </h1>
        <p className="mt-4 max-w-xl font-body text-lg italic leading-relaxed text-foreground-muted">
          Bewaar de gezichten, plekken en momenten — in beeld en bewegend beeld —
          die je nooit wilt vergeten.
        </p>
      </header>

      <Seam className="mt-12 w-full" />

      <div className="mt-10">
        <PhotoUploader slug={legacy.slug} legacyId={legacy.id} />
      </div>

      <section className="mt-14">
        <div className="flex items-center gap-4">
          <span className="text-meta">Album</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {items.length === 0 ? (
          <p className="mt-8 text-center font-body text-lg italic text-foreground-muted">
            Nog geen foto&apos;s of video&apos;s. Upload de eerste herinnering.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {items.map((p) => (
              <figure key={p.id} className="flex flex-col gap-2">
                <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                  {p.url && p.kind === "video" ? (
                    <video
                      src={p.url}
                      controls
                      playsInline
                      preload="metadata"
                      className="aspect-square w-full bg-black object-cover"
                    />
                  ) : p.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.url}
                      alt={p.caption ?? "Foto"}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center text-meta text-foreground-muted">
                      niet beschikbaar
                    </div>
                  )}
                </div>
                {p.caption || p.takenAt ? (
                  <figcaption className="flex flex-col px-1">
                    {p.caption ? (
                      <span className="font-body text-[0.95rem] text-foreground-secondary">
                        {p.caption}
                      </span>
                    ) : null}
                    {p.takenAt ? (
                      <span className="text-meta text-foreground-muted">
                        {format(new Date(p.takenAt), "d MMMM yyyy", { locale: nl })}
                      </span>
                    ) : null}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        )}
      </section>

      <p className="mt-16 text-center font-body text-sm italic text-foreground-muted">
        Elke foto vertelt een stukje van het verhaal.
      </p>
    </main>
  );
}
