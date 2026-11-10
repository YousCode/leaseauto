import { ContactSection, FooterSection } from "@/components/sections";
import { PageHero } from "@/components/ui/PageHero";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-paper">
      <main>
        <PageHero
          eyebrow="Contact"
          title="Louer ou acheter votre prochain véhicule ?"
          subtitle={
            <>
              Nos experts Lease Auto vous accompagnent du choix jusqu’à la clé en main.{" "}
              <span className="font-semibold text-white">Financement 100% sur-mesure.</span>
            </>
          }
        />
        <ContactSection showHeading={false} />
      </main>
      <FooterSection />
    </div>
  );
};

export default ContactPage;
