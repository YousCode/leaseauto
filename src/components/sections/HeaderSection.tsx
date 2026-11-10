import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { EASE } from "@/lib/motion";

const logoWhite = `${import.meta.env.BASE_URL}logo-lease-auto-white.png`;

const navItems = [
  { name: "Véhicules", href: "/vehicules" },
  { name: "Financement", href: "/financement" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

/**
 * Header flottant : une pilule « nuit » en verre dépoli, identique sur toutes les pages.
 * Elle se resserre après quelques pixels de scroll.
 */
const HeaderSection = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
        <div
          className={`pointer-events-auto mx-auto flex items-center justify-between rounded-full border border-white/10 bg-night/80 text-white backdrop-blur-xl transition-[max-width,height,padding,box-shadow] duration-500 ease-out ${
            scrolled
              ? "h-14 max-w-[960px] pl-5 pr-2 shadow-[0_12px_40px_-12px_rgba(7,11,20,0.55)]"
              : "h-16 max-w-[1320px] pl-6 pr-3"
          }`}
        >
          <Link to="/" aria-label="Lease Auto, accueil" className="flex shrink-0 items-center">
            <img src={logoWhite} alt="Lease Auto" width={457} height={86} className="h-6 w-auto md:h-7" />
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    active ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/10"
                      transition={{ duration: 0.45, ease: EASE }}
                    />
                  ) : null}
                  <span className="relative">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/contact" className="btn btn-primary btn-sm hidden sm:inline-flex">
              Demander une offre
              <ArrowUpRight />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="grain fixed inset-0 z-40 flex flex-col bg-night px-6 pb-10 pt-28 text-white md:hidden"
          >
            <nav aria-label="Navigation mobile" className="flex flex-1 flex-col justify-center gap-2">
              {[{ name: "Accueil", href: "/" }, ...navItems].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.05 + i * 0.06 }}
                >
                  <Link
                    to={item.href}
                    className={`display-lg block py-1.5 ${
                      (item.href === "/" ? pathname === "/" : isActive(item.href)) ? "text-white" : "text-white/45"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
              className="space-y-3"
            >
              <Link to="/contact" className="btn btn-primary btn-lg w-full">
                Demander une offre
                <ArrowUpRight />
              </Link>
              <a href="tel:0184218393" className="btn btn-ghost-dark btn-lg w-full">
                01 84 21 83 93
              </a>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export { HeaderSection };
export default HeaderSection;
