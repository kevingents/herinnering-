import Link from "next/link";
import { EverloomsLogo } from "./logo";

const NAV = [
  { href: "/hoe-het-werkt", label: "Hoe het werkt" },
  { href: "/functies", label: "Functies" },
  { href: "/veiligheid", label: "Veiligheid" },
  { href: "/prijzen", label: "Prijzen" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="Everlooms home">
          <EverloomsLogo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="font-meta text-sm text-cream-ink/75 transition-colors hover:text-forest"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden font-meta text-sm text-cream-ink/75 transition-colors hover:text-forest sm:inline"
          >
            Inloggen
          </Link>
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-full bg-forest px-6 font-meta text-sm text-cream shadow-sm transition-colors hover:bg-forest-deep"
          >
            Begin jouw verhaal
          </Link>
        </div>
      </div>
    </header>
  );
}
