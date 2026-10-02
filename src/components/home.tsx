import {
  HeroSection,
  VehicleListingsSection,
  ProcessSection,
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
        <VehicleListingsSection />
        <FinancingSection />
        <ProcessSection />
        <SignatureHighlightsSection />
        <CtaBandSection />
      </main>
      <FooterSection />
    </div>
  );
}
