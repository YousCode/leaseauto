export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none">
          
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Politique de Confidentialité</h1>
          
          <div className="space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Collecte des données</h2>
              <p>Nous collectons les données personnelles que vous nous fournissez directement lorsque vous :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remplissez un formulaire de contact</li>
                <li>Demandez un devis</li>
                <li>Vous abonnez à notre newsletter</li>
                <li>Créez un compte client</li>
                <li>Signez un contrat de leasing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Types de données collectées</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold mb-2">Données d'identification :</h3>
                <p>Nom, prénom, adresse, téléphone, email, date de naissance</p>
                
                <h3 className="font-bold mb-2 mt-4">Données professionnelles :</h3>
                <p>Entreprise, fonction, secteur d'activité</p>
                
                <h3 className="font-bold mb-2 mt-4">Données financières :</h3>
                <p>Revenus, situation financière (pour l'étude de dossier)</p>
                
                <h3 className="font-bold mb-2 mt-4">Données de navigation :</h3>
                <p>Adresse IP, cookies, pages visitées, durée de visite</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Finalités du traitement</h2>
              <p>Vos données personnelles sont utilisées pour :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Traiter vos demandes de devis et contrats</li>
                <li>Gérer la relation client</li>
                <li>Vous envoyer des informations commerciales (avec votre consentement)</li>
                <li>Améliorer nos services</li>
                <li>Respecter nos obligations légales</li>
                <li>Réaliser des statistiques anonymes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base légale</h2>
              <p>Le traitement de vos données repose sur :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>L'exécution du contrat</strong> pour la gestion des services de leasing</li>
                <li><strong>Votre consentement</strong> pour l'envoi de communications marketing</li>
                <li><strong>L'intérêt légitime</strong> pour l'amélioration de nos services</li>
                <li><strong>L'obligation légale</strong> pour certaines données comptables et fiscales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Destinataires des données</h2>
              <p>Vos données peuvent être partagées avec :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nos partenaires financiers (pour l'étude de financement)</li>
                <li>Nos prestataires techniques (hébergement, maintenance)</li>
                <li>Les autorités compétentes (en cas d'obligation légale)</li>
                <li>Nos assureurs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Durée de conservation</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <ul className="space-y-2">
                  <li><strong>Données clients actifs :</strong> Durée du contrat + 5 ans</li>
                  <li><strong>Données prospects :</strong> 3 ans après le dernier contact</li>
                  <li><strong>Données comptables :</strong> 10 ans (obligation légale)</li>
                  <li><strong>Cookies :</strong> 13 mois maximum</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Vos droits</h2>
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-red-600">Droit d'accès</h3>
                  <p className="text-sm">Connaître les données que nous détenons sur vous</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-red-600">Droit de rectification</h3>
                  <p className="text-sm">Corriger vos données inexactes</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-red-600">Droit d'effacement</h3>
                  <p className="text-sm">Supprimer vos données sous conditions</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-red-600">Droit d'opposition</h3>
                  <p className="text-sm">Vous opposer au traitement de vos données</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-red-600">Droit à la portabilité</h3>
                  <p className="text-sm">Récupérer vos données dans un format lisible</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-bold text-red-600">Droit de limitation</h3>
                  <p className="text-sm">Limiter le traitement de vos données</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Sécurité des données</h2>
              <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Chiffrement des données sensibles</li>
                <li>Accès restreint aux données personnelles</li>
                <li>Sauvegardes régulières et sécurisées</li>
                <li>Formation du personnel à la protection des données</li>
                <li>Audits de sécurité réguliers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies</h2>
              <p>Notre site utilise différents types de cookies :</p>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-bold">Cookies essentiels</h3>
                  <p className="text-sm">Nécessaires au fonctionnement du site (pas de consentement requis)</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-bold">Cookies analytiques</h3>
                  <p className="text-sm">Pour mesurer l'audience et améliorer le site</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-bold">Cookies marketing</h3>
                  <p className="text-sm">Pour personnaliser la publicité</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact et réclamations</h2>
              <div className="bg-red-50 p-6 rounded-lg">
                <p className="mb-4">Pour exercer vos droits ou pour toute question :</p>
                <div className="space-y-2">
                  <p><strong>Email :</strong> dpo@leaseauto.fr</p>
                  <p><strong>Courrier :</strong> DPO - Lease Auto SAS, 123 Avenue des Champs-Élysées, 75008 Paris</p>
                  <p><strong>Délégué à la Protection des Données :</strong> Marie Martin</p>
                </div>
                <p className="mt-4 text-sm">
                  <strong>Réclamation CNIL :</strong> Si vous estimez que vos droits ne sont pas respectés, 
                  vous pouvez introduire une réclamation auprès de la CNIL (www.cnil.fr).
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modifications</h2>
              <p>Cette politique de confidentialité peut être modifiée. La version en vigueur est celle publiée sur notre site web.</p>
              <p className="text-sm text-gray-600 mt-2">Dernière mise à jour : Janvier 2024</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}