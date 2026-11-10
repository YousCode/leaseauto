import { useRef } from "react";
import { Search, FileText, CheckCircle2, Car } from "lucide-react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { stagger } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    icon: Search,
    title: "Sélection",
    description: "Choisissez un véhicule dans notre parc ou décrivez celui que vous cherchez : on le trouve pour vous.",
  },
  {
    icon: FileText,
    title: "Simulation",
    description: "Estimation claire en 2 minutes : LOA ou crédit, durée, apport et mensualité adaptés à votre profil.",
  },
  {
    icon: CheckCircle2,
    title: "Validation",
    description: "Vous déposez vos documents en ligne, nos conseillers montent le dossier et obtiennent l’accord sous 24–48h.",
  },
  {
    icon: Car,
    title: "Livraison",
    description: "Retrait à Épinay-sur-Seine ou livraison à domicile, véhicule préparé et clés en main.",
  },
];

export default function ProcessSection() {
  const root = useRef<HTMLElement>(null);

  // Le fil rouge se trace avec le scroll (desktop + animations acceptées) ; sinon il reste plein.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
        gsap.fromTo(
          "[data-process-line]",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-process-track]", start: "top 85%", end: "top 30%", scrub: 0.6 },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section rounded-t-[36px] bg-white md:rounded-t-[48px]">
      <div className="container-x">
        <SectionHeading
          eyebrow="Comment ça marche"
          title="Votre parcours en 4 étapes"
          subtitle="Louer ou acheter : on s’occupe de tout, du premier échange à la remise des clés."
        />

        <div data-process-track>
          <div aria-hidden className="mb-8 hidden h-px bg-slate-200 lg:block">
            <div data-process-line className="h-px origin-left bg-brand-primary" />
          </div>

          <ol className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal as="li" key={step.title} delay={stagger(index)}>
                  <div className="surface flex h-full flex-col border-transparent bg-paper p-7 md:p-8">
                    <div className="flex items-start justify-between">
                      <span aria-hidden className="display-xl num text-[4.5rem] text-night md:text-[5.5rem]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-brand-primary">
                        <Icon aria-hidden className="h-5 w-5" />
                      </span>
                    </div>
                    <h3 className="mt-6 font-display text-xl font-semibold text-night lg:mt-10">
                      <span className="sr-only">Étape {index + 1} : </span>
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 md:text-[15px]">{step.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
