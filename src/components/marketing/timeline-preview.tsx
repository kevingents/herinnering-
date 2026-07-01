import {
  AudioLines,
  BookOpenText,
  Heart,
  Home,
  Image as ImageIcon,
  Mail,
  MapPin,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/brand/section";
import { Reveal } from "@/components/brand/reveal";
import { Slab } from "@/components/ui/slab";
import { cn } from "@/lib/utils";

type Media = "voice" | "photo" | "letter" | "story";

const MEDIA_ICON: Record<Media, LucideIcon> = {
  voice: AudioLines,
  photo: ImageIcon,
  letter: Mail,
  story: BookOpenText,
};

const MEDIA_LABEL: Record<Media, string> = {
  voice: "Stemopname",
  photo: "Foto",
  letter: "Brief",
  story: "Verhaal",
};

const MOMENTS: {
  year: string;
  icon: LucideIcon;
  title: string;
  body: string;
  media: Media[];
}[] = [
  {
    year: "1948",
    icon: Sparkles,
    title: "Geboren in Haarlem",
    body: "Een naoorlogse lente, het derde kind in een rij van vijf. De straat rook naar vers brood van de bakker op de hoek.",
    media: ["photo", "story"],
  },
  {
    year: "1971",
    icon: Heart,
    title: "De dag dat ik je oma ontmoette",
    body: "Op een bruiloft waar ik eigenlijk niet wilde zijn. Ze lachte om een grap die ik niet eens had bedoeld.",
    media: ["voice", "photo"],
  },
  {
    year: "1985",
    icon: Home,
    title: "Ons huis aan de Vliet",
    body: "De eerste eigen voordeur. We hadden geen geld voor gordijnen, dus we keken maandenlang naar de sterren.",
    media: ["photo", "letter"],
  },
  {
    year: "2003",
    icon: MapPin,
    title: "De reis naar Pals",
    body: "Die zomer aan de Costa Brava. De kinderen groot genoeg om zelf de weg te vragen, klein genoeg om nog hand in hand te lopen.",
    media: ["voice", "photo", "story"],
  },
];

export function TimelinePreview() {
  return (
    <Section id="levenslijn">
      <SectionHeading
        eyebrow="De levenslijn"
        title="Elk moment, in de steen gegrift"
        intro="Decennia worden hoofdstukken. Elke herinnering een klein tafereel — met de foto's, de stem en de brieven die erbij horen."
      />

      <div className="relative mx-auto mt-16 max-w-2xl">
        {/* the vertical gold seam */}
        <div
          aria-hidden
          className="absolute bottom-3 left-[7px] top-3 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent"
        />

        <ol className="flex flex-col gap-8">
          {MOMENTS.map((m, i) => {
            const Icon = m.icon;
            return (
              <li key={m.year} className="relative pl-10">
                {/* node on the seam */}
                <span
                  aria-hidden
                  className="absolute left-0 top-7 size-[15px] -translate-x-[0px] rounded-full border border-gold/50 bg-background shadow-[0_0_16px_rgba(201,161,90,0.35)]"
                >
                  <span className="absolute inset-[3px] rounded-full bg-gold/80" />
                </span>

                <Reveal delay={i * 0.06}>
                  <Slab className="p-7 sm:p-8">
                    <div className="flex items-center gap-3">
                      <Icon className="size-4 text-gold" />
                      <span className="font-display text-lg tracking-wide text-gold">
                        {m.year}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-2xl leading-snug text-foreground">
                      {m.title}
                    </h3>
                    <p className="mt-3 font-body text-[1.0625rem] leading-relaxed text-foreground-secondary">
                      {m.body}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      {m.media.map((md) => {
                        const MIcon = MEDIA_ICON[md];
                        return (
                          <span
                            key={md}
                            className={cn(
                              "inline-flex items-center gap-1.5 text-meta text-foreground-muted",
                            )}
                          >
                            <MIcon className="size-3.5 text-gold/80" />
                            {MEDIA_LABEL[md]}
                          </span>
                        );
                      })}
                    </div>
                  </Slab>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
