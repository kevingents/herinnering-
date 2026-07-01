import Link from "next/link";
import { Check, MapPin } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";

/** Two-column hero for marketing subpages (text + optional image). */
export function MarketingHero({
  eyebrow,
  title,
  intro,
  image,
  alt,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  image?: string;
  alt?: string;
}) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-20">
      <Reveal className="flex flex-col gap-5">
        <span className="font-meta text-xs uppercase tracking-[0.16em] text-bronze">
          {eyebrow}
        </span>
        <h1 className="font-display text-[clamp(2.4rem,5.5vw,3.75rem)] leading-[1.06] tracking-[-0.02em] text-forest-deep">
          {title}
        </h1>
        <p className="max-w-xl font-meta text-lg leading-relaxed text-cream-ink/75">
          {intro}
        </p>
      </Reveal>
      {image ? (
        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-3xl border border-sand shadow-[0_40px_80px_-40px_rgba(60,75,54,0.5)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={alt ?? ""}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </Reveal>
      ) : null}
    </section>
  );
}

/** Full-width image band. */
export function ImageBand({ src, alt }: { src: string; alt?: string }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ""}
        className="aspect-[16/7] w-full rounded-3xl border border-sand object-cover shadow-[0_30px_70px_-40px_rgba(60,75,54,0.5)]"
      />
    </div>
  );
}

/**
 * Place-based storytelling example — "sta waar zij ooit stond".
 * A concrete, clearly-labelled scenario: a grandchild visits a place their
 * grandmother once was and sees the photos and story from back then.
 */
export function PlaceStory() {
  const POINTS = [
    "Herinneringen gekoppeld aan een plek op de kaart",
    "De foto's en het verhaal van toen, precies ter plekke",
    "Zelf een nieuw moment toevoegen op dezelfde plek",
  ];
  return (
    <section className="border-y border-sand bg-sand/30 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
        <Reveal className="flex flex-col gap-5">
          <span className="inline-flex items-center gap-2 font-meta text-xs uppercase tracking-[0.16em] text-bronze">
            <MapPin className="size-4" />
            Een voorbeeld
          </span>
          <h2 className="font-display text-[clamp(1.9rem,4vw,2.75rem)] leading-tight tracking-[-0.015em] text-forest-deep">
            Sta waar zij ooit stond
          </h2>
          <p className="max-w-xl font-meta text-lg leading-relaxed text-cream-ink/75">
            Sofie is met vakantie in Zeeland. Op het strand van Domburg opent ze
            Everlooms — en ziet dat oma Riek hier in de zomer van 1963 ook stond,
            negentien jaar oud. Dezelfde duinen, dezelfde zee, zestig jaar
            ertussen.
          </p>
          <p className="max-w-xl font-meta text-lg leading-relaxed text-cream-ink/75">
            Ze bekijkt de foto van toen, hoort er in oma&apos;s eigen stem het
            verhaal bij, en maakt op precies dezelfde plek een nieuwe foto. Zo
            lopen twee generaties elkaar heel even tegemoet.
          </p>
          <ul className="flex flex-col gap-2.5 pt-1">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2.5">
                <Check className="size-4 shrink-0 text-forest" />
                <span className="font-meta text-[0.95rem] text-cream-ink/80">
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.12} className="relative mx-auto w-full max-w-sm pb-10 pr-6">
          {/* Then */}
          <figure className="overflow-hidden rounded-3xl border border-sand shadow-[0_40px_80px_-40px_rgba(60,75,54,0.5)]">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/marketing/plek-toen.jpg"
                alt="Oma Riek op het strand van Domburg, zomer 1963"
                className="aspect-[3/4] w-full object-cover"
              />
              <figcaption className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-cream/90 px-3 py-1 font-meta text-xs text-cream-ink shadow-sm backdrop-blur-sm">
                <MapPin className="size-3 text-bronze" />
                1963 · Oma Riek
              </figcaption>
            </div>
          </figure>
          {/* Now — overlapping inset */}
          <figure className="absolute -bottom-2 -right-1 w-[56%] overflow-hidden rounded-2xl border-4 border-cream shadow-[0_30px_60px_-30px_rgba(60,75,54,0.6)]">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/marketing/plek-nu.jpg"
                alt="Sofie op dezelfde plek in Domburg, vandaag"
                className="aspect-[3/4] w-full object-cover"
              />
              <figcaption className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-forest-deep/90 px-2.5 py-1 font-meta text-[0.65rem] text-cream shadow-sm backdrop-blur-sm">
                <MapPin className="size-3 text-wheat" />
                Vandaag · Sofie
              </figcaption>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/** Closing call-to-action band. */
export function CtaBand({
  title,
  sub,
  label = "Begin jouw verhaal",
  href = "/login",
}: {
  title: string;
  sub?: string;
  label?: string;
  href?: string;
}) {
  return (
    <section className="px-6 pb-24 pt-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-forest-deep px-8 py-14 text-center text-cream sm:px-16">
        <h2 className="font-display text-[clamp(1.8rem,4vw,2.75rem)] leading-tight">
          {title}
        </h2>
        {sub ? (
          <p className="mx-auto mt-4 max-w-xl font-meta text-cream/70">{sub}</p>
        ) : null}
        <Link
          href={href}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-cream px-8 font-meta text-sm text-forest-deep transition-colors hover:bg-wheat"
        >
          {label}
        </Link>
      </div>
    </section>
  );
}
