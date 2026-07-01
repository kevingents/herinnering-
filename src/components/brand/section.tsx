import type { ReactNode } from "react";
import { Reveal } from "@/components/brand/reveal";
import { cn } from "@/lib/utils";

export function Section({
  id,
  className,
  innerClassName,
  children,
}: {
  id?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("relative px-6 py-[clamp(6rem,14vh,12.5rem)]", className)}
    >
      <div className={cn("mx-auto w-full max-w-5xl", innerClassName)}>
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? <span className="text-meta">{eyebrow}</span> : null}
      <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.1] tracking-[-0.015em] text-foreground">
        {title}
      </h2>
      {intro ? (
        <p
          className={cn(
            "font-body text-lg leading-relaxed text-foreground-secondary",
            align === "center" ? "max-w-2xl" : "max-w-xl",
          )}
        >
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}
