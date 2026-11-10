import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VehicleCard, VehicleCardSkeleton } from "@/components/vehicles/VehicleCard";
import type { VehicleCardProps } from "@/components/vehicles/VehicleCard";
import { cn } from "@/lib/utils";
import { useVehicles } from "@/hooks/useVehicles";
import { gsap, ScrollTrigger, useGSAP, MQ, prefersReducedMotion } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { baseTransition, DISTANCE, stagger } from "@/lib/motion";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&auto=format&fit=crop";

const PREVIEW_COUNT = 6;
/** À partir de ce nombre de véhicules, la grille devient une vitrine horizontale. */
const SHOWCASE_MIN = 4;
/** Remplissage minimal de la barre de progression (elle n'est jamais vide). */
const BAR_MIN = 0.12;

/**
 * Scène épinglée : uniquement sur desktop, à la souris, animations autorisées,
 * et avec assez de hauteur pour qu'une carte entière tienne sous le header.
 */
const PIN_QUERY = `${MQ.desktop} and ${MQ.motion} and (hover: hover) and (pointer: fine) and (min-height: 640px)`;

const ITEM_CLASS =
  "w-[80vw] max-w-[340px] shrink-0 snap-start md:w-[360px] md:max-w-none lg:w-[clamp(300px,50vh,480px)]";

