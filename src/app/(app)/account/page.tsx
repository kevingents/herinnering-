import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Download,
  KeyRound,
  Lock,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Slab } from "@/components/ui/slab";
import { Seam } from "@/components/ui/seam";
import { DeleteAccountButton, DeleteLegacyButton } from "./danger-actions";

export const metadata: Metadata = { title: "Account & gegevens" };

const SAFEGUARDS = [
  { icon: Lock, text: "Alles wordt versleuteld bewaard." },
  { icon: ShieldCheck, text: "Streng afgeschermd — alleen mensen die jij uitnodigt." },
  { icon: KeyRound, text: "Jij kunt je gegevens altijd exporteren of verwijderen." },
];

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; deleted?: string }>;
}) {
  const { error, deleted } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("legacies")
    .select("id, full_name, slug")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true });
  const owned = (data ?? []) as { id: string; full_name: string; slug: string }[];

  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-6 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-meta transition-colors hover:text-gold"
      >
        <ArrowLeft className="size-3.5" />
        Dashboard
      </Link>

      <header className="mt-12 flex flex-col gap-2">
        <span className="text-meta">Account &amp; gegevens</span>
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.015em] text-foreground">
          Jouw gegevens, jouw controle
        </h1>
        <p className="font-body text-lg leading-relaxed text-foreground-secondary">
          Ingelogd als {user.email}.
        </p>
      </header>

      {deleted ? (
        <div className="mt-8 rounded-xl border border-sage/40 bg-sage/[0.1] px-5 py-4 font-body text-sm text-foreground-secondary">
          De nalatenschap is definitief verwijderd.
        </div>
      ) : null}
      {error ? (
        <div className="mt-8 rounded-xl border border-danger/40 bg-danger/[0.08] px-5 py-4 font-body text-sm text-foreground-secondary">
          {error}
        </div>
      ) : null}

      <Seam className="mt-10 w-full" />

      {/* Security + export */}
      <section className="mt-10">
        <h2 className="font-display text-2xl text-foreground">Veilig bewaard</h2>
        <ul className="mt-5 flex flex-col gap-3">
          {SAFEGUARDS.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.text} className="flex items-start gap-3">
                <Icon className="mt-0.5 size-4 shrink-0 text-gold" />
                <span className="font-body text-[1.0625rem] text-foreground-secondary">
                  {s.text}
                </span>
              </li>
            );
          })}
        </ul>
        <a
          href="/account/export"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-gold/45 px-6 font-meta text-xs uppercase tracking-[0.14em] text-gold transition-all hover:border-gold/80 hover:bg-gold/[0.06]"
        >
          <Download className="size-4" />
          Exporteer mijn gegevens
        </a>
      </section>

      {/* Owned legacies */}
      <section className="mt-12">
        <div className="flex items-center gap-4">
          <span className="text-meta">Jouw nalatenschappen</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        {owned.length === 0 ? (
          <p className="mt-6 font-body text-foreground-muted">
            Je hebt nog geen eigen nalatenschap.
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {owned.map((l) => (
              <Slab key={l.id} className="flex flex-wrap items-center gap-4 p-5">
                <span className="flex-1 font-display text-xl text-foreground">
                  {l.full_name}
                </span>
                <DeleteLegacyButton legacyId={l.id} name={l.full_name} />
              </Slab>
            ))}
          </div>
        )}
      </section>

      {/* Danger zone */}
      <section className="mt-14 rounded-2xl border border-danger/30 bg-danger/[0.05] p-7">
        <div className="flex items-center gap-2.5">
          <Trash2 className="size-4 text-danger" />
          <h2 className="font-display text-xl text-foreground">Account verwijderen</h2>
        </div>
        <p className="mt-3 max-w-lg font-body text-[0.95rem] leading-relaxed text-foreground-secondary">
          Dit verwijdert je account en alle nalatenschappen, herinneringen,
          foto&apos;s en opnames definitief. Dit kan niet ongedaan worden gemaakt.
        </p>
        <div className="mt-6">
          <DeleteAccountButton />
        </div>
      </section>

      <p className="mt-16 text-center font-body text-sm italic text-foreground-muted">
        Jij houdt altijd de controle over je eigen verhaal.
      </p>
    </main>
  );
}
