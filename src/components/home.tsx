import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import HeroSection from "./sections/HeroSection";
import VehicleListingsSection from "./sections/VehicleListingsSection";
import ServicesSection from "./sections/ServicesSection";
import AboutSection from "./sections/AboutSection";
import ContactSection from "./sections/ContactSection";

function Home() {
  return (
    <div className="w-full min-h-screen bg-black text-white">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <VehicleListingsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
