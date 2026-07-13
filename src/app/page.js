import CtaSection from "@/components/CtaSection";
import FeaturesSection from "@/components/FeaturesSection";
import HeroSection from "@/components/HeroSection";
import HowRolebixWorksSection from "@/components/HowRolebixWorksSection";
import PricingSection from "@/components/PricingSection";

export default function Home() {
  return (
    <main className="overflow-hidden bg-black text-white">
      <HeroSection />
      <FeaturesSection />
      <HowRolebixWorksSection />
      <PricingSection />
      <CtaSection />
    </main>
  );
}
