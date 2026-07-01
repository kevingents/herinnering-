/**
 * A fixed, full-page honed-graphite grain so the darkness has tooth and never
 * reads as flat digital black. Pure SVG, decorative, non-interactive.
 */
export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-overlay"
    >
      <svg className="h-full w-full">
        <filter id="lg-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#lg-grain)" />
      </svg>
    </div>
  );
}
