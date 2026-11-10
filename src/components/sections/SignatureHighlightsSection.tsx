import { useEffect, useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Review = { author: string; timing: string; body: string };

const REVIEWS: Review[] = [
  { author: "léa clément", timing: "il y a 3 mois", body: "Je tiens à remercier sincèrement Youssouph et Belha pour leur écoute, leurs conseils et leur soutien. Grâce à eux, j’ai pu faire les bons choix pour mon avenir. Leur bienveillance et leur professionnalisme m’ont beaucoup aidée à y voir plus clair. Merci encore pour tout !" },
  { author: "yass Chafik", timing: "il y a 4 mois", body: "Service impeccable ! Belha et Youssouph sont très professionnels, accueillants et arrangeants. La voiture était en parfait état et tout s’est déroulé sans aucun souci. Je recommande cette agence les yeux fermés." },
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

const HALF = Math.ceil(REVIEWS.length / 2);
const ROWS = [REVIEWS.slice(0, HALF), REVIEWS.slice(HALF)];

/** Le bandeau défilant n'existe que sur écran large et si les animations sont acceptées. */
const MARQUEE_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

function useMarqueeEnabled() {
  const [enabled, setEnabled] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MARQUEE_QUERY).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(MARQUEE_QUERY);
    const onChange = () => setEnabled(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return enabled;
}

function ReviewCard({ review, className = "" }: { review: Review; className?: string }) {
  const name = toTitleCase(review.author);
  return (
    <figure className={`surface flex h-[248px] shrink-0 flex-col p-6 ${className}`}>
      <figcaption className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-night font-display text-sm font-semibold text-white"
          >
            {getInitials(name)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-night">{name}</p>
            <p className="text-xs text-slate-500">{review.timing}</p>
          </div>
        </div>
        <span className="chip num shrink-0">
          <Star aria-hidden className="h-3.5 w-3.5 fill-brand-primary text-brand-primary" />
          4,9
        </span>
      </figcaption>
      <blockquote className="mt-5 line-clamp-4 text-sm leading-relaxed text-slate-600 md:text-[15px]">
        {review.body}
      </blockquote>
      <p className="mt-auto pt-4 text-xs font-medium text-slate-400">Avis Google</p>
    </figure>
  );
}

export function SignatureHighlightsSection() {
  const marquee = useMarqueeEnabled();

  return (
    <section className="section overflow-hidden bg-paper text-night">
      <div className="container-x">
        <SectionHeading
          eyebrow="Avis clients"
          title="Ils nous font confiance."
          subtitle="Une sélection d’avis authentiques : transparence, accueil, délais, accompagnement personnalisé. Faites défiler pour voir comment nous travaillons au quotidien."
          action={
            <div className="flex flex-col items-start gap-4 md:items-end">
              <p className="flex items-baseline gap-2">
                <span className="num font-display text-3xl font-bold text-night">4,9/5</span>
                <span className="text-sm text-slate-600">moyenne Google sur l’année</span>
              </p>
              <a href={REVIEWS_URL} target="_blank" rel="noreferrer" className="btn btn-ghost">
                Voir tous les avis Google
                <ArrowUpRight />
              </a>
            </div>
          }
        />
      </div>

      {marquee ? (
        <Reveal className="space-y-4">
          {ROWS.map((row, i) => (
            <Marquee key={i} duration={i === 0 ? 70 : 62} reverse={i === 1} pauseOnHover className="mask-fade-x">
              {row.map((review) => (
                <ReviewCard key={review.author} review={review} className="mr-4 w-[380px]" />
              ))}
            </Marquee>
          ))}
        </Reveal>
      ) : (
        <ul
          tabIndex={0}
          aria-label="Avis clients"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 max-md:no-scrollbar md:px-8"
        >
          {REVIEWS.map((review) => (
            <li key={review.author} className="shrink-0 snap-center">
              <ReviewCard review={review} className="w-[82vw] max-w-[360px]" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default SignatureHighlightsSection;
