const CookiesPage = () => {
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
          <p className="text-xs uppercase tracking-[0.2em] text-[#DA1212]">Cookies & traceurs</p>
          <h1 className="text-3xl font-bold text-slate-900">Politique Cookies</h1>
          <p className="text-sm text-slate-600">
            Information sur l’usage des cookies et la gestion du consentement conformément au RGPD et à la directive ePrivacy.
          </p>
        </header>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <Section title="Qu’est-ce qu’un cookie ?">
            <p>
              Un cookie est un petit fichier déposé sur votre terminal pour permettre le bon fonctionnement du site, mesurer
              l’audience ou personnaliser le contenu.
            </p>
          </Section>

          <Section title="Cookies que nous utilisons">
            <List
              items={[
                "Techniques/nécessaires : maintien de session, équilibre de charge, préférences de consentement (obligatoires).",
                "Mesure d’audience : analytics anonymisés (durée 13 mois) activés après consentement.",
                "Marketing : pixels publicitaires (désactivés par défaut, soumis à consentement explicite).",
              ]}
            />
          </Section>

          <Section title="Gestion du consentement">
            <List
              items={[
                "Bandeau de consentement à l’arrivée sur le site.",
                "Centre de préférences permettant d’accepter/refuser par finalité.",
                "Retrait du consentement à tout moment via le centre ou les paramètres navigateur.",
              ]}
            />
          </Section>

          <Section title="Durée de vie">
            <p>Cookies techniques : durée de session ou 6 mois pour les préférences. Analytics : 13 mois. Marketing : 13 mois max.</p>
          </Section>

          <Section title="Paramétrage navigateur">
            <p>Vous pouvez supprimer ou bloquer les cookies via les réglages de votre navigateur. Le refus des cookies techniques
              peut dégrader l’expérience.</p>
          </Section>
        </div>
      </div>
    </main>
  );
};

export default CookiesPage;
