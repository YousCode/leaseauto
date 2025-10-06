import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useVehicle } from "@/hooks/useVehicle";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Car,
  Shield,
  Award,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BrandLogo } from "@/lib/BrandLogo";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";

interface VehicleSpecs {
  doors?: number;
  fiscal?: number;
  din?: number;
  conso?: number;
  co2?: number;
  critair?: number;
}

interface VehicleHighlights {
  lowMileage?: boolean;
  firstHand?: boolean;
  recentModel?: boolean;
  warranty?: boolean;
}

interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  transmission: string;
  fuel: string;
  price: number;
  monthly?: number;
  location_city?: string;
  location_cp?: string;
  photos: string[];
  equipments: string[];
  highlights?: VehicleHighlights;
  specs?: VehicleSpecs;
  description?: string;
  status: string;
}

function VehicleCarousel({
  photos,
  make,
  model,
}: {
  photos: string[];
  make: string;
  model: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full aspect-video bg-surface-card rounded-2xl flex items-center justify-center">
        <Car className="w-16 h-16 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Carousel
          className="w-full"
          onSelect={(api) => setCurrentIndex(api?.selectedScrollSnap() || 0)}
        >
          <CarouselContent>
            {photos.map((photo, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-video bg-surface-alt rounded-2xl overflow-hidden">
                  <img
                    src={photo}
                    alt={`${make} ${model} - Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {index + 1}/{photos.length}
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-accent text-white">
                      PRO
                    </Badge>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
              index === currentIndex ? "border-accent" : "border-transparent"
            }`}
          >
            <img
              src={photo}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function HighlightsBadges({ highlights }: { highlights?: VehicleHighlights }) {
  if (!highlights) return null;

  const badges = [];

  if (highlights.lowMileage) {
    badges.push({
      icon: Gauge,
      text: "Faible kilométrage",
      color: "bg-green-100 text-green-800",
    });
  }
  if (highlights.firstHand) {
    badges.push({
      icon: Award,
      text: "Première main",
      color: "bg-blue-100 text-blue-800",
    });
  }
  if (highlights.recentModel) {
    badges.push({
      icon: Clock,
      text: "Modèle récent",
      color: "bg-purple-100 text-purple-800",
    });
  }
  if (highlights.warranty) {
    badges.push({
      icon: Shield,
      text: "Garantie",
      color: "bg-orange-100 text-orange-800",
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <Badge
            key={index}
            className={`${badge.color} flex items-center gap-1`}
          >
            <Icon className="w-3 h-3" />
            {badge.text}
          </Badge>
        );
      })}
    </div>
  );
}

function CharacteristicsTable({ vehicle }: { vehicle: Vehicle }) {
  const characteristics = [
    { icon: Calendar, label: "Année", value: vehicle.year },
    {
      icon: Gauge,
      label: "Kilométrage",
      value: `${vehicle.mileage?.toLocaleString()} km`,
    },
    { icon: Settings, label: "Transmission", value: vehicle.transmission },
    { icon: Fuel, label: "Carburant", value: vehicle.fuel },
    {
      icon: Car,
      label: "Puissance",
      value: vehicle.specs?.din ? `${vehicle.specs.din} ch` : "N/A",
    },
    { icon: Shield, label: "Crit'Air", value: vehicle.specs?.critair || "N/A" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {characteristics.map((char, index) => {
        const Icon = char.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-surface-alt rounded-lg"
          >
            <Icon className="w-5 h-5 text-accent" />
            <div>
              <div className="text-sm text-gray-600">{char.label}</div>
              <div className="font-medium text-gray-900">{char.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EquipmentAccordion({ equipments }: { equipments: string[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayedEquipments = showAll ? equipments : equipments.slice(0, 6);

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="equipments">
        <AccordionTrigger>
          Équipements & options ({equipments.length})
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {displayedEquipments.map((equipment, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-surface-alt rounded text-sm"
              >
                <div className="w-2 h-2 bg-accent rounded-full" />
                {equipment}
              </div>
            ))}
          </div>
          {equipments.length > 6 && (
            <Button
              variant="ghost"
              onClick={() => setShowAll(!showAll)}
              className="mt-4 text-accent hover:text-accent-lite"
            >
              {showAll ? "Voir moins" : `Voir tout (${equipments.length})`}
            </Button>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function BudgetSimulator({ price }: { price: number }) {
  const [downPayment, setDownPayment] = useState([price * 0.2]);
  const [duration, setDuration] = useState(48);
  const [residualValue, setResidualValue] = useState([price * 0.4]);

  const calculateMonthly = (total: number, down: number, months: number) => {
    return (total - down) / months;
  };

  const calculateLOA = (
    total: number,
    down: number,
    months: number,
    residual: number,
  ) => {
    return (total - down - residual) / months;
  };

  return (
    <Tabs defaultValue="credit" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="credit">Crédit</TabsTrigger>
        <TabsTrigger value="loa">LOA</TabsTrigger>
      </TabsList>

      <TabsContent value="credit" className="space-y-4">
        <div>
          <label className="text-sm font-medium">
            Apport: {downPayment[0].toLocaleString()} €
          </label>
          <Slider
            value={downPayment}
            onValueChange={setDownPayment}
            max={price * 0.5}
            min={0}
            step={1000}
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Durée</label>
          <div className="flex gap-2 mt-2">
            {[36, 48, 60].map((months) => (
              <Button
                key={months}
                variant={duration === months ? "default" : "outline"}
                size="sm"
                onClick={() => setDuration(months)}
              >
                {months} mois
              </Button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-surface-alt rounded-lg">
          <div className="text-2xl font-bold text-accent">
            {calculateMonthly(price, downPayment[0], duration).toLocaleString()}{" "}
            €/mois
          </div>
          <div className="text-sm text-gray-600">Mensualité estimée</div>
        </div>
      </TabsContent>

      <TabsContent value="loa" className="space-y-4">
        <div>
          <label className="text-sm font-medium">
            Apport: {downPayment[0].toLocaleString()} €
          </label>
          <Slider
            value={downPayment}
            onValueChange={setDownPayment}
            max={price * 0.5}
            min={0}
            step={1000}
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Valeur résiduelle: {residualValue[0].toLocaleString()} €
          </label>
          <Slider
            value={residualValue}
            onValueChange={setResidualValue}
            max={price * 0.6}
            min={price * 0.2}
            step={1000}
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Durée</label>
          <div className="flex gap-2 mt-2">
            {[36, 48, 60].map((months) => (
              <Button
                key={months}
                variant={duration === months ? "default" : "outline"}
                size="sm"
                onClick={() => setDuration(months)}
              >
                {months} mois
              </Button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-surface-alt rounded-lg">
          <div className="text-2xl font-bold text-accent">
            {calculateLOA(
              price,
              downPayment[0],
              duration,
              residualValue[0],
            ).toLocaleString()}{" "}
            €/mois
          </div>
          <div className="text-sm text-gray-600">Mensualité LOA estimée</div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function LeadCaptureForm() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Prénom" />
        <Input placeholder="Nom" />
      </div>
      <Input placeholder="Email" type="email" />
      <Input placeholder="Téléphone" type="tel" />
      <Textarea placeholder="Votre message..." rows={4} />
      <Button className="w-full bg-accent hover:bg-accent-lite">
        Envoyer ma demande
      </Button>
    </div>
  );
}

function SimilarVehicles({ make, price }: { make: string; price: number }) {
  const { data: similarVehicles } = useQuery({
    queryKey: ["similar-vehicles", make, price],
    queryFn: async () => {
      const { data } = await supabase
        .from("vehicles")
        .select("*")
        .eq("make", make)
        .eq("status", "published")
        .gte("price", price * 0.9)
        .lte("price", price * 1.1)
        .limit(4);
      return data || [];
    },
  });

  if (!similarVehicles || similarVehicles.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-text-primary">
        Véhicules similaires
      </h3>
      <Carousel className="w-full">
        <CarouselContent>
          {similarVehicles.map((vehicle: Vehicle) => (
            <CarouselItem
              key={vehicle.id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Link to={`/vehicules/${vehicle.slug}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-surface-alt rounded-t-lg overflow-hidden">
                    <img
                      src={vehicle.photos[0]}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold">
                      {vehicle.make} {vehicle.model}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {vehicle.year} • {vehicle.mileage?.toLocaleString()} km
                    </p>
                    <p className="text-lg font-bold text-accent mt-2">
                      {vehicle.price?.toLocaleString()} €
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default function VehiclePage() {
  const { slug = "" } = useParams();
  const { data: vehicle, isLoading } = useVehicle(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-text-primary">Chargement…</div>
      </div>
    );
  }

  if (!vehicle) return <Navigate to="/404" replace />;

  const whatsappUrl = `https://wa.me/33767793106?text=Ref%20${slug}`;
  const instagramUrl = "https://www.instagram.com/lease_auto";

  return (
    <>
      <Helmet>
        <title>{`${vehicle.make} ${vehicle.model} ${vehicle.year} – ${vehicle.price?.toLocaleString()} € | LeaseAuto`}</title>
        <meta
          property="og:title"
          content={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
        />
        <meta
          property="og:description"
          content={`${vehicle.description?.slice(0, 120)}... Dispo chez LeaseAuto`}
        />
        <meta property="og:image" content={vehicle.photos?.[0]} />
        <meta property="og:url" content={location.href} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Vehicle",
            name: `${vehicle.make} ${vehicle.model}`,
            brand: vehicle.make,
            model: vehicle.model,
            vehicleModelDate: vehicle.year,
            mileageFromOdometer: vehicle.mileage,
            fuelType: vehicle.fuel,
            vehicleTransmission: vehicle.transmission,
            offers: {
              "@type": "Offer",
              price: vehicle.price,
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-bg-main text-text-primary">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link to="/vehicules">
              <Button
                variant="ghost"
                size="sm"
                className="text-text-primary hover:text-accent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <nav className="text-sm text-gray-400">
              <Link to="/" className="hover:text-accent">
                Accueil
              </Link>
              <span className="mx-2">»</span>
              <Link to="/vehicules" className="hover:text-accent">
                Véhicules
              </Link>
              <span className="mx-2">»</span>
              <span>
                {vehicle.make} {vehicle.model}
              </span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - 68% */}
            <div className="lg:col-span-2 space-y-8">
              {/* Vehicle Title */}
              <div className="flex items-center gap-4">
                <BrandLogo brand={vehicle.make} size={56} />
                <h1 className="text-3xl font-bold">
                  {vehicle.make} {vehicle.model} {vehicle.year}
                </h1>
              </div>

              {/* Carousel */}
              <VehicleCarousel
                photos={vehicle.photos}
                make={vehicle.make}
                model={vehicle.model}
              />

              {/* Highlights */}
              <HighlightsBadges highlights={vehicle.highlights} />

              {/* Characteristics */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Caractéristiques</h2>
                <CharacteristicsTable vehicle={vehicle} />
              </div>

              {/* Equipment */}
              <EquipmentAccordion equipments={vehicle.equipments || []} />

              {/* Budget Simulator */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Mon budget</h2>
                <div className="bg-surface-card p-6 rounded-2xl">
                  <BudgetSimulator price={vehicle.price} />
                </div>
              </div>

              {/* History & Maintenance */}
              <Accordion type="single" collapsible>
                <AccordionItem value="history">
                  <AccordionTrigger>Historique & entretien</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-surface-alt rounded-lg">
                        <div className="text-sm text-gray-600">VIN</div>
                        <div className="font-medium text-gray-900">
                          WBA***********
                        </div>
                      </div>
                      <div className="p-3 bg-surface-alt rounded-lg">
                        <div className="text-sm text-gray-600">CO₂</div>
                        <div className="font-medium text-gray-900">
                          {vehicle.specs?.co2 || "N/A"} g/km
                        </div>
                      </div>
                      <div className="p-3 bg-surface-alt rounded-lg">
                        <div className="text-sm text-gray-600">Crit'Air</div>
                        <div className="font-medium text-gray-900">
                          {vehicle.specs?.critair || "N/A"}
                        </div>
                      </div>
                      <div className="p-3 bg-surface-alt rounded-lg">
                        <div className="text-sm text-gray-600">
                          Dernière révision
                        </div>
                        <div className="font-medium text-gray-900">Récente</div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Similar Vehicles */}
              <SimilarVehicles make={vehicle.make} price={vehicle.price} />
            </div>

            {/* Price Card - 32% */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 bg-surface-alt text-gray-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BrandLogo brand={vehicle.make} size={32} />
                    <div>
                      <CardTitle className="text-lg">
                        {vehicle.make} {vehicle.model} {vehicle.year}
                      </CardTitle>
                      {vehicle.location_city && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {vehicle.location_city} ({vehicle.location_cp})
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-accent">
                      {vehicle.price?.toLocaleString()} €
                    </div>
                    {vehicle.monthly && (
                      <div className="text-sm text-gray-600">
                        soit ~{vehicle.monthly.toLocaleString()} €/mois
                      </div>
                    )}
                  </div>

                  {/* Primary CTAs */}
                  <div className="space-y-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        WhatsApp
                      </Button>
                    </a>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-accent hover:bg-accent-lite text-white">
                          Demander un devis
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Demande de devis</DialogTitle>
                          <DialogDescription>
                            Remplissez ce formulaire pour recevoir un devis
                            personnalisé.
                          </DialogDescription>
                        </DialogHeader>
                        <LeadCaptureForm />
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Secondary CTA */}
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full">
                      Voir Instagram
                    </Button>
                  </a>

                  {/* Placeholder for ads */}
                  <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center text-sm text-gray-500">
                    Publicité
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <FloatingWhatsApp />
    </>
  );
}
