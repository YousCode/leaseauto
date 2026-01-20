import {
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
      <main>
        <HeroSection />
        <VehicleListingsSection />
        <SignatureHighlightsSection />
        <ServicesSection />
        <CollectionsShowcaseSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
}
