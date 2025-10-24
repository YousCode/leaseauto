import { HeaderSection, ContactSection, FooterSection } from "@/components/sections";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeaderSection />
      <main>
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default ContactPage;
