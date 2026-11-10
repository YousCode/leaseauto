import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { useVehicles } from "@/hooks/useVehicles";

/**
 * Scène d'ouverture : un seul plan plein écran, collé pendant ~4 hauteurs d'écran.
 * Le scroll pilote une caméra (zoom avant sur les berlines, fondu, recul sur les utilitaires)
 * dessinée dans un canvas à partir des deux visuels du site, puis fait défiler les 3 étapes.
 *
 * Pour brancher une vraie vidéo plus tard (ex. rendu Higgsfield) : remplacer `drawScene`
 * par le dessin d'une séquence d'images indexée sur `cam.p` ; le reste ne change pas.
 */
const SHOT_A = { src: "/images/hero/hero-vtc.webp", alt: "Berlines Lease Auto devant La Défense au coucher du soleil" };
const SHOT_B = { src: "/images/hero/hero-utilitaires.webp", alt: "Gamme d’utilitaires Lease Auto" };

const STEPS = [
  { index: "01", title: "Choisissez", body: "Un véhicule du parc, ou celui que vous décrivez : on le trouve, on le contrôle." },
  { index: "02", title: "Financez", body: "LOA ou crédit auto, sans apport possible. Accord sous 24–48h après dossier complet." },
  { index: "03", title: "Roulez", body: "Retrait à Épinay-sur-Seine ou livraison à domicile, véhicule préparé, clés en main." },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

function useReducedMotion() {
  const [reduce, setReduce] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MQ.reduce).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(MQ.reduce);
    const update = () => setReduce(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}

/* ---------- Recherche (partagée entre la version animée et la version statique) ---------- */
function HeroSearch() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { data: vehicles = [] } = useVehicles("published");
  const q = query.trim().toLowerCase();

  const suggestions = useMemo(() => {
    if (!q) return [];
    return (vehicles as any[])
      .filter((v) => `${v.brand || ""} ${v.model || v.title || ""}`.toLowerCase().includes(q))
      .slice(0, 5);
  }, [vehicles, q]);

  return (
    <div className="relative w-full max-w-xl">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (q) navigate(`/vehicules?q=${encodeURIComponent(query.trim())}`);
        }}
        className="flex h-14 items-center gap-2 rounded-full border border-white/15 bg-white/10 pl-5 pr-1.5 backdrop-blur-xl transition-colors focus-within:border-white/40"
      >
        <Search className="h-5 w-5 shrink-0 text-white/60" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Marque ou modèle (ex : Toyota C-HR)"
          aria-label="Rechercher un véhicule"
          className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-white placeholder:text-white/50 focus:outline-none"
        />
        <button type="submit" className="btn btn-light btn-sm shrink-0" aria-label="Lancer la recherche">
          Rechercher
        </button>
      </form>

      {q ? (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-3xl border border-white/10 bg-night/95 text-left backdrop-blur-xl">
          {suggestions.length === 0 ? (
            <p className="px-5 py-4 text-sm text-white/60">Aucun véhicule trouvé pour « {query} ».</p>
          ) : (
            suggestions.map((v: any) => (
              <button
                key={v.slug || v.id}
                type="button"
                onClick={() => navigate(`/vehicules/${v.slug || v.id}`)}
                className="flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-white/10"
              >
                <span className="text-sm font-semibold text-white">
                  {v.brand} {v.model || v.title}
                </span>
                <span className="num text-xs text-white/55">
                  {typeof v.monthly === "number" ? `${v.monthly} €/mois` : "Voir"}
                </span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

function HeroCopy() {
  return (
    <>
      <p className="hero-fade eyebrow eyebrow-dark">LOA · Crédit auto · Épinay-sur-Seine</p>
      <h1 className="display-xl mt-5 max-w-[14ch]">
        <span className="hero-line block overflow-hidden pb-[0.1em]">
          <span className="block">Une offre claire.</span>
        </span>
        <span className="hero-line block overflow-hidden pb-[0.1em]">
          <span className="block text-white/55">Sans surprise.</span>
        </span>
      </h1>
      <p className="hero-fade mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
        Vous définissez le véhicule, la durée et le budget. Nous gérons le reste.
      </p>
      <div className="hero-fade mt-8">
        <HeroSearch />
      </div>
      <div className="hero-fade mt-5 flex flex-wrap items-center gap-3">
        <Link to="/vehicules" className="btn btn-primary btn-lg">
          Voir les véhicules
          <ArrowUpRight />
        </Link>
        <Link to="/financement" className="btn btn-ghost-dark btn-lg">
          Simuler une mensualité
        </Link>
      </div>
    </>
  );
}

/* ---------- Version sans animation (prefers-reduced-motion) ---------- */
function StaticHero() {
  return (
    <section className="bg-night text-white">
      <div className="relative flex min-h-[100svh] items-end overflow-hidden">
        <img src={SHOT_A.src} alt={SHOT_A.alt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/30" />
        <div className="container-x relative z-10 pb-16 pt-36">
          <HeroCopy />
        </div>
      </div>
      <div className="container-x grid gap-4 py-16 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.index} className="surface-glass p-7">
            <p className="num font-display text-sm text-white/50">{s.index}</p>
            <h2 className="display-md mt-3">{s.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Version immersive ---------- */
export function ImmersiveHero() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shots = useRef<{ a: HTMLImageElement | null; b: HTMLImageElement | null }>({ a: null, b: null });
  const cam = useRef({ p: 0 });

  /** Dessine le plan pour la progression courante (0 → 1). */
  const drawScene = () => {
    const canvas = canvasRef.current;
    const { a, b } = shots.current;
    if (!canvas || !a) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, w, h);

    const p = cam.current.p;
    const cover = (img: HTMLImageElement, zoom: number, alpha: number, focusY: number) => {
      if (alpha <= 0) return;
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight) * zoom;
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) * focusY, dw, dh);
    };

    const mix = smooth((p - 0.5) / 0.16); // fondu A → B entre 50 % et 66 %
    cover(a, 1 + 0.16 * smooth(p / 0.66), 1, 0.62 + 0.1 * smooth(p / 0.66));
    if (b) cover(b, 1.16 - 0.16 * smooth((p - 0.5) / 0.5), mix, 0.6);
    ctx.globalAlpha = 1;
  };

  // Chargement des deux plans.
  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const load = (src: string, key: "a" | "b") => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        shots.current[key] = img;
        drawScene();
      };
      img.src = src;
    };
    load(SHOT_A.src, "a");
    load(SHOT_B.src, "b");
    const onResize = () => drawScene();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  useGSAP(
    () => {
      if (reduce) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Entrée au chargement : lignes du titre qui montent, puis le reste en cascade.
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(".hero-line > span", { yPercent: 115, duration: 1.15, stagger: 0.1 }, 0.15)
          .from(".hero-fade", { opacity: 0, y: 24, duration: 0.9, stagger: 0.08 }, 0.5)
          .from(".hero-cue", { opacity: 0, duration: 0.8 }, 1.2);

        // Scène liée au scroll : durée totale normalisée à 1.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });

        tl.to(cam.current, { p: 1, duration: 1, onUpdate: drawScene }, 0)
          .to(".hero-cue", { opacity: 0, duration: 0.04 }, 0.01)
          .to(".hero-intro", { opacity: 0, yPercent: -6, scale: 0.97, duration: 0.11 }, 0.04)
          .set(".hero-intro", { pointerEvents: "none" }, 0.12)
          .fromTo(".hero-veil", { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.1)
          .fromTo(".hero-steps-head", { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.08 }, 0.16)
          .fromTo(".hero-rail", { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.18)
          .fromTo(".hero-rail-fill", { scaleX: 0 }, { scaleX: 1, duration: 0.78 }, 0.2);

        const cards = gsap.utils.toArray<HTMLElement>(".hero-step");
        const slots = [
          { in: 0.2, out: 0.42 },
          { in: 0.47, out: 0.69 },
          { in: 0.74, out: null },
        ];
        cards.forEach((card, i) => {
          const slot = slots[i];
          tl.fromTo(card, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration: 0.07, ease: "power2.out" }, slot.in);
          if (slot.out !== null) tl.to(card, { opacity: 0, y: -32, duration: 0.05, ease: "power2.in" }, slot.out);
        });
        tl.fromTo(".hero-final", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.06 }, 0.84);

        return () => tl.scrollTrigger?.kill();
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [reduce] },
  );

  if (reduce) return <StaticHero />;

  return (
    <section
      ref={root}
      data-immersive
      aria-label="Présentation Lease Auto"
      className="relative h-[380svh] bg-night text-white md:h-[440svh]"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Plan : poster immédiat, puis canvas piloté par le scroll */}
        <img src={SHOT_A.src} alt={SHOT_A.alt} className="absolute inset-0 h-full w-full object-cover object-[50%_62%]" />
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night via-night/45 to-night/35" />
        <div aria-hidden className="hero-veil absolute inset-0 bg-gradient-to-r from-night/80 via-night/35 to-transparent opacity-0" />
        <div aria-hidden className="grain absolute inset-0" />

        {/* 1. Accroche */}
        <div className="hero-intro absolute inset-0 flex items-end">
          <div className="container-x pb-20 pt-32 md:pb-24">
            <HeroCopy />
          </div>
        </div>

        <div className="hero-cue pointer-events-none absolute inset-x-0 bottom-7 hidden items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55 md:flex">
          Faites défiler
          <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden />
        </div>

        {/* 2. Les trois étapes */}
        <div className="pointer-events-none absolute inset-0 flex items-end">
          <div className="container-x w-full pb-24 md:pb-28">
            <div className="hero-steps-head opacity-0">
              <p className="eyebrow eyebrow-dark">Votre parcours</p>
              <h2 className="display-lg mt-4 max-w-[16ch]">Trois étapes. Zéro surprise.</h2>
            </div>

            <div className="relative mt-8 h-[210px] max-w-xl sm:h-[190px]">
              {STEPS.map((s) => (
                <article key={s.index} className="hero-step surface-glass absolute inset-x-0 top-0 p-6 opacity-0 md:p-7">
                  <div className="flex items-baseline gap-4">
                    <span className="num font-display text-sm font-semibold text-brand-primary-bright">{s.index}</span>
                    <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{s.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/75 md:text-base">{s.body}</p>
                </article>
              ))}
            </div>

            <div className="hero-final pointer-events-auto mt-6 flex flex-wrap gap-3 opacity-0">
              <Link to="/dossier" className="btn btn-light">
                Déposer mon dossier
                <ArrowRight />
              </Link>
              <Link to="/financement" className="btn btn-ghost-dark">
                Simuler une mensualité
              </Link>
            </div>
          </div>
        </div>

        {/* Rail de progression */}
        <div className="hero-rail absolute inset-x-0 bottom-0 opacity-0">
          <div className="container-x pb-8">
            <div className="h-px w-full bg-white/15">
              <div className="hero-rail-fill h-px w-full origin-left bg-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ImmersiveHero;
