export default function LegalNoticesPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Mentions Légales</h1>
          
          <div className="space-y-8">
            
            {/* Informations légales */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Informations légales</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p><strong>Raison sociale :</strong> Lease Auto SAS</p>
                <p><strong>Siège social :</strong> 123 Avenue des Champs-Élysées, 75008 Paris, France</p>
                <p><strong>SIRET :</strong> 123 456 789 00012</p>
                <p><strong>RCS :</strong> Paris B 123 456 789</p>
                <p><strong>Capital social :</strong> 100 000 €</p>
                <p><strong>TVA Intracommunautaire :</strong> FR12345678901</p>
                <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
                <p><strong>Email :</strong> contact@leaseauto.fr</p>
              </div>
            </section>

            {/* Directeur de publication */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Directeur de publication</h2>
              <p>Le directeur de la publication est Monsieur Jean Dupont, Président de Lease Auto SAS.</p>
            </section>

            {/* Hébergement */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hébergement</h2>
              <p>Ce site est hébergé par :</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2">
                <p><strong>OVH SAS</strong></p>
                <p>2 rue Kellermann - 59100 Roubaix - France</p>
                <p>Téléphone : +33 8 99 70 17 61</p>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
              <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
              <p>La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.</p>
            </section>

            {/* Responsabilité */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsabilité</h2>
              <p>Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.</p>
              <p>Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir le signaler par email à l'adresse contact@leaseauto.fr, en décrivant le problème de la manière la plus précise possible.</p>
            </section>

            {/* Liens hypertextes */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Liens hypertextes</h2>
              <p>Les liens hypertextes mis en place dans le cadre du présent site web en direction d'autres ressources présentes sur le réseau Internet ne sauraient engager la responsabilité de Lease Auto SAS.</p>
            </section>

            {/* Données personnelles */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Données personnelles</h2>
              <p>Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.</p>
              <p>Pour exercer ce droit, contactez-nous à l'adresse : contact@leaseauto.fr</p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
              <p>Ce site utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visites. En continuant votre navigation, vous acceptez l'utilisation de ces cookies.</p>
              <p>Vous pouvez à tout moment modifier vos préférences en matière de cookies dans les paramètres de votre navigateur.</p>
            </section>

            {/* Droit applicable */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Droit applicable</h2>
              <p>Tout litige en relation avec l'utilisation du site www.leaseauto.fr est soumis au droit français. Il est fait attribution exclusive de juridiction aux tribunaux compétents de Paris.</p>
            </section>

            {/* Contact */}
            <section className="bg-red-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Contact</h2>
              <p>Pour toute question concernant ces mentions légales, vous pouvez nous contacter :</p>
              <ul className="mt-2 space-y-1">
                <li><strong>Par email :</strong> contact@leaseauto.fr</li>
                <li><strong>Par téléphone :</strong> +33 1 23 45 67 89</li>
                <li><strong>Par courrier :</strong> Lease Auto SAS, 123 Avenue des Champs-Élysées, 75008 Paris</li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}