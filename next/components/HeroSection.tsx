"use client";

import Image from "next/image";
import { Menu, User, Search } from "lucide-react";
import { Oswald } from "next/font/google"; // Import de la font "Condensed"

// Configuration de la police pour le titre (effet "Blockbuster")
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-oswald",
});

const BG_IMAGE = "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=2400";

// COULEUR SIGNATURE JOINSTEER (Jaune Néon)
const ACCENT = "#ccff00";
const ACCENT_TEXT = "#000000";

const BRANDS = [
  "Audi","BMW","Mercedes-Benz","Porsche","Volkswagen","Ferrari","Lamborghini",
  "Maserati","Aston Martin","Bentley","Rolls-Royce","Jaguar","Land Rover","McLaren",
  "Tesla","Lexus","Alpine","Mini","Volvo","Ford Mustang"
];

export default function HeroJoinsteerLike() {
  return (
    <section className={`relative h-[100svh] w-full overflow-hidden text-white ${oswald.variable}`}>

      {/* Styles globaux pour l'animation marquee */}
      <style jsx global>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        /* Glass effect premium pour la navbar */
        .glass-nav {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
      `}</style>

      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src={BG_IMAGE}
          alt="Lease Auto Background"
          fill
          priority
          className="object-cover"
        />
        {/* Overlay complexe pour lisibilité parfaite du texte blanc */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />
      </div>

      {/* --- NAVBAR --- */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-6 md:px-10">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
             {/* Remplace par ton vrai logo SVG ici */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black font-bold text-xl">
              L
            </div>
            <span className="text-sm font-bold tracking-[0.2em] uppercase text-white hidden md:block">
              Lease Auto
            </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-wide text-white/90">
            {["Marketplace", "Location par abonnement", "Vendre ma voiture", "FAQ"].map((item) => (
              <a key={item} href="#" className="hover:text-[#ccff00] transition-colors duration-300">
                {item}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="glass-nav flex items-center gap-1 rounded-lg border border-white/10 p-1">
              <button className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10 transition">
                <Menu className="h-5 w-5 text-white" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10 transition">
                <User className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT (CENTER) --- */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        
        {/* Titre Impactant (Font Oswald) */}
        <h1 className="font-oswald max-w-6xl text-5xl font-bold uppercase leading-[0.9] tracking-tighter text-white md:text-[86px] lg:text-[100px] drop-shadow-2xl">
          VOTRE VIE ÉVOLUE.<br /> VOTRE VOITURE AUSSI !
        </h1>

        {/* Sous-titre & Stats */}
        <div className="mt-6 max-w-3xl space-y-2">
          <p className="text-base font-medium text-white md:text-lg">
            Leasing, LOA & LLD de voitures premium d&apos;occasion avec Lease Auto
          </p>
          <p className="text-sm text-white/70 md:text-base font-light">
            Plus de <span className="font-bold text-white">83 294</span> véhicules révisés, garantis et expertisés.
          </p>
        </div>

        {/* Search Bar Premium */}
        <div className="mt-10 w-full max-w-[680px]">
          <div className="group relative flex items-center gap-4 rounded-xl bg-white px-6 py-4 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-transform focus-within:scale-[1.02]">
            <Search className="h-6 w-6 text-gray-400 group-focus-within:text-black transition-colors" />
            <input
              className="h-full w-full bg-transparent text-lg text-black outline-none placeholder:text-gray-400 placeholder:font-light"
              placeholder="Rechercher le véhicule de mes rêves (ex: RS3, Macan...)"
              type="text"
            />
          </div>
        </div>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <button className="group relative px-8 py-3.5 rounded-full border border-white/30 bg-black/20 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black hover:border-white">
            <span className="relative z-10">Vivre l&apos;expérience immersive</span>
          </button>

          <button
            className="px-9 py-3.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-[0_0_20px_-5px_#ccff00] transition-transform hover:scale-105 hover:brightness-110"
            style={{ backgroundColor: ACCENT, color: ACCENT_TEXT }}
          >
            Accéder à la marketplace
          </button>
        </div>
      </div>

      {/* --- MARQUEE BRANDS (FOOTER) --- */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-8 pt-20">
        {/* Gradient pour fondre le texte */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
        
        <div className="relative flex overflow-hidden opacity-60 mix-blend-overlay">
          <div className="animate-marquee flex whitespace-nowrap">
            {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
              <span 
                key={i} 
                className="mx-8 text-xl font-bold italic uppercase tracking-widest text-transparent md:text-2xl"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.5)" }} // Effet "Outline" style luxe
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
