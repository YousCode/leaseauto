import { ContactSection, FooterSection } from "@/components/sections";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <ContactSection headingTag="h1" />
      </main>
      <FooterSection />
    </div>
  );
};

export default ContactPage;
