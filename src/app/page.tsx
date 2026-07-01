import Link from "next/link";
import {
  Archive,
  Clock,
  Image as ImageIcon,
  KeyRound,
  Leaf,
  Lock,
  MessagesSquare,
  Mic,
  Play,
  Shield,
  Sparkles,
  UserPlus,
  Users,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/everloom/site-header";
import { SiteFooter } from "@/components/everloom/site-footer";
import { PhoneFrame } from "@/components/everloom/phone-frame";
import { PricingSection } from "@/components/everloom/pricing";
import { ImageBand, PlaceStory } from "@/components/everloom/marketing";
import { Reveal } from "@/components/brand/reveal";
import { siteUrl } from "@/lib/env";

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: MessagesSquare, title: "AI-interviews", body: "Persoonlijke vragen die het gesprek makkelijk maken." },
  { icon: ImageIcon, title: "Foto's & video's", body: "Bewaar en organiseer je mooiste momenten voor altijd." },
  { icon: Mic, title: "Stem & audio", body: "Leg stemmen en verhalen vast zoals ze echt klinken." },
  { icon: Clock, title: "Tijdcapsules", body: "Berichten voor later, op het juiste moment in de toekomst." },
  { icon: Users, title: "Familie delen", body: "Nodig familie uit om verhalen toe te voegen en te bewaren." },
  { icon: Waypoints, title: "Levenslijn", body: "Breng mijlpalen en mensen samen in één prachtige tijdlijn." },
];

const STEPS: { icon: LucideIcon; step: string; title: string; body: string }[] = [
  { icon: Sparkles, step: "1", title: "Vertel je verhaal", body: "De AI stelt persoonlijke vragen en helpt je herinneringen vast te leggen." },
  { icon: ImageIcon, step: "2", title: "Voeg herinneringen toe", body: "Upload foto's, video's, audio, brieven en notities." },
  { icon: UserPlus, step: "3", title: "Nodig familie uit", body: "Bepaal zelf wie mag meekijken, aanvullen of luisteren." },
  { icon: Archive, step: "4", title: "Bewaar het voor later", body: "Maak een veilig familie-archief dat generaties meegaat." },
];

const TRUST: { icon: LucideIcon; text: string }[] = [
  { icon: Users, text: "Alleen toegang voor mensen die jij uitnodigt" },
  { icon: Lock, text: "Privéherinneringen per persoon instelbaar" },
  { icon: Shield, text: "Sterke beveiliging & AVG/GDPR-ready" },
  { icon: KeyRound, text: "Data exporteren of verwijderen wanneer jij wilt" },
];

const TIMELINE = [
  { year: "1955", text: "Geboren in Amsterdam" },
  { year: "1978", text: "Eerste reis naar Spanje" },
  { year: "1985", text: "Julie is geboren" },
  { year: "1992", text: "Verhuisd naar Laren" },
];

const TESTIMONIALS: {
  quote: string;
  name: string;
  role: string;
  image: string;
}[] = [
  {
    quote:
      "Mijn vader is er niet meer, maar zijn stem en verhalen zijn er nog. Mijn kinderen kunnen hem nu écht leren kennen.",
    name: "Een dochter",
    role: "Illustratief voorbeeld",
    image: "/marketing/portrait-3.jpg",
  },
  {
    quote:
      "We hebben samen zijn levensverhaal opgenomen in zijn laatste jaar. Het mooiste wat we ooit hebben gedaan.",
    name: "Nabestaanden",
    role: "Illustratief voorbeeld",
    image: "/marketing/portrait-1.jpg",
  },
  {
    quote:
      "Een foto laat zien waar je was. Everlooms laat zien wíe je was — dat is onbetaalbaar.",
    name: "Een kleinzoon",
    role: "Illustratief voorbeeld",
    image: "/marketing/portrait-2.jpg",
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Wat is Everlooms?",
    a: "Everlooms helpt je om tijdens je leven je herinneringen, foto's, stem en verhalen vast te leggen, zodat je familie ze voor altijd kan blijven ontdekken.",
  },
  {
    q: "Doet de AI alsof mijn dierbare nog leeft?",
    a: "Nee. Everlooms is altijd duidelijk een herinnering, opgebouwd uit wat er is vastgelegd. Het verzint niets en zegt eerlijk wanneer iets niet bekend is.",
  },
  {
    q: "Wie kan mijn nalatenschap zien?",
    a: "Jij bepaalt het. Je nodigt zelf familie uit met eigen rechten, en je kunt alles privé houden of juist delen.",
  },
  {
    q: "Wat gebeurt er na mijn overlijden?",
    a: "Je nabestaanden houden de gedenkplek actief per periode van 5 jaar, in één keer voor 20 jaar, of voor altijd. Er wordt nooit iets verwijderd zonder bericht.",
  },
  {
    q: "Is mijn data veilig en AVG-proof?",
    a: "Ja. Alles wordt versleuteld bewaard, je kunt je gegevens op elk moment exporteren of verwijderen, en we voldoen aan de AVG/GDPR.",
  },
];

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-forest px-7 font-meta text-sm text-cream shadow-sm transition-colors hover:bg-forest-deep"
    >
      {children}
    </Link>
  );
}

