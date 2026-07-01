import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpenText,
  Clock,
  Image as ImageIcon,
  Mic,
  Users,
  PenLine,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getMyLegacies } from "@/lib/data/legacies";
import { claimInvites } from "@/lib/data/members";
import { sendWelcomeEmail } from "@/lib/email/resend";
import { signOut } from "@/lib/auth/actions";
import { isAdmin } from "@/lib/auth/admin";
import { Slab } from "@/components/ui/slab";
import { Seam } from "@/components/ui/seam";
import { CreateLegacyForm } from "./create-legacy-form";

export const metadata: Metadata = { title: "Dashboard" };

const QUICK_ACTIONS: { icon: LucideIcon; label: string }[] = [
  { icon: PenLine, label: "Nieuwe herinnering" },
  { icon: BookOpenText, label: "Levensverhaal" },
  { icon: Mic, label: "Stem opnemen" },
  { icon: ImageIcon, label: "Foto's uploaden" },
  { icon: Users, label: "Familie uitnodigen" },
  { icon: Clock, label: "Tijdcapsule maken" },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Link any pending family invites to this account (matched by e-mail).
  await claimInvites(user.email, user.id);

  // Send a branded welcome e-mail once (on first login).
  const { data: prof } = await supabase
    .from("profiles")
    .select("welcomed_at")
    .eq("id", user.id)
    .maybeSingle();
  if (prof && !(prof as { welcomed_at: string | null }).welcomed_at && user.email) {
    const ok = await sendWelcomeEmail({ to: user.email });
    if (ok) {
      await supabase
        .from("profiles")
        .update({ welcomed_at: new Date().toISOString() })
        .eq("id", user.id);
    }
  }

  const legacies = await getMyLegacies();
  const admin = await isAdmin();
  const name =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "";

  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-6 py-10">
      {/* header */}
      <header className="flex items-center justify-between">
        <span className="font-display text-lg tracking-wide text-foreground">
          Everlooms
        </span>
        <div className="flex items-center gap-6">
          {admin ? (
            <Link
              href="/admin"
              className="text-meta transition-colors hover:text-gold"
            >
              Admin
            </Link>
          ) : null}
          <Link
            href="/account"
            className="text-meta transition-colors hover:text-gold"
          >
            Account
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="text-meta transition-colors hover:text-gold"
            >
              Uitloggen
            </button>
          </form>
        </div>
      </header>

      <div className="mt-16 flex flex-col gap-2">
        <span className="text-meta">Dashboard</span>
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.015em] text-foreground">
          Welkom{name ? `, ${name}` : ""}
        </h1>
      </div>

      {error ? (
        <div className="mt-6 rounded-xl border border-danger/40 bg-danger/[0.08] px-5 py-4 font-body text-sm text-foreground-secondary">
          {error}
        </div>
      ) : null}

      {/* legacies */}
      <section className="mt-12">
        <div className="flex items-center gap-4">
          <span className="text-meta">Jouw nalatenschappen</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {legacies.length === 0 ? (
          <Slab className="mt-6 p-8 sm:p-10">
            <h2 className="font-display text-2xl text-foreground">
              Begin een heel leven
            </h2>
            <p className="mt-3 max-w-lg font-body text-[1.0625rem] leading-relaxed text-foreground-secondary">
              Maak je eerste nalatenschap aan — voor jezelf, of voor iemand die
              je wilt gedenken.
            </p>
            <div className="mt-7">
              <CreateLegacyForm />
            </div>
          </Slab>
        ) : (
          <div className="mt-6 flex flex-col gap-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {legacies.map((l) => (
                <Link
                  key={l.id}
                  href={`/legacy/${l.slug}`}
                  className="group block"
                >
                  <Slab className="h-full p-7 transition-colors group-hover:border-gold/40">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="size-2 rounded-full bg-amber shadow-[0_0_16px_4px_rgba(224,184,118,0.3)]"
                    />
                    <span className="text-meta">
                      {l.status === "memorial" ? "Gedenkplek" : "In opbouw"}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl text-foreground">
                    {l.full_name}
                  </h3>
                  {l.headline ? (
                    <p className="mt-2 font-body text-[1.0625rem] italic text-foreground-muted">
                      {l.headline}
                    </p>
                  ) : null}
                  </Slab>
                </Link>
              ))}
            </div>

            <Slab className="p-7 sm:p-8">
              <h2 className="font-display text-xl text-foreground">
                Nog een nalatenschap toevoegen
              </h2>
              <div className="mt-5">
                <CreateLegacyForm />
              </div>
            </Slab>
          </div>
        )}
      </section>

      {/* quick actions preview */}
      <section className="mt-16">
        <div className="flex items-center gap-4">
          <span className="text-meta">Vandaag kun je</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {QUICK_ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.label}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface/60 px-4 py-4 text-foreground-secondary"
              >
                <Icon className="size-4 text-gold/80" />
                <span className="font-body text-[0.95rem]">{a.label}</span>
                <span className="ml-auto text-meta text-foreground-muted/60">
                  binnenkort
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <Seam className="mt-16 w-full" />
      <p className="mt-8 text-center font-body text-sm italic text-foreground-muted">
        Rustig aan. Een heel leven bouw je niet op één dag.
      </p>
    </main>
  );
}
