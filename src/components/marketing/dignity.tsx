import { ShieldCheck, Lock, KeyRound, Users, type LucideIcon } from "lucide-react";
import { Section, SectionHeading } from "@/components/brand/section";
import { Reveal } from "@/components/brand/reveal";
import { Seam } from "@/components/ui/seam";

const PRINCIPLES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ShieldCheck,
    title: "Jij bepaalt wie binnenkomt",
    body: "Vooraf leg je vast wie na je overlijden toegang krijgt, wie mag bijdragen, en wie niets ziet.",
  },
  {
    icon: Lock,
    title: "Versleuteld en privé",
    body: "Alles wordt versleuteld bewaard. Volledige AVG-ondersteuning en tweefactor-beveiliging.",
  },
  {
    icon: KeyRound,
    title: "Altijd van jou",
    body: "Het blijft jouw nalatenschap. Je kunt je volledige profiel op elk moment definitief verwijderen.",
  },
  {
    icon: Users,
    title: "Familie met eigen rechten",
    body: "Partner, kinderen, kleinkinderen — ieder met eigen rechten: meelezen, bijdragen of beheren.",
  },
];

export function Dignity() {
  return (
    <Section id="waardigheid">
      <SectionHeading
        eyebrow="Waardigheid &amp; vertrouwen"
        title="Gebouwd om te blijven, en om van jou te blijven"
      />

      <div className="mx-auto mt-16 grid max-w-3xl gap-x-12 gap-y-12 sm:grid-cols-2">
        {PRINCIPLES.map((p, i) => {
          const Icon = p.icon;
          return (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="flex flex-col gap-3">
                <Icon className="size-5 text-gold" />
                <h3 className="font-display text-xl leading-snug text-foreground">
                  {p.title}
                </h3>
                <p className="font-body text-[1.0625rem] leading-relaxed text-foreground-secondary">
                  {p.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Seam className="mt-20" />
    </Section>
  );
}
