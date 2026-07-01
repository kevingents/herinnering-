import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { canEditLegacy, getLegacyBySlug } from "@/lib/data/legacy";
import { getFamily } from "@/lib/data/family";
import { Seam } from "@/components/ui/seam";
import { AddPersonForm } from "./add-person-form";
import { FamilyTree } from "./family-tree";

export const metadata: Metadata = { title: "Familie" };

export default async function FamiliePage({
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

  const people = await getFamily(legacy.id);
  const canEdit = await canEditLegacy(legacy.id);

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
          <Users className="size-5" />
        </span>
        <span className="text-meta">Familie</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.015em] text-foreground">
          De mensen om dit leven heen
        </h1>
        <p className="mt-4 max-w-xl font-body text-lg italic leading-relaxed text-foreground-muted">
          Breng de generaties samen — ouders, partner, kinderen en kleinkinderen
          in één boom.
        </p>
      </header>

      <Seam className="mt-12 w-full" />

      {error ? (
        <div className="mt-8 rounded-xl border border-danger/40 bg-danger/[0.08] px-5 py-4 font-body text-sm text-foreground-secondary">
          {error}
        </div>
      ) : null}

      {canEdit ? (
        <div className="mt-10 flex justify-center">
          <AddPersonForm slug={legacy.slug} legacyId={legacy.id} />
        </div>
      ) : null}

      <section className="mt-14">
        {people.length === 0 ? (
          <p className="text-center font-body text-lg italic text-foreground-muted">
            Nog geen familie toegevoegd. Begin met de naasten.
          </p>
        ) : (
          <FamilyTree
            subjectName={legacy.full_name}
            people={people}
            slug={legacy.slug}
            canEdit={canEdit}
          />
        )}
      </section>

      <p className="mt-16 text-center font-body text-sm italic text-foreground-muted">
        Elk leven is verweven met andere levens.
      </p>
    </main>
  );
}
