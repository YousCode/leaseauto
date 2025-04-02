import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Simple animation for text reveal
    // In a real implementation, you would use GSAP here
    const heading = headingRef.current;
    if (heading) {
      const words = heading.innerText.split(" ");
      heading.innerHTML = "";

      words.forEach((word, index) => {
        const span = document.createElement("span");
        span.innerText = word + " ";
        span.style.opacity = "0";
        span.style.transform = "translateY(20px)";
        span.style.display = "inline-block";
        span.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        heading.appendChild(span);

        setTimeout(() => {
          span.style.opacity = "1";
          span.style.transform = "translateY(0)";
        }, 300 * index);
      });
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-driving-through-a-city-at-night-1270-large.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10">
        <div className="w-[800px] h-[600px]"></div>
      </div>
      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl">
        <h1
          ref={headingRef}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
        >
          Votre mobilité, notre priorité.
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          Découvrez Lease Auto, votre partenaire pour l'achat, la vente et le
          financement de véhicules d'exception à Épinay-sur-Seine.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Button className="bg-[#DA1212] hover:bg-[#B50F0F] text-white text-lg py-6 px-8 font-medium">
            Découvrir Lease Auto
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white/10 text-lg py-6 px-8 font-medium"
          >
            Demander un Devis
          </Button>
        </motion.div>
      </div>
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </div>
  );
};

export default HeroSection;
