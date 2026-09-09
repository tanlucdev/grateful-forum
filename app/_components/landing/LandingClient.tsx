"use client";

import { BadgesSection, BottomCta, CommunitySection, Footer } from "./landing-bottom";
import { ChoiceSection, GardenSection } from "./landing-middle";
import { NotebookSection } from "./landing-notebook";
import { HeroSection, LandingHeader } from "./landing-top";

export function LandingClient() {
  return (
    <main className="landing-theme landing-motion relative isolate min-h-dvh overflow-hidden bg-[#faf7f0] font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-text-deep">
      <div aria-hidden="true" className="landing-watercolor-field pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="landing-mesh-center absolute left-1/2 top-0 h-[820px] w-[1120px] -translate-x-1/2 rounded-full" />
        <div className="landing-mesh-left landing-drift-organic-1 absolute -left-24 -top-[5%] h-[760px] w-[760px] rounded-full" />
        <div className="landing-mesh-right landing-drift-organic-2 absolute -right-24 top-[5%] h-[760px] w-[760px] rounded-full" />
        <div className="landing-mesh-middle landing-drift-organic-3 absolute left-1/2 top-[35%] h-[720px] w-[940px] -translate-x-1/2 rounded-full" />
        <div className="landing-mesh-warm-left landing-drift-organic-2 absolute -left-[10%] top-[55%] h-[720px] w-[720px] rounded-full" />
        <div className="landing-mesh-warm-right landing-drift-organic-1 absolute -right-[10%] top-[58%] h-[720px] w-[720px] rounded-full" />
        <div className="landing-mesh-footer absolute bottom-0 left-1/2 h-[680px] w-[1120px] -translate-x-1/2 rounded-full" />
      </div>
      <LandingHeader />
      <div className="relative z-10 lg:pt-24">
        <HeroSection />
        <ChoiceSection />
        <NotebookSection />
        <GardenSection />
        <BadgesSection />
        <CommunitySection />
        <BottomCta />
      </div>
      <Footer />
    </main>
  );
}
