import { HeroSection } from "@/components/sections/HeroSection";
import { ObjectionsSection } from "@/components/sections/ObjectionsSection";
import { ServicesRail } from "@/components/sections/ServicesRail";
import { AlastauSection } from "@/components/sections/AlastauSection";
import { CalculatorSection } from "@/components/sections/CalculatorSection";
import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { SocialProofSection } from "@/components/sections/SocialProofSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ObjectionsSection />
      <ServicesRail />
      <AlastauSection />
      <CalculatorSection />
      <BeforeAfterSection />
      <TeamSection />
      <SocialProofSection />
      <PricingSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
