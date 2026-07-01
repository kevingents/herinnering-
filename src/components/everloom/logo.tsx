import { cn } from "@/lib/utils";

const LEAVES: { x: number; y: number; rot: number; s: number }[] = [
  { x: 24, y: 13, rot: 0, s: 1 },
  { x: 15.5, y: 17.5, rot: -38, s: 0.92 },
  { x: 32.5, y: 17.5, rot: 38, s: 0.92 },
  { x: 17.5, y: 25, rot: -62, s: 0.8 },
  { x: 30.5, y: 25, rot: 62, s: 0.8 },
  { x: 24, y: 21, rot: 0, s: 0.72 },
];

/** The Everlooms mark — a warm gold tree, roots curling into a loom. */
export function EverloomsMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 54"
      fill="none"
      className={cn("h-9 w-9", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="everloom-gold" x1="8" y1="4" x2="40" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d9c39a" />
          <stop offset="0.55" stopColor="#b79256" />
          <stop offset="1" stopColor="#8a6e4d" />
        </linearGradient>
      </defs>
      {/* trunk + roots */}
      <path
        d="M24 49 V27 M24 49 C 19 52 15 50.5 12.5 46.5 M24 49 C 29 52 33 50.5 35.5 46.5"
        stroke="#8a6e4d"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      {/* canopy of leaves */}
      {LEAVES.map((l, i) => (
        <path
          key={i}
          d="M0 -9 C 4 -4 4 3.5 0 8 C -4 3.5 -4 -4 0 -9 Z"
          fill="url(#everloom-gold)"
          transform={`translate(${l.x} ${l.y}) rotate(${l.rot}) scale(${l.s})`}
        />
      ))}
    </svg>
  );
}

/** Mark + wordmark lockup. `tone` sets the wordmark colour. */
export function EverloomsLogo({
  className,
  tone = "forest",
}: {
  className?: string;
  tone?: "forest" | "cream";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <EverloomsMark />
      <span
        className={cn(
          "font-display text-[1.6rem] leading-none tracking-[-0.01em]",
          tone === "forest" ? "text-forest-deep" : "text-cream",
        )}
      >
        Everlooms
      </span>
    </span>
  );
}
