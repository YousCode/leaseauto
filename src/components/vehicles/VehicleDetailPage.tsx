import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Gauge,
  MapPin,
  MessageCircle,
  MoveRight,
  Phone,
  Settings2,
  Shield,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LazyImage from "@/components/ui/LazyImage";
import { useVehicleBySlug } from "@/hooks/useVehicleBySlug";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { BrandLogo } from "@/lib/BrandLogo";
import { estimateVehicleMonthly } from "@/lib/finance";

const ACCENT = "#DA1212";
const DEFAULT_FINANCE_DURATION_MONTHS = 60;
const WHATSAPP_PHONE = "33767793106";

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

  const [financeDuration, setFinanceDuration] = useLocalStorage<number>(
    "leaseauto:vehicle-simu:duration",
    DEFAULT_FINANCE_DURATION_MONTHS,
  );
  const [firstPayment, setFirstPayment] = useLocalStorage<number | null>(
    "leaseauto:vehicle-simu:firstPayment",
    null,
  );
  const [descOpen, setDescOpen] = useState(false);
  const financeSteps = [24, 36, 48, 60, 72];
  const financeMin = 24;
  const financeMax = 72;

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

  const sanitizedImages =
    Array.isArray(displayVehicle?.images) && (displayVehicle?.images?.length ?? 0) > 0
      ? (displayVehicle?.images as string[]).filter(
          (img) => typeof img === "string" && img.trim().length > 0,
        )
      : [];

  const images = sanitizedImages.length > 0 ? sanitizedImages : FALLBACK_IMAGES;

  const priceLabel = displayVehicle?.price
    ? `${Math.round(displayVehicle.price).toLocaleString("fr-FR")} €`
    : "Prix sur demande";

  const monthlyLabel = displayVehicle?.monthly
    ? `${Math.round(displayVehicle.monthly).toLocaleString("fr-FR")} €/mois`
    : "Loyer sur mesure";

  const optionsList =
    Array.isArray(displayVehicle?.options) && displayVehicle.options.length > 0
      ? displayVehicle.options.filter((opt) => typeof opt === "string" && opt.trim().length > 0)
      : [];

  const equipmentList =
    Array.isArray(displayVehicle?.equipment) && displayVehicle.equipment.length > 0
      ? displayVehicle.equipment.filter((opt) => typeof opt === "string" && opt.trim().length > 0)
      : [];

  const specPills = [
    displayVehicle?.mileage != null
      ? { Icon: Gauge, label: `${formatNumber(displayVehicle.mileage)} km` }
      : null,
    displayVehicle?.energy ? { Icon: Zap, label: displayVehicle.energy } : null,
    displayVehicle?.year ? { Icon: Calendar, label: String(displayVehicle.year) } : null,
    displayVehicle?.gearbox ? { Icon: Settings2, label: displayVehicle.gearbox } : null,
    displayVehicle?.city ? { Icon: MapPin, label: displayVehicle.city } : null,
  ].filter((p): p is { Icon: typeof Gauge; label: string } => p !== null);

  const goBack = () => navigate("/vehicules");

  const simulated = useMemo(() => {
    const value = estimateVehicleMonthly({
      price: displayVehicle?.price,
      fallbackMonthly:
        typeof displayVehicle?.monthly === "number" ? displayVehicle.monthly : null,
      durationMonths: financeDuration,
      firstPayment,
    });
    if (value === null) return { value: null, label: "Sur mesure" };
    return { value, label: `${Math.round(value).toLocaleString("fr-FR")} €/mois` };
  }, [displayVehicle?.monthly, displayVehicle?.price, financeDuration, firstPayment]);
  const financeProgress = Math.min(
    100,
    Math.max(0, ((financeDuration - financeMin) / (financeMax - financeMin)) * 100),
  );

  const descriptionFull =
    displayVehicle?.description ||
    "Configuration premium préparée, dossier financier piloté, livraison rapide partout en France. Garantie et historique vérifiés.";
  const descriptionShort =
    descriptionFull.length > 300
      ? descriptionFull.slice(0, 300).trimEnd() + "…"
      : descriptionFull;

  const vehicleName = displayVehicle
    ? [displayVehicle.brand, displayVehicle.model, displayVehicle.version]
        .filter(Boolean)
        .join(" ")
    : "Véhicule";

  const whatsappMsg = encodeURIComponent(
    `Bonjour, je suis intéressé par ce véhicule : ${vehicleName}${displayVehicle?.price ? ` — ${priceLabel}` : ""}`,
  );

  const prevImage = () => setActiveIndex((p) => (p - 1 + images.length) % images.length);
  const nextImage = () => setActiveIndex((p) => (p + 1) % images.length);

  return (
    <>
      <Helmet>
        <title>{vehicleName} — Lease Auto</title>
        <meta
          name="description"
          content={`${vehicleName} · ${displayVehicle?.mileage ? formatNumber(displayVehicle.mileage) + " km" : ""} · ${displayVehicle?.energy ?? ""}`}
        />
      </Helmet>

      {isLoading ? (
        <main className="bg-white min-h-screen">
          <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 space-y-6">
            <div className="h-7 w-36 rounded-full bg-slate-100 animate-pulse" />
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-2xl bg-slate-100 animate-pulse" />
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 flex-1 rounded-xl bg-slate-100 animate-pulse" />
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-100 animate-pulse h-[520px]" />
            </div>
          </div>
        </main>
      ) : !displayVehicle ? (
        <main className="bg-white min-h-screen">
          <div className="mx-auto max-w-6xl px-4 py-20 space-y-4">
            <p className="text-lg font-semibold text-slate-800">Véhicule introuvable</p>
            <p className="text-sm text-slate-500">
              Ce véhicule n&apos;est plus disponible ou le lien est incorrect.
            </p>
            <Button onClick={goBack} variant="outline" className="mt-2">
              <ArrowLeft size={15} className="mr-2" />
              Retour aux véhicules
            </Button>
          </div>
        </main>
      ) : (
        <main className="bg-white min-h-screen pb-28 md:pb-12">
          {/* Breadcrumb */}
          <div className="border-b border-slate-100">
            <div className="mx-auto max-w-6xl px-4 md:px-6 h-11 flex items-center gap-2 text-sm">
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-800 transition-colors font-medium"
              >
                <ArrowLeft size={14} />
                Véhicules
              </button>
              <span className="text-slate-200">/</span>
              <span className="text-slate-700 font-medium truncate max-w-[180px] md:max-w-none">
                {vehicleName}
              </span>
            </div>
          </div>

          {/* Main content */}
          <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 md:py-8 overflow-hidden">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-8 lg:items-start">

              {/* ====== LEFT COLUMN ====== */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-5 min-w-0"
              >
                {/* Gallery */}
                <div className="space-y-2.5">
                  {/* Main image */}
                  <div className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 aspect-[16/10] md:aspect-[4/3]">
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="absolute inset-0 z-[2] cursor-zoom-in"
                      aria-label="Agrandir"
                    />
                    <img
                      src={images[activeIndex] || FALLBACK_IMAGES[0]}
                      alt={vehicleName}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="eager"
                      decoding="async"
                    />
                    {/* Counter */}
                    <div className="absolute top-3 right-3 z-[3] rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                      {activeIndex + 1} / {images.length}
                    </div>
                    {/* Nav arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); prevImage(); }}
                          className="absolute left-3 top-1/2 z-[3] -translate-y-1/2 flex items-center justify-center h-9 w-9 rounded-full bg-white/90 shadow hover:bg-white active:scale-95 transition-all"
                          aria-label="Image précédente"
                        >
                          <ChevronLeft size={18} className="text-slate-700" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); nextImage(); }}
                          className="absolute right-3 top-1/2 z-[3] -translate-y-1/2 flex items-center justify-center h-9 w-9 rounded-full bg-white/90 shadow hover:bg-white active:scale-95 transition-all"
                          aria-label="Image suivante"
                        >
                          <ChevronRight size={18} className="text-slate-700" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {images.slice(0, 10).map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`flex-shrink-0 h-16 w-24 overflow-hidden rounded-xl border-2 transition-all snap-start ${
                          idx === activeIndex
                            ? "border-[#DA1212] opacity-100"
                            : "border-transparent opacity-60 hover:opacity-90 hover:border-slate-200"
                        }`}
                        aria-label={`Photo ${idx + 1}`}
                      >
                        <LazyImage src={img} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                    {images.length > 10 && (
                      <button
                        type="button"
                        onClick={() => setLightboxOpen(true)}
                        className="flex-shrink-0 h-16 w-24 rounded-xl border-2 border-transparent bg-slate-100 text-xs font-semibold text-slate-500 hover:bg-slate-200 transition snap-start"
                      >
                        +{images.length - 10}
                      </button>
                    )}
                  </div>
                </div>

                {/* Mobile: compact price + specs card */}
                <div className="lg:hidden rounded-2xl border border-slate-100 bg-white p-4 space-y-3">
                  <div className="text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">{displayVehicle.brand}</p>
                    <h1 className="text-lg font-bold text-slate-900 leading-tight mt-0.5">
                      {displayVehicle.model}{displayVehicle.version ? ` ${displayVehicle.version}` : ""}
                    </h1>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {specPills.map(({ Icon, label }, idx) => (
                      <span key={idx} className="flex items-center gap-1 rounded-full bg-slate-50 border border-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-500">
                        <Icon size={10} className="text-slate-400" />
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 pt-3 text-center">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400">Prix du véhicule</p>
                    <p className="text-2xl font-black leading-tight mt-0.5" style={{ color: ACCENT }}>{priceLabel}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Loyer mensuel <span className="font-bold text-slate-800">{simulated.value !== null ? simulated.label : monthlyLabel}</span>
                    </p>
                  </div>
                </div>

                {/* Trust strip */}
                <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:auto-rows-fr md:items-stretch md:overflow-visible">
                  {[
                    { Icon: Shield, label: "Garantie 12 mois", sub: "Incluse" },
                    { Icon: CheckCircle, label: "Véhicule contrôlé", sub: "Expertise complète" },
                    { Icon: MoveRight, label: "Livraison nationale", sub: "France entière" },
                  ].map(({ Icon, label, sub }) => (
                    <div
                      key={label}
                      className="flex h-full min-h-[88px] flex-shrink-0 w-[140px] md:w-auto flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-center"
                    >
                      <Icon size={14} className="mx-auto mb-1" style={{ color: ACCENT }} />
                      <p className="text-[10px] md:text-[11px] font-semibold text-slate-800 leading-tight">{label}</p>
                      <p className="text-[9px] md:text-[10px] text-slate-400 mt-0.5">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="rounded-2xl border border-slate-100 bg-white p-4 md:p-5 space-y-3 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <Shield size={12} className="text-slate-300" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Fiche certifiée Lease Auto
                    </span>
                  </div>
                  <h2 className="text-sm md:text-base font-semibold text-slate-900">{vehicleName}</h2>
                  <p className="text-[13px] md:text-sm text-slate-600 leading-relaxed whitespace-pre-line break-words [overflow-wrap:anywhere]">
                    {descOpen ? descriptionFull : descriptionShort}
                  </p>
                  {descriptionFull.length > 300 && (
                    <button
                      type="button"
                      onClick={() => setDescOpen((v) => !v)}
                      className="text-xs font-semibold transition-colors"
                      style={{ color: ACCENT }}
                    >
                      {descOpen ? "Voir moins ↑" : "Lire la suite ↓"}
                    </button>
                  )}
                </div>

                {/* Options + Equipment */}
                {(optionsList.length > 0 || equipmentList.length > 0) && (
                  <div className="rounded-2xl border border-slate-100 bg-white p-4 md:p-5 space-y-5 overflow-hidden">
                    {optionsList.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                          Points forts
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {optionsList.map((opt, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                            >
                              <CheckCircle size={10} style={{ color: ACCENT }} />
                              {opt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {equipmentList.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                          Équipements
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {equipmentList.map((opt, idx) => (
                            <span
                              key={idx}
                              className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Delivery (desktop, below left col) */}
                <div className="hidden lg:flex items-center gap-6 px-1">
                  {[
                    { Icon: Shield, text: "Garantie 12 mois incluse" },
                    { Icon: MoveRight, text: "Dossier traité en 48h" },
                    { Icon: MapPin, text: "Livraison France métropolitaine" },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-xs text-slate-400">
                      <Icon size={12} style={{ color: ACCENT }} className="flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ====== RIGHT COLUMN: Sticky Finance Card ====== */}
              <motion.aside
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 }}
                className="space-y-4 lg:self-start"
              >
                <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-[0_10px_34px_rgba(15,23,42,0.08)] bg-white">
                  {/* Brand + model + specs (hidden on mobile, shown in mobile price card instead) */}
                  <div className="hidden lg:block p-5 space-y-4 bg-white">
                    <div className="flex items-center gap-3">
                      <BrandLogo brand={displayVehicle.brand} className="h-9 w-9 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                          {displayVehicle.brand}
                        </p>
                        <h1 className="text-[15px] font-bold text-slate-900 leading-tight">
                          {displayVehicle.model}
                          {displayVehicle.version ? ` ${displayVehicle.version}` : ""}
                        </h1>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {specPills.map(({ Icon, label }, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-100 px-3 py-1.5"
                        >
                          <Icon size={11} className="text-slate-400 flex-shrink-0" />
                          <span className="text-[11px] font-medium text-slate-600 whitespace-nowrap">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="px-5 py-4 lg:border-t border-b border-slate-100 bg-white space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Prix du véhicule
                    </p>
                    <p className="text-[2rem] font-black leading-none" style={{ color: ACCENT }}>
                      {priceLabel}
                    </p>
                    <div className="flex items-baseline gap-2 pt-1.5">
                      <span className="text-xs text-slate-400 whitespace-nowrap">Loyer mensuel</span>
                      <span className="text-lg font-bold text-slate-900 whitespace-nowrap">
                        {simulated.value !== null ? simulated.label : monthlyLabel}
                      </span>
                    </div>
                  </div>

                  {/* Finance simulator */}
                  <div className="px-5 py-4 space-y-4 border-b border-slate-100 bg-white">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">Durée de financement</p>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-800">
                          {financeDuration} mois
                        </span>
                      </div>
                      <input
                        type="range"
                        min={financeMin}
                        max={financeMax}
                        step={6}
                        value={financeDuration}
                        onChange={(e) => setFinanceDuration(Number(e.target.value))}
                        className="finance-range w-full"
                        style={{
                          background: `linear-gradient(to right, #DA1212 0%, #DA1212 ${financeProgress}%, #e2e8f0 ${financeProgress}%, #e2e8f0 100%)`,
                        }}
                        aria-label="Durée de financement"
                      />
                      <div className="grid grid-cols-5 gap-1.5">
                        {financeSteps.map((month) => {
                          const active = financeDuration === month;
                          return (
                            <button
                              key={month}
                              type="button"
                              onClick={() => setFinanceDuration(month)}
                              className={`rounded-md border px-1.5 py-1 text-[10px] font-semibold transition-colors ${
                                active
                                  ? "border-[#DA1212] bg-[#DA1212]/10 text-[#DA1212]"
                                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                              }`}
                            >
                              {month}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>{financeMin} mois</span>
                        <span>{financeMax} mois</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs text-slate-600 flex-shrink-0">Première mensualité</p>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={firstPayment ?? ""}
                            onChange={(e) =>
                              setFirstPayment(e.target.value ? Number(e.target.value) : null)
                            }
                            className="w-24 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-right text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:border-[#DA1212]"
                            placeholder="0"
                          />
                          <span className="text-xs text-slate-400">€</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA section */}
                  <div className="bg-white px-5 py-5 space-y-3.5 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 mb-1">
                        Votre mensualité estimée
                      </p>
                      <p className="text-[2rem] font-black text-slate-900 leading-none">
                        {simulated.value !== null ? simulated.label : monthlyLabel}
                      </p>
                    </div>
                    <a
                      href="tel:0184218393"
                      className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#DA1212] text-white font-semibold hover:bg-[#b80f0f] active:scale-[0.98] transition-all text-sm shadow-[0_4px_20px_rgba(218,18,18,0.45)]"
                    >
                      <Phone size={15} />
                      Appeler pour un devis
                    </a>
                    <a
                      href={`https://wa.me/${WHATSAPP_PHONE}?text=${whatsappMsg}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-10 rounded-xl border border-emerald-200 text-emerald-700 bg-emerald-50/60 font-semibold hover:bg-emerald-100/60 transition-colors text-sm"
                    >
                      <MessageCircle size={15} />
                      WhatsApp
                    </a>
                    <p className="text-[11px] text-slate-400 text-center">
                      WhatsApp direct: +33 7 67 79 31 06
                    </p>
                  </div>
                </div>

                {/* Delivery (mobile — shown in right column) */}
                <div className="lg:hidden rounded-2xl border border-slate-100 bg-white p-4 space-y-2.5">
                  {[
                    { Icon: Shield, text: "Garantie 12 mois incluse" },
                    { Icon: MoveRight, text: "Dossier traité en 48h" },
                    { Icon: MapPin, text: "Livraison France métropolitaine" },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <Icon size={14} style={{ color: ACCENT }} className="flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
              </motion.aside>
            </div>
          </div>

          {/* Sticky mobile CTA */}
          <div
            className="fixed inset-x-0 bottom-0 z-30 bg-white/96 backdrop-blur-sm border-t border-slate-100 px-4 py-3 md:hidden"
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400">Prix TTC</p>
                <p className="text-xl font-black leading-tight" style={{ color: ACCENT }}>
                  {priceLabel}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {simulated.value !== null ? simulated.label : monthlyLabel}
                </p>
              </div>
              <a
                href="tel:0184218393"
                className="flex items-center gap-2 h-11 px-5 rounded-full bg-[#DA1212] text-white font-semibold text-sm flex-shrink-0 shadow-[0_4px_16px_rgba(218,18,18,0.4)]"
              >
                <Phone size={14} />
                Appeler
              </a>
            </div>
          </div>
        </main>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="w-screen max-w-none h-[100dvh] md:h-auto md:max-w-5xl bg-black p-0 overflow-hidden border-none rounded-none md:rounded-2xl">
          <div className="relative h-[100dvh] md:h-auto bg-black flex items-center justify-center">
            <img
              src={images[activeIndex] || FALLBACK_IMAGES[0]}
              alt={`${vehicleName} — Photo ${activeIndex + 1}`}
              className="w-full h-full md:max-h-[85vh] object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
                  aria-label="Image précédente"
                >
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
                  aria-label="Image suivante"
                >
                  <ChevronRight size={20} className="text-white" />
                </button>
              </>
            )}
            <div className="absolute top-4 right-14 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </div>
            {images.length <= 14 && (
              <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeIndex ? "bg-white w-4" : "bg-white/35 w-1.5"
                    }`}
                    aria-label={`Image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VehicleDetailPage;
