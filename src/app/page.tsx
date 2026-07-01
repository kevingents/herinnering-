import Link from "next/link";
import {
  Archive,
  Check,
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
  Star,
  UserPlus,
  Users,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/everloom/site-header";
import { SiteFooter } from "@/components/everloom/site-footer";
import { PhoneFrame } from "@/components/everloom/phone-frame";
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

type Plan = {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  featured?: boolean;
  cta: string;
};

// While you live — a yearly subscription.
const LIVING_PLANS: Plan[] = [
  {
    name: "Start",
    price: "Gratis",
    tagline: "Voor wie wil beginnen met vastleggen",
    features: ["AI-interviews", "Foto's & audio opslaan", "Persoonlijke levenslijn"],
    cta: "Gratis proberen",
  },
  {
    name: "Persoonlijk",
    price: "€39",
    period: "per jaar",
    tagline: "Je complete nalatenschap, onbeperkt",
    features: ["Alles van Start", "Onbeperkte opslag", "Stem, video & tijdcapsules", "AI-gesprekken"],
    featured: true,
    cta: "Kies Persoonlijk",
  },
  {
    name: "Familie",
    price: "€79",
    period: "per jaar",
    tagline: "Voor het hele gezin samen",
    features: ["Alles van Persoonlijk", "Meerdere nalatenschappen", "Familie uitnodigen", "Gedeeld archief"],
    cta: "Kies Familie",
  },
];

// After death — keep the memorial active, per 5-year period, or longer.
const MEMORIAL_PLANS: Plan[] = [
  {
    name: "Bewaren",
    price: "€99",
    period: "per 5 jaar",
    tagline: "Nabestaanden houden de gedenkplek actief — telkens met 5 jaar te verlengen",
    features: ["Grafmodus & QR blijven werken", "AI-chat blijft beschikbaar", "Alles blijft bewaard"],
    cta: "Zo werkt het",
  },
  {
    name: "20 jaar",
    price: "€299",
    period: "eenmalig",
    tagline: "Vier periodes in één keer — voordeliger en zonder omkijken",
    features: ["20 jaar vooruit vastgelegd", "Bespaar t.o.v. losse periodes", "Door te geven aan de volgende generatie"],
    featured: true,
    cta: "Zo werkt het",
  },
  {
    name: "Voor altijd",
    price: "€999",
    period: "eenmalig",
    tagline: "Definitief afgekocht — blijft voor altijd bestaan",
    features: ["Onbeperkt bewaren", "Eenmalige afkoop", "Voor alle generaties"],
    cta: "Zo werkt het",
  },
];

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={
        "flex h-full flex-col gap-5 rounded-2xl border p-8 " +
        (plan.featured
          ? "border-forest bg-[#fdfbf6] shadow-[0_20px_50px_-30px_rgba(60,75,54,0.6)]"
          : "border-sand bg-[#fdfbf6]")
      }
    >
      {plan.featured ? (
        <span className="self-start rounded-full bg-forest px-3 py-1 font-meta text-xs text-cream">
          Aanrader
        </span>
      ) : null}
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-2xl text-forest-deep">{plan.name}</h3>
        <span className="font-meta text-sm text-bronze">
          {plan.price}
          {plan.period ? ` · ${plan.period}` : ""}
        </span>
      </div>
      <p className="font-meta text-[0.95rem] leading-relaxed text-cream-ink/70">
        {plan.tagline}
      </p>
      <ul className="flex flex-col gap-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5">
            <Check className="size-4 shrink-0 text-forest" />
            <span className="font-meta text-sm text-cream-ink/80">{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/login"
        className={
          "mt-auto inline-flex h-11 items-center justify-center rounded-full font-meta text-sm transition-colors " +
          (plan.featured
            ? "bg-forest text-cream hover:bg-forest-deep"
            : "border border-forest/30 text-forest hover:bg-forest/5")
        }
      >
        {plan.cta}
      </Link>
    </div>
  );
}

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
    name: "Sanne de Groot",
    role: "Dochter",
    image: "/marketing/portrait-3.jpg",
  },
  {
    quote:
      "We hebben samen zijn levensverhaal opgenomen in zijn laatste jaar. Het mooiste wat we ooit hebben gedaan.",
    name: "Familie Bakker",
    role: "Nabestaanden",
    image: "/marketing/portrait-1.jpg",
  },
  {
    quote:
      "Een foto laat zien waar je was. Everlooms laat zien wíe je was — dat is onbetaalbaar.",
    name: "Rob Jansen",
    role: "Gebruiker sinds 2025",
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
    a: "Nee. Everlooms is altijd duidelijk een herinnering, opgebouwd uit wat de persoon zelf heeft vastgelegd. Het verzint niets en zegt eerlijk wanneer iets niet bekend is.",
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
        operatingSystem: "Web, iOS",
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
          <div className="flex items-center gap-4 pt-2">
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="size-8 rounded-full border-2 border-cream bg-gradient-to-br from-wheat to-sand"
                />
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex gap-0.5 text-bronze">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="size-3.5" fill="currentColor" />
                ))}
              </div>
              <span className="font-meta text-xs text-cream-ink/60">
                4,9 uit 5 op basis van 1.250+ families
              </span>
            </div>
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

      {/* Prijzen */}
      <section id="prijzen" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-[-0.015em] text-forest-deep">
              Kies het plan dat bij jouw familie past
            </h2>
            <p className="mt-4 font-meta text-lg leading-relaxed text-cream-ink/70">
              Tijdens je leven betaal je per jaar. Daarna houden je nabestaanden
              de gedenkplek per periode van 5 jaar actief — verlengbaar, in één
              keer voor 20 jaar, of voor altijd.
            </p>
          </Reveal>

          {/* Tijdens je leven */}
          <div className="mt-14">
            <div className="flex items-center gap-4">
              <span className="font-meta text-xs uppercase tracking-[0.16em] text-bronze">
                Tijdens je leven · per jaar
              </span>
              <span className="h-px flex-1 bg-sand" />
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {LIVING_PLANS.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.07}>
                  <PlanCard plan={p} />
                </Reveal>
              ))}
            </div>
          </div>

          {/* Na je overlijden */}
          <div className="mt-14">
            <div className="flex items-center gap-4">
              <span className="font-meta text-xs uppercase tracking-[0.16em] text-bronze">
                Na je overlijden · de gedenkplek actief houden
              </span>
              <span className="h-px flex-1 bg-sand" />
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {MEMORIAL_PLANS.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.07}>
                  <PlanCard plan={p} />
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-center font-meta text-sm text-cream-ink/60">
              Loopt een periode af zonder verlenging? De gedenkplek gaat in
              stille modus — nooit verwijderd zonder bericht aan de nabestaanden.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-sand bg-sand/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-[-0.015em] text-forest-deep">
              Wat families vertellen
            </h2>
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
                      alt={t.name}
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
