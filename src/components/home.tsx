import { 
  HeaderSection, 
  HeroSection, 
  ServicesSection,
  VehicleListingsSection, 
  ProcessSection,
  ContactSection, 
  FooterSection 
} from "@/components/sections";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderSection />
      <main>
        <HeroSection />
        <ServicesSection />
        <VehicleListingsSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
}