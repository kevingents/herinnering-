import { cn } from "@/lib/utils";

/**
 * Radical honesty, treated as poetry rather than fine print. The system never
 * pretends the person is alive — that truth is what turns unease into trust.
 */
export function AiDisclaimer({
  name = "deze persoon",
  pronoun = "die",
  className,
}: {
  name?: string;
  /** third-person pronoun: "hij" | "zij" | "die" */
  pronoun?: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-body text-[0.95rem] italic leading-relaxed text-foreground-muted",
        className,
      )}
    >
      Dit is een herinnering, opgebouwd uit wat {name} zelf heeft vastgelegd. Het
      doet niet alsof {pronoun} er nog is.
    </p>
  );
}
