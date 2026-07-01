import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Crown, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getLegacyBySlug, isLegacyOwner } from "@/lib/data/legacy";
import { getMembers } from "@/lib/data/members";
import { Slab } from "@/components/ui/slab";
import { Seam } from "@/components/ui/seam";
import { InviteForm } from "./invite-form";
import { revokeMember } from "./actions";

export const metadata: Metadata = { title: "Delen" };

const ROLE_LABEL: Record<string, string> = {
  viewer: "Mag meelezen",
  contributor: "Mag bijdragen",
  admin: "Mag beheren",
  owner: "Eigenaar",
};

const STATUS_LABEL: Record<string, string> = {
  invited: "Uitgenodigd",
  active: "Actief",
  revoked: "Ingetrokken",
};

export default async function DelenPage({
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

  const isOwner = await isLegacyOwner(legacy.id);
  const members = await getMembers(legacy.id);

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
          <UserRound className="size-5" />
        </span>
        <span className="text-meta">Delen</span>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.015em] text-foreground">
          Wie mag deze nalatenschap zien
        </h1>
        <p className="mt-4 max-w-xl font-body text-lg italic leading-relaxed text-foreground-muted">
          Nodig familie uit met eigen rechten. Jij bepaalt wie mag meelezen,
          bijdragen of beheren.
        </p>
      </header>

      <Seam className="mt-12 w-full" />

      {error ? (
        <div className="mt-8 rounded-xl border border-danger/40 bg-danger/[0.08] px-5 py-4 font-body text-sm text-foreground-secondary">
          {error}
        </div>
      ) : null}

      {/* Members */}
      <section className="mt-10 flex flex-col gap-3">
        <Slab className="flex items-center gap-4 p-5">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-gold/[0.1] text-gold">
            <Crown className="size-4" />
          </span>
          <div className="flex flex-1 flex-col">
            <span className="font-body text-[1.0625rem] text-foreground">
              {isOwner ? "Jij" : "De eigenaar"}
            </span>
            <span className="text-meta text-foreground-muted">Eigenaar · volledige toegang</span>
          </div>
        </Slab>

        {members.map((m) => (
          <Slab key={m.id} className="flex flex-wrap items-center gap-4 p-5">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-surface-elevated text-foreground-muted">
              <UserRound className="size-4" />
            </span>
            <div className="flex flex-1 flex-col">
              <span className="font-body text-[1.0625rem] text-foreground">
                {m.invited_email}
              </span>
              <span className="text-meta text-foreground-muted">
                {ROLE_LABEL[m.role] ?? m.role}
                {m.relation ? ` · ${m.relation}` : ""}
              </span>
            </div>
            <span
              className={
                "rounded-full px-3 py-1 text-meta " +
                (m.status === "active"
                  ? "bg-sage/15 text-sage"
                  : "bg-gold/[0.1] text-gold")
              }
            >
              {STATUS_LABEL[m.status] ?? m.status}
            </span>
            {isOwner ? (
              <form action={revokeMember}>
                <input type="hidden" name="slug" value={legacy.slug} />
                <input type="hidden" name="memberId" value={m.id} />
                <button
                  type="submit"
                  className="text-meta text-foreground-muted transition-colors hover:text-danger"
                >
                  intrekken
                </button>
              </form>
            ) : null}
          </Slab>
        ))}

        {members.length === 0 ? (
          <p className="py-4 text-center font-body text-foreground-muted">
            Nog niemand uitgenodigd.
          </p>
        ) : null}
      </section>

      {/* Invite */}
      {isOwner ? (
        <Slab className="mt-8 p-7 sm:p-8">
          <h2 className="font-display text-xl text-foreground">
            Nodig iemand uit
          </h2>
          <p className="mt-2 font-body text-[0.95rem] text-foreground-muted">
            Ze krijgen toegang zodra ze inloggen met dit e-mailadres.
          </p>
          <div className="mt-6">
            <InviteForm
              slug={legacy.slug}
              legacyId={legacy.id}
              legacyName={legacy.full_name}
            />
          </div>
        </Slab>
      ) : (
        <p className="mt-8 text-center font-body text-sm italic text-foreground-muted">
          Alleen de eigenaar kan familie uitnodigen.
        </p>
      )}

      <p className="mt-16 text-center font-body text-sm italic text-foreground-muted">
        Gedeelde herinneringen worden dubbel zo mooi.
      </p>
    </main>
  );
}
