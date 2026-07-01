import type { Metadata } from "next";
import { SiteHeader } from "@/components/everloom/site-header";
import { SiteFooter } from "@/components/everloom/site-footer";

export const metadata: Metadata = {
  title: "Privacy & AVG",
  description:
    "Hoe Everlooms omgaat met jouw gegevens: transparant, versleuteld en volledig AVG/GDPR-proof. Jij houdt altijd de controle.",
};

const SECTIONS: { h: string; body: string[] }[] = [
  {
    h: "1. Wie zijn wij",
    body: [
      "Everlooms is de verwerkingsverantwoordelijke voor de gegevens die je via ons platform vastlegt. Wil je contact over privacy? Mail naar privacy@everlooms.app.",
    ],
  },
  {
    h: "2. Welke gegevens we verwerken",
    body: [
      "Accountgegevens (naam, e-mailadres) om je aan te melden.",
      "De inhoud die je zelf vastlegt: herinneringen, foto's, video's, stemopnames, brieven, tijdcapsules en interviewantwoorden.",
      "Technische gegevens die nodig zijn om de dienst veilig te laten werken.",
    ],
  },
  {
    h: "3. Waarvoor en op welke grondslag",
    body: [
      "We verwerken je gegevens om de dienst te leveren (uitvoering van de overeenkomst) en om je nalatenschap te bewaren zoals jij dat wenst (jouw toestemming).",
      "We verkopen je gegevens nooit en gebruiken ze niet voor advertenties.",
    ],
  },
  {
    h: "4. AI en eerlijkheid",
    body: [
      "De AI-herinnering antwoordt uitsluitend op basis van wat de persoon zelf heeft vastgelegd. Het doet nooit alsof iemand nog leeft en verzint niets. Voor de AI-functie schakelen we een verwerker in (Anthropic); er worden geen gegevens gebruikt om modellen te trainen.",
    ],
  },
  {
    h: "5. Verwerkers",
    body: [
      "We werken met zorgvuldig gekozen verwerkers met verwerkersovereenkomsten: Supabase (hosting van database en opslag, EU-regio), Anthropic (AI-antwoorden) en Mollie (betalingen). Zij verwerken uitsluitend in onze opdracht.",
    ],
  },
  {
    h: "6. Bewaartermijnen",
    body: [
      "Tijdens je leven bewaren we je nalatenschap zolang je account actief is. Na overlijden blijft de gedenkplek actief per gekozen periode (5 jaar, 20 jaar of voor altijd). Er wordt nooit iets verwijderd zonder bericht aan de nabestaanden.",
    ],
  },
  {
    h: "7. Cookies",
    body: [
      "We gebruiken alleen strikt noodzakelijke (functionele) cookies om je ingelogd te houden. We plaatsen geen tracking- of advertentiecookies, dus een cookiebanner is niet nodig.",
    ],
  },
  {
    h: "8. Jouw rechten",
    body: [
      "Je hebt recht op inzage, correctie, verwijdering, beperking, bezwaar en dataportabiliteit. Je kunt je volledige profiel op elk moment exporteren of definitief laten verwijderen via je accountinstellingen of via privacy@everlooms.app.",
    ],
  },
  {
    h: "9. Beveiliging",
    body: [
      "Gegevens worden versleuteld opgeslagen, toegang is streng afgeschermd (row-level security) en tweefactor-authenticatie is beschikbaar. Alleen mensen die jij uitnodigt krijgen toegang.",
    ],
  },
  {
    h: "10. Klacht",
    body: [
      "Ben je het niet eens met hoe we met je gegevens omgaan? Je kunt een klacht indienen bij de Autoriteit Persoonsgegevens.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-cream font-meta text-cream-ink">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <span className="font-meta text-xs uppercase tracking-[0.16em] text-bronze">
          Privacy &amp; AVG
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.25rem)] leading-tight tracking-[-0.02em] text-forest-deep">
          Jouw verhaal, jouw controle
        </h1>
        <p className="mt-4 max-w-2xl font-meta text-lg leading-relaxed text-cream-ink/75">
          We gaan transparant en zorgvuldig om met je gegevens, volledig volgens
          de AVG/GDPR. Hieronder lees je precies hoe.
        </p>

        <div className="mt-12 flex flex-col gap-10">
          {SECTIONS.map((s) => (
            <section key={s.h} className="flex flex-col gap-3">
              <h2 className="font-display text-xl text-forest-deep">{s.h}</h2>
              {s.body.map((p, i) => (
                <p
                  key={i}
                  className="font-meta text-[0.95rem] leading-relaxed text-cream-ink/75"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-14 font-meta text-sm italic text-cream-ink/60">
          Dit is een leesbare samenvatting van ons privacybeleid, bedoeld als
          startpunt. Laat de definitieve tekst juridisch controleren vóór
          livegang.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
