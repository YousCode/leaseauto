const PolitiqueConfidentialitePage = () => {
  const contact = "dpo@leaseauto.fr";

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
          <p className="text-xs uppercase tracking-[0.2em] text-[#DA1212]">Données personnelles</p>
          <h1 className="text-3xl font-bold text-slate-900">Politique de confidentialité</h1>
          <p className="text-sm text-slate-600">
            Politique conforme au RGPD (UE) 2016/679 et à la loi Informatique et Libertés modifiée.
          </p>
        </header>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <Section title="Responsable de traitement">
            <p>Lease Auto — contact : {contact}</p>
          </Section>

          <Section title="Données collectées">
            <List
              items={[
                "Identité et contact : nom, prénom, email, téléphone",
                "Données de dossier : informations véhicule, financement, documents transmis",
                "Données techniques : logs de connexion, cookies (voir politique cookies)",
              ]}
            />
          </Section>

          <Section title="Finalités et bases légales">
            <List
              items={[
                "Traitement des demandes et dossiers : exécution de mesures précontractuelles / contrat",
                "Gestion clientèle et SAV : contrat et intérêt légitime",
                "Prospection email/SMS : consentement, retirable à tout moment",
                "Sécurité, prévention fraude : intérêt légitime",
                "Obligations légales (comptabilité, KYC le cas échéant)",
              ]}
            />
          </Section>

          <Section title="Durées de conservation">
            <List
              items={[
                "Prospects : 3 ans après dernier contact",
                "Clients : 5 ans après fin de contrat (factures : 10 ans)",
                "Cookies analytics : 13 mois ; logs de sécurité : 12 mois",
              ]}
            />
          </Section>

          <Section title="Destinataires">
            <List
              items={[
                "Équipe Lease Auto habilitée",
                "Prestataires (hébergement, CRM, emailing, analytics, paiement/financement) sous clauses contractuelles",
                "Partenaires financiers/assureurs pour l’étude de dossier",
                "Autorités compétentes sur réquisition",
              ]}
            />
          </Section>

          <Section title="Transferts hors UE">
            <p>
              Le cas échéant, des clauses contractuelles types et mesures complémentaires sont mises en place. Détails sur
              demande : {contact}.
            </p>
          </Section>

          <Section title="Vos droits">
            <List
              items={[
                "Accès, rectification, effacement, limitation, opposition",
                "Portabilité des données fournies",
                "Retrait du consentement à tout moment",
                "Directives sur le sort des données après décès",
                "Réclamation auprès de la CNIL",
              ]}
            />
            <p>Exercer vos droits : {contact}</p>
          </Section>

          <Section title="Sécurité">
            <p>Accès restreints, HTTPS, sauvegardes, journalisation, revue périodique des droits.</p>
          </Section>

          <Section title="Mise à jour">
            <p>Dernière mise à jour : janvier 2026. Cette politique peut évoluer.</p>
          </Section>
        </div>
      </div>
    </main>
  );
};

export default PolitiqueConfidentialitePage;
