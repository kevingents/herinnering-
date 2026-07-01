import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  ShieldAlert,
  Users,
  Waypoints,
  QrCode,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminOverview } from "@/lib/data/admin";
import { Slab } from "@/components/ui/slab";
import { Seam } from "@/components/ui/seam";

export const metadata: Metadata = { title: "Admin" };

const PLAN_LABEL: Record<string, string> = {
  free: "Gratis",
  premium: "Premium",
  legacy_lifetime: "Voor altijd",
};

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const data = await getAdminOverview();

  const kpis = [
    { icon: Waypoints, label: "Nalatenschappen", value: data.counts.legacies },
    { icon: Users, label: "Gebruikers", value: data.counts.users },
    { icon: Users, label: "Leden & uitnodigingen", value: data.counts.members },
    { icon: QrCode, label: "Gedenkplek-codes", value: data.counts.markers },
  ];

  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-6 py-10">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-meta transition-colors hover:text-gold"
        >
          <ArrowLeft className="size-3.5" />
          Dashboard
        </Link>
        <span className="text-meta text-foreground-muted">{admin.email}</span>
      </div>

      <header className="mt-12 flex flex-col gap-2">
        <span className="text-meta">Admin</span>
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.015em] text-foreground">
          Beheer
        </h1>
        <p className="max-w-xl font-body text-lg italic leading-relaxed text-foreground-muted">
          Een overzicht van het platform. Alleen zichtbaar voor beheerders.
        </p>
      </header>

      <Seam className="mt-10 w-full" />

      {/* KPI's */}
      <section className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Slab key={k.label} className="flex flex-col gap-3 p-5">
              <Icon className="size-5 text-gold" />
              <span className="font-display text-3xl text-foreground">
                {k.value}
              </span>
              <span className="text-meta text-foreground-muted">{k.label}</span>
            </Slab>
          );
        })}
      </section>

      {/* Abonnementen + privacy */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <Slab className="flex flex-col gap-4 p-6">
          <span className="flex items-center gap-2 font-display text-lg text-foreground">
            <CreditCard className="size-4 text-gold" />
            Abonnementen
          </span>
          {data.subscriptions.length === 0 ? (
            <p className="font-body text-sm text-foreground-muted">
              Nog geen abonnementen.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {data.subscriptions.map((s) => (
                <li
                  key={s.plan}
                  className="flex items-center justify-between font-body text-sm text-foreground-secondary"
                >
                  <span>{PLAN_LABEL[s.plan] ?? s.plan}</span>
                  <span className="text-foreground">{s.count}</span>
                </li>
              ))}
            </ul>
          )}
        </Slab>

        <Slab className="flex flex-col gap-4 p-6">
          <span className="flex items-center gap-2 font-display text-lg text-foreground">
            <ShieldAlert className="size-4 text-gold" />
            AVG-verzoeken
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-foreground">
              {data.privacyPending}
            </span>
            <span className="text-meta text-foreground-muted">
              openstaand
            </span>
          </div>
        </Slab>
      </section>

      {/* Recente nalatenschappen */}
      <section className="mt-10">
        <div className="flex items-center gap-4">
          <span className="text-meta">Recente nalatenschappen</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        {data.recentLegacies.length === 0 ? (
          <p className="mt-6 font-body text-sm text-foreground-muted">
            Nog geen nalatenschappen.
          </p>
        ) : (
          <ul className="mt-6 flex flex-col gap-2">
            {data.recentLegacies.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/legacy/${l.slug}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-gold/40"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-body text-base text-foreground">
                      {l.full_name}
                    </span>
                    <span className="truncate text-meta text-foreground-muted">
                      {l.owner_email ?? "onbekende eigenaar"}
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end">
                    <span className="text-meta text-foreground-muted">
                      {l.status === "memorial" ? "Gedenkplek" : "In opbouw"}
                    </span>
                    <span className="text-meta text-foreground-muted/70">
                      {format(new Date(l.created_at), "d MMM yyyy", {
                        locale: nl,
                      })}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Partner-aanvragen */}
      <section className="mt-10">
        <div className="flex items-center gap-4">
          <span className="text-meta">Partner-aanvragen</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        {data.partnerLeads.length === 0 ? (
          <p className="mt-6 font-body text-sm text-foreground-muted">
            Nog geen aanvragen van uitvaartondernemers.
          </p>
        ) : (
          <ul className="mt-6 flex flex-col gap-3">
            {data.partnerLeads.map((lead) => (
              <li key={lead.id}>
                <Slab className="flex flex-col gap-2 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-2 font-display text-lg text-foreground">
                      <Building2 className="size-4 text-gold" />
                      {lead.organization || lead.name}
                    </span>
                    <span className="text-meta text-foreground-muted">
                      {format(new Date(lead.created_at), "d MMM yyyy", {
                        locale: nl,
                      })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-meta text-foreground-muted">
                    <span>{lead.name}</span>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-gold transition-colors hover:text-foreground"
                    >
                      {lead.email}
                    </a>
                    {lead.phone ? <span>{lead.phone}</span> : null}
                  </div>
                  {lead.message ? (
                    <p className="font-body text-[0.95rem] leading-relaxed text-foreground-secondary">
                      {lead.message}
                    </p>
                  ) : null}
                </Slab>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-16 text-center font-body text-sm italic text-foreground-muted">
        Met zorg beheerd.
      </p>
    </main>
  );
}
