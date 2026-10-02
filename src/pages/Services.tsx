import { ServicesSection, ProcessSection, CtaBandSection, FooterSection } from "@/components/sections";

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <ServicesSection />
        <ProcessSection />
        <CtaBandSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default ServicesPage;
