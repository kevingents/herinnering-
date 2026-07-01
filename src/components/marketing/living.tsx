import { Mic, PenLine, MessagesSquare, type LucideIcon } from "lucide-react";
import { Section, SectionHeading } from "@/components/brand/section";
import { Reveal } from "@/components/brand/reveal";
import { Slab } from "@/components/ui/slab";

const RITUALS: { icon: LucideIcon; step: string; title: string; body: string }[] =
  [
    {
      icon: Mic,
      step: "Opnemen",
      title: "Je stem, precies zoals hij klinkt",
      body: "Vertel een verhaal hardop. Blij, rustig, serieus of grappig — later klinkt het weer zoals het was.",
    },
    {
      icon: PenLine,
      step: "Schrijven",
      title: "Brieven voor wie er nog niet zijn",
      body: "Een brief voor een achttiende verjaardag. Een gedachte voor over vijfentwintig jaar. Bewaard tot het moment daar is.",
    },
    {
      icon: MessagesSquare,
      step: "Het interview",
      title: "Duizenden vragen, één leven",
      body: "We stellen de vragen, jij vertelt. Rustig, in je eigen tempo — nooit alsof je iemand anders bent.",
    },
  ];

export function Living() {
  return (
    <Section id="voor-wie-leeft">
      <SectionHeading
        eyebrow="Voor wie nog leeft"
        title="Bouw jouw nalatenschap terwijl je leeft"
        intro="Geen haast, geen urgentie. Een rustig ritueel dat meegroeit met je leven, stukje bij beetje."
      />

      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {RITUALS.map((r, i) => {
          const Icon = r.icon;
          return (
            <Reveal key={r.step} delay={i * 0.08}>
              <Slab className="flex h-full flex-col gap-4 p-8">
                <span className="inline-flex size-11 items-center justify-center rounded-full border border-gold/25 bg-gold/[0.06] text-gold">
                  <Icon className="size-5" />
                </span>
                <span className="text-meta">{r.step}</span>
                <h3 className="font-display text-xl leading-snug text-foreground">
                  {r.title}
                </h3>
                <p className="font-body text-[1.0625rem] leading-relaxed text-foreground-secondary">
                  {r.body}
                </p>
              </Slab>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
