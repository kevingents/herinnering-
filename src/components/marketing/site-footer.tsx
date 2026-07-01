import Link from "next/link";
import { Seam } from "@/components/ui/seam";

const LINKS = [
  { href: "#waardigheid", label: "Veiligheid" },
  { href: "#waardigheid", label: "Privacy" },
  { href: "#aanwezigheid", label: "Hoe het werkt" },
  { href: "/begin", label: "Beginnen" },
];

export function SiteFooter() {
  return (
    <footer className="relative px-6 pb-16 pt-8">
      <div className="mx-auto w-full max-w-5xl">
        <Seam className="w-full" />
        <div className="mt-10 flex flex-col items-center gap-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col gap-2">
            <span className="font-display text-xl tracking-wide text-foreground">
              Levend&nbsp;Graf
            </span>
            <p className="max-w-sm font-body text-sm italic leading-relaxed text-foreground-muted">
              Een herinnering, opgebouwd uit wat iemand zelf heeft vastgelegd.
              Nooit alsof die persoon er nog is.
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-meta transition-colors hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-10 text-center text-meta text-foreground-muted/70">
          © {2026} Levend Graf — met zorg gemaakt
        </p>
      </div>
    </footer>
  );
}
