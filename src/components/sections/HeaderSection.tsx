import { Menu, X, Search } from "lucide-react";
import { useState } from "react";

const HeaderSection = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "ACCUEIL", href: "#hero" },
    { name: "VÉHICULES", href: "#vehicles" },
    { name: "SERVICES", href: "#services" },
    { name: "ESTIMER MON VÉHICULE", href: "#estimate" },
    { name: "CONTACT", href: "#contact" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black shadow-[0_2px_10px_rgba(0,0,0,0.3)] transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-12">
        <div className="flex items-center justify-between h-[72px]">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold">
              <span className="text-[#E53935]">Lease</span>
              <span className="text-white">Auto</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white text-sm font-medium tracking-wide hover:text-[#E53935] transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200">
              <Search size={20} className="text-white" />
            </button>
            <button className="bg-[#E53935] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#C62828] transition-all duration-200 shadow-sm hover:shadow-md">
              Demander une offre
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#E53935] p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/10">
            <div className="py-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-white hover:bg-white/10 hover:text-[#E53935] text-sm font-medium tracking-wide transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="px-4 pt-4">
                <button className="w-full bg-[#E53935] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#C62828] transition-colors duration-200">
                  Demander une offre
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export { HeaderSection };
export default HeaderSection;