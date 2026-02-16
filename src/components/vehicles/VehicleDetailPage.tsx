import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AlertTriangle, ArrowLeft, Calendar, CheckCircle, Circle, Gauge, MapPin, MoveRight, Shield, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LazyImage from "@/components/ui/LazyImage";
import { useVehicleBySlug } from "@/hooks/useVehicleBySlug";
import { BrandLogo } from "@/lib/BrandLogo";

const ACCENT = "#DA1212";
const ACCENT_DARK = "#0b0d12";
const DEFAULT_FINANCE_DURATION_MONTHS = 60;

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
    "Configuration premium préparée, dossier financier piloté, livraison rapide partout en France. Garantie et historique vérifiés.",
  images: FALLBACK_IMAGES,
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

  const [financeDuration, setFinanceDuration] = useState(DEFAULT_FINANCE_DURATION_MONTHS);
  const [firstPayment, setFirstPayment] = useState<number | null>(null);
  const [isLOA, setIsLOA] = useState(false);

  const [descOpen, setDescOpen] = useState(false);

  const displayVehicle: VehicleProps | null = useMemo(() => {
    const remote = vehicleData as Record<string, any> | null;
    if (!remote) return null;
    return {
      ...FALLBACK_VEHICLE,
      ...remote,
      images:
        (Array.isArray(remote.images) && remote.images.length > 0 ? remote.images : FALLBACK_IMAGES) ??
        FALLBACK_IMAGES,
    };
  }, [vehicleData]);

  useEffect(() => {
    if (displayVehicle?.images && activeIndex >= displayVehicle.images.length) {
      setActiveIndex(0);
    }
  }, [displayVehicle?.images, activeIndex]);

  const sanitizedImages =
    Array.isArray(displayVehicle?.images) && (displayVehicle?.images?.length ?? 0) > 0
      ? (displayVehicle?.images as string[]).filter((img) => typeof img === "string" && img.trim().length > 0)
      : [];

  const images = sanitizedImages.length > 0 ? sanitizedImages : FALLBACK_IMAGES;

  const priceLabel = displayVehicle?.price ? `${formatNumber(displayVehicle.price)} €` : "Prix sur demande";
  const monthlyLabel = displayVehicle?.monthly ? `${formatNumber(displayVehicle.monthly)} €/mois` : "Loyer sur mesure";

  const optionsList =
    Array.isArray(displayVehicle?.options) && displayVehicle.options.length > 0
      ? displayVehicle.options.filter((opt) => typeof opt === "string" && opt.trim().length > 0)
      : [];

  const equipmentList =
    Array.isArray(displayVehicle?.equipment) && displayVehicle.equipment.length > 0
      ? displayVehicle.equipment.filter((opt) => typeof opt === "string" && opt.trim().length > 0)
      : [];

  const specPills = [
    { icon: Gauge, label: displayVehicle?.mileage ? `${formatNumber(displayVehicle.mileage)} km` : "Kilométrage" },
    { icon: Zap, label: displayVehicle?.energy ?? "Motorisation" },
    { icon: Calendar, label: displayVehicle?.year ? String(displayVehicle.year) : "Année" },
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

    if (baseMonthly === null) return { value: null, label: "Sur mesure" };

    const upfrontImpact =
      firstPayment && firstPayment > 0 ? -firstPayment / Math.max(6, financeDuration) : 0;
    const value = baseMonthly + upfrontImpact;

    if (!Number.isFinite(value) || value <= 0) return { value: null, label: "Sur mesure" };

    const rounded = Math.max(99, Math.round(value));
    return { value: rounded, label: `${rounded.toLocaleString("fr-FR")} €/mois` };
  }, [displayVehicle?.monthly, displayVehicle?.price, financeDuration, firstPayment]);

  const descriptionFull =
    displayVehicle?.description ||
    "Configuration premium préparée, dossier financier piloté, livraison rapide partout en France. Garantie et historique vérifiés.";
  const descriptionShort =
    descriptionFull.length > 220 ? descriptionFull.slice(0, 220).trim() + "…" : descriptionFull;
  const descriptionItems = useMemo(() => {
    if (!descriptionFull) return [];
    return descriptionFull
      .split(/(?:(?<=\.)\s+)|(?:\s*·\s*)|(?:\s+-\s+)|(?:\s*;\s*)|(?:\s*:\s+(?=[A-Z0-9]))/)
      .map((t) => t.trim())
      .filter((t) => t.length > 6 && t.length < 300);
  }, [descriptionFull]);

  const pickIcon = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("prix") || lower.includes("€") || lower.includes("mois")) {
      return { Icon: CheckCircle, className: "text-[#DA1212]" };
    }
    if (lower.includes("crédit") || lower.includes("remboursement") || lower.includes("vérifiez")) {
      return { Icon: AlertTriangle, className: "text-amber-500" };
    }
    return { Icon: Circle, className: "text-slate-400" };
  };

  return (
    <>
      <Helmet>
        <title>{displayVehicle ? `${displayVehicle.title ?? displayVehicle.model}` : "Véhicule"} — Lease Auto</title>
        <meta
          name="description"
          content={`${displayVehicle?.brand ?? ""} ${displayVehicle?.model ?? ""} ${displayVehicle?.year ?? ""} · ${
            displayVehicle?.mileage ?? ""
          } km`}
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
            <p className="text-sm text-slate-600">Le véhicule n&apos;est plus disponible ou le lien est incorrect.</p>
            <Button onClick={goBack} className="bg-[#0f4b5f] text-white hover:bg-[#0d4051] w-fit">
              Retour aux véhicules
            </Button>
          </div>
        </main>
      ) : (
        <main className="bg-[#f7f9fb] text-slate-900 min-h-screen pt-2 pb-36 md:pb-12">
          <section className="hidden md:block mx-auto w-full max-w-6xl px-6 py-6 space-y-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
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

            <div className="grid gap-4 md:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              {/* =======================
                  GALLERY (FIXED)
                  ======================= */}
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm aspect-[4/3] sm:aspect-auto sm:h-[360px] md:h-[480px] lg:h-[520px] max-h-[60vh]">
                  {/* tap opens lightbox */}
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="absolute inset-0 z-[2]"
                    aria-label="Ouvrir la galerie"
                  />

                  {/* IMPORTANT: contain on mobile, cover on desktop */}
                  <img
                    src={images[activeIndex] || FALLBACK_IMAGES[0]}
                    alt={displayVehicle.title || "Véhicule"}
                    className="absolute inset-0 h-full w-full object-contain md:object-cover object-center bg-black"
                    loading={activeIndex === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />

                  {/* Counter */}
                  <div className="absolute right-3 top-3 z-[3] rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                    {activeIndex + 1} / {images.length}
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
                        }}
                        className="absolute left-3 top-1/2 z-[3] -translate-y-1/2 rounded-full bg-white/85 p-3 text-sm font-semibold text-slate-800 shadow hover:bg-white active:scale-95"
                        aria-label="Image précédente"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex((prev) => (prev + 1) % images.length);
                        }}
                        className="absolute right-3 top-1/2 z-[3] -translate-y-1/2 rounded-full bg-white/85 p-3 text-sm font-semibold text-slate-800 shadow hover:bg-white active:scale-95"
                        aria-label="Image suivante"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbs mobile (snap + bigger + valid Tailwind heights) */}
                <div className="flex gap-3 overflow-x-auto pb-3 md:hidden snap-x snap-mandatory">
                  <div className="w-2" aria-hidden />
                  {images.slice(0, 10).map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`h-24 w-36 flex-shrink-0 overflow-hidden rounded-xl border transition snap-center ${
                        idx === activeIndex
                          ? "border-[#DA1212] ring-2 ring-[#DA1212]"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                      aria-label={`Voir la photo ${idx + 1}`}
                    >
                      <LazyImage src={img} alt={`Thumb ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                  {images.length > 10 && (
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="h-24 w-24 flex-shrink-0 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 hover:border-slate-400"
                      aria-label="Voir toutes les photos"
                    >
                      +{images.length - 10}
                    </button>
                  )}
                  <div className="w-2" aria-hidden />
                </div>

                {/* Thumbs desktop */}
                <div className="hidden md:grid grid-cols-4 gap-2">
                  {images.slice(0, 8).map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`h-24 overflow-hidden rounded-xl border transition ${
                        idx === activeIndex
                          ? "border-[#DA1212] ring-2 ring-[#DA1212]"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <LazyImage src={img} alt={`Thumb ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                  {images.length > 8 && (
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="h-24 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:border-slate-400"
                    >
                      Voir tout
                    </button>
                  )}
                </div>

                {/* Trust pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
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

              {/* =======================
                  FINANCE CARD (yours)
                  ======================= */}
              <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 md:p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Prix TTC</p>
                  <h1 className="text-3xl font-semibold leading-tight" style={{ color: ACCENT }}>
                    {priceLabel}
                  </h1>
                  <div className="flex flex-wrap items-baseline gap-2">
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

                <div className="flex flex-col sm:flex-row gap-2 rounded-lg border border-slate-200 p-1">
                  <Button
                    className={`flex-1 h-11 rounded-md ${
                      !isLOA ? "bg-[#DA1212] text-white hover:bg-[#b80f0f]" : "bg-white text-slate-800 hover:bg-slate-100"
                    }`}
                    onClick={() => setIsLOA(false)}
                  >
                    LLD
                  </Button>
                  <Button
                    className={`flex-1 h-11 rounded-md ${
                      isLOA ? "bg-[#DA1212] text-white hover:bg-[#b80f0f]" : "bg-white text-slate-800 hover:bg-slate-100"
                    }`}
                    variant="outline"
                    onClick={() => setIsLOA(true)}
                  >
                    LOA
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Durée de financement</span>
                    <span className="font-semibold">{financeDuration} mois</span>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      type="range"
                      min={24}
                      max={72}
                      step={6}
                      value={financeDuration}
                      onChange={(e) => setFinanceDuration(Number(e.target.value))}
                      className="w-full sm:flex-1 accent-[#DA1212]"
                    />
                    <input
                      type="number"
                      min={24}
                      max={72}
                      step={6}
                      value={financeDuration}
                      onChange={(e) =>
                        setFinanceDuration(Math.min(72, Math.max(24, Number(e.target.value) || DEFAULT_FINANCE_DURATION_MONTHS)))
                      }
                      className="w-full sm:w-16 rounded-md border border-slate-200 px-2 py-1 text-right text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                    <span>Première mensualité</span>
                    <input
                      type="number"
                      value={firstPayment ?? ""}
                      onChange={(e) => setFirstPayment(e.target.value ? Number(e.target.value) : null)}
                      className="w-full sm:w-32 rounded-md border border-slate-200 px-2 py-1 text-right text-sm"
                      placeholder="0 €"
                    />
                  </div>
                </div>

                <div className="rounded-xl text-white p-4 space-y-2" style={{ backgroundColor: ACCENT_DARK }}>
                  <p className="text-xs uppercase tracking-wide text-white/80">Votre mensualité</p>
                  <p className="text-2xl font-bold">{simulated.value !== null ? simulated.label : monthlyLabel}</p>
                  <Button className="w-full h-11 rounded-md bg-[#DA1212] text-white hover:bg-[#b80f0f]">
                    Calculez votre mensualité
                  </Button>
                </div>
              </aside>
            </div>

            {/* =======================
                DESCRIPTION (PRO)
                ======================= */}
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] mt-6" data-contact-anchor>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Shield className="h-4 w-4" />
                  Fiche certifiée Lease Auto
                </div>

                <p className="text-xl font-semibold text-slate-900">
                  {displayVehicle.title || `${displayVehicle.brand} ${displayVehicle.model}`}
                </p>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Présentation détaillée</p>
                    {descriptionFull.length > 220 && (
                      <button
                        type="button"
                        onClick={() => setDescOpen((v) => !v)}
                        className="text-xs font-semibold text-[#DA1212] md:hidden"
                      >
                        {descOpen ? "Réduire" : "Lire la suite"}
                      </button>
                    )}
                  </div>

                  {/* Description formatée */}
                  {descriptionItems.length >= 4 ? (
                    <div className="space-y-2">
                      <ul className="space-y-1.5 text-sm text-slate-700 leading-relaxed">
                        {(descOpen ? descriptionItems : descriptionItems.slice(0, 8)).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 text-[#DA1212]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      {descriptionItems.length > 8 && (
                        <button
                          type="button"
                          onClick={() => setDescOpen((v) => !v)}
                          className="text-xs font-semibold text-[#DA1212]"
                        >
                          {descOpen ? "Réduire" : `Voir les ${descriptionItems.length - 8} lignes suivantes`}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      <span className="md:hidden">{descOpen ? descriptionFull : descriptionShort}</span>
                      <span className="hidden md:inline">{descriptionFull}</span>
                    </p>
                  )}

                  {(optionsList.length > 0 || equipmentList.length > 0) && (
                    <div className="border-t border-slate-200 pt-4 grid gap-4 md:grid-cols-2">
                      {optionsList.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-wide text-slate-500">Points forts</p>
                          <ul className="space-y-1.5 text-sm text-slate-800">
                            {optionsList.slice(0, 6).map((opt, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: ACCENT }} />
                                <span>{opt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {equipmentList.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-wide text-slate-500">Équipements</p>
                          <ul className="space-y-1.5 text-sm text-slate-800">
                            {equipmentList.slice(0, 6).map((opt, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: ACCENT }} />
                                <span>{opt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Énergie</p>
                    <p className="text-sm font-semibold text-slate-900">{displayVehicle.energy ?? "—"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Boîte</p>
                    <p className="text-sm font-semibold text-slate-900">{displayVehicle.gearbox ?? "—"}</p>
                  </div>
                </div>
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

          {/* Mobile layout dedicated */}
          <section className="md:hidden mx-auto w-full max-w-6xl px-3 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={goBack}
                className="w-fit text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                <span>Accueil</span>
                <span>›</span>
                <span>Véhicules</span>
                <span>›</span>
                <span className="font-semibold text-slate-800">{displayVehicle.model}</span>
              </div>
            </div>

            {/* Hero mobile */}
            <div className="space-y-3">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm aspect-[4/3] max-h-[70vh]">
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="absolute inset-0 z-[2]"
                  aria-label="Ouvrir la galerie"
                />
                <img
                  src={images[activeIndex] || FALLBACK_IMAGES[0]}
                  alt={displayVehicle.title || "Véhicule"}
                  className="absolute inset-0 h-full w-full object-contain bg-black"
                  loading={activeIndex === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
                      }}
                      className="absolute left-3 top-1/2 z-[3] -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-slate-800 shadow"
                      aria-label="Image précédente"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex((prev) => (prev + 1) % images.length);
                      }}
                      className="absolute right-3 top-1/2 z-[3] -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-slate-800 shadow"
                      aria-label="Image suivante"
                    >
                      ›
                    </button>
                  </>
                )}
                <div className="absolute right-3 top-3 z-[3] rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white">
                  {activeIndex + 1} / {images.length}
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-3 snap-x snap-mandatory">
                <div className="w-2" aria-hidden />
                {images.slice(0, 8).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl border transition snap-center ${
                      idx === activeIndex
                        ? "border-[#DA1212] ring-2 ring-[#DA1212]"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                    aria-label={`Voir la photo ${idx + 1}`}
                  >
                    <LazyImage src={img} alt={`Thumb ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
                {images.length > 8 && (
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="h-20 w-16 flex-shrink-0 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-400"
                  >
                    +{images.length - 8}
                  </button>
                )}
                <div className="w-2" aria-hidden />
              </div>
            </div>

            {/* Title + price */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <BrandLogo brand={displayVehicle.brand} className="h-9 w-9 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-slate-500">
                    {displayVehicle.brand} · {displayVehicle.year ?? "—"}
                  </p>
                  <p className="text-lg font-semibold text-slate-900 leading-tight">
                    {displayVehicle.title || `${displayVehicle.brand} ${displayVehicle.model}`}
                  </p>
                  <p className="text-sm text-slate-600">{displayVehicle.city ?? "France / Livraison"}</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">Prix TTC</p>
                  <p className="text-2xl font-semibold text-[#DA1212]">{priceLabel}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">Mensualité estimée</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {simulated.value !== null ? simulated.label : monthlyLabel}
                  </p>
                </div>
                <p className="mt-1 text-xs text-slate-500 flex items-center gap-2">
                  <MapPin size={14} />
                  Livrable rapidement
                </p>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3">
              {specPills.map((pill, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white p-3 flex items-center gap-2">
                  <pill.icon className="h-4 w-4 text-slate-700" />
                  <p className="text-sm font-semibold text-slate-900 truncate">{pill.label}</p>
                </div>
              ))}
            </div>

            {/* Financing mobile */}
            <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-4">
              <div className="flex gap-2 rounded-lg border border-slate-200 p-1">
                <Button
                  className={`h-11 rounded-md flex-1 ${
                    !isLOA ? "bg-[#DA1212] text-white hover:bg-[#b80f0f]" : "bg-white text-slate-800 hover:bg-slate-100"
                  }`}
                  onClick={() => setIsLOA(false)}
                >
                  LLD
                </Button>
                <Button
                  className={`h-11 rounded-md flex-1 ${
                    isLOA ? "bg-[#DA1212] text-white hover:bg-[#b80f0f]" : "bg-white text-slate-800 hover:bg-slate-100"
                  }`}
                  variant="outline"
                  onClick={() => setIsLOA(true)}
                >
                  LOA
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Durée de financement</span>
                  <span className="font-semibold">{financeDuration} mois</span>
                </div>
                <div className="flex flex-col gap-3">
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
                      setFinanceDuration(Math.min(72, Math.max(24, Number(e.target.value) || DEFAULT_FINANCE_DURATION_MONTHS)))
                    }
                    className="w-full rounded-md border border-slate-200 px-2 py-1 text-right text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col gap-2 text-sm text-slate-600">
                  <span>Première mensualité</span>
                  <input
                    type="number"
                    value={firstPayment ?? ""}
                    onChange={(e) => setFirstPayment(e.target.value ? Number(e.target.value) : null)}
                    className="w-full rounded-md border border-slate-200 px-2 py-1 text-right text-sm"
                    placeholder="0 €"
                  />
                </div>
              </div>

              <div className="rounded-xl text-white p-4 space-y-2" style={{ backgroundColor: ACCENT_DARK }}>
                <p className="text-xs uppercase tracking-wide text-white/80">Votre mensualité</p>
                <p className="text-2xl font-bold">{simulated.value !== null ? simulated.label : monthlyLabel}</p>
                <Button className="w-full h-11 rounded-md bg-[#DA1212] text-white hover:bg-[#b80f0f]">
                  Calculez votre mensualité
                </Button>
              </div>
            </aside>

            {/* Guarantees */}
            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
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

            {/* Description & delivery */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3" data-contact-anchor>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Shield className="h-4 w-4" />
                Fiche certifiée Lease Auto
              </div>
              <p className="text-lg font-semibold text-slate-900">
                {displayVehicle.title || `${displayVehicle.brand} ${displayVehicle.model}`}
              </p>
              <div className="space-y-2">
                {descriptionItems.length >= 4 ? (
                  <div className="space-y-3">
                    <ul className="grid gap-2 text-sm text-slate-700 leading-relaxed md:grid-cols-2">
                      {(descOpen ? descriptionItems : descriptionItems.slice(0, 8)).map((item, idx) => {
                        const { Icon, className } = pickIcon(item);
                        return (
                          <li key={idx} className="flex items-start gap-2">
                            <Icon className={`h-4 w-4 mt-0.5 ${className}`} />
                            <span>{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                    {descriptionItems.length > 8 && (
                      <button
                        type="button"
                        onClick={() => setDescOpen((v) => !v)}
                        className="text-sm font-semibold text-[#DA1212]"
                      >
                        {descOpen ? "Réduire" : `Voir les ${descriptionItems.length - 8} lignes suivantes`}
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-700 leading-relaxed">{descOpen ? descriptionFull : descriptionShort}</p>
                )}
              </div>

              {(optionsList.length > 0 || equipmentList.length > 0) && (
                <div className="border-t border-slate-200 pt-3 grid gap-3">
                  {optionsList.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Points forts</p>
                      <ul className="space-y-1.5 text-sm text-slate-800">
                        {optionsList.slice(0, 6).map((opt, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: ACCENT }} />
                            <span>{opt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {equipmentList.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Équipements</p>
                      <ul className="space-y-1.5 text-sm text-slate-800">
                        {equipmentList.slice(0, 6).map((opt, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: ACCENT }} />
                            <span>{opt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
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
          </section>

          {/* Sticky mobile CTA */}
          <div className="fixed inset-x-0 bottom-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">À partir de</p>
                <p className="text-lg font-bold text-[#DA1212] leading-tight">{priceLabel}</p>
                <p className="text-xs text-slate-600 truncate">
                  Mensualité estimée {simulated.value !== null ? simulated.label : monthlyLabel}
                </p>
              </div>
              <Button
                className="h-12 px-5 rounded-full bg-[#DA1212] text-white hover:bg-[#b80f0f] flex-shrink-0"
                onClick={() => {
                  const el = document.querySelector("[data-contact-anchor]");
                  if (el instanceof HTMLElement) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Demander une offre
              </Button>
            </div>
          </div>
        </main>
      )}

      {/* =======================
          LIGHTBOX FULL SCREEN MOBILE
          ======================= */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="w-screen max-w-none h-[100dvh] md:h-auto md:max-w-6xl bg-black p-0 overflow-hidden border-none rounded-none md:rounded-2xl">
          <div className="relative bg-black h-full md:h-auto">
            <LazyImage
              src={images[activeIndex] || FALLBACK_IMAGES[0]}
              alt={`Aperçu véhicule ${activeIndex + 1}/${images.length}`}
              className="w-full h-[100dvh] md:h-full md:max-h-[80vh] object-contain bg-black"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 px-3 py-2 text-lg font-semibold text-white hover:bg-white/30"
                  aria-label="Image précédente"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 px-3 py-2 text-lg font-semibold text-white hover:bg-white/30"
                  aria-label="Image suivante"
                >
                  ›
                </button>
              </>
            )}

            <div className="absolute top-4 right-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {activeIndex + 1} / {images.length}
            </div>

            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 w-2 rounded-full transition ${idx === activeIndex ? "bg-white" : "bg-white/40"}`}
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
