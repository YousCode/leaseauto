import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * Séquence d'images pilotée par le scroll (technique canvas + frames).
 * Les frames vivent dans /public/frames/story ; remplacer le dossier suffit
 * pour changer la vidéo (ex. rendu Higgsfield), FRAME_COUNT à ajuster.
 */
const FRAME_COUNT = 63;
const FRAME_SRC = (i: number) => `/frames/story/f_${String(i + 1).padStart(3, "0")}.webp`;
const POSTER = FRAME_SRC(0);

type Step = { from: number; to: number; index: string; title: string; body: string };

const STEPS: Step[] = [
  { from: 0.04, to: 0.34, index: "01", title: "Choisissez", body: "Un véhicule du parc, ou celui que vous décrivez : on le trouve, on le contrôle." },
  { from: 0.38, to: 0.66, index: "02", title: "Financez", body: "LOA ou crédit auto, sans apport possible. Accord sous 24–48h après dossier complet." },
  { from: 0.70, to: 0.98, index: "03", title: "Roulez", body: "Retrait à Épinay-sur-Seine ou livraison à domicile, véhicule préparé, clés en main." },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}

export function ScrollStorySection() {
  const reduce = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const lastDrawn = useRef(-1);
  const progressRef = useRef(0);
  const rafRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [armed, setArmed] = useState(false);

  // Précharge uniquement quand la section approche.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  useEffect(() => {
    if (!armed) return;
    const imgs: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    framesRef.current = imgs;
    let cancelled = false;
    // La première frame d'abord, puis le reste par paquets.
    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (!cancelled) {
            imgs[i] = img;
            if (i === 0 || i === frameIndex(progressRef.current)) requestDraw();
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = FRAME_SRC(i);
      });
    (async () => {
      await load(0);
      for (let start = 1; start < FRAME_COUNT && !cancelled; start += 6) {
        await Promise.all(Array.from({ length: Math.min(6, FRAME_COUNT - start) }, (_, k) => load(start + k)));
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed]);

  const frameIndex = (p: number) => Math.min(FRAME_COUNT - 1, Math.floor(clamp01(p) * (FRAME_COUNT - 1)));

  const draw = () => {
    rafRef.current = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const idx = frameIndex(progressRef.current);
    // Frame la plus proche déjà chargée (évite les trous pendant le préchargement).
    let img = framesRef.current[idx];
    if (!img) {
      for (let d = 1; d < FRAME_COUNT && !img; d++) img = framesRef.current[idx - d] || framesRef.current[idx + d] || null;
    }
    if (!img) return;
    const drawnKey = framesRef.current.indexOf(img);
    if (drawnKey === lastDrawn.current && canvas.dataset.sized === "1") return;
    lastDrawn.current = drawnKey;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    canvas.dataset.sized = "1";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // cover-fit
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  };

  const requestDraw = () => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    if (reduce) return;
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = clamp01(-rect.top / Math.max(1, total));
      progressRef.current = p;
      requestDraw();
      // Les cartes ne changent d'état qu'à ~1 % près : pas de re-render à chaque pixel.
      setProgress((prev) => (Math.abs(prev - p) > 0.01 || p === 0 || p === 1 ? p : prev));
    };
    const onResize = () => {
      if (canvasRef.current) canvasRef.current.dataset.sized = "0";
      lastDrawn.current = -1;
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      lastDrawn.current = -1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const stepStates = useMemo(
    () =>
      STEPS.map((s) => {
        const inRange = progress >= s.from && progress <= s.to;
        const fadeIn = clamp01((progress - s.from) / 0.06);
        const fadeOut = clamp01((s.to - progress) / 0.06);
        const o = inRange ? Math.min(fadeIn, fadeOut) : 0;
        return { opacity: o, y: (1 - o) * 14 };
      }),
    [progress],
  );

  /* Version statique : image + 3 étapes, pour reduced-motion. */
  if (reduce) {
    return (
      <section className="bg-brand-ink-deep text-white">
        <div className="relative">
          <img src={POSTER} alt="" className="h-[60vh] w-full object-cover opacity-80" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink-deep via-brand-ink-deep/30 to-transparent" />
        </div>
        <div className="mx-auto grid max-w-6xl gap-5 px-4 py-14 sm:grid-cols-3 lg:px-8">
          {STEPS.map((s) => (
            <div key={s.index} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-[11px] tracking-[0.28em] text-white/50">{s.index}</p>
              <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-white/70">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Votre parcours en trois étapes" className="bg-brand-ink-deep text-white">
      <div ref={containerRef} className="relative h-[260vh] md:h-[320vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* poster instantané sous le canvas : aucun flash au chargement */}
          <img src={POSTER} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-ink-deep/90 via-brand-ink-deep/20 to-brand-ink-deep/40" />

          {/* en-tête fixe */}
          <div className="absolute inset-x-0 top-0 pt-28 text-center md:pt-32">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">Votre parcours</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold md:text-5xl">Trois étapes. Zéro surprise.</h2>
          </div>

          {/* cartes d'étape */}
          <div className="absolute inset-x-0 bottom-0 px-4 pb-10 md:bottom-16 md:px-8">
            <div className="relative mx-auto h-[150px] max-w-6xl md:h-[170px]">
              {STEPS.map((s, i) => (
                <div
                  key={s.index}
                  style={{
                    opacity: stepStates[i].opacity,
                    transform: `translate3d(0, ${stepStates[i].y}px, 0)`,
                    transition: "opacity 0.25s linear, transform 0.25s cubic-bezier(0.22,1,0.36,1)",
                  }}
                  className="absolute inset-x-0 bottom-0 mx-auto flex max-w-xl flex-col rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md md:p-6"
                  aria-hidden={stepStates[i].opacity < 0.5}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-primary text-sm font-bold">{s.index}</span>
                    <h3 className="text-xl font-semibold md:text-2xl">{s.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">{s.body}</p>
                </div>
              ))}
            </div>
            <div className="mx-auto mt-5 flex max-w-xl items-center justify-between">
              <div className="flex gap-1.5">
                {STEPS.map((s, i) => (
                  <span
                    key={s.index}
                    className="h-1 rounded-full bg-white transition-all duration-300"
                    style={{ width: stepStates[i].opacity > 0.5 ? 28 : 10, opacity: stepStates[i].opacity > 0.5 ? 1 : 0.35 }}
                  />
                ))}
              </div>
              <Link
                to="/financement"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition-[gap] hover:gap-3"
                style={{ opacity: progress > 0.72 ? 1 : 0, transition: "opacity 0.3s linear" }}
              >
                Simuler mon financement <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScrollStorySection;
