import { CheckCircle2, Search, FileText, Car } from "lucide-react";

export default function ProcessSection() {
  const steps = [
    {
      icon: Search,
      title: "1. Recherche",
      description: "Parcourez notre sélection de véhicules premium et trouvez celui qui correspond à vos besoins",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: FileText,
      title: "2. Simulation",
      description: "Obtenez une simulation de financement personnalisée en quelques clics",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: CheckCircle2,
      title: "3. Validation",
      description: "Nous validons votre dossier et préparons tous les documents nécessaires",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: Car,
      title: "4. Livraison",
      description: "Recevez votre véhicule directement chez vous, prêt à rouler",
      color: "bg-orange-50 text-orange-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Un processus simple et transparent pour vous accompagner à chaque étape
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                  <div className={`w-16 h-16 rounded-xl ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <a
            href="/vehicules"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Commencer maintenant
            <CheckCircle2 className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
