import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WhatsAppShare from "@/components/ui/WhatsAppShare";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import useEmblaCarousel from "embla-carousel-react";
import { useVehicleBySlug } from "@/hooks/useVehicleBySlug";
import { BrandLogo } from "@/lib/getBrandLogo.tsx";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Mail,
  User,
  Phone,
  CheckCircle,
  Euro,
  Car,
  Fuel,
  Settings,
  Clock,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  MessageCircle,
  Download,
  FileText,
  Wrench,
  History,
  Calculator,
} from "lucide-react";
import HeaderSection from "@/components/sections/HeaderSection";

interface VehicleProps {
  id?: string;
  images?: string[];
  title?: string;
  brand?: string;
  model?: string;
  version?: string;
  year?: number;
  price?: number;
  monthly?: number;
  mileage?: number;
  energy?: string;
  gearbox?: string;
  doors?: string | number;
  seats?: string | number;
  fiscalPower?: string | number;
  dinPower?: string | number;
  color?: string;
  firstHand?: string;
  inspection?: string;
  warranty?: string;
  city?: string;
  registrationDate?: string;
  publishDate?: string;
  description?: string;
  options?: string[];
  downPayment?: string;
  duration?: string;
  residualValue?: string;
  extendedWarranty?: string;
  critAir?: string | number;
  power?: string | number;
  status?: string;
  equipment?: string[];
  history?: Array<{ date: string; event: string; details?: string }>;
  documents?: Array<{ name: string; type: string; url?: string }>;
}

const PREMIUM_VEHICLES: VehicleProps[] = [
  {
    id: "1",
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1280&q=80",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1280&q=80&auto=format&fit=crop&crop=left",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1280&q=80&auto=format&fit=crop&crop=right",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1280&q=80&auto=format&fit=crop&crop=top",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1280&q=80&auto=format&fit=crop&crop=bottom",
    ],
    title: "TOYOTA COROLLA TOURING 1.8i 122 HK HYBRID SPORTS ACTIVE",
    brand: "Toyota",
    model: "Corolla Touring",
    version: "Sports Active",
    year: 2023,
    price: 22990,
    monthly: 405,
    mileage: 45000,
    energy: "Hybride",
    gearbox: "Automatique",
    doors: "5",
    seats: "5",
    fiscalPower: "8",
    dinPower: "122",
    power: "122",
    color: "Gris Métallisé",
    firstHand: "Oui",
    inspection: "OK",
    warranty: "Garantie constructeur 5 ans ou 100 000 km",
    city: "Épinay-sur-Seine 93800",
    registrationDate: "2023-03-15",
    publishDate: "15 Janvier 2024",
    status: "Disponible",
    critAir: "1",
    description:
      "# Véhicule d'Exception\n\nCette **Toyota Corolla Touring** combine parfaitement efficacité énergétique et espace pratique pour répondre à tous vos besoins de mobilité.\n\n## Caractéristiques principales\n\n- Motorisation hybride dernière génération\n- Consommation exceptionnelle : 4,2L/100km\n- Émissions CO2 réduites : 96g/km\n- Garantie constructeur étendue\n\n## État impeccable\n\nVéhicule non-fumeur, première main. Entretien régulier effectué en concession Toyota, carnet d'entretien à jour et complet.",
    options: [
      "Climatisation automatique bi-zone",
      "Système de navigation GPS intégré",
      "Caméra de recul haute définition",
      "Régulateur de vitesse adaptatif",
      "Phares LED / Xenon",
      "Bluetooth et connectivité smartphone",
      "Apple CarPlay / Android Auto",
      "Jantes alliage 17 pouces",
      "Aide au stationnement avant/arrière",
      "Détecteur d'angle mort",
      "Système audio premium JBL",
      "Sièges chauffants avant",
    ],
    equipment: [
      "Pack Sécurité Toyota Safety Sense 2.0",
      "Système de freinage d'urgence automatique",
      "Reconnaissance des panneaux de signalisation",
      "Alerte de franchissement involontaire de ligne",
      "Feux de route automatiques",
      "Régulateur de vitesse adaptatif",
    ],
    history: [
      {
        date: "2024-01-15",
        event: "Mise en vente",
        details: "Véhicule mis en ligne sur notre plateforme",
      },
      {
        date: "2023-12-10",
        event: "Révision complète",
        details: "Révision 45 000 km effectuée en concession Toyota",
      },
      {
        date: "2023-09-15",
        event: "Contrôle technique",
        details: "Contrôle technique OK, aucun défaut relevé",
      },
      {
        date: "2023-03-15",
        event: "Première mise en circulation",
        details: "Véhicule neuf livré au premier propriétaire",
      },
    ],
    documents: [
      { name: "Carte grise", type: "pdf" },
      { name: "Certificat de non-gage", type: "pdf" },
      { name: "Contrôle technique", type: "pdf" },
      { name: "Carnet d'entretien", type: "pdf" },
      { name: "Factures d'entretien", type: "pdf" },
    ],
    downPayment: "3000",
    duration: "48",
    residualValue: "12000",
    extendedWarranty: "Extension possible 24 mois",
  },
];

const VehicleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading, error } = useVehicleBySlug(slug || "");
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [financeParams, setFinanceParams] = useState({
    downPayment: 3000,
    duration: 48,
    residualValue: 12000,
  });

  // Fallback to static data if no vehicle found in Supabase
  const fallbackVehicle = PREMIUM_VEHICLES[0];
  const remoteVehicle = vehicle as Record<string, any> | null;
  const displayVehicle: VehicleProps = remoteVehicle
    ? ({
        ...fallbackVehicle,
        ...remoteVehicle,
        images:
          (Array.isArray(remoteVehicle.images) && remoteVehicle.images.length > 0
            ? remoteVehicle.images
            : fallbackVehicle.images) ?? fallbackVehicle.images,
        options:
          (remoteVehicle.options as string[] | undefined) ??
          fallbackVehicle.options,
        equipment:
          (remoteVehicle.equipment as string[] | undefined) ??
          fallbackVehicle.equipment,
        history:
          (remoteVehicle.history as VehicleProps["history"]) ??
          fallbackVehicle.history,
        documents:
          (remoteVehicle.documents as VehicleProps["documents"]) ??
          fallbackVehicle.documents,
      } as VehicleProps)
    : fallbackVehicle;

  // Calculate monthly payment
  const calculateMonthly = () => {
    const price = displayVehicle.price || 0;
    const { downPayment, duration, residualValue } = financeParams;
    const financedAmount = price - downPayment - residualValue;
    return Math.round(financedAmount / duration);
  };

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E50914]"></div>
      </div>
    );
  }

  const vehicleImages = displayVehicle.images || [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1280&q=80",
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Demande envoyée avec succès ! Nous vous recontacterons rapidement.");
    setContactForm({ name: "", email: "", phone: "", message: "" });
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Bonjour, je suis intéressé par le véhicule ${displayVehicle.title} au prix de ${displayVehicle.price?.toLocaleString()}€`,
    );
    window.open(`https://wa.me/33767793106?text=${message}`, "_blank");
  };

  const generatePDF = () => {
    // Simulate PDF generation
    alert("PDF généré ! Le téléchargement va commencer...");
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/# (.*)/g, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/## (.*)/g, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/- (.*)/g, '<li class="ml-4">• $1</li>')
      .replace(/\n/g, "<br />");
  };

  return (
    <>
      <Helmet>
        <title>{displayVehicle.title} — Lease Auto</title>
        <meta
          name="description"
          content={`${displayVehicle.brand} ${displayVehicle.model} ${displayVehicle.year}, ${displayVehicle.mileage?.toLocaleString()} km, ${displayVehicle.price?.toLocaleString()} €`}
        />
        <link rel="canonical" href={`https://leaseauto.fr/vehicules/${slug}`} />
        <meta property="og:title" content={displayVehicle.title} />
        <meta
          property="og:description"
          content={displayVehicle.description?.slice(0, 120)}
        />
        <meta property="og:image" content={vehicleImages[0]} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Header fixe */}
      <HeaderSection />

      <div className="w-full bg-[#F9FAFB] min-h-screen pt-[72px]">
        {/* Back button */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-4 bg-white">
          <Button
            variant="ghost"
            onClick={() => navigate("/vehicules")}
            className="text-[#6B7280] hover:text-[#111111] hover:bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux véhicules
          </Button>
        </div>

        {/* Hero Section with Carousel - Compact */}
        <div className="relative max-w-[1440px] mx-auto bg-white">
          <div className="aspect-[21/9] max-h-[500px] relative overflow-hidden bg-[#F9FAFB]">
            <div className="embla" ref={emblaRef}>
              <div className="embla__container flex">
                {vehicleImages.map((image, index) => (
                  <div
                    key={index}
                    className="embla__slide flex-[0_0_100%] min-w-0"
                  >
                    <div
                      className="w-full h-full relative cursor-pointer group"
                      onClick={() => {
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                      }}
                    >
                      <img
                        src={image}
                        alt={`${displayVehicle.title} - ${index + 1}`}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500 flex items-center justify-center">
                        <ZoomIn
                          className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          size={40}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons - Compact */}
            {vehicleImages.length > 1 && (
              <>
                <button
                  onClick={() => emblaApi?.scrollPrev()}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#111111] rounded-full p-2.5 transition-all duration-300 backdrop-blur-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => emblaApi?.scrollNext()}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#111111] rounded-full p-2.5 transition-all duration-300 backdrop-blur-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Fullscreen button */}
            <button
              onClick={() => {
                setLightboxIndex(selectedIndex);
                setLightboxOpen(true);
              }}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white text-[#111111] rounded-lg p-2.5 transition-all duration-300 backdrop-blur-sm"
            >
              <ZoomIn size={18} />
            </button>
          </div>

          {/* Thumbnails - Compact */}
          {vehicleImages.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto bg-white border-b border-[#E5E7EB]">
              {vehicleImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border transition-all duration-300 ${
                    index === selectedIndex
                      ? "border-[#111111] border-2 shadow-md"
                      : "border-[#E5E7EB] hover:border-[#6B7280]"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-7xl w-full p-0 bg-black">
            <div className="relative">
              <img
                src={vehicleImages[lightboxIndex]}
                alt={`${displayVehicle.title} - ${lightboxIndex + 1}`}
                className="w-full h-auto max-h-[90vh] object-contain"
              />
              {vehicleImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setLightboxIndex(
                        (prev) =>
                          (prev - 1 + vehicleImages.length) %
                          vehicleImages.length,
                      )
                    }
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all duration-200"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() =>
                      setLightboxIndex(
                        (prev) => (prev + 1) % vehicleImages.length,
                      )
                    }
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 transition-all duration-200"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Main Content - BMW Grid Layout */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column - 8/12 */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Vehicle Title Card - Compact */}
              <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <BrandLogo
                    brand={displayVehicle.brand}
                    size={40}
                    className="text-[#111111]"
                  />
                  <div>
                    <h1 className="text-xl font-bold text-[#111111] uppercase tracking-wide">
                      {displayVehicle.brand} {displayVehicle.model}
                    </h1>
                    <p className="text-sm text-[#6B7280] mt-0.5">
                      {displayVehicle.version}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[#6B7280] text-sm">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    <span>Disponible à {displayVehicle.city}</span>
                  </div>
                  <Badge
                    className="bg-gray-100 text-gray-700 border border-gray-200 text-xs"
                  >
                    {displayVehicle.status || "Neuf"}
                  </Badge>
                </div>
              </div>

              {/* À propos de ce véhicule - Compact */}
              <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-2.5 px-6 py-4 border-b border-[#E5E7EB]">
                  <Car className="text-[#111111]" size={18} />
                  <h2 className="text-base font-semibold text-[#111111]">
                    À propos de ce véhicule
                  </h2>
                </div>

                {/* Specifications Grid - BMW 2 columns */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-x-8">
                    {/* Row 1 */}
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
                      <span className="text-[#6B7280] text-sm">Année</span>
                      <span className="font-semibold text-[#111111] text-sm">
                        {displayVehicle.year}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
                      <span className="text-[#6B7280] text-sm">Kilométrage</span>
                      <span className="font-semibold text-[#111111] text-sm">
                        {displayVehicle.mileage?.toLocaleString()} km
                      </span>
                    </div>

                    {/* Row 2 */}
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
                      <span className="text-[#6B7280] text-sm">Puissance DIN</span>
                      <span className="font-semibold text-[#111111] text-sm">
                        {displayVehicle.power || displayVehicle.dinPower} ch
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
                      <span className="text-[#6B7280] text-sm">Puissance fiscale</span>
                      <span className="font-semibold text-[#111111] text-sm">
                        {displayVehicle.fiscalPower} CV
                      </span>
                    </div>

                    {/* Row 3 */}
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
                      <span className="text-[#6B7280] text-sm">Énergie</span>
                      <span className="font-semibold text-[#111111] text-sm">
                        {displayVehicle.energy}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
                      <span className="text-[#6B7280] text-sm">Boîte</span>
                      <span className="font-semibold text-[#111111] text-sm">
                        {displayVehicle.gearbox}
                      </span>
                    </div>

                    {/* Row 4 */}
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
                      <span className="text-[#6B7280] text-sm">Couleur</span>
                      <span className="font-semibold text-[#111111] text-sm">
                        {displayVehicle.color}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB]">
                      <span className="text-[#6B7280] text-sm">Crit'Air</span>
                      <span className="font-semibold text-[#111111] text-sm">
                        {displayVehicle.critAir || "1"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section - Compact */}
              <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                <div className="flex items-center gap-2.5 px-6 py-4 border-b border-[#E5E7EB]">
                  <FileText className="text-[#111111]" size={18} />
                  <h2 className="text-base font-semibold text-[#111111]">
                    Description
                  </h2>
                </div>
                <div className="p-6">
                  <div
                    className="prose prose-sm max-w-none text-[#6B7280] leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(
                        displayVehicle.description ||
                          "Description détaillée du véhicule.",
                      ),
                    }}
                  />
                </div>
              </div>

              {/* Equipment Section - Compact */}
              <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                <div className="flex items-center gap-2.5 px-6 py-4 border-b border-[#E5E7EB]">
                  <Settings className="text-[#111111]" size={18} />
                  <h2 className="text-base font-semibold text-[#111111]">
                    Équipements
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {(displayVehicle.options || []).map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2.5 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]"
                      >
                        <CheckCircle
                          size={16}
                          className="text-[#111111] flex-shrink-0"
                        />
                        <span className="text-[#111111] text-sm">
                          {option}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* History Section - Compact */}
              {displayVehicle.history && displayVehicle.history.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                  <div className="flex items-center gap-2.5 px-6 py-4 border-b border-[#E5E7EB]">
                    <History className="text-[#111111]" size={18} />
                    <h2 className="text-base font-semibold text-[#111111]">
                      Historique du véhicule
                    </h2>
                  </div>
                  <div className="p-6">
                    <ol className="relative border-l-2 border-[#E5E7EB]">
                      {displayVehicle.history.map((event, index) => (
                        <li key={index} className="mb-8 ml-6 last:mb-0">
                          <span className="absolute flex items-center justify-center w-6 h-6 bg-[#111111] rounded-full -left-3 ring-4 ring-white">
                            <Clock className="w-3 h-3 text-white" />
                          </span>
                          <h3 className="text-sm font-semibold text-[#111111] mb-1">
                            {event.event}
                          </h3>
                          <time className="block mb-1.5 text-xs text-[#6B7280]">
                            {new Date(event.date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric"
                            })}
                          </time>
                          {event.details && (
                            <p className="text-sm text-[#6B7280] leading-relaxed">
                              {event.details}
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* Documents Section - Compact */}
              {displayVehicle.documents && displayVehicle.documents.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                  <div className="flex items-center gap-2.5 px-6 py-4 border-b border-[#E5E7EB]">
                    <FileText className="text-[#111111]" size={18} />
                    <h2 className="text-base font-semibold text-[#111111]">
                      Documents
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-2.5">
                      {displayVehicle.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] hover:bg-white transition-colors duration-200"
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText
                              className="text-[#6B7280]"
                              size={18}
                            />
                            <span className="font-medium text-[#111111] text-sm">{doc.name}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#6B7280] border-[#E5E7EB] hover:bg-[#F9FAFB] text-xs"
                            disabled
                          >
                            <Download size={14} className="mr-1.5" />
                            Réservé admin
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - 4/12 - Sticky Card */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-4">
                
                {/* Price & Finance Card - Compact */}
                <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                  <div className="text-center mb-5">
                    <div className="text-xs text-[#6B7280] mb-1.5">Loyer Mensuel</div>
                    <div className="text-3xl font-bold text-[#111111] mb-0.5">
                      {calculateMonthly()} €
                    </div>
                    <div className="text-xs text-[#6B7280]">/ mois</div>
                  </div>
                  
                  <div className="border-t border-[#E5E7EB] pt-5 mb-5">
                    <div className="text-xs text-[#6B7280] mb-1.5">Prix total</div>
                    <div className="text-xl font-bold text-[#111111]">
                      {displayVehicle.price?.toLocaleString()} €
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Button
                      className="w-full bg-[#E53935] hover:bg-[#C62828] text-white h-11 text-sm rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      Demander des détails
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-[#E53935] text-[#E53935] hover:bg-[#E53935] hover:text-white h-11 text-sm rounded-lg font-semibold transition-all duration-200"
                    >
                      Réserver en ligne
                    </Button>
                  </div>

                  <div className="mt-5 pt-5 border-t border-[#E5E7EB]">
                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <MapPin size={14} />
                      <span>Disponible à {displayVehicle.city}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Card - Compact */}
                <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-5">
                  <h3 className="text-sm font-semibold text-[#111111] mb-3">
                    Besoin d'aide ?
                  </h3>
                  <div className="space-y-2.5">
                    <Button
                      onClick={() => window.open("tel:+33767793106", "_self")}
                      variant="outline"
                      className="w-full border border-[#E5E7EB] text-[#111111] hover:bg-[#F9FAFB] h-10 text-sm rounded-lg"
                    >
                      <Phone size={16} className="mr-2" />
                      Appeler
                    </Button>
                    <Button
                      onClick={handleWhatsApp}
                      variant="outline"
                      className="w-full border border-[#E5E7EB] text-[#111111] hover:bg-[#F9FAFB] h-10 text-sm rounded-lg"
                    >
                      <MessageCircle size={16} className="mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>

                {/* Financing Calculator - New Section */}
                <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-5">
                  <h3 className="text-sm font-semibold text-[#111111] mb-4">
                    Simulateur de financement
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="downPayment" className="text-xs text-[#6B7280]">
                          Apport
                        </Label>
                        <span className="text-xs font-semibold text-[#111111]">
                          {financeParams.downPayment.toLocaleString()}€
                        </span>
                      </div>
                      <input
                        id="downPayment"
                        type="range"
                        min="0"
                        max={displayVehicle.price || 30000}
                        step="500"
                        value={financeParams.downPayment}
                        onChange={(e) =>
                          setFinanceParams({
                            ...financeParams,
                            downPayment: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E53935]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="duration" className="text-xs text-[#6B7280]">
                          Durée
                        </Label>
                        <span className="text-xs font-semibold text-[#111111]">
                          {financeParams.duration} mois
                        </span>
                      </div>
                      <input
                        id="duration"
                        type="range"
                        min="12"
                        max="72"
                        step="6"
                        value={financeParams.duration}
                        onChange={(e) =>
                          setFinanceParams({
                            ...financeParams,
                            duration: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E53935]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="residualValue" className="text-xs text-[#6B7280]">
                          Valeur résiduelle
                        </Label>
                        <span className="text-xs font-semibold text-[#111111]">
                          {financeParams.residualValue.toLocaleString()}€
                        </span>
                      </div>
                      <input
                        id="residualValue"
                        type="range"
                        min="0"
                        max={(displayVehicle.price || 30000) * 0.6}
                        step="500"
                        value={financeParams.residualValue}
                        onChange={(e) =>
                          setFinanceParams({
                            ...financeParams,
                            residualValue: parseInt(e.target.value),
                          })
                        }
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E53935]"
                      />
                    </div>
                    <Button
                      onClick={generatePDF}
                      variant="outline"
                      className="w-full border border-[#E5E7EB] text-[#111111] hover:bg-[#F9FAFB] h-10 text-sm rounded-lg"
                    >
                      <Download size={16} className="mr-2" />
                      Télécharger l'offre PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleDetailPage;
