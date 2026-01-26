import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { CarFront, ClipboardList, Sparkles } from "lucide-react";

type SimpleFeature = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

type SimpleStep = {
  title: string;
  detail: string;
};

const SIMPLE_FEATURES: SimpleFeature[] = [
  {
    icon: Sparkles,
    title: "Sélection soignée",
    description:
      "Un choix resserré de modèles récents, fiables et entretenus, prêts à prendre la route.",
  },
  {
    icon: CarFront,
    title: "Budget maîtrisé",
    description:
      "Un loyer clair, assurance et services inclus présentés ligne par ligne, sans surprise.",
  },
  {
    icon: ClipboardList,
    title: "Dossier express",
    description:
      "Un conseiller unique vous guide pour rassembler les pièces et finaliser votre dossier.",
  },
];

const SIMPLE_STEPS: SimpleStep[] = [
  { title: "On échange", detail: "Vous nous partagez vos usages, votre budget et vos délais." },
  { title: "On propose", detail: "Nous sélectionnons jusqu’à 3 offres adaptées, déjà disponibles." },
  { title: "On livre", detail: "Vous signez en ligne, nous organisons la mise à disposition du véhicule." },
];

export function SignatureHighlightsSection() {
  return (
    <section className="border-t border-slate-100 bg-white cv-auto">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-16 md:py-20">
        {/* En-tête */}
        <div className="text-center">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-slate-400">
            l&apos;essentiel
          </p>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-slate-900">
            Simple, beau, efficace.
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-slate-600">
            En quelques blocs, tout ce qu’il faut pour comprendre comment Lease Auto vous accompagne
            du premier échange à la remise des clés.
          </p>
        </div>

        {/* 3 atouts principaux */}
        <div className="mt-10 md:mt-12 grid gap-5 md:gap-6 md:grid-cols-3">
          {SIMPLE_FEATURES.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-3xl border border-slate-100 bg-slate-50/80 p-6 md:p-7 shadow-[0_16px_45px_rgba(15,23,42,0.04)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-inner">
                <Icon className="h-5 w-5 text-slate-800" />
              </div>
              <h3 className="mt-5 text-lg md:text-xl font-semibold text-slate-900">
                {title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {description}
              </p>
            </article>
          ))}
        </div>

        {/* Process en 3 étapes */}
        <div className="mt-12 md:mt-16 rounded-3xl border border-slate-100 bg-slate-50/90 px-5 py-6 md:px-7 md:py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                comment ça marche
              </p>
              <h3 className="mt-2 text-xl md:text-2xl font-semibold text-slate-900">
                Trois étapes, un seul interlocuteur.
              </h3>
              <p className="mt-1 text-xs md:text-sm text-slate-600 max-w-md">
                Un parcours pensé pour aller vite, tout en gardant une vision claire sur votre budget.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/reservation"
                className="inline-flex items-center justify-center rounded-full bg-brand-red px-6 md:px-8 py-2.5 text-sm font-medium text-white shadow-[0_18px_45px_rgba(220,38,38,0.35)] hover:bg-brand-red/90 transition-colors"
              >
                Commencer
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 md:px-8 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
              >
                Poser une question
              </Link>
            </div>
          </div>

          <div className="mt-7 md:mt-8 grid gap-5 md:grid-cols-3">
            {SIMPLE_STEPS.map((step, index) => (
              <div key={step.title} className="flex items-start gap-3">
                <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-white text-xs md:text-sm font-semibold text-slate-900 shadow-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm md:text-base font-semibold text-slate-900">
                    {step.title}
                  </p>
                  <p className="mt-1 text-xs md:text-sm text-slate-600 leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignatureHighlightsSection;
