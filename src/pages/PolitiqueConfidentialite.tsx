import { LegalLayout, LegalList, type LegalSectionItem } from "@/components/legal/LegalLayout";

const PolitiqueConfidentialitePage = () => {
  const contact = "dpo@leaseauto.fr";

  const sections: LegalSectionItem[] = [
    {
      title: "Responsable de traitement",
      content: (
        <>
          <p>Lease Auto — contact : {contact}</p>
        </>
      ),
    },
    {
      title: "Données collectées",
      content: (
        <>
          <LegalList
            items={[
              "Identité et contact : nom, prénom, email, téléphone",
              "Données de dossier : informations véhicule, financement, documents transmis",
              "Données techniques : logs de connexion, cookies (voir politique cookies)",
            ]}
          />
        </>
      ),
    },
    {
      title: "Finalités et bases légales",
      content: (
        <>
          <LegalList
            items={[
              "Traitement des demandes et dossiers : exécution de mesures précontractuelles / contrat",
              "Gestion clientèle et SAV : contrat et intérêt légitime",
              "Prospection email/SMS : consentement, retirable à tout moment",
              "Sécurité, prévention fraude : intérêt légitime",
              "Obligations légales (comptabilité, KYC le cas échéant)",
            ]}
          />
        </>
      ),
    },
    {
      title: "Durées de conservation",
      content: (
        <>
          <LegalList
            items={[
              "Prospects : 3 ans après dernier contact",
              "Clients : 5 ans après fin de contrat (factures : 10 ans)",
              "Cookies analytics : 13 mois ; logs de sécurité : 12 mois",
            ]}
          />
        </>
      ),
    },
    {
      title: "Destinataires",
      content: (
        <>
          <LegalList
            items={[
              "Équipe Lease Auto habilitée",
              "Prestataires (hébergement, CRM, emailing, analytics, paiement/financement) sous clauses contractuelles",
              "Partenaires financiers/assureurs pour l’étude de dossier",
              "Autorités compétentes sur réquisition",
            ]}
          />
        </>
      ),
    },
    {
      title: "Transferts hors UE",
      content: (
        <>
          <p>
            Le cas échéant, des clauses contractuelles types et mesures complémentaires sont mises en place. Détails sur
            demande : {contact}.
          </p>
        </>
      ),
    },
    {
      title: "Vos droits",
      content: (
        <>
          <LegalList
            items={[
              "Accès, rectification, effacement, limitation, opposition",
              "Portabilité des données fournies",
              "Retrait du consentement à tout moment",
              "Directives sur le sort des données après décès",
              "Réclamation auprès de la CNIL",
            ]}
          />
          <p>Exercer vos droits : {contact}</p>
        </>
      ),
    },
    {
      title: "Sécurité",
      content: (
        <>
          <p>Accès restreints, HTTPS, sauvegardes, journalisation, revue périodique des droits.</p>
        </>
      ),
    },
    {
      title: "Mise à jour",
      content: (
        <>
          <p>Dernière mise à jour : janvier 2026. Cette politique peut évoluer.</p>
        </>
      ),
    },
  ];

  return (
    <LegalLayout
      eyebrow="Données personnelles"
      title="Politique de confidentialité"
      subtitle={
        <>
          Politique conforme au RGPD (UE) 2016/679 et à la loi Informatique et Libertés modifiée.
        </>
      }
      sections={sections}
    />
  );
};

export default PolitiqueConfidentialitePage;
