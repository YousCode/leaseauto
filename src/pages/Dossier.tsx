import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FileRejection, useDropzone } from "react-dropzone";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  Info,
  Upload,
} from "lucide-react";
import { HeaderSection, FooterSection } from "@/components/sections";
import Stepper from "@/components/ui/Stepper";
import { useToast } from "@/components/ui/use-toast";
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
        title: "✅ Document ajouté",
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
        title: isSizeIssue ? "⚠️ Fichier trop volumineux" : "⚠️ Fichier non accepté",
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

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#444444]">
      <HeaderSection />
      <main className="px-4 pt-28 pb-16 md:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-10">
          <header className="space-y-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#ECECEC] md:p-10">
            <p className="text-xs uppercase tracking-[0.4em] text-[#9FA3AE]">
              Dossier • Dépôt & Envoi de documents
            </p>
            <div>
              <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                Créez votre dossier en 3 étapes
              </h1>
              <p className="mt-3 max-w-3xl text-base text-[#5A5E66] md:text-lg">
                Uploadez vos documents en toute sécurité et obtenez une réponse sous 48h.
                Les conseillers Lease Auto à Épinay-sur-Seine vous accompagnent à chaque étape.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl bg-[#FFF3F2] p-4 text-sm md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 font-medium text-[#E10600]">
                <HelpCircle size={18} />
                Besoin d’aide ? 01 84 21 83 93 • WhatsApp • contact@lease-auto.fr
              </div>
              <div className="text-xs text-[#5A5E66]">
                Formats acceptés : PDF, JPG, PNG, HEIC — jusqu’à 20 Mo / fichier
              </div>
            </div>
          </header>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#ECECEC] md:p-10">
            <Stepper steps={STEPS} current={currentStep} />

            {currentStep === 0 && (
              <div className="space-y-6">
                <p className="text-sm text-[#5A5E66]">
                  Choisissez votre profil pour afficher la check-list adaptée. Vous pourrez modifier ce choix plus tard.
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  {PROFILE_OPTIONS.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => handleProfileSelect(profile.id)}
                      className={clsx(
                        "rounded-2xl border p-5 text-left transition hover:border-[#E10600] hover:shadow-md",
                        selectedProfile === profile.id ? "border-[#E10600] bg-[#FFF5F4]" : "border-[#ECECEC] bg-white",
                      )}
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A1A6B4]">
                        {profile.label}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-[#262A32]">{profile.description}</h3>
                      <p className="mt-2 text-sm text-[#5A5E66]">{profile.helper}</p>
                    </button>
                  ))}
                </div>
                {selectedProfile && (
                  <div className="flex flex-col gap-3 rounded-2xl border border-[#ECECEC] bg-[#FDFDFD] p-4 text-sm md:flex-row md:items-center md:justify-between">
                    <p>
                      Profil sélectionné :{" "}
                      <span className="font-semibold text-[#E10600]">
                        {PROFILE_OPTIONS.find((p) => p.id === selectedProfile)?.label}
                      </span>
                    </p>
                    <button
                      className="rounded-full bg-[#E10600] px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white"
                      onClick={() => goToStep(1)}
                    >
                      Continuer
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
                <div className="grid gap-4 md:grid-cols-2">
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
                    <label key={field} className="text-sm">
                      <span className="text-[#5A5E66]">{label}</span>
                      <input
                        type={field === "email" ? "email" : field === "budget" ? "number" : "text"}
                        value={formData[field]}
                        onChange={(e) => handleFormChange(field, e.target.value)}
                        className={clsx(
                          "mt-2 w-full rounded-2xl border px-4 py-3 text-base text-[#262A32] outline-none transition focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600]",
                          formErrors[field] ? "border-red-400" : "border-[#E1E1E1]",
                        )}
                        required
                      />
                    </label>
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm">
                    <span className="text-[#5A5E66]">Type de contrat souhaité</span>
                    <select
                      value={formData.contractType}
                      onChange={(e) => handleFormChange("contractType", e.target.value)}
                      className={clsx(
                        "mt-2 w-full rounded-2xl border px-4 py-3 text-base text-[#262A32] outline-none focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600]",
                        formErrors.contractType ? "border-red-400" : "border-[#E1E1E1]",
                      )}
                      required
                    >
                      <option value="">Sélectionner</option>
                      <option value="loa">LOA</option>
                      <option value="lld">LLD</option>
                      <option value="rent-to-buy">Rent to Buy</option>
                    </select>
                  </label>
                  <div className="rounded-2xl border border-[#ECECEC] bg-[#FDFDFD] p-4 text-sm">
                    <p className="font-semibold text-[#E10600]">Rappel</p>
                    <p className="mt-2 text-[#5A5E66]">
                      Toutes vos informations restent confidentielles. Vous recevez un lien magique pour suivre votre dossier.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 rounded-2xl border border-[#ECECEC] bg-[#FDFDFD] p-4 text-sm md:flex-row md:items-center md:justify-between">
                  <span>Votre dossier est pré-rempli avec ces informations.</span>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      className="rounded-full border border-[#E1E1E1] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#444444]"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="rounded-full bg-[#E10600] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white"
                    >
                      Créer mon dossier
                    </button>
                  </div>
                </div>
              </form>
            )}

            {currentStep === 2 && selectedProfile && (
              <div className="space-y-8">
                <div className="rounded-2xl border border-[#ECECEC] bg-[#FDFDFD] p-4 text-sm md:flex md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-[#9FA3AE]">Progression</p>
                    <p className="mt-2 text-lg font-semibold text-[#262A32]">
                      {progressPercent}% complet
                    </p>
                    <p className="text-[#5A5E66]">
                      {uploadedCount} / {currentDocuments.length} pièces ajoutées
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#E10600]">{dossierStatusLabel}</p>
                    <p className="text-xs text-[#9FA3AE]">{dossierStatusHelper}</p>
                  </div>
                  <div className="mt-4 h-3 w-full rounded-full bg-[#ECECEC] md:mt-0 md:w-64">
                    <div
                      className="h-full rounded-full bg-[#E10600] transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.2fr_minmax(0,0.8fr)]">
                  <div className="space-y-4">
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
                  <div className="space-y-5">
                    <div
                      {...getRootProps()}
                      className={clsx(
                        "flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition",
                        isDragActive ? "border-[#E10600] bg-[#FFF5F4]" : "border-[#D9DBE1] bg-white",
                      )}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-10 w-10 text-[#E10600]" />
                      <p className="mt-3 text-lg font-semibold">Glissez-déposez vos fichiers</p>
                      <p className="text-sm text-[#5A5E66]">
                        Actuellement :{" "}
                        <span className="font-semibold text-[#E10600]">
                          {currentDocuments.find((d) => d.id === targetDocId)?.label ?? "Sélectionnez une pièce"}
                        </span>
                      </p>
                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openFileDialog();
                          }}
                          className="rounded-full bg-[#E10600] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
                        >
                          Ajouter un document
                        </button>
                        <button
                          type="button"
                          onClick={handleCameraCapture}
                          className="rounded-full border border-[#E10600] px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#E10600]"
                        >
                          Prendre une photo
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

                    <div className="space-y-3 rounded-3xl border border-[#ECECEC] bg-white p-5 text-sm">
                      <div className="flex items-center gap-2 text-[#E10600]">
                        <Info size={16} />
                        Règles de dépôt
                      </div>
                      <ul className="list-disc pl-5 text-[#5A5E66]">
                        <li>Formats acceptés : PDF, JPG, PNG, HEIC</li>
                        <li>20 Mo maximum par fichier, nombre illimité</li>
                        <li>Nommage auto : NOM_PRENOM_TYPEPIECE_DATE.pdf</li>
                        <li>OCR & correction automatique pour vos scans</li>
                      </ul>
                    </div>

                    <div className="space-y-3 rounded-3xl border border-[#ECECEC] bg-white p-5 text-sm">
                      <div className="flex items-center gap-2 text-[#5A5E66]">
                        <FileText size={16} />
                        Validation & envoi
                      </div>
                      <label className="flex items-start gap-3 text-sm text-[#5A5E66]">
                        <input
                          type="checkbox"
                          checked={attestationChecked}
                          onChange={(e) => setAttestationChecked(e.target.checked)}
                          className="mt-1 h-4 w-4 accent-[#E10600]"
                        />
                        J’atteste que mes informations sont exactes et autorise Lease Auto à les vérifier.
                      </label>
                      <button
                        type="button"
                        onClick={handleSubmitDossier}
                        className="w-full rounded-full bg-[#E10600] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white disabled:opacity-50"
                        disabled={!documentsComplete || !attestationChecked}
                      >
                        Envoyer mon dossier
                      </button>
                      <p className="text-xs text-[#5A5E66]">
                        Vous recevez un email + SMS de confirmation avec un lien “Mon dossier”.
                      </p>
                    </div>

                    <Link
                      to="/dossier/mon-dossier"
                      className="block rounded-3xl border border-[#ECECEC] bg-[#FDFDFD] p-5 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#E10600] hover:bg-white"
                    >
                      Accéder à mon dossier
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
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

  const statusConfig: Record<
    DocumentStatus,
    { label: string; className: string; icon: JSX.Element }
  > = {
    missing: {
      label: "🔴 Manquant",
      className: "bg-[#FEF2F2] text-[#B42318]",
      icon: <AlertCircle size={14} />,
    },
    pending: {
      label: "🟡 À vérifier",
      className: "bg-[#FFF7E6] text-[#B76E00]",
      icon: <Clock size={14} />,
    },
    validated: {
      label: "🟢 Validé",
      className: "bg-[#ECFDF3] text-[#067647]",
      icon: <CheckCircle2 size={14} />,
    },
  };

  return (
    <div
      className={clsx(
        "flex flex-col gap-4 rounded-3xl border p-5 transition hover:shadow-sm md:flex-row md:items-center md:justify-between",
        isActive ? "border-[#E10600] bg-[#FFF5F4]" : "border-[#ECECEC] bg-white",
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSelect();
      }}
    >
      <div className="flex flex-1 items-start gap-3">
        <span className="text-3xl" aria-hidden="true">
          {doc.icon}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-[0.4em] text-[#9FA3AE]">{doc.label}</p>
            <button
              type="button"
              onClick={(event) => event.stopPropagation()}
              className="rounded-full border border-[#ECECEC] p-1 text-[#9FA3AE] transition hover:border-[#E10600] hover:text-[#E10600]"
              title={doc.tooltip}
              aria-label={`En savoir plus sur ${doc.label}`}
            >
              <Info size={14} />
            </button>
          </div>
          <p className="mt-1 text-sm text-[#5A5E66]">{doc.description}</p>
          {doc.files.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-[#5A5E66]">
              {doc.files.map((file) => (
                <li key={file.id}>
                  {file.name} – {formatSize(file.size)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 md:items-end">
        <span
          className={clsx(
            "rounded-full px-4 py-1 text-xs font-semibold",
            statusConfig[doc.status].className,
          )}
        >
          <span className="flex items-center gap-1">
            {statusConfig[doc.status].icon}
            {statusConfig[doc.status].label}
          </span>
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-full border border-[#E10600] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#E10600]"
            onClick={(event) => {
              event.stopPropagation();
              inputRef.current?.click();
            }}
          >
            Ajouter
          </button>
        </div>
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
