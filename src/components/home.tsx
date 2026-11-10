import {
  ImmersiveHero,
  BrandBand,
  VehicleListingsSection,
  FinancingSection,
  StatsSection,
  SignatureHighlightsSection,
  CtaBandSection,
  FooterSection,
} from "@/components/sections";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <ImmersiveHero />
        <BrandBand />
        <VehicleListingsSection />
        <FinancingSection />
        <StatsSection />
        <SignatureHighlightsSection />
        <CtaBandSection />
      </main>
      <FooterSection />
    </div>
  );
}
