import type { Metadata } from "next";
import {
  MessagesSquare,
  Mic,
  Users,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/everloom/site-header";
import { SiteFooter } from "@/components/everloom/site-footer";
import { MarketingHero, ImageBand, CtaBand } from "@/components/everloom/marketing";
import { Reveal } from "@/components/brand/reveal";

export const metadata: Metadata = {
  title: "Hoe het werkt",
  description:
    "In vier rustige stappen leg je met Everlooms je leven vast: vertel je verhaal, bewaar je stem en foto's, nodig familie uit, en laat een eerlijke AI-herinnering na.",
};

const STEPS: { icon: LucideIcon; step: string; title: string; body: string }[] =
  [
    {
      icon: MessagesSquare,
      step: "01",
      title: "Vertel je verhaal",
      body: "De AI stelt warme, persoonlijke vragen. Jij antwoordt wanneer je wilt — een paar minuten per keer is genoeg. Zo groeit je levenslijn vanzelf.",
    },
    {
      icon: Mic,
      step: "02",
      title: "Bewaar je stem en beeld",
      body: "Neem verhalen in je eigen stem op, voeg foto's en documenten toe. De kleine details die je anders zou vergeten, blijven bewaard.",
    },
    {
      icon: Users,
      step: "03",
      title: "Nodig je familie uit",
      body: "Laat dierbaren meelezen, meebouwen of alleen bewaren. Samen maak je het verhaal completer dan iemand alleen ooit kan.",
    },
    {
      icon: Leaf,
      step: "04",
      title: "Laat een eerlijke herinnering na",
      body: "Na je overlijden wordt je archief een gedenkplek. De AI vertelt jouw verhaal — altijd eerlijk, nooit alsof je er nog bent.",
    },
  ];

export default function HoeHetWerktPage() {
  return (
    <div className="min-h-dvh bg-cream font-meta text-cream-ink">
      <SiteHeader />
      <MarketingHero
        eyebrow="Hoe het werkt"
        title="Van losse herinneringen naar een levend verhaal"
        intro="Everlooms maakt van het vastleggen van je leven iets rustigs en persoonlijks. Geen leeg dagboek dat op je wacht — maar een gesprek dat je stap voor stap meeneemt."
        image="/marketing/writing.jpg"
        alt="Iemand die rustig herinneringen opschrijft"
      />

      <section className="border-y border-sand bg-sand/30 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.step} delay={(i % 2) * 0.08}>
                  <div className="flex h-full flex-col gap-4 rounded-2xl border border-sand bg-[#fdfbf6] p-8">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex size-12 items-center justify-center rounded-full bg-sand text-forest">
                        <Icon className="size-5" />
                      </span>
                      <span className="font-display text-3xl text-wheat">
                        {s.step}
                      </span>
                    </div>
                    <h3 className="font-display text-xl text-forest-deep">
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
        </div>
      </section>

      <ImageBand
        src="/marketing/generations.jpg"
        alt="Drie generaties genieten samen van herinneringen"
      />

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.5rem)] leading-tight text-forest-deep">
            Jouw tempo, jouw verhaal
          </h2>
          <p className="mt-4 font-meta text-lg leading-relaxed text-cream-ink/75">
            Er is geen haast en geen goede of foute manier. Begin met één
            herinnering vandaag, en bouw er zoveel bij als je wilt. Alles blijft
            veilig bewaard en volledig van jou.
          </p>
        </div>
      </section>

      <CtaBand
        title="Klaar om te beginnen?"
        sub="De eerste herinnering vastleggen kost maar een paar minuten."
      />
      <SiteFooter />
    </div>
  );
}
