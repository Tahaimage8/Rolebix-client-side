import CtaSection from "@/components/CtaSection";
import FeaturesSection from "@/components/FeaturesSection";
import HeroSection from "@/components/HeroSection";
import PricingSection from "@/components/PricingSection";
import Image from "next/image";

export default function Home() {
  return (
  <main>
    <HeroSection />
    <FeaturesSection/>
    <PricingSection/>
    <CtaSection/>
  </main>
  );
}
