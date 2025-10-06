import { useParams, Link, useNavigate } from "react-router-dom";
import { useVehicle } from "@/hooks/useVehicle";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Fuel,
  Settings,
  Car,
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Eye,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Award,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import PhotoCarousel from "@/components/ui/PhotoCarousel";
import BrandLogo from "@/components/ui/BrandLogo";
import { Helmet } from "react-helmet-async";

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const VehicleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading, error } = useVehicle(slug!);
  const { toast } = useToast();

  const [leadForm, setLeadForm] = useState<LeadFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [showLeadDialog, setShowLeadDialog] = useState(false);

  // Financing calculator state
  const [downPayment, setDownPayment] = useState([0]);
  const [loanDuration, setLoanDuration] = useState([60]);
  const [activeTab, setActiveTab] = useState("monthly");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full rounded-xl" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Véhicule non trouvé
          </h1>
          <p className="text-gray-600 mb-6">
            Ce véhicule n'existe pas ou n'est plus disponible.
          </p>
          <Button onClick={() => navigate("/vehicules")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux annonces
          </Button>
        </div>
      </div>
    );
  }

  const calculateMonthlyPayment = (
    price: number,
    down: number,
    months: number,
  ) => {
    const loanAmount = price - down;
    const monthlyRate = 0.06 / 12; // 6% annual rate
    if (monthlyRate === 0) return loanAmount / months;
    return (
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
      (Math.pow(1 + monthlyRate, months) - 1)
    );
  };

  const monthlyPayment = calculateMonthlyPayment(
    vehicle.price || 0,
    downPayment[0],
    loanDuration[0],
  );

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);

    try {
      // Here you would typically send the lead to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        title: "Demande envoyée !",
        description: "Nous vous recontacterons dans les plus brefs délais.",
      });

      setShowLeadDialog(false);
      setLeadForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const getHighlights = () => {
    const highlights = [];
    if ((vehicle.mileage || 0) < 40000)
      highlights.push({
        icon: <Car className="h-4 w-4" />,
        text: "Faible kilométrage",
      });
    if (vehicle.first_owner)
      highlights.push({
        icon: <Award className="h-4 w-4" />,
        text: "Première main",
      });
    if (vehicle.critair && vehicle.critair <= 2)
      highlights.push({
        icon: <Shield className="h-4 w-4" />,
        text: `Crit'Air ${vehicle.critair}`,
      });
    if (vehicle.energy === "Électrique")
      highlights.push({
        icon: <Zap className="h-4 w-4" />,
        text: "Véhicule électrique",
      });
    return highlights;
  };

  const whatsappUrl = `https://api.whatsapp.com/send?phone=+33767793106&text=Bonjour, je suis intéressé(e) par le véhicule ${vehicle.title} (Ref: ${vehicle.slug})`;
  const instagramUrl = "https://instagram.com/lease_auto";

  return (
    <>
      <Helmet>
        <title>{vehicle.title} - Lease Auto</title>
        <meta
          name="description"
          content={`${vehicle.title} - ${vehicle.price?.toLocaleString()}€ - ${vehicle.mileage?.toLocaleString()} km - ${vehicle.energy} - ${vehicle.gearbox}`}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Vehicle",
            name: vehicle.title,
            brand: vehicle.brand,
            model: vehicle.model,
            vehicleModelDate: vehicle.year,
            mileageFromOdometer: vehicle.mileage,
            fuelType: vehicle.energy,
            vehicleTransmission: vehicle.gearbox,
            offers: {
              "@type": "Offer",
              price: vehicle.price,
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-gray-900">
                Accueil
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/vehicules" className="hover:text-gray-900">
                Véhicules d'occasion
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900">{vehicle.brand}</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900">{vehicle.model}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/vehicules")}
            className="mb-6 -ml-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux annonces
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and basic info */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <BrandLogo brand={vehicle.brand || ""} />
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {vehicle.title}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {vehicle.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    {vehicle.mileage?.toLocaleString()} km
                  </span>
                  <span className="flex items-center gap-1">
                    <Fuel className="h-4 w-4" />
                    {vehicle.energy}
                  </span>
                  <span className="flex items-center gap-1">
                    <Settings className="h-4 w-4" />
                    {vehicle.gearbox}
                  </span>
                  {vehicle.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {vehicle.city}
                    </span>
                  )}
                </div>
              </div>

              {/* Photo carousel */}
              <Card>
                <CardContent className="p-0">
                  <PhotoCarousel imgs={vehicle.images || []} />
                </CardContent>
              </Card>

              {/* Highlights */}
              {getHighlights().length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Points forts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {getHighlights().map((highlight, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-green-50 rounded-lg"
                        >
                          <div className="text-green-600">{highlight.icon}</div>
                          <span className="text-sm font-medium text-green-800">
                            {highlight.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Characteristics */}
              <Card>
                <CardHeader>
                  <CardTitle>Caractéristiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Année</span>
                        <span className="font-medium">{vehicle.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kilométrage</span>
                        <span className="font-medium">
                          {vehicle.mileage?.toLocaleString()} km
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Boîte</span>
                        <span className="font-medium">{vehicle.gearbox}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Énergie</span>
                        <span className="font-medium">{vehicle.energy}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {vehicle.doors && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Portes</span>
                          <span className="font-medium">{vehicle.doors}</span>
                        </div>
                      )}
                      {vehicle.power_din && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Puissance DIN</span>
                          <span className="font-medium">
                            {vehicle.power_din} ch
                          </span>
                        </div>
                      )}
                      {vehicle.power_fiscal && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Puissance fiscale
                          </span>
                          <span className="font-medium">
                            {vehicle.power_fiscal} CV
                          </span>
                        </div>
                      )}
                      {vehicle.consumption_mixed && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Conso. mixte</span>
                          <span className="font-medium">
                            {vehicle.consumption_mixed} L/100km
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full mt-4">
                        Voir toutes les caractéristiques
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Caractéristiques complètes</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold">Général</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Marque</span>
                              <span>{vehicle.brand}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Modèle</span>
                              <span>{vehicle.model}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Année</span>
                              <span>{vehicle.year}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Couleur</span>
                              <span>{vehicle.color || "Non spécifiée"}</span>
                            </div>
                          </div>
                        </div>

                        {vehicle.dimensions && (
                          <div className="space-y-3">
                            <h4 className="font-semibold">Dimensions</h4>
                            <div className="space-y-2 text-sm">
                              {Object.entries(vehicle.dimensions).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex justify-between"
                                  >
                                    <span className="text-gray-600 capitalize">
                                      {key}
                                    </span>
                                    <span>{value}</span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {vehicle.weight && (
                          <div className="space-y-3">
                            <h4 className="font-semibold">Poids</h4>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                Poids à vide
                              </span>
                              <span>{vehicle.weight} kg</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </CardContent>
              </Card>

              {/* Equipment */}
              {vehicle.options && vehicle.options.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Équipements & Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                      {vehicle.options.slice(0, 6).map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{option}</span>
                        </div>
                      ))}
                    </div>

                    {vehicle.options.length > 6 && (
                      <Accordion type="single" collapsible>
                        <AccordionItem value="all-equipment">
                          <AccordionTrigger>
                            Voir tout ({vehicle.options.length})
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {vehicle.options.slice(6).map((option, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-sm">{option}</span>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              {vehicle.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {vehicle.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Budget simulator */}
              <Card>
                <CardHeader>
                  <CardTitle>Simulateur de financement</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="monthly">Mensualité</TabsTrigger>
                      <TabsTrigger value="cash">Comptant</TabsTrigger>
                    </TabsList>

                    <TabsContent value="monthly" className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <Label>
                            Apport: {downPayment[0].toLocaleString()}€
                          </Label>
                          <Slider
                            value={downPayment}
                            onValueChange={setDownPayment}
                            max={vehicle.price || 0}
                            step={1000}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label>Durée: {loanDuration[0]} mois</Label>
                          <Slider
                            value={loanDuration}
                            onValueChange={setLoanDuration}
                            min={36}
                            max={84}
                            step={12}
                            className="mt-2"
                          />
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {monthlyPayment.toLocaleString("fr-FR", {
                                maximumFractionDigits: 0,
                              })}
                              €/mois
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Taux: 6% • Durée: {loanDuration[0]} mois
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="cash">
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {vehicle.price?.toLocaleString()}€
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Prix comptant
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Price and CTA */}
            <div className="lg:sticky lg:top-24 space-y-4 h-fit">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {vehicle.price?.toLocaleString()}€
                    </div>
                    {vehicle.monthly && (
                      <div className="text-lg text-gray-600">
                        {Math.round(vehicle.monthly).toLocaleString()}€/mois
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Dialog
                      open={showLeadDialog}
                      onOpenChange={setShowLeadDialog}
                    >
                      <DialogTrigger asChild>
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                          Demander une offre
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Demande d'offre</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleLeadSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Nom complet *</Label>
                            <Input
                              id="name"
                              value={leadForm.name}
                              onChange={(e) =>
                                setLeadForm((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={leadForm.email}
                              onChange={(e) =>
                                setLeadForm((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Téléphone *</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={leadForm.phone}
                              onChange={(e) =>
                                setLeadForm((prev) => ({
                                  ...prev,
                                  phone: e.target.value,
                                }))
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                              id="message"
                              value={leadForm.message}
                              onChange={(e) =>
                                setLeadForm((prev) => ({
                                  ...prev,
                                  message: e.target.value,
                                }))
                              }
                              placeholder="Votre message..."
                              rows={3}
                            />
                          </div>
                          <Button
                            type="submit"
                            disabled={isSubmittingLead}
                            className="w-full"
                          >
                            {isSubmittingLead
                              ? "Envoi..."
                              : "Envoyer la demande"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(whatsappUrl, "_blank")}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(instagramUrl, "_blank")}
                    >
                      <Instagram className="mr-2 h-4 w-4" />
                      Instagram
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Seller info */}
              <Card>
                <CardHeader>
                  <CardTitle>Vendeur</CardTitle>
                </CardHeader>
                <CardContent>
                  {vehicle.seller_type === "pro" ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">LA</span>
                        </div>
                        <div>
                          <div className="font-semibold">Lease Auto</div>
                          <div className="text-sm text-gray-600">
                            Professionnel
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>Épinay-sur-Seine, 93800</span>
                        </div>
                        <div className="text-gray-600">
                          Lun-Ven: 9h-18h • Sam: 9h-17h
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="mr-2 h-4 w-4" />
                          Appeler
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <span className="text-gray-500 text-xl">👤</span>
                      </div>
                      <div className="font-semibold mb-1">Particulier</div>
                      <div className="text-sm text-gray-600 mb-4">
                        Vendeur privé
                      </div>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Contacter
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleDetailPage;
