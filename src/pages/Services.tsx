import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ServicesSection, ProcessSection, CtaBandSection, FooterSection } from "@/components/sections";
import { PageHero } from "@/components/ui/PageHero";

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-paper">
      <main>
        <PageHero
          eyebrow="Nos services"
          title="Une gamme complète de services"
          subtitle="Particuliers, VTC, artisans et sociétés : une solution par usage, un seul interlocuteur."
        >
          <Link to="/contact" className="btn btn-primary">
            Demander une offre
            <ArrowUpRight />
          </Link>
          <Link to="/vehicules" className="btn btn-ghost-dark">
            Voir les véhicules
          </Link>
        </PageHero>
        <ServicesSection />
        <ProcessSection />
        <CtaBandSection tone="white" />
      </main>
      <FooterSection />
    </div>
  );
};

export default ServicesPage;
