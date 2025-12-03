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
    description: "Une courte liste de modèles fiables, révisés et prêts à rouler.",
  },
  {
    icon: CarFront,
    title: "Budget maîtrisé",
    description: "Mensualités lisibles, assurance et services clairement indiqués.",
  },
  {
    icon: ClipboardList,
    title: "Dossier express",
    description: "Formalités guidées étape par étape avec un conseiller unique.",
  },
];

const SIMPLE_STEPS: SimpleStep[] = [
  { title: "On échange", detail: "Vos usages, votre budget, votre timing." },
  { title: "On propose", detail: "3 véhicules max, déjà disponibles." },
  { title: "On livre", detail: "Signature en ligne et remise rapide." },
];

export function SignatureHighlightsSection() {
  return (
    <section className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
            l&apos;essentiel
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-gray-900 md:text-4xl">
            Simple, beau, efficace.
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Chaque rubrique va droit au but. Pas de jargon, juste ce dont vous avez besoin pour choisir sereinement.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SIMPLE_FEATURES.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-3xl border border-gray-100 bg-[#f9fafc] p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-inner">
                <Icon className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-gray-100 bg-[#f6f7fb] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
                comment ça marche
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-gray-900">
                Trois étapes, un seul contact.
              </h3>
            </div>
            <div className="flex gap-3">
              <Link to="/reservation" className="brand-button">
                Commencer
              </Link>
              <Link to="/contact" className="brand-button-outline text-gray-900">
                Poser une question
              </Link>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {SIMPLE_STEPS.map((step, index) => (
              <div key={step.title}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-gray-900 shadow">
                    {index + 1}
                  </div>
                  <p className="text-base font-semibold text-gray-900">{step.title}</p>
                </div>
                <p className="mt-2 text-sm text-gray-600">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignatureHighlightsSection;
