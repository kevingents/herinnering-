import type { Metadata } from "next";
import { SiteHeader } from "@/components/everloom/site-header";
import { SiteFooter } from "@/components/everloom/site-footer";
import { MarketingHero, CtaBand } from "@/components/everloom/marketing";
import { PricingSection } from "@/components/everloom/pricing";

export const metadata: Metadata = {
  title: "Prijzen",
  description:
    "Eerlijke prijzen voor Everlooms: tijdens je leven per jaar, en na je overlijden houdt je familie de gedenkplek actief per 5 jaar, 20 jaar of voor altijd.",
};

export default function PrijzenPage() {
  return (
    <div className="min-h-dvh bg-cream font-meta text-cream-ink">
      <SiteHeader />
      <MarketingHero
        eyebrow="Prijzen"
        title="Eerlijke prijzen, voor nu en voor later"
        intro="Begin gratis. Betaal tijdens je leven per jaar, en laat je nabestaanden de gedenkplek daarna zo lang bewaren als jullie willen."
        image="/marketing/keepsake.jpg"
        alt="Een houten bewaardoos met foto's en herinneringen"
      />
      <PricingSection />
      <CtaBand
        title="Begin vandaag met bewaren"
        sub="Rustig, in je eigen tempo — voor wie er na jou nog doorheen wil lopen."
      />
      <SiteFooter />
    </div>
  );
}
