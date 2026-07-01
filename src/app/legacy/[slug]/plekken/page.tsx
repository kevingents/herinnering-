import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLegacyBySlug, canEditLegacy } from "@/lib/data/legacy";
import { getPlaces } from "@/lib/data/places";
import { Seam } from "@/components/ui/seam";
import { PlekkenClient } from "./plekken-client";

export const metadata: Metadata = { title: "Plekken" };

export default async function PlekkenPage({
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

  const [places, canEdit] = await Promise.all([
    getPlaces(legacy.id),
    canEditLegacy(legacy.id),
  ]);

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
          <MapPin className="size-5" />
        </span>
        <span className="text-meta">Plekken</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.015em] text-foreground">
          Waar het leven zich afspeelde
        </h1>
        <p className="mt-4 max-w-xl font-body text-lg italic leading-relaxed text-foreground-muted">
          Koppel herinneringen aan de plek waar ze gebeurden. Sta later op
          precies dezelfde plek en zie de foto&apos;s en verhalen van toen.
        </p>
      </header>

      <Seam className="mt-12 w-full" />

      <div className="mt-10">
        <PlekkenClient
          slug={legacy.slug}
          legacyId={legacy.id}
          places={places}
          canEdit={canEdit}
        />
      </div>

      <p className="mt-16 text-center font-body text-sm italic text-foreground-muted">
        Elke plek draagt een herinnering die er ooit gebeurde.
      </p>
    </main>
  );
}
