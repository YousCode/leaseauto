import {
  HeaderSection,
  HeroSection,
  ServicesSection,
  VehicleListingsSection,
  ProcessSection,
  ContactSection,
  FooterSection,
  SignatureHighlightsSection,
  CollectionsShowcaseSection,
} from "@/components/sections";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderSection />
      <main>
        <HeroSection />
        <SignatureHighlightsSection />
        <ServicesSection />
        <CollectionsShowcaseSection />
        <VehicleListingsSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
}
