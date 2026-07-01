import type { Metadata } from "next";
import Link from "next/link";
import {
  Lock,
  ShieldCheck,
  KeyRound,
  Users,
  EyeOff,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/everloom/site-header";
import { SiteFooter } from "@/components/everloom/site-footer";
import { MarketingHero, CtaBand } from "@/components/everloom/marketing";
import { Reveal } from "@/components/brand/reveal";

export const metadata: Metadata = {
  title: "Veiligheid",
  description:
    "Hoe Everlooms jouw herinneringen beschermt: versleuteld, streng afgeschermd, volledig AVG-proof, en altijd te exporteren of te verwijderen. Jij houdt de controle.",
};

const POINTS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Lock,
    title: "Versleuteld bewaard",
    body: "Al je herinneringen, foto's en opnames worden versleuteld opgeslagen bij een Europese hostingpartner.",
  },
  {
    icon: ShieldCheck,
    title: "Streng afgeschermd",
    body: "Row-level security zorgt dat alleen mensen die jij uitnodigt bij jouw nalatenschap kunnen — technisch afgedwongen, niet alleen beloofd.",
  },
  {
    icon: Users,
    title: "Jij bepaalt wie wat ziet",
    body: "Nodig familie uit met eigen rechten: meelezen, bijdragen of beheren. Alles kan privé blijven.",
  },
  {
    icon: EyeOff,
    title: "Nooit voor advertenties",
    body: "We verkopen je gegevens nooit en gebruiken ze niet voor advertenties of om AI-modellen te trainen.",
  },
  {
    icon: KeyRound,
    title: "AVG/GDPR-proof",
    body: "Je hebt recht op inzage, correctie en dataportabiliteit. Exporteer je volledige archief wanneer je wilt.",
  },
  {
    icon: Trash2,
    title: "Altijd verwijderbaar",
    body: "Verwijder een nalatenschap of je volledige account definitief, op elk moment — onomkeerbaar en volledig.",
  },
];

export default function VeiligheidPage() {
  return (
    <div className="min-h-dvh bg-cream font-meta text-cream-ink">
      <SiteHeader />
      <MarketingHero
        eyebrow="Veiligheid & privacy"
        title="Jouw herinneringen, veilig bewaard"
        intro="Een nalatenschap is het meest persoonlijke wat er is. Daarom is veiligheid bij Everlooms geen bijzaak, maar het fundament — en houd jij altijd de controle."
        image="/marketing/security.jpg"
        alt="Een rustige, veilige plek voor herinneringen"
      />

      <section className="border-y border-sand bg-sand/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {POINTS.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={(i % 3) * 0.06}>
                  <div className="flex h-full flex-col gap-4 rounded-2xl border border-sand bg-[#fdfbf6] p-7">
                    <span className="inline-flex size-12 items-center justify-center rounded-full bg-sand text-forest">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="font-display text-xl text-forest-deep">
                      {p.title}
                    </h3>
                    <p className="font-meta text-[0.95rem] leading-relaxed text-cream-ink/70">
                      {p.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.5rem)] leading-tight text-forest-deep">
            En de AI? Altijd eerlijk.
          </h2>
          <p className="mt-4 font-meta text-lg leading-relaxed text-cream-ink/75">
            De AI-herinnering antwoordt uitsluitend op basis van wat er is
            vastgelegd. Ze doet nooit alsof iemand nog leeft en zegt eerlijk
            wanneer iets niet bekend is.
          </p>
          <Link
            href="/privacy"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-full border border-forest/30 px-6 font-meta text-sm text-forest transition-colors hover:bg-forest/5"
          >
            Lees ons volledige privacybeleid
          </Link>
        </div>
      </section>

      <CtaBand
        title="Bewaar je verhaal, met een gerust hart"
        sub="Versleuteld, privé en altijd van jou."
      />
      <SiteFooter />
    </div>
  );
}
