import Image from "next/image";
import { Menu, User, Search, ArrowRight } from "lucide-react";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=2400&q=80";

// ✅ Mets ici la couleur exacte Lease Auto (accent)
const LEASE_ACCENT = "#CCFF00";

const BRANDS = [
  // Allemagne
  "Audi",
  "BMW",
  "Mercedes-Benz",
  "Porsche",
  "Volkswagen",
  "Opel",
  "Smart",
  "Mini",

  // France
  "Peugeot",
  "Renault",
  "Citroën",
  "DS Automobiles",
  "Alpine",

  // Italie
  "Ferrari",
  "Lamborghini",
  "Maserati",
  "Alfa Romeo",
  "Fiat",
  "Abarth",

  // Royaume-Uni
  "Aston Martin",
  "Bentley",
  "Rolls-Royce",
  "Jaguar",
  "Land Rover",
  "McLaren",

  // Japon
  "Toyota",
  "Lexus",
  "Honda",
  "Mazda",
  "Nissan",
  "Infiniti",
  "Suzuki",
  "Mitsubishi",
  "Subaru",

  // Corée
  "Hyundai",
  "Kia",
  "Genesis",

  // Europe (Esp/CZ/SE)
  "SEAT",
  "CUPRA",
  "Škoda",
  "Volvo",

  // USA très présentes en Europe
  "Tesla",
  "Ford",
  "Jeep",
  "Chevrolet",
  "Cadillac",

  // EV / nouvelles marques qu’on voit de plus en plus
  "Polestar",
  "BYD",
  "XPeng",
  "Lucid",
];

export default function HeroSection() {
  return (
    <section className="relative h-[100svh] overflow-hidden text-white">
      {/* Keyframes marquee (pas besoin de tailwind.config) */}
      <style jsx global>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={BG_IMAGE}
          alt="Lease Auto - voitures premium"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70" />
      </div>

      {/* Navbar */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-8 py-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full border border-white/25 bg-white/10" />
            <div className="text-[12px] font-semibold tracking-[0.22em] uppercase text-white/90">
              Lease Auto
            </div>
          </div>

          {/* Links + icons */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-7 text-[14px] text-white/85">
              <a className="hover:text-white transition-colors" href="#marketplace">
                Marketplace
              </a>
              <a className="hover:text-white transition-colors" href="#abonnement">
                Location par abonnement
              </a>
              <a className="hover:text-white transition-colors" href="#vendre">
                Vendre ma voiture
              </a>
              <a className="hover:text-white transition-colors" href="#faq">
                FAQ
              </a>
            </nav>

            <div className="flex items-center gap-2 rounded-md border border-white/25 bg-black/30 p-1 backdrop-blur">
              <button
                aria-label="Menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <button
                aria-label="Compte"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10 transition-colors"
              >
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="w-full max-w-[920px] text-center">
          <h1 className="mx-auto max-w-[980px] text-[44px] leading-[1.05] md:text-[72px] font-extrabold uppercase tracking-tight">
            VOTRE VIE ÉVOLUE. VOTRE VOITURE AUSSI !
          </h1>

          <div className="mt-4 space-y-2 text-[15px] md:text-[16px] text-white/85">
            <p className="font-light">
              Leasing, LOA &amp; LLD de voitures premium d&apos;occasion avec Lease Auto.
            </p>
            <p className="font-light">
              Plus de <span className="font-semibold text-white">83&nbsp;294</span> véhicules
              révisés, garantis et expertisés, prêts à être financés et livrés partout en France.
            </p>
          </div>

          {/* Search */}
          <div className="mt-6 flex justify-center">
            <div className="flex w-full max-w-[760px] items-center gap-3 rounded-full bg-white/95 px-5 py-3 shadow-2xl backdrop-blur">
              <Search className="h-5 w-5 text-slate-500" />
              <input
                className="w-full bg-transparent text-[15px] text-slate-800 placeholder:text-slate-400 outline-none"
                placeholder="Rechercher le véhicule de mes rêves"
                type="text"
              />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
            <button className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/10 px-5 py-2.5 text-[13px] font-medium text-white hover:bg-white/10 transition-colors backdrop-blur">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-white/5 group-hover:bg-white/10 transition-colors">
                <ArrowRight className="h-4 w-4" />
              </span>
              Vivre l&apos;expérience immersive
            </button>

            <button
              className="rounded-full px-6 py-3 text-[13px] font-semibold text-black hover:brightness-110 transition"
              style={{
                backgroundColor: LEASE_ACCENT,
                boxShadow: `0 14px 40px rgba(0,0,0,0.35), 0 10px 30px ${LEASE_ACCENT}40`,
              }}
            >
              Accéder à la marketplace
            </button>
          </div>
        </div>
      </div>

      {/* Brands marquee (défilement infini) */}
      <div className="absolute bottom-6 left-0 right-0 z-10 overflow-hidden pointer-events-none">
        {/* fade edges like premium */}
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-black/70 to-transparent" />

        <div
          className="flex w-max gap-14 px-10 text-[16px] italic tracking-[0.15em] text-white/45"
          style={{
            animation: "marquee 42s linear infinite",
          }}
        >
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span key={i} className="whitespace-nowrap uppercase">
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Optional: bubble (comme Joinsteer) */}
      <div className="absolute bottom-6 right-6 z-20">
        <button
          aria-label="Chat"
          className="relative inline-flex h-12 w-12 items-center justify-center rounded-full shadow-xl"
          style={{ backgroundColor: LEASE_ACCENT }}
        >
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 ring-2 ring-black/30" />
          <span className="h-5 w-5 rounded-sm bg-black/70" />
        </button>
      </div>
    </section>
  );
}