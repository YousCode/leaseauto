import {
  HeroSection,
  VehicleListingsSection,
  ProcessSection,
  ContactSection,
  FooterSection,
  SignatureHighlightsSection,
  CollectionsShowcaseSection,
  FinancingSection,
} from "@/components/sections";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection />
        <VehicleListingsSection />
        <SignatureHighlightsSection />
        <FinancingSection />
        <CollectionsShowcaseSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
}
