import {
  HeroSection,
  ScrollStorySection,
  VehicleListingsSection,
  CtaBandSection,
  FooterSection,
  SignatureHighlightsSection,
  FinancingSection,
} from "@/components/sections";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection />
        <ScrollStorySection />
        <VehicleListingsSection />
        <FinancingSection />
        <SignatureHighlightsSection />
        <CtaBandSection />
      </main>
      <FooterSection />
    </div>
  );
}
