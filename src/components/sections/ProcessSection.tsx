import { motion } from "framer-motion";
import { DURATION, EASE, DISTANCE } from "@/lib/motion";
import { Search, FileText, CheckCircle2, Car } from "lucide-react";

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
  return (
    <section className="relative bg-white py-20 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: DISTANCE }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: DURATION, ease: EASE}}
          className="mb-12 text-center"
        >
          <p className="text-[11px] tracking-[0.28em] uppercase text-slate-400 font-medium">Comment ça marche</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-heading font-semibold text-brand-navy">
            Votre parcours en 4 étapes
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-slate-500">
            Louer ou acheter : on s’occupe de tout, du premier échange à la remise des clés.
          </p>
        </motion.div>

        <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: DISTANCE }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: DURATION, ease: EASE, delay: index * 0.08 }}
                className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-slate-400">
                    ÉTAPE {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
