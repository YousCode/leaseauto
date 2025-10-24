import {
  HeaderSection,
  ServicesSection,
  ProcessSection,
  ContactSection,
  FooterSection,
} from "@/components/sections";

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderSection />
      <main>
        <ServicesSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default ServicesPage;
