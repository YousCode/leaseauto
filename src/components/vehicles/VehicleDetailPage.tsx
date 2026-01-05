import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Calendar,
  Download,
  Gauge,
  MapPin,
  MoveRight,
  Shield,
  Zap,
} from "lucide-react";

import HeaderSection from "@/components/sections/HeaderSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LazyImage from "@/components/ui/LazyImage";
import WhatsAppShare from "@/components/ui/WhatsAppShare";
import { useVehicleBySlug } from "@/hooks/useVehicleBySlug";
import { BrandLogo } from "@/lib/BrandLogo";

type VehicleProps = {
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
  power?: string | number;
  city?: string;
  status?: string;
  description?: string;
  options?: string[];
  equipment?: string[];
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1600&q=80",
];

const FALLBACK_VEHICLE: VehicleProps = {
  id: "1",
  title: "Ferrari 812 Superfast",
  brand: "Ferrari",
  model: "812 Superfast",
  version: "V12 · 800 ch",
  year: 2023,
  price: 388000,
  monthly: 24131,
  mileage: 7290,
  energy: "Essence",
  gearbox: "Automatique",
  power: "800",
  city: "Paris / Livraison France",
  status: "Disponible",
  description:
    "Supercar V12 emblématique, historique limpide, prête pour une livraison rapide. Dossier finance piloté, couverture garantie premium.",
  images: FALLBACK_IMAGES,
  options: [
    "Carnet et factures Ferrari",
    "Pack carbone extérieur",
    "Système Hi-Fi JBL",
    "Caméra 360°",
    "Sellerie Daytona",
  ],
  equipment: [
    "Historique limpide, aucun sinistre",
    "Contrôle technique OK",
    "Garantie 12 mois premium",
    "Livraison partout en France",
  ],
};

const formatNumber = (value?: number | string) => {
  if (value === undefined || value === null) return "";
  const num = Number(value);
  return Number.isFinite(num) ? num.toLocaleString("fr-FR") : String(value);
};

const VehicleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: vehicleData, isLoading } = useVehicleBySlug(slug || "");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const displayVehicle: VehicleProps = useMemo(() => {
    const remote = vehicleData as Record<string, any> | null;
    if (!remote) return FALLBACK_VEHICLE;
    return {
      ...FALLBACK_VEHICLE,
      ...remote,
      images:
        (Array.isArray(remote.images) && remote.images.length > 0
          ? remote.images
          : FALLBACK_IMAGES) ?? FALLBACK_IMAGES,
    };
  }, [vehicleData]);

  useEffect(() => {
    setActiveIndex(0);
  }, [displayVehicle.images]);

  const images = displayVehicle.images ?? FALLBACK_IMAGES;

  const monthlyLabel = displayVehicle.monthly
    ? `${formatNumber(displayVehicle.monthly)} €/mois`
    : "Loyer sur mesure";
  const priceLabel = displayVehicle.price
    ? `${formatNumber(displayVehicle.price)} €`
    : "Prix sur demande";

  const goBack = () => navigate("/vehicules");

  return (
    <>
      <Helmet>
        <title>{displayVehicle.title} — Lease Auto</title>
        <meta
          name="description"
          content={`${displayVehicle.brand} ${displayVehicle.model} ${displayVehicle.year} · ${displayVehicle.mileage ?? ""} km`}
        />
      </Helmet>

      <HeaderSection />

      <main className="bg-slate-950 text-white min-h-screen">
        {/* Hero overlay */}
        <section className="relative h-[78vh] w-full overflow-hidden">
          <LazyImage
            src={images[activeIndex] || FALLBACK_IMAGES[0]}
            alt={displayVehicle.title || "Véhicule"}
            className="absolute inset-0 h-full w-full object-cover"
            containerClassName="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-black/80" />

          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-between px-6 py-6">
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={goBack}
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/15 text-white border border-white/20">
                  {displayVehicle.status || "Disponible"}
                </Badge>
                <Badge className="bg-white/10 text-white border border-white/15">
                  Livraison rapide
                </Badge>
              </div>
            </div>

            <div className="space-y-4 pb-6">
              <div className="flex items-center gap-3">
                <BrandLogo brand={displayVehicle.brand} size={42} />
                <div className="text-left">
                  <p className="text-sm uppercase tracking-[0.22em] text-white/60">
                    {displayVehicle.brand}
                  </p>
                  <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                    {displayVehicle.model} <span className="text-white/80">{displayVehicle.version}</span>
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-white/80">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5">
                  <Calendar size={14} /> {displayVehicle.year ?? "Année"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5">
                  <Gauge size={14} /> {formatNumber(displayVehicle.mileage)} km
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5">
                  <Zap size={14} /> {displayVehicle.energy ?? "Motorisation"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5">
                  <MapPin size={14} /> {displayVehicle.city ?? "France entière"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-2xl bg-white/10 px-5 py-4 border border-white/15 shadow-lg">
                  <p className="text-xs uppercase tracking-wide text-white/60">
                    À partir de
                  </p>
                  <p className="text-3xl font-semibold">{monthlyLabel}</p>
                  <p className="text-sm text-white/70">{priceLabel}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-full px-6 h-12 bg-[#CCFF00] text-black hover:brightness-110">
                    Réserver maintenant
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full h-12 border-white/40 text-white hover:bg-white/10"
                    onClick={() => setLightboxOpen(true)}
                  >
                    Voir la galerie
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full h-12 border-white/40 text-white hover:bg-white/10"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger la fiche
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="relative -mt-10 bg-white text-slate-900 rounded-t-[28px]">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 lg:flex-row">
            {/* Left column */}
            <div className="flex-1 space-y-8">
              {/* Gallery */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="relative overflow-hidden rounded-2xl">
                  <LazyImage
                    src={images[activeIndex] || FALLBACK_IMAGES[0]}
                    alt={`${displayVehicle.title} - ${activeIndex + 1}`}
                    className="h-[440px] w-full object-cover"
                  />
                  {images.length > 1 ? (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveIndex(idx)}
                          className={`h-2 w-8 rounded-full transition ${
                            idx === activeIndex ? "bg-white" : "bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
                {images.length > 1 ? (
                  <div className="flex gap-2 overflow-x-auto px-4 py-3">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg border transition ${
                          idx === activeIndex
                            ? "border-slate-900"
                            : "border-slate-200 hover:border-slate-400"
                        }`}
                      >
                        <LazyImage
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Description */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                  <Shield className="h-4 w-4" />
                  Fiche certifiée Lease Auto
                </div>
                <p className="text-lg font-semibold text-slate-900 mb-2">
                  Pourquoi ce modèle ?
                </p>
                <p className="text-slate-700 leading-relaxed">
                  {displayVehicle.description ||
                    "Configuration premium préparée, dossier financier piloté, livraison rapide partout en France. Garantie et historique vérifiés."}
                </p>
              </div>

              {/* Equipements */}
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-3">Équipements clés</h3>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    {(displayVehicle.equipment ?? FALLBACK_VEHICLE.equipment)?.map(
                      (item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-slate-900" />
                          {item}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-3">Options remarquables</h3>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    {(displayVehicle.options ?? FALLBACK_VEHICLE.options)?.map(
                      (item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-slate-900" />
                          {item}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right column */}
            <aside className="w-full max-w-[360px] space-y-6 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <p className="text-sm uppercase tracking-[0.14em] text-slate-500">
                  Offre leasing
                </p>
                <p className="text-3xl font-semibold text-slate-900 mt-2">
                  {monthlyLabel}
                </p>
                <p className="text-sm text-slate-600">{priceLabel} · livraison rapide</p>
                <div className="mt-4 flex flex-col gap-3">
                  <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                    Réserver un rendez-vous
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-slate-300 text-slate-900 hover:bg-slate-50"
                  >
                    Calculer mon financement
                  </Button>
                  <WhatsAppShare
                    title={`Je suis intéressé par ${displayVehicle.title} (${monthlyLabel}).`}
                    url={window.location.href}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <h3 className="text-base font-semibold text-slate-900">
                  Détails clés
                </h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Année</span>
                    <span className="font-semibold">{displayVehicle.year}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Kilométrage</span>
                    <span className="font-semibold">
                      {formatNumber(displayVehicle.mileage)} km
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Motorisation</span>
                    <span className="font-semibold">{displayVehicle.energy}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Puissance</span>
                    <span className="font-semibold">
                      {displayVehicle.power ? `${displayVehicle.power} ch` : "À préciser"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Boîte</span>
                    <span className="font-semibold">
                      {displayVehicle.gearbox ?? "Automatique"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900 mb-3">
                  Livraison & garanties
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-slate-900" />
                    Garantie 12 mois incluse
                  </li>
                  <li className="flex items-center gap-2">
                    <MoveRight className="h-4 w-4 text-slate-900" />
                    Dossier financé en 48h
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-900" />
                    Livraison France métropolitaine
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-6xl bg-black p-0">
          <div className="relative">
            <LazyImage
              src={images[activeIndex] || FALLBACK_IMAGES[0]}
              alt="Aperçu véhicule"
              className="w-full h-full max-h-[90vh] object-contain bg-black"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VehicleDetailPage;
