import { LegalLayout, LegalList, type LegalSectionItem } from "@/components/legal/LegalLayout";

const CookiesPage = () => {
  const sections: LegalSectionItem[] = [
    {
      title: "Qu’est-ce qu’un cookie ?",
      content: (
        <>
          <p>
            Un cookie est un petit fichier déposé sur votre terminal pour permettre le bon fonctionnement du site, mesurer
            l’audience ou personnaliser le contenu.
          </p>
        </>
      ),
    },
    {
      title: "Cookies que nous utilisons",
      content: (
        <>
          <LegalList
            items={[
              "Techniques/nécessaires : maintien de session, équilibre de charge, préférences de consentement (obligatoires).",
              "Mesure d’audience : analytics anonymisés (durée 13 mois) activés après consentement.",
              "Marketing : pixels publicitaires (désactivés par défaut, soumis à consentement explicite).",
            ]}
          />
        </>
      ),
    },
    {
      title: "Gestion du consentement",
      content: (
        <>
          <LegalList
            items={[
              "Bandeau de consentement à l’arrivée sur le site.",
              "Centre de préférences permettant d’accepter/refuser par finalité.",
              "Retrait du consentement à tout moment via le centre ou les paramètres navigateur.",
            ]}
          />
        </>
      ),
    },
    {
      title: "Durée de vie",
      content: (
        <>
          <p>Cookies techniques : durée de session ou 6 mois pour les préférences. Analytics : 13 mois. Marketing : 13 mois max.</p>
        </>
      ),
    },
    {
      title: "Paramétrage navigateur",
      content: (
        <>
          <p>Vous pouvez supprimer ou bloquer les cookies via les réglages de votre navigateur. Le refus des cookies techniques
            peut dégrader l’expérience.</p>
        </>
      ),
    },
  ];

  return (
    <LegalLayout
      eyebrow="Cookies & traceurs"
      title="Politique Cookies"
      subtitle={
        <>
          Information sur l’usage des cookies et la gestion du consentement conformément au RGPD et à la directive ePrivacy.
        </>
      }
      sections={sections}
    />
  );
};

export default CookiesPage;
