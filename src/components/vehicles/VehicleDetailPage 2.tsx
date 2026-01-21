import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Download,
  Gauge,
  MapPin,
  MoveRight,
  Shield,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LazyImage from "@/components/ui/LazyImage";
import WhatsAppShare from "@/components/ui/WhatsAppShare";
import { useVehicleBySlug } from "@/hooks/useVehicleBySlug";
import { BrandLogo } from "@/lib/BrandLogo";

const ACCENT = "#DA1212";
const ACCENT_DARK = "#0b0d12";

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
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=80",
];

const FALLBACK_VEHICLE: VehicleProps = {
  id: "1",
  title: "Peugeot 5008",
  brand: "Peugeot",
  model: "5008",
  version: "Allure",
  year: 2022,
  price: 19990,
  monthly: 386,
  mileage: 45000,
  energy: "Essence",
  gearbox: "Automatique",
  power: "130",
  city: "France / Livraison",
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
  const [financeDuration, setFinanceDuration] = useState(48);
  const [firstPayment, setFirstPayment] = useState<number | null>(null);
  const [isLOA, setIsLOA] = useState(false);

  const displayVehicle: VehicleProps | null = useMemo(() => {
    const remote = vehicleData as Record<string, any> | null;
    if (!remote) return null;
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
    if (displayVehicle?.images && activeIndex >= displayVehicle.images.length) {
      setActiveIndex(0);
    }
  }, [displayVehicle?.images, activeIndex]);

  const images = Array.isArray(displayVehicle?.images) && (displayVehicle?.images?.length ?? 0) > 0
    ? (displayVehicle?.images as string[])
    : FALLBACK_IMAGES;

  const priceLabel = displayVehicle?.price
    ? `${formatNumber(displayVehicle.price)} €`
    : "Prix sur demande";
  const monthlyLabel = displayVehicle?.monthly
    ? `${formatNumber(displayVehicle.monthly)} €/mois`
    : "Loyer sur mesure";
  const specPills = [
    { icon: Calendar, label: displayVehicle?.year ? String(displayVehicle.year) : "Année" },
    { icon: Gauge, label: displayVehicle?.mileage ? `${formatNumber(displayVehicle.mileage)} km` : "Kilométrage" },
    { icon: Zap, label: displayVehicle?.energy ?? "Motorisation" },
    { icon: MapPin, label: displayVehicle?.city ?? "France entière" },
  ];

  const goBack = () => navigate("/vehicules");

  const simulated = useMemo(() => {
    const priceNumber =
      typeof displayVehicle?.price === "number"
        ? displayVehicle.price
        : displayVehicle?.price
          ? Number(String(displayVehicle.price).replace(/[^\d]/g, ""))
          : null;

    const baseMonthly =
      (priceNumber && priceNumber > 0
        ? Math.max(99, priceNumber / Math.max(12, financeDuration))
        : null) ??
      (displayVehicle?.monthly as number | undefined) ??
      null;
    if (baseMonthly === null) {
      return { value: null, label: "Sur mesure" };
    }
    const upfrontImpact =
      firstPayment && firstPayment > 0 ? -firstPayment / Math.max(6, financeDuration) : 0;
    const value = baseMonthly + upfrontImpact;
    if (!Number.isFinite(value) || value <= 0) return { value: null, label: "Sur mesure" };
    const rounded = Math.max(99, Math.round(value));
    return { value: rounded, label: `${rounded.toLocaleString("fr-FR")} €/mois` };
  }, [displayVehicle?.monthly, displayVehicle?.price, financeDuration, firstPayment]);

  return (
    <>
      <Helmet>
        <title>{displayVehicle ? `${displayVehicle.title ?? displayVehicle.model}` : "Véhicule"} — Lease Auto</title>
        <meta
          name="description"
          content={`${displayVehicle?.brand ?? ""} ${displayVehicle?.model ?? ""} ${displayVehicle?.year ?? ""} · ${displayVehicle?.mileage ?? ""} km`}
        />
      </Helmet>

      {isLoading ? (
        <main className="bg-[#f7f9fb] text-slate-900 min-h-screen pt-10">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-sm text-slate-500">Chargement du véhicule…</p>
          </div>
        </main>
      ) : !displayVehicle ? (
        <main className="bg-[#f7f9fb] text-slate-900 min-h-screen pt-10">
          <div className="mx-auto max-w-6xl px-4 space-y-4">
            <p className="text-lg font-semibold text-slate-800">Véhicule introuvable</p>
            <p className="text-sm text-slate-600">
              Le véhicule n&apos;est plus disponible ou le lien est incorrect.
            </p>
            <Button onClick={goBack} className="bg-[#0f4b5f] text-white hover:bg-[#0d4051] w-fit">
              Retour aux véhicules
            </Button>
          </div>
        </main>
      ) : (
        <main className="bg-[#f7f9fb] text-slate-900 min-h-screen pt-4 pb-10">
          <section className="mx-auto max-w-6xl px-4 md:px-6 py-4 md:py-6 space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Button
                variant="ghost"
                onClick={goBack}
                className="w-fit text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux véhicules
              </Button>
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-slate-500">
                <span>Accueil</span>
                <span>›</span>
                <span>Véhicules</span>
                <span>›</span>
                <span className="font-semibold text-slate-800">{displayVehicle.model}</span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Gallery */}
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <LazyImage
                    src={images[activeIndex] || FALLBACK_IMAGES[0]}
                    alt={displayVehicle.title || "Véhicule"}
                    className="h-[240px] sm:h-[360px] md:h-[480px] lg:h-[540px] w-full object-cover object-center"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-slate-800 shadow hover:bg-white"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-slate-800 shadow hover:bg-white"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`h-24 w-36 flex-shrink-0 overflow-hidden rounded-xl border transition ${
                        idx === activeIndex
                          ? "border-[#DA1212] ring-2 ring-[#DA1212]"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <LazyImage src={img} alt={`Thumb ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                  {images.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="h-24 w-20 flex-shrink-0 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-slate-400"
                    >
                      +{images.length - 4}
                    </button>
                  )}
                </div>

              <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5" style={{ color: ACCENT }} />
                  <div>
                    <p className="font-semibold">Garantie 12 mois</p>
                    <p className="text-xs text-slate-500">Roulez tranquille</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5" style={{ color: ACCENT }} />
                  <div>
                    <p className="font-semibold">Véhicule expertisé</p>
                    <p className="text-xs text-slate-500">Contrôles complets</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5" style={{ color: ACCENT }} />
                  <div>
                    <p className="font-semibold">Prépa esthétique</p>
                    <p className="text-xs text-slate-500">Finition showroom</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financing card */}
            <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Prix TTC</p>
                  <h1
                    className="text-3xl font-semibold leading-tight"
                    style={{ color: ACCENT }}
                  >
                    {priceLabel}
                  </h1>
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm text-slate-600">Mensualité estimée</p>
                    <p className="text-xl font-semibold" style={{ color: ACCENT_DARK }}>
                      {simulated.value !== null ? simulated.label : monthlyLabel}
                    </p>
                  </div>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <MapPin size={14} />
                    Livrable rapidement
                  </p>
                </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-slate-200 px-3 py-2 text-center">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Kilométrage</p>
                  <p className="text-base font-semibold">
                    {displayVehicle.mileage ? `${formatNumber(displayVehicle.mileage)} km` : "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 px-3 py-2 text-center">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Puissance</p>
                  <p className="text-base font-semibold">
                    {displayVehicle.power ? `${displayVehicle.power} ch` : "—"}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 px-3 py-2 text-center">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Année</p>
                  <p className="text-base font-semibold">{displayVehicle.year ?? "—"}</p>
                </div>
              </div>

              <div className="flex gap-2 rounded-lg border border-slate-200 p-1">
                <Button
                  className={`flex-1 h-10 rounded-md ${
                    !isLOA
                      ? "bg-[#DA1212] text-white hover:bg-[#b80f0f]"
                      : "bg-white text-slate-800 hover:bg-slate-100"
                  }`}
                  onClick={() => setIsLOA(false)}
                >
                  LLD
                </Button>
                <Button
                  className={`flex-1 h-10 rounded-md ${
                    isLOA
                      ? "bg-[#DA1212] text-white hover:bg-[#b80f0f]"
                      : "bg-white text-slate-800 hover:bg-slate-100"
                  }`}
                  variant="outline"
                  onClick={() => setIsLOA(true)}
                >
                  LOA
                </Button>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Durée de financement</span>
                  <span className="font-semibold">{financeDuration} mois</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={24}
                    max={72}
                    step={6}
                    value={financeDuration}
                    onChange={(e) => setFinanceDuration(Number(e.target.value))}
                    className="w-full accent-[#DA1212]"
                  />
                  <input
                    type="number"
                    min={24}
                    max={72}
                    step={6}
                    value={financeDuration}
                    onChange={(e) =>
                      setFinanceDuration(
                        Math.min(72, Math.max(24, Number(e.target.value) || 24)),
                      )
                    }
                    className="w-16 rounded-md border border-slate-200 px-2 py-1 text-right text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Première mensualité</span>
                  <input
                    type="number"
                    value={firstPayment ?? ""}
                    onChange={(e) => setFirstPayment(e.target.value ? Number(e.target.value) : null)}
                    className="w-28 rounded-md border border-slate-200 px-2 py-1 text-right text-sm"
                    placeholder="0 €"
                  />
                </div>
              </div>

              <div className="rounded-xl text-white p-4 space-y-2" style={{ backgroundColor: ACCENT_DARK }}>
                <p className="text-xs uppercase tracking-wide text-white/80">Votre mensualité</p>
                <p className="text-2xl font-bold">
                  {simulated.value !== null ? simulated.label : monthlyLabel}
                </p>
                <Button className="w-full h-11 rounded-md bg-[#DA1212] text-white hover:bg-[#b80f0f]">
                  Calculez votre mensualité
                </Button>
              </div>
            </aside>
          </div>

          {/* Description & options */}
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] mt-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Shield className="h-4 w-4" />
                Fiche certifiée Lease Auto
              </div>
              <p className="text-xl font-semibold text-slate-900">
                {displayVehicle.title || `${displayVehicle.brand} ${displayVehicle.model}`}
              </p>
              <p className="text-slate-700 leading-relaxed">
                {displayVehicle.description ||
                  "Configuration premium préparée, dossier financier piloté, livraison rapide partout en France. Garantie et historique vérifiés."}
              </p>
            </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Livraison & garanties</h3>
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
          </div>
        </section>
      </main>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-6xl bg-black p-0 overflow-hidden">
          <div className="relative bg-black">
            <LazyImage
              src={images[activeIndex] || FALLBACK_IMAGES[0]}
              alt={`Aperçu véhicule ${activeIndex + 1}/${images.length}`}
              className="w-full h-full max-h-[80vh] object-contain bg-black"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 px-3 py-2 text-lg font-semibold text-white hover:bg-white/30"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 px-3 py-2 text-lg font-semibold text-white hover:bg-white/30"
                >
                  ›
                </button>
              </>
            )}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 w-2 rounded-full transition ${
                    idx === activeIndex ? "bg-white" : "bg-white/40"
                  }`}
                  aria-label={`Aller à l'image ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VehicleDetailPage;
