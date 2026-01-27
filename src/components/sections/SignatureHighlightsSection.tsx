import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Review = { author: string; timing: string; body: string };

const REVIEWS: Review[] = [
  { author: "léa clément", timing: "il y a 3 mois", body: "Je tiens à remercier sincèrement Youssouph et Belha pour leur écoute, leurs conseils et leur soutien. Grâce à eux, j’ai pu faire les bons choix pour mon avenir. Leur bienveillance et leur professionnalisme m’ont beaucoup aidée à y voir plus clair. Merci encore pour tout !" },
  { author: "yass Chafik", timing: "il y a 4 mois", body: "Service impeccable ! Belha et Youssouph sont très professionnels, accueillants et arrangeants. La voiture était en parfait état et tout s’est déroulé sans aucun souci. Je recommande cette agence les yeux fermés." },
  { author: "darren du17", timing: "il y a 4 mois", body: "Service impeccable ! Belha et Youssouph sont très professionnels, accueillants et arrangeants. La voiture était en parfait état et tout s’est déroulé sans aucun souci. Je recommande cette agence les yeux fermés." },
  { author: "aissata carneva", timing: "il y a 3 mois", body: "Très satisfait de la prise en charge et du véhicule. Très attentif à la demande du client et répond très rapidement aux questions. Un grand merci et je vous recommande 100%." },
  { author: "mujtaba syed", timing: "il y a un mois", body: "Changement de pneus en moins de 15 minutes, prix très attractif et personnel agréable. Je recommande !" },
  { author: "christ mendome", timing: "il y a un an", body: "Personnel très professionnel et accueillant. Réponse rapide à l’achat de mon véhicule, service efficace et excellent rapport qualité-prix. Je recommande vivement ce garage à tous ceux qui cherchent un service fiable et de qualité." },
  { author: "Lucienne Fernandes", timing: "il y a un an", body: "Accueil et professionnalisme exemplaires lors de l'achat de mon véhicule. Équipe à l'écoute, réponses claires et bienveillantes. Très satisfaite de mon achat, je recommanderai votre garage à mes proches." },
  { author: "selma latrach", timing: "il y a 11 mois", body: "Très belle expérience : équipe honnête et passionnée, explications précises sans pousser à la vente. Personnel soigné et compétent. Je recommande ce garage à 100%." },
  { author: "sopre black", timing: "il y a 9 mois", body: "Je recommande vivement pour l'achat de voiture professionnelle ou utilitaire. Très professionnels et vraiment à l’écoute ! Super équipe. Si vous cherchez une voiture, je vous recommande Lease Auto." },
  { author: "raphael bourdet", timing: "il y a 8 mois", body: "Belha a pris en charge ma recherche personnalisée et a trouvé une A3 3.2 V6 pépite. Accueil exceptionnel le jour de la réception. Je recommande à 200% !" },
  { author: "seifdine daris", timing: "il y a 11 mois", body: "Deux véhicules achetés chez eux et toujours autant satisfait. Véhicules quasi neufs, parfois encore sous garantie. Belha s’adapte aux demandes et prend son temps : excellent commercial, je recommande à 100%." },
  { author: "mbaye baguette-andrea", timing: "il y a 8 mois", body: "AU TOP ! Déjà deux véhicules achetés depuis 2022 et tout se passe toujours parfaitement. Professionnalisme hors pair et réponses rapides à nos attentes. Allez-y les yeux fermés !!" },
  { author: "alexi.k", timing: "il y a 8 mois", body: "Je recherchais une Lamborghini Revuelto pour ma collection. Ils me l’ont trouvée dans un délai incroyable et dans un état irréprochable. Rien à gérer. Des gens de confiance, foncez !" },
  { author: "Oumaima SMAIL", timing: "il y a un an", body: "Achat récent d’un véhicule : équipe professionnelle et très accueillante, conseils et suivi irréprochables. Ils ont parfaitement répondu à mes attentes. Je recommande vivement Lease Auto." },
  { author: "Auré G", timing: "il y a 6 mois", body: "Achat de mon Q2 aujourd’hui. Merci pour le professionnalisme. Je recommande vivement." },
  { author: "Kamel moun", timing: "il y a 7 mois", body: "Très bon accueil, excellent garage. Bon plan véhicule." },
];

