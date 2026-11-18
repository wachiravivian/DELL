import Hero from "@/components/Hero";
import StatsStrip from "@/components/StatsStrip";
import HowItWorks from "@/components/HowItWorks";
import PlansSection from "@/components/PlansSection";
import WhyMaranet from "@/components/WhyMaranet";
import OnlineOffline from "@/components/OnlineOffline";
import ServicesTeaser from "@/components/ServicesTeaser";
import CtaBand from "@/components/CtaBand";
//import coverageZones from "@/lib/coverage";
//import { areas } from "@/lib/coverage";
import CoverageChecker from "@/components/CoverageChecker";


export default function Home() {
  return (
    <main>
      <Hero />
      <StatsStrip />
      <HowItWorks />
      <PlansSection />
      <CoverageChecker />
      <WhyMaranet />
      <OnlineOffline />
      <ServicesTeaser />
      <CtaBand />
    </main>
  );
}