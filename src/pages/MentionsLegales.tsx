import { LegalLayout, type LegalSectionItem } from "@/components/legal/LegalLayout";

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

  const sections: LegalSectionItem[] = [
    {
      title: "Éditeur du site",
      content: (
        <>
          <p>{societe} ({forme}) au capital de {capital}</p>
          <p>RCS {rcs} {siren}</p>
          <p>Siège : {adresse}</p>
          <p>Tél : {tel} — Email : {email}</p>
        </>
      ),
    },
    {
      title: "Direction de la publication",
      content: (
        <>
          <p>{directeur}</p>
        </>
      ),
    },
    {
      title: "Hébergement",
      content: (
        <>
          <p>{hebergeur}</p>
        </>
      ),
    },
    {
      title: "Propriété intellectuelle",
      content: (
        <>
          <p>
            L’ensemble du site (textes, visuels, logos, code) est protégé par le droit d’auteur.
            Toute reproduction ou diffusion nécessite l’autorisation écrite préalable de l’éditeur.
          </p>
        </>
      ),
    },
    {
      title: "Responsabilité",
      content: (
        <>
          <p>
            Les informations fournies le sont à titre indicatif et peuvent évoluer. L’éditeur ne peut être tenu
            responsable d’erreurs ou d’indisponibilités temporaires du service.
          </p>
        </>
      ),
    },
    {
      title: "Contact signalement",
      content: (
        <>
          <p>Pour tout signalement de contenu illicite : {email}</p>
        </>
      ),
    },
  ];

  return (
    <LegalLayout
      eyebrow="Informations légales"
      title="Mentions légales"
      subtitle={
        <>
          Conformément aux articles 6-III et 19 de la loi n°2004-575 du 21 juin 2004 pour la confiance dans
          l’économie numérique (LCEN).
        </>
      }
      sections={sections}
    />
  );
};

export default MentionsLegalesPage;