export default function EverloomsHome() {
  const base = siteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Everlooms",
        url: base,
        slogan: "Jouw verhaal. Voor altijd dichtbij.",
      },
      { "@type": "WebSite", name: "Everlooms", url: base },
      {
        "@type": "SoftwareApplication",
        name: "Everlooms",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="min-h-dvh bg-cream font-meta text-cream-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <Reveal className="flex flex-col gap-7">
          <span className="inline-flex items-center gap-2 font-meta text-xs uppercase tracking-[0.16em] text-bronze">
            <Leaf className="size-4" />
            Jouw verhaal. Voor altijd dichtbij.
          </span>
          <h1 className="font-display text-[clamp(2.6rem,6vw,4.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-forest-deep">
            Bewaar je verhaal voor de mensen die van je houden.
          </h1>
          <p className="max-w-xl font-meta text-lg leading-relaxed text-cream-ink/75">
            Everlooms helpt je om herinneringen, foto&apos;s, video&apos;s,
            stemfragmenten en levenslessen vast te leggen, zodat jouw familie je
            verhaal altijd kan blijven ontdekken.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <PrimaryLink href="/login">Begin jouw verhaal</PrimaryLink>
            <a
              href="#hoe-het-werkt"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-forest/25 px-6 font-meta text-sm text-forest transition-colors hover:bg-forest/5"
            >
              <Play className="size-4" />
              Bekijk hoe het werkt
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2">
            {[
              { icon: Lock, text: "Versleuteld bewaard" },
              { icon: Shield, text: "AVG-proof" },
              { icon: KeyRound, text: "Altijd te verwijderen" },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <span
                  key={t.text}
                  className="inline-flex items-center gap-1.5 font-meta text-xs text-cream-ink/60"
                >
                  <Icon className="size-3.5 text-bronze" />
                  {t.text}
                </span>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative mx-auto w-full max-w-xl">
          <div className="overflow-hidden rounded-3xl border border-sand shadow-[0_40px_80px_-40px_rgba(60,75,54,0.55)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/marketing/hero.jpg"
              alt="Grootouders en een kleinkind kijken samen naar oude foto's"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-8 -right-3 hidden w-[196px] lg:block">
            <PhoneFrame>
              <div className="px-3.5 pb-4">
                <p className="font-display text-base text-forest-deep">
                  Mijn levenslijn
                </p>
                <div className="mt-3 flex flex-col gap-2.5">
                  {TIMELINE.slice(0, 3).map((t) => (
                    <div key={t.year} className="flex items-center gap-2">
                      <span className="size-1.5 shrink-0 rounded-full bg-forest" />
                      <div className="flex flex-1 flex-col">
                        <span className="font-meta text-[0.58rem] font-medium text-bronze">
                          {t.year}
                        </span>
                        <span className="font-meta text-[0.68rem] text-cream-ink/80">
                          {t.text}
                        </span>
                      </div>
                      <span className="size-7 shrink-0 rounded-md bg-gradient-to-br from-sand to-wheat" />
                    </div>
                  ))}
                </div>
              </div>
            </PhoneFrame>
          </div>
        </Reveal>
      </section>

      {/* Functies */}
      <section id="functies" className="border-y border-sand bg-sand/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-[-0.015em] text-forest-deep">
              Alles wat je nodig hebt om herinneringen te bewaren
            </h2>
            <p className="mt-4 font-meta text-lg text-cream-ink/70">
              Met Everlooms bouw je stap voor stap een persoonlijk familiearchief.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={(i % 3) * 0.06}>
                  <div className="flex h-full flex-col gap-4 rounded-2xl border border-sand bg-[#fdfbf6] p-7">
                    <span className="inline-flex size-12 items-center justify-center rounded-full bg-sand text-forest">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="font-display text-xl text-forest-deep">
                      {f.title}
                    </h3>
                    <p className="font-meta text-[0.95rem] leading-relaxed text-cream-ink/70">
                      {f.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hoe het werkt */}
      <section id="hoe-het-werkt" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-[-0.015em] text-forest-deep">
              Hoe het werkt
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <Reveal key={s.step} delay={(i % 2) * 0.06}>
                    <div className="flex h-full flex-col gap-3 rounded-2xl border border-sand bg-[#fdfbf6] p-6">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-forest font-meta text-sm text-cream">
                          {s.step}
                        </span>
                        <Icon className="size-5 text-forest" />
                      </div>
                      <h3 className="font-display text-lg text-forest-deep">
                        {s.title}
                      </h3>
                      <p className="font-meta text-[0.95rem] leading-relaxed text-cream-ink/70">
                        {s.body}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.1}>
              <div
                id="veiligheid"
                className="flex h-full flex-col gap-6 rounded-2xl bg-forest-deep p-8 text-cream"
              >
                <h3 className="font-display text-2xl leading-snug">
                  Jij bepaalt wat, wie en wanneer.
                </h3>
                <ul className="flex flex-col gap-4">
                  {TRUST.map((t) => {
                    const Icon = t.icon;
                    return (
                      <li key={t.text} className="flex items-start gap-3">
                        <Icon className="mt-0.5 size-4 shrink-0 text-wheat" />
                        <span className="font-meta text-sm leading-relaxed text-cream/85">
                          {t.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-auto flex items-center gap-2 rounded-xl bg-cream/10 px-4 py-3">
                  <Lock className="size-4 text-wheat" />
                  <span className="font-meta text-sm text-cream/85">
                    Jouw verhaal is veilig bij Everlooms.
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Voor wie / app preview */}
      <section id="voor-wie" className="border-y border-sand bg-sand/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="max-w-2xl">
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-[-0.015em] text-forest-deep">
              Jouw herinneringen. Overzichtelijk &amp; veilig.
            </h2>
            <p className="mt-4 font-meta text-lg text-cream-ink/70">
              Van de eerste herinnering tot een compleet familiearchief — alles op
              één rustige, warme plek.
            </p>
          </Reveal>

          <div className="mt-14 flex flex-wrap items-start justify-center gap-8">
            {[
              { label: "Levenslijn", rows: TIMELINE.slice(0, 3) },
              { label: "Herinneringen", rows: TIMELINE.slice(1, 4) },
              { label: "Familie", rows: TIMELINE.slice(0, 3) },
            ].map((screen, i) => (
              <Reveal key={screen.label} delay={i * 0.08} className="flex flex-col items-center gap-4">
                <PhoneFrame className="max-w-[210px]">
                  <div className="px-3.5 pb-4">
                    <p className="font-display text-base text-forest-deep">
                      {screen.label}
                    </p>
                    <div className="mt-3 flex flex-col gap-2.5">
                      {screen.rows.map((r, j) => (
                        <div
                          key={j}
                          className="flex items-center gap-2.5 rounded-lg border border-sand bg-cream/70 p-2"
                        >
                          <span className="size-8 shrink-0 rounded-md bg-gradient-to-br from-sand to-wheat" />
                          <div className="flex flex-col">
                            <span className="font-meta text-[0.62rem] text-bronze">
                              {r.year}
                            </span>
                            <span className="font-meta text-[0.72rem] text-cream-ink/80">
                              {r.text}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </PhoneFrame>
                <span className="font-meta text-sm text-cream-ink/70">
                  {screen.label}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Place-based story example */}
      <PlaceStory />

      {/* Warm image band */}
      <div className="pb-4 pt-8">
        <ImageBand
          src="/marketing/generations.jpg"
          alt="Drie generaties genieten samen van herinneringen"
        />
      </div>

      {/* Prijzen */}
      <PricingSection />

      {/* Testimonials */}
      <section className="border-y border-sand bg-sand/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-[-0.015em] text-forest-deep">
              Waarom mensen hun verhaal bewaren
            </h2>
            <p className="mt-4 font-meta text-sm text-cream-ink/60">
              Illustratieve voorbeelden van wat Everlooms voor een familie kan
              betekenen.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.07}>
                <figure className="flex h-full flex-col gap-6 rounded-2xl border border-sand bg-[#fdfbf6] p-7">
                  <blockquote className="font-display text-lg leading-relaxed text-forest-deep">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.image}
                      alt=""
                      aria-hidden="true"
                      className="size-11 rounded-full object-cover"
                    />
                    <span className="flex flex-col">
                      <span className="font-meta text-sm text-cream-ink">{t.name}</span>
                      <span className="font-meta text-xs text-cream-ink/60">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal className="text-center">
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-[-0.015em] text-forest-deep">
              Veelgestelde vragen
            </h2>
          </Reveal>
          <div className="mt-12 flex flex-col divide-y divide-sand">
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={(i % 3) * 0.05}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-forest-deep">
                    {f.q}
                    <span className="text-bronze transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 font-meta text-[0.95rem] leading-relaxed text-cream-ink/75">
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
