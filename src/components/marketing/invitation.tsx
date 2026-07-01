import { Section } from "@/components/brand/section";
import { Reveal } from "@/components/brand/reveal";
import { Seam } from "@/components/ui/seam";

export function Invitation() {
  return (
    <Section id="uitnodiging" innerClassName="max-w-3xl">
      <Reveal className="flex flex-col items-center gap-10 text-center">
        <span className="text-meta">De uitnodiging</span>
        <p className="font-display text-[clamp(1.6rem,3.4vw,2.5rem)] leading-[1.4] tracking-[-0.01em] text-foreground-secondary">
          Een mens is meer dan een naam op een steen. Hier blijven het{" "}
          <span className="text-foreground">lachen, de stem en de verhalen</span>{" "}
          bewaard — een heel leven om doorheen te lopen, verteld door een
          herinnering.
        </p>
        <Seam />
      </Reveal>
    </Section>
  );
}