const REVIEWS_URL =
  "https://www.google.com/search?sa=X&sca_esv=6a0b219675808712&sxsrf=ANbL-n6zw8TriEPW1S9ObJM7ZajW-hcIgA:1769505889594&q=Lease+Auto+Avis&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxIxNDY0MLAwNzczsrSwNLYwMzSzNNzAyPiKkd8nNbE4VcGxtCRfwbEss3gRK7oIAH42MQs_AAAA&rldimm=13100877629893861691&tbm=lcl&hl=fr-FR&ved=2ahUKEwixquiPs6uSAxVLfaQEHTySBl4Q9fQKegQIPxAG&biw=1470&bih=801&dpr=2&aic=0#lkt=LocalPoiReviews";

const toTitleCase = (s: string) =>
  s
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "LA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const gradientMask: CSSProperties = {
  maskImage: "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)",
  WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%)",
};

export function SignatureHighlightsSection() {
  const looped = useMemo(() => [...REVIEWS, ...REVIEWS], []);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="relative bg-white text-slate-900 overflow-hidden">
      <style>
        {`
          @keyframes review-marquee-x {
            0% { transform: translate3d(0,0,0); }
            100% { transform: translate3d(-50%,0,0); }
          }

          @media (prefers-reduced-motion: reduce) {
            .marquee-track { animation: none !important; transform: none !important; }
          }

          /* clamp texte (si tu n’as pas le plugin line-clamp) */
          .clamp-4 {
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}
      </style>

      <div className="relative w-full px-4 md:px-10 lg:px-16 py-16 md:py-20">
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-[#E60000]">
              <span className="h-2 w-2 rounded-full bg-[#E60000]" />
              avis clients
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
              Ils nous font confiance.
            </h2>
            <p className="mt-3 max-w-2xl text-sm md:text-base text-slate-600">
              Une sélection d’avis authentiques : transparence, accueil, délais, accompagnement personnalisé.
              Faites défiler pour voir comment nous travaillons au quotidien.
            </p>
          </div>

          <div className="md:text-right text-sm text-slate-500">
            <p className="font-semibold text-slate-900">4,9/5</p>
            <p className="text-slate-500">moyenne Google sur l’année</p>
            <a
              href={REVIEWS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#E60000] hover:underline"
            >
              Voir tous les avis Google <span aria-hidden>↗</span>
            </a>
          </div>
        </div>

        {/* marquee container */}
        <div className="relative mt-10 md:mt-12 rounded-3xl bg-gradient-to-r from-white via-white to-slate-50 shadow-[0_25px_60px_rgba(17,24,39,0.12)] overflow-hidden">
          <div className="pointer-events-none absolute inset-0" style={gradientMask} />
          {/* halos */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 top-10 h-52 w-52 rounded-full bg-[#e60000]/10 blur-[120px]" />
            <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-[#2563eb]/10 blur-[130px]" />
          </div>

          <div
            className="marquee relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={() => setIsPaused(false)}
          >
            {/* padding pour éviter la carte coupée */}
            <div
              className="marquee-track flex w-[200%] gap-4 md:gap-6 py-10 pl-6 pr-6 md:pl-10 md:pr-10"
              style={{
                animation: "review-marquee-x 28s linear infinite",
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {looped.map((review, idx) => {
                const name = toTitleCase(review.author);
                const initials = getInitials(name);

                return (
                <a
                  key={`${review.author}-${idx}`}
                  href={REVIEWS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative min-w-[280px] md:min-w-[340px] max-w-[360px] rounded-2xl bg-white shadow-[0_14px_28px_rgba(2,6,23,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(230,0,0,0.14)]"
                >
                    {/* barre rouge */}
                    <span className="absolute left-0 top-6 h-12 w-[3px] rounded-full bg-[#E60000] transition-all duration-300 group-hover:h-16" />

                    <div className="flex h-full flex-col px-6 py-7">
                      {/* header fixe */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#E60000]/10 text-[#E60000] font-semibold">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold uppercase tracking-[0.08em] text-slate-900">
                              {name}
                            </p>
                            <p className="text-xs text-slate-500">{review.timing}</p>
                          </div>
                        </div>

                        <span className="flex-shrink-0 rounded-full bg-[#E60000]/10 px-2 py-1 text-[11px] font-semibold text-[#E60000]">
                          ★ 4,9
                        </span>
                      </div>

                      {/* body homogène */}
                      <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-700 clamp-4">
                        {review.body}
                      </p>

                      {/* footer fixe */}
                      <div className="mt-auto pt-5">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                          Avis Google <span className="text-[#E60000]">↗</span>
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default SignatureHighlightsSection;
