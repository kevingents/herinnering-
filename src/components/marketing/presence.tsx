import { AudioLines, Quote } from "lucide-react";
import { Section, SectionHeading } from "@/components/brand/section";
import { Reveal } from "@/components/brand/reveal";
import { Slab } from "@/components/ui/slab";
import { Waveform } from "@/components/brand/waveform";

export function Presence() {
  return (
    <Section id="aanwezigheid" innerClassName="max-w-3xl">
      <SectionHeading
        eyebrow="Stem &amp; aanwezigheid"
        title="Stel een vraag. De herinnering antwoordt."
        intro="Met Willems eigen woorden, opnames en verhalen — en met de eerlijkheid om te zeggen wanneer iets niet is vastgelegd."
      />

      <Reveal className="mt-14">
        <Slab featured className="p-7 sm:p-10">
          {/* the honest presence — a still ember, never a talking avatar */}
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="size-2.5 rounded-full bg-amber shadow-[0_0_24px_6px_rgba(224,184,118,0.35)] motion-safe:animate-breathe"
            />
            <span className="text-meta">Een herinnering, geen imitatie</span>
          </div>

          {/* mock exchange */}
          <div className="mt-8 flex flex-col gap-6">
            <div className="self-end rounded-2xl rounded-br-md border border-border bg-surface-elevated px-5 py-3.5">
              <p className="font-body text-[1.0625rem] text-foreground-secondary">
                Hoe heb je oma leren kennen?
              </p>
            </div>

            <div className="max-w-[85%] self-start">
              <div className="flex items-start gap-3">
                <Quote className="mt-1 size-5 shrink-0 text-gold/70" />
                <p className="font-body text-lg italic leading-relaxed text-foreground">
                  &ldquo;Op een bruiloft in de zomer van &lsquo;71. Ik stond bij
                  de deur, klaar om weg te gaan, en toen lachte ze. Ik ben
                  gebleven — nog vijftig jaar.&rdquo;
                </p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 pl-8">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 px-3 py-1 text-meta text-gold/90">
                  <AudioLines className="size-3.5" />
                  Uit een opname · 1971
                </span>
                <span className="text-meta text-foreground-muted">
                  Bron: &ldquo;De dag dat ik je oma ontmoette&rdquo;
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Waveform />
          </div>

          <p className="mt-8 text-center font-body text-[0.95rem] italic text-foreground-muted">
            Wanneer iets niet is vastgelegd, zegt de herinnering dat eerlijk. Ze
            verzint niets.
          </p>
        </Slab>
      </Reveal>
    </Section>
  );
}
