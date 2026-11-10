import type { ReactNode } from "react";
import { FooterSection } from "@/components/sections/FooterSection";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { getLenis } from "@/lib/lenis";

export type LegalSectionItem = {
  title: string;
  content: ReactNode;
};

type LegalLayoutProps = {
  eyebrow: string;
  title: string;
  subtitle: ReactNode;
  sections: LegalSectionItem[];
};

const sectionId = (index: number) => `section-${index + 1}`;

/** Défile jusqu'à une section, via Lenis quand il est actif (voir docs/DESIGN.md). */
const scrollToSection = (id: string) => {
  const target = document.getElementById(id);
  if (!target) return;
  const lenis = getLenis();
  // Le dégagement sous le header vient de `scroll-mt-*` sur le titre (pris en compte par Lenis et le natif).
  if (lenis) lenis.scrollTo(target);
  else target.scrollIntoView({ block: "start" });
  target.focus({ preventScroll: true });
};

/**
 * Gabarit commun des pages légales : héros nuit (h1), colonne de lecture étroite,
 * une carte par section, sommaire collant sur desktop, pied de page.
 */
export function LegalLayout({ eyebrow, title, subtitle, sections }: LegalLayoutProps) {
  return (
    <div className="bg-paper">
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <main className="container-x py-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,48rem)_16rem] lg:justify-between">
          <div data-legal-content className="max-w-3xl space-y-4">
            {sections.map((section, index) => (
              <Reveal as="section" key={section.title} className="surface p-6 sm:p-8 md:p-10">
                <h2
                  id={sectionId(index)}
                  tabIndex={-1}
                  className="display-md scroll-mt-36 text-night focus:outline-none"
                >
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3 text-base leading-relaxed text-slate-700">{section.content}</div>
              </Reveal>
            ))}
          </div>

          <nav aria-label="Sommaire" className="hidden lg:block">
            <div className="sticky top-28">
              <p className="eyebrow">Sommaire</p>
              <ol className="mt-4 border-l border-slate-300">
                {sections.map((section, index) => (
                  <li key={section.title}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(sectionId(index))}
                      className="-ml-px flex min-h-[44px] w-full items-center border-l border-transparent py-2 pl-4 text-left text-sm leading-snug text-slate-600 transition-colors duration-300 hover:border-night hover:text-night"
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}

/** Liste à puces des pages légales. */
export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-slate-400">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default LegalLayout;
