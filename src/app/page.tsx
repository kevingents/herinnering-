import { Candlelight } from "@/components/atmosphere/candlelight";
import { Hero } from "@/components/marketing/hero";
import { Invitation } from "@/components/marketing/invitation";
import { TimelinePreview } from "@/components/marketing/timeline-preview";
import { Presence } from "@/components/marketing/presence";
import { Living } from "@/components/marketing/living";
import { Dignity } from "@/components/marketing/dignity";
import { Threshold } from "@/components/marketing/threshold";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function Home() {
  return (
    <>
      <Candlelight />
      <main id="top" className="relative z-10">
        <Hero />
        <Invitation />
        <TimelinePreview />
        <Presence />
        <Living />
        <Dignity />
        <Threshold />
        <SiteFooter />
      </main>
    </>
  );
}
