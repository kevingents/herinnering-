import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";

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
export const LIVING_PLANS: Plan[] = [
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
export const MEMORIAL_PLANS: Plan[] = [
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

export function PricingSection() {
  return (
    <section id="prijzen" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-[-0.015em] text-forest-deep">
            Kies het plan dat bij jouw familie past
          </h2>
          <p className="mt-4 font-meta text-lg leading-relaxed text-cream-ink/70">
            Tijdens je leven betaal je per jaar. Daarna houden je nabestaanden de
            gedenkplek per periode van 5 jaar actief — verlengbaar, in één keer
            voor 20 jaar, of voor altijd.
          </p>
        </Reveal>

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
            Loopt een periode af zonder verlenging? De gedenkplek gaat in stille
            modus — nooit verwijderd zonder bericht aan de nabestaanden.
          </p>
        </div>
      </div>
    </section>
  );
}
