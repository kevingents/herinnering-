import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { canEditLegacy, getLegacyBySlug } from "@/lib/data/legacy";
import { getDocuments } from "@/lib/data/documents";
import { Slab } from "@/components/ui/slab";
import { Seam } from "@/components/ui/seam";
import { DocumentUploader } from "./document-uploader";

export const metadata: Metadata = { title: "Documenten" };

export default async function DocumentenPage({
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

  const [docs, canEdit] = await Promise.all([
    getDocuments(legacy.id),
    canEditLegacy(legacy.id),
  ]);

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
          <FileText className="size-5" />
        </span>
        <span className="text-meta">Documenten</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.015em] text-foreground">
          Brieven, dagboeken en meer
        </h1>
        <p className="mt-4 max-w-xl font-body text-lg italic leading-relaxed text-foreground-muted">
          Bewaar geschreven herinneringen — brieven, dagboeken, documenten — voor
          wie ze ooit wil lezen.
        </p>
      </header>

      <Seam className="mt-12 w-full" />

      {canEdit ? (
        <div className="mt-10">
          <DocumentUploader slug={legacy.slug} legacyId={legacy.id} />
        </div>
      ) : null}

      <section className="mt-12">
        <div className="flex items-center gap-4">
          <span className="text-meta">Bewaard</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {docs.length === 0 ? (
          <p className="mt-8 text-center font-body text-lg italic text-foreground-muted">
            Nog geen documenten.
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {docs.map((d) => (
              <Slab key={d.id} className="flex flex-wrap items-center gap-4 p-5">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-gold">
                  <FileText className="size-4" />
                </span>
                <div className="flex flex-1 flex-col">
                  <span className="font-body text-[1.0625rem] text-foreground">
                    {d.title}
                  </span>
                  <span className="text-meta text-foreground-muted">
                    {format(new Date(d.created_at), "d MMMM yyyy", { locale: nl })}
                  </span>
                </div>
                {d.url ? (
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-meta text-gold transition-colors hover:text-foreground"
                  >
                    <Download className="size-3.5" />
                    Openen
                  </a>
                ) : null}
              </Slab>
            ))}
          </div>
        )}
      </section>

      <p className="mt-16 text-center font-body text-sm italic text-foreground-muted">
        Woorden op papier dragen soms het meeste gevoel.
      </p>
    </main>
  );
}
