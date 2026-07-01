import type { Metadata } from "next";
import {
  HeartHandshake,
  Sparkles,
  TrendingUp,
  Users,
  ShieldCheck,
  Palette,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/everloom/site-header";
import { SiteFooter } from "@/components/everloom/site-footer";
import { PartnerLeadForm } from "./partner-lead-form";

export const metadata: Metadata = {
  title: "Voor uitvaartondernemers",
  description:
    "Bied nabestaanden een blijvende, waardige digitale herinnering. Werk samen met Everlooms — onderscheidend, ontzorgd, met een aantrekkelijk partnermodel.",
};

const BENEFITS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: HeartHandshake,
    title: "Meer betekenis voor nabestaanden",
    body: "Geef families niet alleen een afscheid, maar een blijvende plek om een heel leven te bezoeken.",
  },
  {
    icon: TrendingUp,
    title: "Extra dienst, extra omzet",
    body: "Een nieuwe, terugkerende bron van inkomsten via een aantrekkelijk partnertarief.",
  },
  {
    icon: Sparkles,
    title: "Onderscheidend vermogen",
    body: "Bied iets wat de meeste uitvaartondernemers nog niet hebben — modern, warm en waardig.",
  },
  {
    icon: Palette,
    title: "In jouw huisstijl",
    body: "Optioneel white-label: de gedenkplek met jouw logo en kleuren.",
  },
  {
    icon: ShieldCheck,
    title: "Wij ontzorgen de techniek",
    body: "Hosting, AI, beveiliging en AVG regelen wij. Jij biedt het simpelweg aan.",
  },
  {
    icon: Users,
    title: "Nazorg die blijft",
    body: "Een natuurlijk verlengstuk van je nazorgtraject dat families jaren later nog waarderen.",
  },
];

const STEPS: { step: string; title: string; body: string }[] = [
  {
    step: "1",
    title: "Word partner",
    body: "We maken kennis, kiezen samen het model (provisie of white-label) en richten je partneraccount in.",
  },
  {
    step: "2",
    title: "Bied het aan",
    body: "Introduceer Everlooms tijdens het uitvaart- of nazorggesprek, met materialen die wij leveren.",
  },
  {
    step: "3",
    title: "Deel in de opbrengst",
    body: "Nabestaanden bouwen de nalatenschap; jij ontvangt een vergoeding per aangesloten familie.",
  },
];

export default function UitvaartondernemersPage() {
  return (
    <div className="min-h-dvh bg-cream font-meta text-cream-ink">
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center lg:py-24">
        <span className="font-meta text-xs uppercase tracking-[0.16em] text-bronze">
          Voor uitvaartondernemers
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4rem)] leading-[1.05] tracking-[-0.02em] text-forest-deep">
          Bied nabestaanden een blijvende herinnering
        </h1>
        <p className="mx-auto mt-5 max-w-2xl font-meta text-lg leading-relaxed text-cream-ink/75">
          Everlooms helpt families een heel leven te bewaren — verhalen, stem,
          foto&apos;s en een eerlijke, respectvolle AI-herinnering. Bied het aan
          als onderdeel van jouw dienstverlening, in een partnermodel dat werkt.
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href="#contact"
            className="inline-flex h-12 items-center justify-center rounded-full bg-forest px-8 font-meta text-sm text-cream transition-colors hover:bg-forest-deep"
          >
            Plan een kennismaking
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-sand bg-sand/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="max-w-2xl font-display text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-[-0.015em] text-forest-deep">
            Waarom uitvaartondernemers met ons samenwerken
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="flex h-full flex-col gap-4 rounded-2xl border border-sand bg-[#fdfbf6] p-7"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-sand text-forest">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-display text-xl text-forest-deep">
                    {b.title}
                  </h3>
                  <p className="font-meta text-[0.95rem] leading-relaxed text-cream-ink/70">
                    {b.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-[-0.015em] text-forest-deep">
            Zo werkt de samenwerking
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="flex h-full flex-col gap-3 rounded-2xl border border-sand bg-[#fdfbf6] p-7"
              >
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-forest font-meta text-sm text-cream">
                  {s.step}
                </span>
                <h3 className="font-display text-lg text-forest-deep">
                  {s.title}
                </h3>
                <p className="font-meta text-[0.95rem] leading-relaxed text-cream-ink/70">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-sand bg-sand/30 py-20">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-[-0.015em] text-forest-deep">
              Laten we kennismaken
            </h2>
            <p className="max-w-md font-meta text-lg leading-relaxed text-cream-ink/75">
              Vertel ons kort over je onderneming. We denken graag mee over de
              beste manier om Everlooms aan te bieden aan de families die je
              begeleidt.
            </p>
            <p className="font-meta text-sm text-cream-ink/60">
              Of mail direct naar{" "}
              <a href="mailto:partners@everlooms.app" className="text-forest underline">
                partners@everlooms.app
              </a>
            </p>
          </div>
          <PartnerLeadForm />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
