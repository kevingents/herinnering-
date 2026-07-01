import type { Variants } from "framer-motion";

/** Candlelight & settling stone — slow, weighty, never bouncy. */
export const easeStone = [0.22, 0.61, 0.36, 1] as const;
export const easeSettle = [0.4, 0, 0.2, 1] as const;

/** Titles fade + rise, chiseled into place. */
export const inscription: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.64, ease: easeStone },
  },
};

/** Generic content reveal. */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: easeStone },
  },
};

/** Parent that staggers its children into view. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

/** Shared whileInView viewport config — reveal once, a little before entering. */
export const revealViewport = { once: true, margin: "-80px" } as const;
