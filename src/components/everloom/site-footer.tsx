import Link from "next/link";
import { EverloomsLogo } from "./logo";

const COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/hoe-het-werkt", label: "Hoe het werkt" },
      { href: "/functies", label: "Functies" },
      { href: "/prijzen", label: "Prijzen" },
      { href: "/uitvaartondernemers", label: "Voor uitvaartondernemers" },
    ],
  },
  {
    title: "Over ons",
    links: [
      { href: "/#voor-wie", label: "Onze missie" },
      { href: "/veiligheid", label: "Veiligheid" },
      { href: "/privacy", label: "Privacy & AVG" },
      { href: "/#faq", label: "Veelgestelde vragen" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/uitvaartondernemers", label: "Samenwerken" },
      { href: "/login", label: "Inloggen" },
      { href: "mailto:hallo@everlooms.app", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-forest-deep text-cream">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <EverloomsLogo tone="cream" />
          <p className="max-w-xs font-meta text-sm leading-relaxed text-cream/70">
            Jouw verhaal. Voor altijd dichtbij. Met liefde ontworpen om
            generaties te verbinden.
          </p>
        </div>

        {COLS.map((c) => (
          <div key={c.title} className="flex flex-col gap-3">
            <span className="font-meta text-xs uppercase tracking-[0.14em] text-cream/50">
              {c.title}
            </span>
            {c.links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="font-meta text-sm text-cream/80 transition-colors hover:text-wheat"
              >
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 sm:flex-row">
          <p className="font-meta text-xs text-cream/50">
            © {2026} Everlooms — met zorg gemaakt
          </p>
          <p className="font-display text-sm italic text-cream/70">
            &ldquo;Herinneringen zijn het enige paradijs waaruit we niet
            verdreven kunnen worden.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
