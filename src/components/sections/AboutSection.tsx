import { CheckCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current?.children,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Stats animation with counter effect
      const statNumbers = statsRef.current?.querySelectorAll('.stat-number');
      statNumbers?.forEach((stat, index) => {
        const finalValue = stat.textContent;
        gsap.fromTo(stat, 
          { textContent: "0" },
          {
            textContent: finalValue,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            },
            delay: index * 0.2
          }
        );
      });

      // Stats cards animation
      gsap.fromTo(statsRef.current?.children,
        { 
          scale: 0.8, 
          opacity: 0,
          rotationY: 90
        },
        { 
          scale: 1, 
          opacity: 1,
          rotationY: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Features animation
      const featureItems = featuresRef.current?.querySelectorAll('.feature-item');
      gsap.fromTo(featureItems,
        { 
          x: -50, 
          opacity: 0 
        },
        { 
          x: 0, 
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Images grid animation
      const imageCards = imagesRef.current?.querySelectorAll('.image-card');
      gsap.fromTo(imageCards,
        { 
          scale: 0.7, 
          opacity: 0,
          rotation: 10
        },
        { 
          scale: 1, 
          opacity: 1,
          rotation: 0,
          duration: 1,
          stagger: 0.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: imagesRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Buttons animation
      gsap.fromTo(buttonsRef.current?.children,
        { 
          y: 30, 
          opacity: 0,
          scale: 0.9
        },
        { 
          y: 0, 
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: buttonsRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Floating animations
      gsap.to(".floating-element-1", {
        y: -20,
        x: 10,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });

      gsap.to(".floating-element-2", {
        y: 15,
        x: -5,
        rotation: -3,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });

      // Parallax effect for background elements
      gsap.to(".parallax-bg", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: "🏆", number: "500+", label: "Véhicules disponibles" },
    { icon: "😊", number: "99%", label: "Clients satisfaits" },
    { icon: "⏰", number: "24h", label: "Service client" }
  ];

  const features = [
    "Large choix de véhicules haut de gamme disponibles",
    "Des options de financement flexibles pour tous les budgets",
    "Processus de location simple et rapide",
    "Un service clientèle dédié et disponible",
    "Suivi du véhicule pour une expérience de conduite en toute sécurité",
    "Possibilité d'améliorer ou de renouveler le véhicule sans stress"
  ];

  const vehicleImages = [
    "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop&q=80"
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="parallax-bg absolute inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 opacity-60"></div>
      <div className="floating-element-1 absolute top-20 left-10 w-32 h-32 bg-red-100 rounded-full opacity-20"></div>
      <div className="floating-element-2 absolute bottom-20 right-20 w-24 h-24 bg-orange-100 rounded-full opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Leasing automobile
            <span className="text-red-600 block">premium</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Lease Auto est votre partenaire de confiance pour une expérience 
            de leasing automobile d'exception. Nous combinons expertise, 
            innovation et service personnalisé pour vous offrir les meilleures 
            solutions de mobilité.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-12">
            
            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center group cursor-pointer transform-gpu"
                  style={{ perspective: "1000px" }}
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="stat-number text-3xl font-bold text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Why Choose Us */}
            <div ref={featuresRef}>
              <div className="flex items-center mb-6">
                <span className="text-red-600 font-bold text-sm tracking-wider">
                  POURQUOI NOUS CHOISIR ?
                </span>
                <div className="ml-4 h-px bg-red-600 flex-1"></div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-8">
                L'excellence automobile à votre portée
              </h3>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="feature-item flex items-start space-x-3 group cursor-pointer"
                  >
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div ref={buttonsRef} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                DÉCOUVRIR NOS VÉHICULES
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-bold hover:border-red-600 hover:text-red-600 transition-all duration-300">
                EN SAVOIR PLUS →
              </button>
            </div>
          </div>

          {/* Right Images Grid */}
          <div ref={imagesRef} className="relative">
            <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold z-10">
              #1 EN FRANCE
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {vehicleImages.map((image, index) => (
                <div 
                  key={index}
                  className={`image-card relative overflow-hidden rounded-xl shadow-lg group cursor-pointer transform-gpu ${
                    index === 0 ? 'col-span-2 h-48' : 'h-36'
                  }`}
                  style={{ perspective: "1000px" }}
                >
                  <img
                    src={image}
                    alt={`Véhicule premium ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-gray-900 font-semibold text-sm">
                        Voir détails
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}