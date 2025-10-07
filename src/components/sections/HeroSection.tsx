import React from "react";

export function HeroSection() {
  return (
    <section className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 🎬 Vidéo Vimeo en fond - VRAIMENT plein écran */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          src="https://player.vimeo.com/video/1125140032?background=1&autoplay=1&loop=1&muted=1&byline=0&title=0"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute pointer-events-none"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100vw',
            height: '56.25vw', // 16:9 aspect ratio
            minHeight: '100vh',
            minWidth: '177.78vh', // 16:9 aspect ratio
            transform: 'translate(-50%, -50%)',
            zIndex: 1
          }}
          title="Lease Auto video background"
        ></iframe>
      </div>

      {/* 💬 Contenu centré au-dessus de la vidéo */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center text-white px-4 h-full">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-2xl">
          Votre véhicule de <span className="text-red-500">rêve</span>
          <br />
          en leasing premium
        </h1>

        <p className="text-lg md:text-xl mt-6 max-w-2xl drop-shadow-xl">
          Découvrez notre collection exclusive de véhicules haut de gamme
          avec des solutions de financement flexibles et un service d'exception.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <a 
            href="/vehicules"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-md uppercase tracking-wide transition-all duration-200 shadow-lg hover:shadow-red-700/40 inline-block"
          >
            Découvrir nos véhicules
          </a>

          <a 
            href="/reservation"
            className="border-2 border-white text-white font-semibold py-3 px-8 rounded-md uppercase tracking-wide hover:bg-white hover:text-black transition-all duration-200 shadow-lg hover:shadow-white/40 inline-block"
          >
            Réserver maintenant
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;