const subscribePin = (onChange: () => void) => {
  const mql = window.matchMedia(PIN_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};
const getPin = () => window.matchMedia(PIN_QUERY).matches;
const getPinServer = () => false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawVehicle = Record<string, any>;

const toCardProps = (v: RawVehicle): VehicleCardProps => {
  const primaryImage =
    (Array.isArray(v.images) && v.images.length > 0 && v.images[0]) || v.image || v.main_image_url || FALLBACK_IMAGE;

  const monthlyRaw = v.monthly_price ?? v.monthly ?? v.price_loa ?? v.price ?? null;
  const monthlyPrice =
    typeof monthlyRaw === "number"
      ? Math.round(monthlyRaw)
      : monthlyRaw !== null
        ? Math.round(Number(String(monthlyRaw).replace(/[^\d.]/g, ""))) || null
        : null;

  const energy =
    typeof v.energy === "string" && v.energy.trim().length > 0 ? v.energy : typeof v.fuel === "string" ? v.fuel : null;

  const transmission =
    typeof v.transmission === "string" && v.transmission.trim().length > 0
      ? v.transmission
      : typeof v.gearbox === "string" && v.gearbox.trim().length > 0
        ? v.gearbox
        : null;

  const highlight =
    v.highlight || (v.new_arrival ? "nouveau" : v.availability === "immediate" ? "dispo" : v.featured ? "promo" : null);

  return {
    slug: v.slug || String(v.id),
    imageUrl: primaryImage,
    brand: v.brand || "Marque",
    model: v.model || v.title || "Modèle",
    year: v.year || undefined,
    mileage: v.mileage || undefined,
    energy,
    transmission,
    monthlyPrice,
    highlight,
  };
};

const reveal = (index: number) => ({
  initial: { opacity: 0, y: DISTANCE },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { ...baseTransition, delay: stagger(index) },
});

const VehicleListingsSection = () => {
  const { data: publishedVehicles = [], isLoading } = useVehicles("published");
  const total = (publishedVehicles as RawVehicle[]).length;

  const featured = useMemo(() => {
    const list = [...(publishedVehicles as RawVehicle[])];
    // Mis en avant d'abord, puis par récence
    list.sort((a, b) => (Number(b.featured) || 0) - (Number(a.featured) || 0));
    return list.slice(0, PREVIEW_COUNT);
  }, [publishedVehicles]);

  const layout: "loading" | "empty" | "grid" | "showcase" = isLoading
    ? "loading"
    : featured.length === 0
      ? "empty"
      : featured.length < SHOWCASE_MIN
        ? "grid"
        : "showcase";

  const canPin = useSyncExternalStore(subscribePin, getPin, getPinServer);
  /** Vitrine épinglée (défilement horizontal piloté par le scroll) ou carrousel natif. */
  const pinned = layout === "showcase" && canPin;

  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Scène desktop : la section s'épingle, l'en-tête et la piste de cartes se translatent en X au scroll vertical.
  useGSAP(
    () => {
      const pin = pinRef.current;
      const mover = moverRef.current;
      const viewport = viewportRef.current;
      const bar = barRef.current;
      if (!pinned || !pin || !mover || !viewport || !bar) return;

      const mm = gsap.matchMedia();
      mm.add(PIN_QUERY, () => {
        viewport.scrollLeft = 0;

        /** Distance à parcourir = largeur de piste − largeur visible. */
        const distance = () => Math.max(0, mover.scrollWidth - pin.clientWidth);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(mover, { x: () => -distance() }, 0).fromTo(bar, { scaleX: BAR_MIN }, { scaleX: 1 }, 0);

        // Au clavier : amène la carte qui reçoit le focus dans le champ.
        const onFocusIn = (event: FocusEvent) => {
          const target = event.target as HTMLElement | null;
          const st = tl.scrollTrigger;
          const item = target?.closest("li");
          const span = distance();
          if (!target || !st || !item || !span || !target.matches(":focus-visible")) return;
          const gutter = parseFloat(getComputedStyle(mover).paddingRight) || 0;
          const left = item.getBoundingClientRect().left - mover.getBoundingClientRect().left;
          const offset = Math.min(span, Math.max(0, left - gutter));
          const y = st.start + (offset / span) * (st.end - st.start);
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(y, { immediate: true });
          else window.scrollTo(0, y);
        };
        mover.addEventListener("focusin", onFocusIn);

        // Les données arrivent après le montage : les scènes situées plus bas doivent
        // tenir compte de la hauteur ajoutée par l'épinglage.
        ScrollTrigger.sort();
        ScrollTrigger.refresh();

        return () => {
          mover.removeEventListener("focusin", onFocusIn);
          gsap.set([mover, bar], { clearProps: "transform" });
          bar.style.transform = `scaleX(${BAR_MIN})`;
        };
      });
    },
    { scope: root, dependencies: [pinned, featured.length, total], revertOnUpdate: true },
  );

  // Carrousel natif (mobile, tactile, animations réduites) : la barre suit le défilement horizontal.
  const onNativeScroll = useCallback(() => {
    const viewport = viewportRef.current;
    const bar = barRef.current;
    if (!viewport || !bar) return;
    const max = viewport.scrollWidth - viewport.clientWidth;
    if (max <= 0) return;
    const progress = Math.min(1, Math.max(0, viewport.scrollLeft / max));
    bar.style.transform = `scaleX(${BAR_MIN + (1 - BAR_MIN) * progress})`;
  }, []);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!viewport || !track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    viewport.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  const heading = (
    <SectionHeading
      eyebrow="Sélection Lease Auto"
      title="Nos coups de cœur du moment"
      subtitle="Véhicules récents, contrôlés et prêts à partir — avec financement sur-mesure."
      className={cn(
        layout === "showcase" && "!mb-8 md:!mb-10",
        // Épinglé : l'en-tête devient le premier panneau de la piste, texte en haut, action en bas.
        pinned && "h-full !mb-0 md:!mb-0 md:!flex-col md:!items-start md:!justify-between",
      )}
      action={
        <Link to="/vehicules" className="btn btn-ghost">
          Voir toute la sélection
          <ArrowUpRight />
        </Link>
      }
    />
  );

  return (
    <section
      ref={root}
      data-scene="vehicles"
      className="relative bg-paper [--gutter:1.25rem] md:[--gutter:2rem] lg:[--gutter:max(2rem,calc((100vw_-_1320px)_/_2_+_2rem))]"
    >
      <div
        ref={pinRef}
        className={cn("flex flex-col", pinned ? "h-screen justify-center overflow-x-clip pb-8 pt-24" : "section")}
      >
        <div ref={moverRef} className={cn(pinned && "flex w-max pr-[var(--gutter)]")}>
          <div
            className={
              pinned ? "w-[calc(var(--gutter)+28rem)] shrink-0 pl-[var(--gutter)] pr-12" : "container-x"
            }
          >
            {heading}
          </div>

          {layout === "loading" ? (
            <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <VehicleCardSkeleton />
              <VehicleCardSkeleton className="hidden sm:block" />
              <VehicleCardSkeleton className="hidden lg:block" />
            </div>
          ) : null}

          {layout === "empty" ? (
            <div className="container-x">
              <div className="surface flex flex-col gap-8 p-7 md:p-12 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-xl">
                  <h3 className="display-md text-night">Vous cherchez un modèle précis ? On le trouve pour vous.</h3>
                  <p className="lead mt-4">
                    Notre sélection se renouvelle en continu. Décrivez le véhicule, le budget et la durée : on sourçe,
                    on contrôle et on monte le financement.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                  <Link to="/contact" className="btn btn-primary">
                    Décrire mon projet
                    <ArrowUpRight />
                  </Link>
                  <Link to="/financement" className="btn btn-ghost">
                    Simuler mon financement
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          {layout === "grid" ? (
            <ul className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((v, index) => (
                <motion.li key={v.slug || v.id || index} {...reveal(index)}>
                  <VehicleCard {...toCardProps(v)} />
                </motion.li>
              ))}
            </ul>
          ) : null}

          {layout === "showcase" ? (
            <div
              ref={viewportRef}
              onScroll={onNativeScroll}
              className={cn(
                // py/-my : marge interne pour que le survol et l'apparition des cartes ne soient pas rognés
                !pinned &&
                  "no-scrollbar -my-6 snap-x snap-mandatory scroll-px-[var(--gutter)] overflow-x-auto py-6",
              )}
            >
              <ul ref={trackRef} className={cn("flex w-max gap-4 md:gap-5", !pinned && "px-[var(--gutter)]")}>
                {featured.map((v, index) => (
                  <motion.li key={v.slug || v.id || index} className={ITEM_CLASS} {...reveal(index)}>
                    <VehicleCard {...toCardProps(v)} />
                  </motion.li>
                ))}
                <motion.li className={ITEM_CLASS} {...reveal(featured.length)}>
                  <Link
                    to="/vehicules"
                    className="surface-night grain group relative flex h-full min-h-[340px] flex-col justify-between overflow-hidden p-7 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-white/30 md:p-8"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-brand-ink/70 blur-[90px]"
                    />
                    <p className="eyebrow eyebrow-dark relative z-10">Sélection Lease Auto</p>
                    <div className="relative z-10">
                      <p className="display-md text-white">
                        Voir les <span className="num">{total}</span> véhicules disponibles
                      </p>
                      <span
                        aria-hidden
                        className="mt-8 grid h-14 w-14 place-items-center rounded-full bg-white text-night transition-colors duration-300 ease-out group-hover:bg-brand-primary group-hover:text-white"
                      >
                        <ArrowUpRight className="h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </Link>
                </motion.li>
              </ul>
            </div>
          ) : null}
        </div>

        {layout === "showcase" ? (
          <div
            className={cn(
              "container-x flex items-center gap-5",
              // Épinglée, la ligne s'arrête avant le bouton flottant en bas à droite de l'écran.
              pinned ? "mt-8 pr-[max(2rem,calc(8rem_-_var(--gutter)))]" : "mt-8 md:mt-10",
            )}
          >
            <div aria-hidden className="h-[3px] flex-1 overflow-hidden rounded-full bg-night/10">
              <div
                ref={barRef}
                className="h-full w-full origin-left rounded-full bg-brand-primary"
                style={{ transform: `scaleX(${BAR_MIN})` }}
              />
            </div>

            {pinned ? (
              <p aria-hidden className="flex items-center gap-2 text-xs font-medium text-slate-500">
                Faites défiler
                <ArrowRight className="h-3.5 w-3.5" />
              </p>
            ) : (
              <div className="hidden gap-2 md:flex">
                <button
                  type="button"
                  onClick={() => scrollByCard(-1)}
                  aria-label="Véhicules précédents"
                  className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 text-night transition-colors duration-300 ease-out hover:border-night hover:bg-night hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByCard(1)}
                  aria-label="Véhicules suivants"
                  className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 text-night transition-colors duration-300 ease-out hover:border-night hover:bg-night hover:text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export { VehicleListingsSection };
export default VehicleListingsSection;
