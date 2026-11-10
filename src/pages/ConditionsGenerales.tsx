import { LegalLayout, LegalList, type LegalSectionItem } from "@/components/legal/LegalLayout";

const ConditionsGeneralesPage = () => {
  const sections: LegalSectionItem[] = [
    {
      title: "Objet",
      content: (
        <>
          <p>
            Les présentes CGU définissent les conditions d’accès et d’utilisation du site et des services en ligne
            (demandes, dépôt de documents, suivi de dossiers).
          </p>
        </>
      ),
    },
    {
      title: "Accès au service",
      content: (
        <>
          <LegalList
            items={[
              "Consultation libre des offres ; certaines fonctionnalités nécessitent un compte ou des informations de contact exactes.",
              "L’éditeur se réserve le droit de limiter ou suspendre l’accès en cas d’abus ou de maintenance.",
            ]}
          />
        </>
      ),
    },
    {
      title: "Engagements de l’utilisateur",
      content: (
        <>
          <LegalList
            items={[
              "Fournir des informations exactes et à jour.",
              "Ne pas porter atteinte au service (fraude, intrusion, scraping massif).",
              "Respecter les droits de propriété intellectuelle sur les contenus du site.",
            ]}
          />
        </>
      ),
    },
    {
      title: "Responsabilités",
      content: (
        <>
          <LegalList
            items={[
              "L’éditeur met en œuvre des moyens raisonnables pour assurer disponibilité et exactitude, sans garantie d’erreur zéro.",
              "L’éditeur n’est pas responsable des sites tiers liés depuis le site.",
            ]}
          />
        </>
      ),
    },
    {
      title: "Propriété intellectuelle",
      content: (
        <>
          <p>Les marques, logos, textes et médias sont protégés. Toute reproduction requiert autorisation écrite.</p>
        </>
      ),
    },
    {
      title: "Résiliation",
      content: (
        <>
          <p>Tout compte peut être supprimé sur demande ou en cas de non-respect des CGU.</p>
        </>
      ),
    },
    {
      title: "Droit applicable",
      content: (
        <>
          <p>Le droit français s’applique. Juridiction compétente : tribunaux de Bobigny (à personnaliser si besoin).</p>
        </>
      ),
    },
  ];

  return (
    <LegalLayout
      eyebrow="Conditions d’utilisation"
      title="Conditions Générales d’Utilisation"
      subtitle={
        <>
          Règles d’usage du site et de l’espace client Lease Auto (consultation, demande d’offre, suivi de dossier).
        </>
      }
      sections={sections}
    />
  );
};

export default ConditionsGeneralesPage;
