import { useEffect, useRef } from "react";

const HERO_VIDEO_URL =
  "https://player.vimeo.com/video/1125140032?background=1&autoplay=1&loop=1&muted=1&byline=0&title=0&autopause=0&playsinline=1&api=1";

export function HeroSection() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const playVideo = () => {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow) return;

      iframe.contentWindow.postMessage(
        JSON.stringify({ method: "play" }),
        "https://player.vimeo.com",
      );
    };

    const handleLoad = () => playVideo();
    const iframe = iframeRef.current;

    if (iframe) {
      iframe.addEventListener("load", handleLoad);
    }

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        playVideo();
      }
    };

    playVideo();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleLoad);
      }
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative flex h-screen w-full flex-col justify-center overflow-hidden bg-[#05070d]"
    >
      {/* 🎬 Fond vidéo Vimeo */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          ref={iframeRef}
          src={HERO_VIDEO_URL}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          loading="eager"
          className="absolute top-1/2 left-1/2 pointer-events-none"
          style={{
            transform: "translate(-50%, -50%)",
            width: "177.78vh", // 16:9 proportion
            height: "100vh",
            minWidth: "100vw",
            minHeight: "56.25vw",
            objectFit: "cover",
            zIndex: 1,
          }}
          title="Lease Auto - Vidéo de fond"
        ></iframe>
      </div>

      {/* 🔳 Overlay léger pour contraste */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#05070d]/80 via-[#05070d]/70 to-[#0b162f]/60 mix-blend-multiply" />
      <div className="gradient-radial" />

      {/* 💬 Contenu centré */}
      <div className="relative z-20 mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="brand-title brand-title-contrast text-4xl leading-tight md:text-6xl">
          Votre véhicule de <span className="text-[#E50914]">rêve</span>
          <br />
          en leasing premium
        </h1>

        <p className="brand-subtitle mt-6 max-w-2xl text-base md:text-xl">
          Découvrez notre collection exclusive de véhicules haut de gamme
          avec des solutions de financement flexibles et un service d&apos;exception.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a href="/vehicules" className="brand-button">
            Découvrir nos véhicules
          </a>

          <a href="/reservation" className="brand-button-outline">
            Réserver maintenant
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
