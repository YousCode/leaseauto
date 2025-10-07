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
  doors?: string;
  seats?: string;
  fiscalPower?: string;
  dinPower?: string;
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
  critAir?: string;
  power?: string;
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
  const displayVehicle = vehicle ? {
    ...vehicle,
    images: vehicle.images || fallbackVehicle.images,
    options: vehicle.options || fallbackVehicle.options,
    equipment: fallbackVehicle.equipment,
    history: fallbackVehicle.history,
    documents: fallbackVehicle.documents,
  } : fallbackVehicle;

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

      <div className="w-full bg-white min-h-screen">
        {/* Back button */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/vehicules")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux véhicules
          </Button>
        </div>

        {/* Hero Section with Carousel */}
        <div className="relative max-w-screen-xl mx-auto">
          <div className="aspect-video relative overflow-hidden">
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
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <ZoomIn
                          className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          size={48}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            {vehicleImages.length > 1 && (
              <>
                <button
                  onClick={() => emblaApi?.scrollPrev()}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 transition-all duration-200 shadow-lg"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => emblaApi?.scrollNext()}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 transition-all duration-200 shadow-lg"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Overlay with vehicle info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
              <div className="max-w-4xl">
                <div className="flex items-center gap-3 mb-4">
                  <BrandLogo
                    brand={displayVehicle.brand}
                    size={48}
                    className="text-white"
                  />
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {displayVehicle.brand} {displayVehicle.model}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-[#E50914]">
                    {displayVehicle.price?.toLocaleString()}€
                  </span>
                  <span className="text-xl text-white/80">
                    {displayVehicle.monthly}€/mois
                  </span>
                  <Badge
                    className={`${
                      displayVehicle.status === "Disponible"
                        ? "bg-green-500 text-white"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {displayVehicle.status || "Disponible"}
                  </Badge>
                </div>
                <div className="flex items-center text-white/80">
                  <MapPin size={16} className="mr-2" />
                  <span>{displayVehicle.city}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          {vehicleImages.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {vehicleImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`flex-shrink-0 w-20 h-12 rounded overflow-hidden border-2 transition-all duration-200 ${
                    index === selectedIndex
                      ? "border-[#E50914]"
                      : "border-gray-300 hover:border-gray-400"
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
          <DialogContent className="max-w-6xl w-full p-0 bg-black">
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

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About this vehicle */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="text-[#E50914]" size={20} />À propos de ce
                    véhicule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Année</span>
                      <span className="font-semibold">
                        {displayVehicle.year}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Kilométrage</span>
                      <span className="font-semibold">
                        {displayVehicle.mileage?.toLocaleString()} km
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Puiss. DIN</span>
                      <span className="font-semibold">
                        {displayVehicle.power || displayVehicle.dinPower} ch
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Puiss. fiscale</span>
                      <span className="font-semibold">
                        {displayVehicle.fiscalPower} CV
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Énergie</span>
                      <span className="font-semibold">
                        {displayVehicle.energy}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Boîte</span>
                      <span className="font-semibold">
                        {displayVehicle.gearbox}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Couleur</span>
                      <span className="font-semibold">
                        {displayVehicle.color}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Crit'Air</span>
                      <span className="font-semibold">
                        {displayVehicle.critAir || "1"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="description">
                    <FileText size={16} className="mr-1" />
                    Description
                  </TabsTrigger>
                  <TabsTrigger value="equipment">
                    <Settings size={16} className="mr-1" />
                    Équipements
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <History size={16} className="mr-1" />
                    Historique
                  </TabsTrigger>
                  <TabsTrigger value="financing">
                    <Calculator size={16} className="mr-1" />
                    Financement
                  </TabsTrigger>
                  <TabsTrigger value="documents">
                    <FileText size={16} className="mr-1" />
                    Documents
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(
                            displayVehicle.description ||
                              "Description détaillée du véhicule.",
                          ),
                        }}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="equipment" className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(displayVehicle.options || []).map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center p-3 bg-green-50 rounded-lg"
                          >
                            <CheckCircle
                              size={16}
                              className="mr-3 text-green-600"
                            />
                            <span className="text-green-800 font-medium">
                              {option}
                            </span>
                          </div>
                        ))}
                      </div>
                      {displayVehicle.equipment && (
                        <div className="mt-6">
                          <h4 className="font-semibold mb-3">
                            Équipements de sécurité
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {displayVehicle.equipment.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center p-3 bg-blue-50 rounded-lg"
                              >
                                <Shield
                                  size={16}
                                  className="mr-3 text-blue-600"
                                />
                                <span className="text-blue-800 font-medium">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <ol className="relative border-l border-gray-200">
                        {(displayVehicle.history || []).map((event, index) => (
                          <li key={index} className="mb-10 ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-[#E50914] rounded-full -left-3 ring-8 ring-white">
                              <Clock className="w-3 h-3 text-white" />
                            </span>
                            <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                              {event.event}
                            </h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                              {new Date(event.date).toLocaleDateString("fr-FR")}
                            </time>
                            {event.details && (
                              <p className="mb-4 text-base font-normal text-gray-500">
                                {event.details}
                              </p>
                            )}
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="financing" className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="downPayment">
                            Apport: {financeParams.downPayment.toLocaleString()}
                            €
                          </Label>
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
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration">
                            Durée: {financeParams.duration} mois
                          </Label>
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
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <Label htmlFor="residualValue">
                            Valeur résiduelle:{" "}
                            {financeParams.residualValue.toLocaleString()}€
                          </Label>
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
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div className="bg-[#E50914] text-white p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold">
                            {calculateMonthly()}€/mois
                          </div>
                          <div className="text-sm opacity-90">
                            Mensualité calculée en temps réel
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {(displayVehicle.documents || []).map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center">
                              <FileText
                                className="mr-3 text-gray-500"
                                size={20}
                              />
                              <span className="font-medium">{doc.name}</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-gray-500"
                              disabled
                            >
                              <Download size={16} className="mr-1" />
                              Réservé admin
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Sticky Finance Component */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Finance Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Euro className="text-[#E50914]" size={20} />
                      Financement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#E50914]">
                        {displayVehicle.price?.toLocaleString()}€
                      </div>
                      <div className="text-lg text-gray-600">
                        {calculateMonthly()}€/mois
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Apport</span>
                        <span>
                          {financeParams.downPayment.toLocaleString()}€
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Durée</span>
                        <span>{financeParams.duration} mois</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Valeur résiduelle</span>
                        <span>
                          {financeParams.residualValue.toLocaleString()}€
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={generatePDF}
                      className="w-full bg-[#E50914] hover:bg-[#B50F0F]"
                    >
                      <Download size={16} className="mr-2" />
                      Recevoir l'offre PDF
                    </Button>

                    {/* WhatsApp Share */}
                    <div className="flex justify-center">
                      <WhatsAppShare
                        url={window.location.href}
                        title={displayVehicle.title || "Véhicule Lease Auto"}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Intéressé par ce véhicule ?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="contact-name">Nom</Label>
                        <Input
                          id="contact-name"
                          placeholder="Votre nom"
                          value={contactForm.name}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-email">Email</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="Votre email"
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-phone">Téléphone</Label>
                        <Input
                          id="contact-phone"
                          placeholder="Votre téléphone"
                          value={contactForm.phone}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              phone: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-message">Message</Label>
                        <Textarea
                          id="contact-message"
                          placeholder="Votre message (optionnel)"
                          value={contactForm.message}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              message: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-[#E50914] hover:bg-[#B50F0F]"
                      >
                        Envoyer ma demande
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="fixed inset-x-0 bottom-0 bg-white/90 backdrop-blur border-t p-4 flex gap-3 z-50">
          <Button
            onClick={() => window.open("tel:+33767793106", "_self")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Phone size={18} className="mr-2" />
            Appeler
          </Button>
          <Button
            onClick={handleWhatsApp}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageCircle size={18} className="mr-2" />
            WhatsApp
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 bg-[#E50914] hover:bg-[#B50F0F] text-white">
                <Mail size={18} className="mr-2" />
                Demander une offre
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Demander une offre</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="modal-name">Nom</Label>
                  <Input
                    id="modal-name"
                    placeholder="Votre nom"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="modal-email">Email</Label>
                  <Input
                    id="modal-email"
                    type="email"
                    placeholder="Votre email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="modal-phone">Téléphone</Label>
                  <Input
                    id="modal-phone"
                    placeholder="Votre téléphone"
                    value={contactForm.phone}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="modal-message">Message</Label>
                  <Textarea
                    id="modal-message"
                    placeholder="Votre message (optionnel)"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#E50914] hover:bg-[#B50F0F]"
                >
                  Envoyer ma demande
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default VehicleDetailPage;