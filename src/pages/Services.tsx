import { ServicesSection, ProcessSection, ContactSection, FooterSection } from "@/components/sections";

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-white">
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
