import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background video with parallax */}
      <motion.div
        style={{ y }}
        className="absolute top-0 left-0 w-full h-[110%] -top-[5%]"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/videos/hero-poster.jpg"
          className="w-full h-full object-cover scale-105"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>

      {/* Light gradient overlay - 25-30% only */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/30 to-black/25 z-5" />

      {/* Content with animations */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4"
      >
        {/* Main title with staggered animation */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 tracking-wide font-premium"
          style={{
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          <motion.span
            initial={{ opacity: 0, x: -30 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="block"
          >
            Votre mobilité,
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 30 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            notre priorité
          </motion.span>
        </motion.h1>

        {/* Subtitle with typing effect */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-lg md:text-xl lg:text-2xl mb-16 font-light tracking-wide max-w-3xl leading-relaxed font-inter text-white/90"
          style={{ textShadow: "0 1px 5px rgba(0,0,0,0.3)" }}
        >
          Découvrez nos véhicules premium en leasing
        </motion.p>

        {/* CTA Button with premium styling */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const element = document.getElementById("vehicles");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="group relative px-8 py-3 bg-[#E50914] hover:bg-[#E50914]/90 border border-[#E50914]/30 text-white text-sm font-light font-inter tracking-wide rounded-sm overflow-hidden transition-all duration-300"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">Voir nos offres</span>
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none z-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </section>
  );
};

export default HeroSection;
