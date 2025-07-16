import HeroSection from "./sections/HeroSection";
import VehicleListingsSection from "./sections/VehicleListingsSection";
import ServicesSection from "./sections/ServicesSection";
import AboutSection from "./sections/AboutSection";
import ContactSection from "./sections/ContactSection";

function Home() {
  return (
    <div className="w-full min-h-screen bg-white">
      <main>
        <section id="hero">
          <HeroSection />
        </section>
        <section id="vehicles">
          <VehicleListingsSection />
        </section>
        <section id="services">
          <ServicesSection />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
    </div>
  );
}

export default Home;
