import { Car, MessageCircle, FileText, Key } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current?.children || [], {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
        }
      });

      // Cards staggered animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          }
        });

        // Card entrance
        tl.from(card, {
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotation: -5,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: index * 0.15
        });

        // Image zoom
        tl.from(card.querySelector('.card-image'), {
          scale: 1.3,
          duration: 1.2,
          ease: "power2.out"
        }, "-=0.6");

        // Number badge
        tl.from(card.querySelector('.step-number'), {
          scale: 0,
          rotation: 360,
          duration: 0.6,
          ease: "back.out(2)"
        }, "-=0.8");

        // Icon
        tl.from(card.querySelector('.step-icon'), {
          scale: 0,
          rotation: -180,
          duration: 0.5,
          ease: "back.out(2)"
        }, "-=0.4");

        // Content
        tl.from(card.querySelector('.card-title'), {
          x: -30,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out"
        }, "-=0.3");

        tl.from(card.querySelector('.card-description'), {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out"
        }, "-=0.3");

        // Connector arrow
        const arrow = card.querySelector('.connector-arrow');
        if (arrow) {
          tl.from(arrow, {
            scaleX: 0,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out"
          }, "-=0.2");
        }

        // Hover animations
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -15,
            scale: 1.05,
            duration: 0.4,
            ease: "power2.out"
          });
          gsap.to(card.querySelector('.card-image'), {
            scale: 1.15,
            duration: 0.6,
            ease: "power2.out"
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
          });
          gsap.to(card.querySelector('.card-image'), {
            scale: 1,
            duration: 0.6,
            ease: "power2.out"
          });
        });
      });

      // CTA animation
      gsap.from(ctaRef.current, {
        y: 80,
        opacity: 0,
        scale: 0.9,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 90%",
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      number: "01",
      title: "Choisissez votre véhicule",
      icon: Car,
      image: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
      description: "Explorez notre collection exclusive de véhicules premium et trouvez celui qui correspond parfaitement à vos besoins et à votre style de vie."
    },
    {
      number: "02", 
      title: "Contactez nos experts",
      icon: MessageCircle,
      image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
      description: "Nos conseillers spécialisés vous accompagnent personnellement pour définir l'offre de leasing idéale selon votre budget et vos préférences."
    },
    {
      number: "03",
      title: "Finalisez votre contrat", 
      icon: FileText,
      image: "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
      description: "Signature rapide et sécurisée de votre contrat de leasing avec des conditions transparentes et avantageuses."
    },
    {
      number: "04",
      title: "Récupérez vos clés !",
      icon: Key,
      image: "https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg?auto=compress&cs=tinysrgb&w=800&h=600",
      description: "Prenez possession de votre nouveau véhicule et profitez d'une expérience de conduite exceptionnelle dès le premier jour.",
      highlight: true
    }
  ];

  return (
    <div ref={sectionRef} className="bg-white py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <p className="text-red-600 font-bold text-sm uppercase tracking-wider mb-3">
            COMMENT ÇA MARCHE ?
          </p>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Votre véhicule en 
            <span className="text-red-600"> 4 étapes simples</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un processus optimisé pour vous faire gagner du temps et vous offrir 
            la meilleure expérience de leasing automobile
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div 
              key={index} 
              ref={el => cardsRef.current[index] = el}
              className="relative group"
            >
              {/* Card */}
              <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${step.highlight ? 'ring-2 ring-red-500' : ''}`}>
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="card-image w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Step Number */}
                  <div className={`step-number absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${step.highlight ? 'bg-red-600 text-white' : 'bg-white text-gray-900'} shadow-lg`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`step-icon absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${step.highlight ? 'bg-red-600' : 'bg-white'} shadow-lg`}>
                    <step.icon className={`h-5 w-5 ${step.highlight ? 'text-white' : 'text-gray-700'}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className={`card-title text-xl font-bold mb-3 ${step.highlight ? 'text-red-600' : 'text-gray-900'}`}>
                    {step.title}
                  </h3>
                  <p className="card-description text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Highlight Badge */}
                {step.highlight && (
                  <div className="absolute -top-2 -right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    FINAL
                  </div>
                )}
              </div>

              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="connector-arrow hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-red-300"></div>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-red-300 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div ref={ctaRef} className="text-center bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">
            Prêt à commencer votre aventure automobile ?
          </h3>
          <p className="text-red-100 mb-6 text-lg">
            Rejoignez plus de 10,000 clients satisfaits qui nous font confiance
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform transition-all duration-200 shadow-lg">
              COMMENCER MAINTENANT
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-200">
              VOIR NOS OFFRES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}