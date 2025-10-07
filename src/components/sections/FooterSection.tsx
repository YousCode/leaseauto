import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    "Accueil",
    "Véhicules", 
    "Services",
    "À propos",
    "Contact"
  ];

  const legalLinks = [
    "Mentions légales",
    "Politique de confidentialité",
    "Conditions générales",
    "Cookies",
    "Plan du site"
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-red-500 mb-4">LeaseAuto</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Votre partenaire de confiance pour la location de véhicules. 
              Des solutions flexibles adaptées à tous vos besoins.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-gray-300">Lease auto 42 Bd Foch, 93800 Épinay-sur-Seine</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-gray-300">01 84 21 83 93</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-gray-300">leaseauto.epinay@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-gray-300">Lundi - Samedi</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Navigation</h4>
            <ul className="space-y-3">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-red-500 transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Nous contacter</h4>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nom"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 text-white"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 text-white"
              />
              <textarea
                placeholder="Message"
                rows={3}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-red-500 text-white resize-none"
              ></textarea>
              <button className="w-full bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
                Envoyer
              </button>
            </form>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Suivez-nous</h4>
            <div className="flex space-x-3 mb-6">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>

            {/* Legal Links */}
            <div>
              <h5 className="text-sm font-semibold mb-3 text-gray-400">Informations légales</h5>
              <ul className="space-y-2">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-red-500 text-sm transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="text-center text-gray-400 text-sm">
            © {currentYear} LeaseAuto. Tous droits réservés. | SIRET: 123 456 789 00012 | RCS Paris
          </div>
        </div>
      </div>
    </footer>
  );
};

export { FooterSection };
export default FooterSection;