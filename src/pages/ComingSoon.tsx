import { Mail, Phone, Clock3, ShieldCheck, Sparkles } from "lucide-react";
import logo from "@/assets/logo-lease-auto.png";

function ComingSoon() {
  const highlights = [
    "Nouvelle expérience de location sur mesure",
    "Catalogue enrichi et parcours simplifié",
    "Accompagnement dédié pour vos projets auto",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-red-500/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-red-600/15 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-14 text-center">
        <div className="mb-6 flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/80 backdrop-blur">
          <Clock3 className="h-4 w-4" />
          <span>Site en construction</span>
        </div>

        <img
          src={logo}
          alt="Lease Auto"
          className="mb-5 h-14 w-auto drop-shadow-xl"
        />

        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Lease Auto prépare une nouvelle expérience premium
        </h1>
        <p className="mb-10 max-w-3xl text-lg text-white/70 md:text-xl">
          Nous finalisons une plateforme plus claire, plus rapide et pensée pour
          vous guider dans vos projets de leasing. Merci pour votre patience :
          nous revenons très vite avec des offres optimisées et un suivi encore
          plus personnalisé.
        </p>

        <div className="mb-8 grid w-full max-w-4xl gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-white/80 shadow-inner shadow-black/10 backdrop-blur"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              <Sparkles className="h-4 w-4" />
              Ce qui arrive
            </div>
            <p className="text-base text-white/80">
              Parcours simplifié, offres mieux structurées, et assistance
              proactive dès vos premières questions.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/15 via-white/10 to-white/5 p-6 text-left shadow-lg shadow-red-500/15 backdrop-blur">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
              <ShieldCheck className="h-4 w-4" />
              Restons en contact
            </div>
            <p className="mb-4 text-base text-white/80">
              Besoin d’une info ou d’un devis pendant la mise à jour ? Notre
              équipe reste disponible.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:leaseauto.epinay@gmail.com"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-red-500/20 transition hover:-translate-y-0.5 hover:shadow-red-500/30"
              >
                <Mail className="h-4 w-4" />
                leaseauto.epinay@gmail.com 
              </a>
              <a
                href="tel:+33184218393"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40"
              >
                <Phone className="h-4 w-4" />
                01 84 21 83 93
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComingSoon;
