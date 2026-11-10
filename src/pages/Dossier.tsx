import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FileRejection, useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BarChart3,
  BookOpen,
  Building2,
  Camera,
  CarFront,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Contact,
  CreditCard,
  FileBadge,
  FileCheck2,
  FileText,
  HelpCircle,
  Home,
  Info,
  Landmark,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  ShieldCheck,
  Upload,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { FooterSection } from "@/components/sections/FooterSection";
import { PageHero } from "@/components/ui/PageHero";
import Stepper from "@/components/ui/Stepper";
import { useToast } from "@/components/ui/use-toast";
import { baseTransition } from "@/lib/motion";
import clsx from "clsx";

type ProfileId = "particulier" | "vtc" | "societe";

type ProfileOption = {
  id: ProfileId;
  label: string;
  description: string;
  helper: string;
};

type DocumentRequirement = {
  id: string;
  label: string;
  description: string;
  icon: string;
  tooltip: string;
};

type DocumentStatus = "missing" | "pending" | "validated";

type UploadedDoc = {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
};

type DocumentState = DocumentRequirement & {
  status: DocumentStatus;
  files: UploadedDoc[];
};

const PROFILE_OPTIONS: ProfileOption[] = [
  {
    id: "particulier",
    label: "Particulier",
    description: "LOA / LLD / Rent to Buy",
    helper: "Identité, revenus, domicile",
  },
  {
    id: "vtc",
    label: "VTC / Auto-entrepreneur",
    description: "Dossier pro, revenus indépendants",
    helper: "SIREN, URSSAF, comptes",
  },
  {
    id: "societe",
    label: "Société",
    description: "SARL, SAS, EURL, SCI…",
    helper: "KBIS, statuts, bilans",
  },
];

const DOCUMENT_REQUIREMENTS: Record<ProfileId, DocumentRequirement[]> = {
  particulier: [
    {
      id: "piece-identite",
      label: "Pièce d’identité",
      description: "CNI ou passeport, recto-verso",
      icon: "🪪",
      tooltip: "Formats : PDF/JPG/PNG. Exemple : passeport ou CNI recto/verso. Pourquoi : confirmer votre identité.",
    },
    {
      id: "domicile",
      label: "Justificatif de domicile",
      description: "Moins de 3 mois",
      icon: "🧾",
      tooltip: "Formats : PDF/JPG. Exemple : facture EDF, téléphone ou quittance < 3 mois. Pourquoi : valider votre adresse.",
    },
    {
      id: "fiches-paie",
      label: "3 dernières fiches de paie",
      description: "Format PDF/JPG",
      icon: "💶",
      tooltip: "Formats : PDF/JPG. Exemple : fiches de paie des 3 derniers mois. Pourquoi : évaluer vos revenus.",
    },
    {
      id: "avis-imposition",
      label: "Dernier avis d’imposition",
      description: "Toutes les pages",
      icon: "📄",
      tooltip: "Formats : PDF. Exemple : avis complet N-1. Pourquoi : confirmer vos revenus annuels.",
    },
    {
      id: "rib",
      label: "RIB",
      description: "RIB nominatif",
      icon: "🏦",
      tooltip: "Formats : PDF/JPG. Exemple : RIB nominatif. Pourquoi : préparer les prélèvements.",
    },
  ],
  vtc: [
    {
      id: "piece-identite",
      label: "Pièce d’identité",
      description: "CNI ou passeport",
      icon: "🪪",
      tooltip: "Formats : PDF/JPG/PNG. Exemple : CNI ou passeport. Pourquoi : confirmer votre identité.",
    },
    {
      id: "insee",
      label: "Extrait INSEE / SIREN",
      description: "Document officiel",
      icon: "📄",
      tooltip: "Formats : PDF. Exemple : extrait INSEE ou avis SIREN. Pourquoi : vérifier votre immatriculation.",
    },
    {
      id: "urssaf",
      label: "Relevé URSSAF ou attestation",
      description: "Moins de 3 mois",
      icon: "📊",
      tooltip: "Formats : PDF. Exemple : relevé URSSAF ou attestation < 3 mois. Pourquoi : prouver votre régularité.",
    },
    {
      id: "releves-bancaires",
      label: "Relevés bancaires 3 mois",
      description: "Compte pro ou perso",
      icon: "💳",
      tooltip: "Formats : PDF. Exemple : relevés bancaires des 3 derniers mois. Pourquoi : analyser les flux financiers.",
    },
    {
      id: "domicile",
      label: "Justificatif de domicile",
      description: "EDF, téléphone…",
      icon: "🧾",
      tooltip: "Formats : PDF/JPG. Exemple : facture pro ou perso. Pourquoi : confirmer votre adresse.",
    },
    {
      id: "rib",
      label: "RIB",
      description: "Idéalement compte pro",
      icon: "🏦",
      tooltip: "Formats : PDF/JPG. Exemple : RIB professionnel si disponible. Pourquoi : paramétrer les loyers.",
    },
  ],
  societe: [
    {
      id: "piece-identite",
      label: "Pièce d’identité du gérant",
      description: "CNI ou passeport",
      icon: "🪪",
      tooltip: "Formats : PDF/JPG/PNG. Exemple : CNI ou passeport du gérant. Pourquoi : identifier le signataire.",
    },
    {
      id: "kbis",
      label: "KBIS < 3 mois",
      description: "Extrait complet",
      icon: "🧾",
      tooltip: "Formats : PDF. Exemple : KBIS de moins de 3 mois. Pourquoi : confirmer l’existence légale.",
    },
    {
      id: "statuts",
      label: "Statuts signés",
      description: "PDF complet",
      icon: "📘",
      tooltip: "Formats : PDF. Exemple : statuts à jour. Pourquoi : vérifier la gouvernance.",
    },
    {
      id: "bilans",
      label: "Liasses fiscales / bilans",
      description: "Années N et N-1",
      icon: "📊",
      tooltip: "Formats : PDF. Exemple : liasses fiscales N et N-1. Pourquoi : analyser la santé financière.",
    },
    {
      id: "rib",
      label: "RIB société",
      description: "Compte bancaire de l’entreprise",
      icon: "🏦",
      tooltip: "Formats : PDF/JPG. Exemple : RIB société. Pourquoi : mettre en place les prélèvements.",
    },
  ],
};

