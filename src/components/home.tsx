import HeaderSection from "./sections/HeaderSection";
import HeroSection from "./sections/HeroSection";
import VehicleListingsSection from "./sections/VehicleListingsSection";
import AboutSection from "./sections/AboutSection";
import ProcessSection from "./sections/ProcessSection";
import ServicesSection from "./sections/ServicesSection";
import ContactSection from "./sections/ContactSection";
import FooterSection from "./sections/FooterSection";

function Home() {
  return (
    <div className="w-full min-h-screen bg-white">
      <HeaderSection />
      <main>
        <section id="hero">
          <HeroSection />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="process">
          <ProcessSection />
        </section>
        <section id="vehicles">
          <VehicleListingsSection />
        </section>
        <section id="services">
          <ServicesSection />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      <FooterSection />
    </div>
  );
}

export default Home;