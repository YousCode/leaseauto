const MentionsLegalesPage = () => {
  const societe = "Lease Auto";
  const forme = "SARL";
  const capital = "10 000 €";
  const siren = "XXX XXX XXX";
  const rcs = "Bobigny";
  const adresse = "42 Bd Foch, 93800 Épinay-sur-Seine";
  const tel = "01 84 21 83 93";
  const email = "contact@leaseauto.fr";
  const directeur = "Nom Prénom, Gérant";
  const hebergeur = "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA";

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="text-sm leading-relaxed text-slate-700 space-y-1">{children}</div>
    </section>
  );

  return (
    <main className="bg-[#f7f9fb] min-h-screen pt-16 pb-20">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-[#DA1212]">Informations légales</p>
          <h1 className="text-3xl font-bold text-slate-900">Mentions légales</h1>
          <p className="text-sm text-slate-600">
            Conformément aux articles 6-III et 19 de la loi n°2004-575 du 21 juin 2004 pour la confiance dans
            l’économie numérique (LCEN).
          </p>
        </header>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <Section title="Éditeur du site">
            <p>{societe} ({forme}) au capital de {capital}</p>
            <p>RCS {rcs} {siren}</p>
            <p>Siège : {adresse}</p>
            <p>Tél : {tel} — Email : {email}</p>
          </Section>

          <Section title="Direction de la publication">
            <p>{directeur}</p>
          </Section>

          <Section title="Hébergement">
            <p>{hebergeur}</p>
          </Section>

          <Section title="Propriété intellectuelle">
            <p>
              L’ensemble du site (textes, visuels, logos, code) est protégé par le droit d’auteur.
              Toute reproduction ou diffusion nécessite l’autorisation écrite préalable de l’éditeur.
            </p>
          </Section>

          <Section title="Responsabilité">
            <p>
              Les informations fournies le sont à titre indicatif et peuvent évoluer. L’éditeur ne peut être tenu
              responsable d’erreurs ou d’indisponibilités temporaires du service.
            </p>
          </Section>

          <Section title="Contact signalement">
            <p>Pour tout signalement de contenu illicite : {email}</p>
          </Section>
        </div>
      </div>
    </main>
  );
};

export default MentionsLegalesPage;
