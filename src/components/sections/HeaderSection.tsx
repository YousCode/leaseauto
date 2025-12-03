import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Accueil", href: "/" },
  { name: "Véhicules", href: "/vehicules" },
  { name: "Financement", href: "/financement" },
  { name: "Assurances", href: "/assurances" },
  { name: "Contact", href: "/contact" },
];

const HeaderSection = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 border-slate-200 backdrop-blur shadow-sm"
          : "bg-white border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="flex h-18 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="src/assets/logo-lease-auto.png"
              alt="Lease Auto"
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`transition-colors ${
                    active
                      ? "text-slate-900 font-medium"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions droite */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/devis"
              className="inline-flex items-center rounded-full bg-[#E52127] text-white text-sm font-medium px-4 py-2 hover:bg-[#c91c22] transition-colors"
            >
              Demander une offre
            </Link>
          </div>

          {/* Burger mobile */}
          <button
            className="md:hidden p-2 text-slate-700"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Ouvrir le menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <nav className="py-3 flex flex-col gap-1 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-2 py-2 text-slate-800 hover:bg-slate-50"
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-2 pt-2 pb-3">
                <Link
                  to="/devis"
                  className="block w-full text-center rounded-full bg-[#E52127] text-white text-sm font-medium px-4 py-2 hover:bg-[#c91c22] transition-colors"
                >
                  Demander une offre
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export { HeaderSection };
export default HeaderSection;
