import { Car, Users, Headphones, Shield, Zap, Award } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: Car,
      title: "Leasing Longue Durée",
      description: "Solutions de leasing flexibles de 12 à 60 mois avec maintenance incluse",
      image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
      features: ["Maintenance incluse", "Assurance comprise", "Véhicule de remplacement"]
    },
    {
      icon: Users,
      title: "Leasing Professionnel", 
      description: "Offres dédiées aux entreprises et professionnels avec avantages fiscaux",
      image: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
      features: ["Avantages fiscaux", "Gestion de flotte", "Facturation simplifiée"]
    },
    {
      icon: Zap,
      title: "Véhicules Électriques",
      description: "Large gamme de véhicules électriques et hybrides pour une mobilité durable",
      image: "https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
      features: ["Bonus écologique", "Bornes de recharge", "Autonomie optimisée"]
    },
    {
      icon: Award,
      title: "Véhicules Premium",
      description: "Collection exclusive de véhicules haut de gamme des plus grandes marques",
      image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
      features: ["Marques premium", "Équipements haut de gamme", "Service VIP"]
    },
    {
      icon: Headphones,
      title: "Service Client 24/7",
      description: "Assistance dédiée disponible 24h/24 et 7j/7 pour tous vos besoins",
      image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
      features: ["Support 24/7", "Conseiller dédié", "Assistance dépannage"]
    },
    {
      icon: Shield,
      title: "Assurance Complète",
      description: "Couverture complète avec assurance tous risques et protection juridique",
      image: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
      features: ["Tous risques", "Protection juridique", "Assistance 0 km"]
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-red-600 font-bold text-sm uppercase tracking-wider mb-3">
            NOS SERVICES
          </p>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Une gamme complète de 
            <span className="text-red-600"> services premium</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos solutions de leasing automobile adaptées à tous vos besoins, 
            avec un service d'excellence et des avantages exclusifs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Icon */}
                  <div className="absolute top-4 left-4 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200">
                    En savoir plus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Besoin d'un service personnalisé ?
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Nos experts sont à votre disposition pour créer une solution sur mesure 
              qui répond parfaitement à vos besoins spécifiques
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                DEMANDER UN DEVIS
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-bold text-lg hover:border-red-600 hover:text-red-600 transition-all duration-200">
                NOUS CONTACTER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}