const initialDocumentsState = (): Record<ProfileId, DocumentState[]> => {
  return PROFILE_OPTIONS.reduce((acc, option) => {
    acc[option.id] = DOCUMENT_REQUIREMENTS[option.id].map((doc) => ({
      ...doc,
      status: "missing",
      files: [],
    }));
    return acc;
  }, {} as Record<ProfileId, DocumentState[]>);
};

const STEPS = ["Choisir mon profil", "Créer mon dossier", "Déposer & valider"];

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  budget: "",
  contractType: "",
};

type FormData = typeof initialFormData;

const MAX_SIZE = 20 * 1024 * 1024;

/* --- Habillage (aucune donnée métier) --- */
const PROFILE_ICONS: Record<ProfileId, LucideIcon> = {
  particulier: UserRound,
  vtc: CarFront,
  societe: Building2,
};

const DOCUMENT_ICONS: Record<string, LucideIcon> = {
  "piece-identite": Contact,
  domicile: Home,
  "fiches-paie": Banknote,
  "avis-imposition": FileText,
  rib: Landmark,
  insee: FileBadge,
  urssaf: FileCheck2,
  "releves-bancaires": CreditCard,
  kbis: Building2,
  statuts: BookOpen,
  bilans: BarChart3,
};

/** Même numéro que le bouton WhatsApp flottant (src/components/ui/FloatingWhatsApp.tsx). */
const WHATSAPP_URL = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUM || "33767793106"}`;

const HELP_CHIP =
  "chip-dark min-h-[44px] px-4 text-sm transition-colors duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

export default function DossierPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProfile, setSelectedProfile] = useState<ProfileId | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [documents, setDocuments] = useState<Record<ProfileId, DocumentState[]>>(initialDocumentsState);
  const [targetDocId, setTargetDocId] = useState<string | null>(null);
  const [attestationChecked, setAttestationChecked] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const generateDocumentName = useCallback(
    (docId: string, originalName: string) => {
      const extension = originalName.split(".").pop()?.toLowerCase() ?? "pdf";
      const normalizedFirst = (formData.firstName || "Client").trim().replace(/\s+/g, "_").toUpperCase() || "CLIENT";
      const normalizedLast = (formData.lastName || "Dossier").trim().replace(/\s+/g, "_").toUpperCase() || "DOSSIER";
      const docSlug = docId.replace(/[^a-z0-9]+/gi, "_").toUpperCase();
      const date = new Date().toISOString().split("T")[0];
      return `${normalizedLast}_${normalizedFirst}_${docSlug}_${date}.${extension}`;
    },
    [formData.firstName, formData.lastName],
  );

  const currentDocuments = useMemo(() => {
    if (!selectedProfile) return [];
    return documents[selectedProfile] ?? [];
  }, [documents, selectedProfile]);

  useEffect(() => {
    if (selectedProfile) {
      setTargetDocId(currentDocuments[0]?.id ?? null);
    } else {
      setTargetDocId(null);
    }
  }, [selectedProfile, currentDocuments]);

  const uploadedCount = currentDocuments.filter((doc) => doc.files.length > 0).length;
  const progressPercent = currentDocuments.length
    ? Math.round((uploadedCount / currentDocuments.length) * 100)
    : 0;
  const documentsComplete = currentDocuments.every((doc) => doc.files.length > 0);
  const missingCount = Math.max(currentDocuments.length - uploadedCount, 0);
  const dossierStatusLabel =
    missingCount === 0 ? "Complet" : `Manque ${missingCount} pièce${missingCount > 1 ? "s" : ""}`;
  const dossierStatusHelper =
    missingCount === 0
      ? "Tout est prêt pour l’envoi."
      : "Ajoutez les pièces restantes pour finaliser votre dossier.";

  const handleProfileSelect = (profile: ProfileId) => {
    setSelectedProfile(profile);
    setCurrentStep(1);
  };

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validateStepTwo = () => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    (Object.keys(initialFormData) as (keyof FormData)[]).forEach((field) => {
      if (!formData[field]) errors[field] = "Champ requis";
    });
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      toast({
        title: "Informations manquantes",
        description: "Merci de renseigner chaque champ pour créer votre dossier.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const goToStep = (nextStep: number) => {
    if (nextStep === 2 && currentStep < 2) {
      if (!validateStepTwo()) return;
    }
    setCurrentStep(nextStep);
  };

  const handleUpload = useCallback(
    (docId: string, files: File[]) => {
      if (!selectedProfile) return;
      if (!files.length) return;
      setDocuments((prev) => {
        const next = { ...prev };
        next[selectedProfile] = next[selectedProfile].map((doc) => {
          if (doc.id !== docId) return doc;
          const uploaded: UploadedDoc[] = files.map((file) => {
            const renamed = generateDocumentName(doc.id, file.name);
            return {
              id: `${doc.id}-${Date.now()}-${renamed}`,
              name: renamed,
              size: file.size,
              uploadedAt: new Date().toISOString(),
            };
          });
          return {
            ...doc,
            status: "pending",
            files: [...doc.files, ...uploaded],
          };
        });
        return next;
      });
      toast({
        title: "Document ajouté",
        description: "Nous vérifions sa lisibilité dans les prochaines minutes.",
      });
    },
    [generateDocumentName, selectedProfile, toast],
  );

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      if (!targetDocId) {
        toast({
          title: "Choisissez une pièce",
          description: "Sélectionnez un document dans la liste avant de déposer vos fichiers.",
          variant: "destructive",
        });
        return;
      }
      handleUpload(targetDocId, acceptedFiles);
    },
    [handleUpload, targetDocId, toast],
  );

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      const isSizeIssue = fileRejections.some((rejection) =>
        rejection.errors.some((error) => error.code === "file-too-large"),
      );
      toast({
        title: isSizeIssue ? "Fichier trop volumineux" : "Fichier non accepté",
        description: isSizeIssue
          ? "Limite 20 Mo. Essayez en PDF/JPG compressé."
          : "Formats acceptés : PDF, JPG, PNG, HEIC.",
        variant: "destructive",
      });
    },
    [toast],
  );

  const { getRootProps, getInputProps, isDragActive, open: openFileDialog } = useDropzone({
    onDropAccepted,
    onDropRejected,
    maxSize: MAX_SIZE,
    noClick: true,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/heic": [".heic"],
      "image/heif": [".heif"],
    },
  });

  const handleCameraCapture = () => {
    if (!targetDocId) {
      toast({
        title: "Choisissez une pièce",
        description: "Sélectionnez un document dans la liste avant de prendre une photo.",
        variant: "destructive",
      });
      return;
    }
    cameraInputRef.current?.click();
  };

  const handleCameraChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length || !targetDocId) return;
    handleUpload(targetDocId, Array.from(event.target.files));
    event.target.value = "";
  };

  const handleSubmitDossier = () => {
    if (!documentsComplete || !attestationChecked) {
      toast({
        title: "Pièces manquantes",
        description: "Ajoutez chaque document et cochez l’attestation avant l’envoi.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Dossier envoyé",
      description: "Un conseiller Lease Auto vous répond sous 48h.",
    });
    setDocuments((prev) => {
      if (!selectedProfile) return prev;
      const next = { ...prev };
      next[selectedProfile] = next[selectedProfile].map((doc) => ({
        ...doc,
        status: "validated",
      }));
      return next;
    });
  };

  const selectedProfileOption = PROFILE_OPTIONS.find((p) => p.id === selectedProfile);
  const targetDocLabel = currentDocuments.find((d) => d.id === targetDocId)?.label ?? "Sélectionnez une pièce";

  return (
    <div className="bg-paper text-slate-700">
      <PageHero
        eyebrow="Dossier • Dépôt & Envoi de documents"
        title="Créez votre dossier en 3 étapes"
        subtitle="Uploadez vos documents en toute sécurité et obtenez une réponse sous 48h. Les conseillers Lease Auto à Épinay-sur-Seine vous accompagnent à chaque étape."
      >
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-2 text-sm font-medium text-white">
              <HelpCircle className="h-4 w-4 text-brand-primary-bright" aria-hidden />
              Besoin d’aide ?
            </span>
            <a href="tel:0184218393" className={HELP_CHIP}>
              <Phone className="h-4 w-4" aria-hidden />
              <span className="num">01 84 21 83 93</span>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className={HELP_CHIP}>
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp
            </a>
            <a href="mailto:contact@leaseauto.fr" className={HELP_CHIP}>
              <Mail className="h-4 w-4" aria-hidden />
              contact@leaseauto.fr
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-white/65">Formats acceptés :</span>
            {["PDF", "JPG", "PNG", "HEIC"].map((format) => (
              <span key={format} className="chip-dark">
                {format}
              </span>
            ))}
            <span className="chip-dark num">jusqu’à 20 Mo / fichier</span>
          </div>
        </div>
      </PageHero>

      <main className="container-x py-10 md:py-16">
        <section aria-label="Dépôt de dossier" className="surface p-5 sm:p-8 md:p-12">
          <Stepper steps={STEPS} current={currentStep} />

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={baseTransition}
          >
            <header className="mb-8">
              <p className="eyebrow num">
                Étape {currentStep + 1} sur {STEPS.length}
              </p>
              <h2 className="display-md mt-3 text-night">{STEPS[currentStep]}</h2>
              {currentStep === 0 && (
                <p className="lead mt-3 max-w-2xl">
                  Choisissez votre profil pour afficher la check-list adaptée. Vous pourrez modifier ce choix plus tard.
                </p>
              )}
            </header>

            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {PROFILE_OPTIONS.map((profile) => {
                    const selected = selectedProfile === profile.id;
                    const Icon = PROFILE_ICONS[profile.id];
                    return (
                      <button
                        key={profile.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => handleProfileSelect(profile.id)}
                        className={clsx(
                          "surface group flex min-h-[13rem] flex-col p-6 text-left transition-[transform,border-color,background-color] duration-300 ease-out hover:-translate-y-1",
                          selected
                            ? "border-brand-primary bg-brand-primary-soft ring-1 ring-brand-primary"
                            : "hover:border-slate-300",
                        )}
                      >
                        <span className="flex w-full items-start justify-between gap-3">
                          <span
                            aria-hidden
                            className={clsx(
                              "grid h-12 w-12 place-items-center rounded-2xl transition-colors duration-300",
                              selected ? "bg-brand-primary text-white" : "bg-paper text-night",
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          {selected ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white">
                              <Check className="h-3.5 w-3.5" aria-hidden />
                              Sélectionné
                            </span>
                          ) : (
                            <span
                              aria-hidden
                              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-400 transition-colors duration-300 group-hover:border-night group-hover:bg-night group-hover:text-white"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </span>
                          )}
                        </span>
                        <span className="mt-6 block font-display text-xl font-semibold text-night">
                          {profile.label}
                        </span>
                        <span className="mt-1 block text-sm leading-relaxed text-slate-600">{profile.description}</span>
                        <span className="mt-auto block pt-5 text-xs text-slate-500">{profile.helper}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedProfile && (
                  <div className="flex flex-col gap-4 rounded-[20px] bg-paper p-5 text-sm md:flex-row md:items-center md:justify-between">
                    <p className="text-slate-600">
                      Profil sélectionné :{" "}
                      <span className="font-semibold text-night">{selectedProfileOption?.label}</span>
                    </p>
                    <button type="button" className="btn btn-primary" onClick={() => goToStep(1)}>
                      Continuer
                      <ArrowRight />
                    </button>
                  </div>
                )}
              </div>
            )}

            {currentStep === 1 && (
              <form
                className="space-y-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  goToStep(2);
                }}
              >
                <div className="grid gap-5 md:grid-cols-2">
                  {(
                    [
                      { label: "Nom", field: "lastName" },
                      { label: "Prénom", field: "firstName" },
                      { label: "Email", field: "email" },
                      { label: "Téléphone", field: "phone" },
                      { label: "Ville", field: "city" },
                      { label: "Budget mensuel estimé (€)", field: "budget" },
                    ] as { label: string; field: keyof FormData }[]
                  ).map(({ label, field }) => (
                    <label key={field} className="block text-sm">
                      <span className="font-medium text-slate-700">{label}</span>
                      <input
                        type={field === "email" ? "email" : field === "budget" ? "number" : "text"}
                        value={formData[field]}
                        onChange={(e) => handleFormChange(field, e.target.value)}
                        aria-invalid={formErrors[field] ? true : undefined}
                        className={clsx("field mt-2 text-base", formErrors[field] && "border-red-500")}
                        required
                      />
                      {formErrors[field] ? (
                        <span className="mt-1.5 block text-xs text-red-500">{formErrors[field]}</span>
                      ) : null}
                    </label>
                  ))}
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block text-sm">
                    <span className="font-medium text-slate-700">Type de contrat souhaité</span>
                    <span className="relative mt-2 block">
                      <select
                        value={formData.contractType}
                        onChange={(e) => handleFormChange("contractType", e.target.value)}
                        aria-invalid={formErrors.contractType ? true : undefined}
                        className={clsx(
                          "field appearance-none pr-11 text-base",
                          formErrors.contractType && "border-red-500",
                        )}
                        required
                      >
                        <option value="">Sélectionner</option>
                        <option value="loa">LOA</option>
                        <option value="lld">LLD</option>
                        <option value="rent-to-buy">Rent to Buy</option>
                      </select>
                      <ChevronDown
                        aria-hidden
                        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                      />
                    </span>
                    {formErrors.contractType ? (
                      <span className="mt-1.5 block text-xs text-red-500">{formErrors.contractType}</span>
                    ) : null}
                  </label>
                  <div className="flex items-start gap-3 rounded-[20px] bg-paper p-5 text-sm">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" aria-hidden />
                    <div>
                      <p className="font-semibold text-night">Rappel</p>
                      <p className="mt-1 leading-relaxed text-slate-600">
                        Toutes vos informations restent confidentielles. Vous recevez un lien magique pour suivre votre dossier.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm md:flex-row md:items-center md:justify-between">
                  <span className="text-slate-600">Votre dossier est pré-rempli avec ces informations.</span>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setCurrentStep(0)} className="btn btn-ghost">
                      <ArrowLeft />
                      Retour
                    </button>
                    <button type="submit" className="btn btn-primary flex-1 md:flex-none">
                      Créer mon dossier
                      <ArrowRight />
                    </button>
                  </div>
                </div>
              </form>
            )}

            {currentStep === 2 && selectedProfile && (
              <div className="space-y-8">
                <div className="grain relative overflow-hidden rounded-[20px] bg-night p-6 text-white md:flex md:items-end md:justify-between md:gap-10 md:p-8">
                  <div>
                    <p className="eyebrow eyebrow-dark">Progression</p>
                    <p className="num display-md mt-3">{progressPercent}% complet</p>
                    <p className="num mt-2 text-sm text-white/65">
                      {uploadedCount} / {currentDocuments.length} pièces ajoutées
                    </p>
                  </div>
                  <div className="mt-6 md:mt-0 md:w-80">
                    <p className="text-sm font-semibold text-white">{dossierStatusLabel}</p>
                    <p className="mt-1 text-xs text-white/65">{dossierStatusHelper}</p>
                    <div
                      role="progressbar"
                      aria-label="Progression du dossier"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={progressPercent}
                      className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/15"
                    >
                      <div
                        className="h-full w-full rounded-full bg-brand-primary-bright transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${100 - progressPercent}%)` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.2fr_minmax(0,0.8fr)]">
                  <div className="space-y-3">
                    {currentDocuments.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        doc={doc}
                        isActive={targetDocId === doc.id}
                        onSelect={() => setTargetDocId(doc.id)}
                        onUpload={(files) => handleUpload(doc.id, files)}
                      />
                    ))}
                  </div>
                  <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                    <div
                      {...getRootProps()}
                      className={clsx(
                        "flex flex-col items-center justify-center rounded-[28px] border-2 border-dashed px-6 py-10 text-center transition-colors duration-300",
                        isDragActive ? "border-brand-primary bg-brand-primary-soft" : "border-slate-300 bg-paper",
                      )}
                    >
                      <input {...getInputProps()} />
                      <span aria-hidden className="grid h-14 w-14 place-items-center rounded-full bg-night text-white">
                        <Upload className="h-6 w-6" />
                      </span>
                      <p className="mt-4 font-display text-xl font-semibold text-night">Glissez-déposez vos fichiers</p>
                      <p className="mt-1 text-sm text-slate-600">
                        Actuellement : <span className="font-semibold text-night">{targetDocLabel}</span>
                      </p>
                      <div className="mt-6 flex w-full flex-col justify-center gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openFileDialog();
                          }}
                          className="btn btn-primary"
                        >
                          Ajouter un document
                          <Plus />
                        </button>
                        <button type="button" onClick={handleCameraCapture} className="btn btn-ghost">
                          Prendre une photo
                          <Camera />
                        </button>
                      </div>
                    </div>

                    <input
                      type="file"
                      ref={cameraInputRef}
                      accept=".pdf,image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleCameraChange}
                    />

                    <div className="rounded-[20px] border border-slate-200 p-5 text-sm">
                      <p className="flex items-center gap-2 font-semibold text-night">
                        <Info className="h-4 w-4 text-brand-primary" aria-hidden />
                        Règles de dépôt
                      </p>
                      <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-slate-600 marker:text-slate-400">
                        <li>Formats acceptés : PDF, JPG, PNG, HEIC</li>
                        <li>20 Mo maximum par fichier, nombre illimité</li>
                        <li>Nommage auto : NOM_PRENOM_TYPEPIECE_DATE.pdf</li>
                        <li>OCR & correction automatique pour vos scans</li>
                      </ul>
                    </div>

                    <div className="space-y-4 rounded-[20px] border border-slate-200 p-5 text-sm">
                      <p className="flex items-center gap-2 font-semibold text-night">
                        <FileText className="h-4 w-4 text-brand-primary" aria-hidden />
                        Validation & envoi
                      </p>
                      <label className="flex min-h-[44px] cursor-pointer items-start gap-3 leading-relaxed text-slate-600">
                        <input
                          type="checkbox"
                          checked={attestationChecked}
                          onChange={(e) => setAttestationChecked(e.target.checked)}
                          className="mt-0.5 h-5 w-5 shrink-0 accent-brand-primary"
                        />
                        J’atteste que mes informations sont exactes et autorise Lease Auto à les vérifier.
                      </label>
                      <button
                        type="button"
                        onClick={handleSubmitDossier}
                        className="btn btn-primary w-full"
                        disabled={!documentsComplete || !attestationChecked}
                      >
                        Envoyer mon dossier
                        <ArrowRight />
                      </button>
                      <p className="text-xs leading-relaxed text-slate-500">
                        Vous recevez un email + SMS de confirmation avec un lien “Mon dossier”.
                      </p>
                    </div>

                    <Link to="/dossier/mon-dossier" className="btn btn-ghost w-full">
                      Accéder à mon dossier
                      <ArrowUpRight />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}

