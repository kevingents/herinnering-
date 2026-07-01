import type { Metadata } from "next";
import {
  Waypoints,
  Sparkles,
  Mic,
  Image as ImageIcon,
  QrCode,
  Clock,
  UserPlus,
  Archive,
  MessagesSquare,
  MapPin,
  Search,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/everloom/site-header";
import { SiteFooter } from "@/components/everloom/site-footer";
import { MarketingHero, ImageBand, CtaBand } from "@/components/everloom/marketing";
import { Reveal } from "@/components/brand/reveal";

export const metadata: Metadata = {
  title: "Functies",
  description:
    "Alles wat Everlooms kan: een persoonlijke levenslijn, AI-interviews, je eigen stem, foto's, tijdcapsules, familie uitnodigen, en een eerlijke AI-gedenkplek met QR.",
};

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Waypoints,
    title: "Levenslijn",
    body: "Al je herinneringen op een rustige tijdlijn — van je vroegste jeugd tot vandaag. Bladeren door een heel leven, moment voor moment.",
  },
  {
    icon: Sparkles,
    title: "AI-interview",
    body: "Warme, persoonlijke vragen die je op gang helpen. De AI luistert, vraagt door en helpt je verhalen boven water te halen die je bijna vergeten was.",
  },
  {
    icon: Mic,
    title: "Je eigen stem",
    body: "Neem verhalen op in je eigen stem. Later horen je dierbaren niet alleen wát je vertelde, maar ook hóé — het meest persoonlijke wat je kunt nalaten.",
  },
  {
    icon: ImageIcon,
    title: "Foto's & documenten",
    body: "Bewaar foto's, brieven en belangrijke documenten op één veilige plek, gekoppeld aan de verhalen waar ze bij horen.",
  },
  {
    icon: Clock,
    title: "Tijdcapsules",
    body: "Schrijf een boodschap die pas op een gekozen moment opengaat — een verjaardag, een huwelijk, of jaren na je overlijden.",
  },
  {
    icon: MapPin,
    title: "Plekken & kaart",
    body: "Koppel herinneringen aan de plek waar ze gebeurden. Sta later op precies dezelfde plek en zie de foto's en verhalen van toen.",
  },
  {
    icon: UserPlus,
    title: "Familie uitnodigen",
    body: "Nodig dierbaren uit om mee te lezen, mee te bouwen of alleen te bewaren. Ieder met eigen rechten, jij houdt de regie.",
  },
  {
    icon: MessagesSquare,
    title: "In gesprek met de herinnering",
    body: "Stel vragen aan het archief en krijg antwoord op basis van wat écht is vastgelegd. Grounded in de bron, nooit verzonnen.",
  },
  {
    icon: Search,
    title: "Doorzoeken",
    body: "Vind elk moment, elke naam en elke plek in seconden terug — hoe groot het archief ook wordt.",
  },
  {
    icon: QrCode,
    title: "Grafmodus & QR",
    body: "Een waardige online gedenkplek, te bereiken via een QR-code op de gedenksteen. Bezoekers ontmoeten het verhaal, altijd eerlijk verteld.",
  },
];

export default function FunctiesPage() {
  return (
    <div className="min-h-dvh bg-cream font-meta text-cream-ink">
      <SiteHeader />
      <MarketingHero
        eyebrow="Functies"
        title="Alles om een heel leven te bewaren"
        intro="Everlooms brengt je verhalen, je stem, je beeld en je familie samen op één plek — en maakt er iets van dat generaties lang meegaat."
        image="/marketing/keepsake.jpg"
        alt="Dierbare herinneringen bij elkaar bewaard"
      />

      <section className="pb-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <ImageBand
        src="/marketing/generations.jpg"
        alt="Drie generaties genieten samen van herinneringen"
      />

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.5rem)] leading-tight text-forest-deep">
            Eén plek, een heel leven
          </h2>
          <p className="mt-4 font-meta text-lg leading-relaxed text-cream-ink/75">
            Geen losse mappen, verspreide foto's of vergeten wachtwoorden. Alles
            wat je nalaat, veilig en overzichtelijk bij elkaar — klaar om door te
            geven.
          </p>
        </div>
      </section>

      <CtaBand
        title="Ontdek wat je kunt bewaren"
        sub="Begin gratis en voeg toe wat je wilt, in je eigen tempo."
      />
      <SiteFooter />
    </div>
  );
}
