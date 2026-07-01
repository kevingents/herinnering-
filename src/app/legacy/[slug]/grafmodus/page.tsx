import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";
import { ArrowLeft, ExternalLink, QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLegacyBySlug } from "@/lib/data/legacy";
import { siteUrl } from "@/lib/env";
import { Slab } from "@/components/ui/slab";
import { Seam } from "@/components/ui/seam";
import { activateGrafmodus, setMarkerActive } from "./actions";

export const metadata: Metadata = { title: "Grafmodus" };

type Marker = {
  id: string;
  code: string;
  is_active: boolean;
  scan_count: number;
  last_scanned_at: string | null;
};

export default async function GrafmodusPage({
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

  const { data } = await supabase
    .from("grave_markers")
    .select("id, code, is_active, scan_count, last_scanned_at")
    .eq("legacy_id", legacy.id)
    .limit(1)
    .maybeSingle();
  const marker = data as Marker | null;

  const memorialUrl = marker ? `${siteUrl()}/graf/${marker.code}` : null;
  const qrSvg = memorialUrl
    ? await QRCode.toString(memorialUrl, {
        type: "svg",
        margin: 1,
        color: { dark: "#0b0c0e", light: "#ede6d8" },
      })
    : null;

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
          <QrCode className="size-5" />
        </span>
        <span className="text-meta">Grafmodus</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.015em] text-foreground">
          Een QR-code op de steen
        </h1>
        <p className="mt-4 max-w-xl font-body text-lg italic leading-relaxed text-foreground-muted">
          Wie bij het graf staat en de code scant, opent een respectvolle
          herinnering — en kan praten met het leven dat hier bewaard is.
        </p>
      </header>

      <Seam className="mt-12 w-full" />

      {error ? (
        <div className="mt-8 rounded-xl border border-danger/40 bg-danger/[0.08] px-5 py-4 font-body text-sm text-foreground-secondary">
          {error}
        </div>
      ) : null}

      <div className="mt-12">
        {!marker ? (
          <Slab className="flex flex-col items-center gap-6 p-8 text-center sm:p-10">
            <p className="max-w-md font-body text-[1.0625rem] leading-relaxed text-foreground-secondary">
              Activeer grafmodus om een unieke QR-code te maken. De gedenkplek
              wordt dan openbaar bezoekbaar via de code — jij houdt de controle
              en kunt het altijd weer uitzetten.
            </p>
            <form action={activateGrafmodus}>
              <input type="hidden" name="slug" value={legacy.slug} />
              <input type="hidden" name="legacyId" value={legacy.id} />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-gradient-to-b from-[#d9ba7e] to-[#c9a15a] px-7 font-meta text-xs uppercase tracking-[0.14em] text-background transition-all hover:brightness-105"
              >
                <QrCode className="size-4" />
                Activeer grafmodus
              </button>
            </form>
          </Slab>
        ) : (
          <div className="flex flex-col gap-6">
            <Slab className="flex flex-col items-center gap-6 p-8 sm:p-10">
              {qrSvg ? (
                <div
                  className="w-56 rounded-2xl bg-[#ede6d8] p-5 shadow-[var(--shadow-slab)] [&_svg]:h-full [&_svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              ) : null}
              <p className="text-center font-body text-sm text-foreground-muted">
                Print deze code en plaats hem op de steen (QR of NFC).
              </p>
            </Slab>

            <Slab className="flex flex-col gap-5 p-7 sm:p-8">
              <div className="flex flex-col gap-1.5">
                <span className="text-meta">Openbare link</span>
                <code className="break-all font-body text-[0.95rem] text-foreground-secondary">
                  {memorialUrl}
                </code>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-meta">Bezoeken</span>
                  <span className="font-display text-2xl text-foreground">
                    {marker.scan_count ?? 0}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-meta">Status</span>
                  <span className="font-display text-2xl text-foreground">
                    {marker.is_active ? "Actief" : "Uit"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href={memorialUrl ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-gold/45 px-6 font-meta text-xs uppercase tracking-[0.14em] text-gold transition-all hover:border-gold/80 hover:bg-gold/[0.06]"
                >
                  <ExternalLink className="size-4" />
                  Bekijk gedenkplek
                </a>
                <form action={setMarkerActive}>
                  <input type="hidden" name="slug" value={legacy.slug} />
                  <input type="hidden" name="markerId" value={marker.id} />
                  <input
                    type="hidden"
                    name="active"
                    value={(!marker.is_active).toString()}
                  />
                  <button
                    type="submit"
                    className="text-meta transition-colors hover:text-gold"
                  >
                    {marker.is_active ? "Zet uit" : "Zet aan"}
                  </button>
                </form>
              </div>
            </Slab>
          </div>
        )}
      </div>

      <p className="mt-16 text-center font-body text-sm italic text-foreground-muted">
        Een respectvolle herinnering — nooit een hologram dat doet alsof iemand
        nog leeft.
      </p>
    </main>
  );
}