function DocumentCard({
  doc,
  onUpload,
  onSelect,
  isActive,
}: {
  doc: DocumentState;
  onUpload: (files: File[]) => void;
  onSelect: () => void;
  isActive: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const Icon = DOCUMENT_ICONS[doc.id] ?? FileText;

  const statusConfig: Record<
    DocumentStatus,
    { label: string; className: string; icon: JSX.Element }
  > = {
    missing: {
      label: "Manquant",
      className: "bg-brand-primary-soft text-brand-primary-dark",
      icon: <AlertCircle size={14} aria-hidden />,
    },
    pending: {
      label: "À vérifier",
      className: "bg-amber-50 text-amber-700",
      icon: <Clock size={14} aria-hidden />,
    },
    validated: {
      label: "Validé",
      className: "bg-emerald-50 text-emerald-700",
      icon: <CheckCircle2 size={14} aria-hidden />,
    },
  };

  return (
    <div
      className={clsx(
        "flex cursor-pointer flex-col gap-4 rounded-[20px] border p-5 transition-colors duration-300 sm:flex-row sm:items-center sm:justify-between",
        isActive ? "border-night bg-paper" : "border-slate-200 bg-white hover:border-slate-300",
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect();
      }}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <span
          aria-hidden
          className={clsx(
            "grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-colors duration-300",
            isActive ? "bg-night text-white" : "bg-paper text-night",
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-display text-base font-semibold leading-snug text-night">{doc.label}</p>
            <button
              type="button"
              onClick={(event) => event.stopPropagation()}
              className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors after:absolute after:-inset-2 after:content-[''] hover:border-night hover:text-night"
              title={doc.tooltip}
              aria-label={`En savoir plus sur ${doc.label}`}
            >
              <Info size={14} aria-hidden />
            </button>
          </div>
          <p className="mt-0.5 text-sm text-slate-600">{doc.description}</p>
          {isActive && <p className="mt-2 text-xs leading-relaxed text-slate-500">{doc.tooltip}</p>}
          {doc.files.length > 0 && (
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
              {doc.files.map((file) => (
                <li key={file.id} className="flex items-start gap-2">
                  <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                  <span className="num break-all">
                    {file.name} – {formatSize(file.size)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
        <span
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
            statusConfig[doc.status].className,
          )}
        >
          {statusConfig[doc.status].icon}
          {statusConfig[doc.status].label}
        </span>
        <button
          type="button"
          className="btn btn-ghost btn-sm h-11 bg-white"
          onClick={(event) => {
            event.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Ajouter
          <Plus />
        </button>
      </div>
      <input
        type="file"
        ref={inputRef}
        accept=".pdf,image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => {
          if (!event.target.files) return;
          onUpload(Array.from(event.target.files));
          event.target.value = "";
        }}
      />
    </div>
  );
}
