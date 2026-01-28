const ConditionsGeneralesPage = () => {
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="text-sm leading-relaxed text-slate-700 space-y-1">{children}</div>
    </section>
  );

  const List = ({ items }: { items: string[] }) => (
    <ul className="list-disc list-outside pl-5 space-y-1">
      {items.map((i, idx) => (
        <li key={idx}>{i}</li>
      ))}
    </ul>
  );

  return (
    <main className="bg-[#f7f9fb] min-h-screen pt-16 pb-20">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-[#DA1212]">Conditions d’utilisation</p>
          <h1 className="text-3xl font-bold text-slate-900">Conditions Générales d’Utilisation</h1>
          <p className="text-sm text-slate-600">
            Règles d’usage du site et de l’espace client Lease Auto (consultation, demande d’offre, suivi de dossier).
          </p>
        </header>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <Section title="Objet">
            <p>
              Les présentes CGU définissent les conditions d’accès et d’utilisation du site et des services en ligne
              (demandes, dépôt de documents, suivi de dossiers).
            </p>
          </Section>

          <Section title="Accès au service">
            <List
              items={[
                "Consultation libre des offres ; certaines fonctionnalités nécessitent un compte ou des informations de contact exactes.",
                "L’éditeur se réserve le droit de limiter ou suspendre l’accès en cas d’abus ou de maintenance.",
              ]}
            />
          </Section>

          <Section title="Engagements de l’utilisateur">
            <List
              items={[
                "Fournir des informations exactes et à jour.",
                "Ne pas porter atteinte au service (fraude, intrusion, scraping massif).",
                "Respecter les droits de propriété intellectuelle sur les contenus du site.",
              ]}
            />
          </Section>

          <Section title="Responsabilités">
            <List
              items={[
                "L’éditeur met en œuvre des moyens raisonnables pour assurer disponibilité et exactitude, sans garantie d’erreur zéro.",
                "L’éditeur n’est pas responsable des sites tiers liés depuis le site.",
              ]}
            />
          </Section>

          <Section title="Propriété intellectuelle">
            <p>Les marques, logos, textes et médias sont protégés. Toute reproduction requiert autorisation écrite.</p>
          </Section>

          <Section title="Résiliation">
            <p>Tout compte peut être supprimé sur demande ou en cas de non-respect des CGU.</p>
          </Section>

          <Section title="Droit applicable">
            <p>Le droit français s’applique. Juridiction compétente : tribunaux de Bobigny (à personnaliser si besoin).</p>
          </Section>
        </div>
      </div>
    </main>
  );
};

export default ConditionsGeneralesPage;
