import { Link } from "react-router-dom";
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Clock,
  Contact,
  FileCheck2,
  FileText,
  Home,
  Landmark,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { FooterSection } from "@/components/sections/FooterSection";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import clsx from "clsx";

const STATUS_TEXT: Record<
  "draft" | "submitted" | "under_review" | "approved" | "rejected",
  { label: string; badge: string }
> = {
  draft: { label: "Brouillon", badge: "bg-brand-primary-soft text-brand-primary-dark" },
  submitted: { label: "Envoyé", badge: "bg-slate-100 text-brand-ink" },
  under_review: { label: "En cours d’analyse", badge: "bg-brand-primary-soft text-brand-primary-dark" },
  approved: { label: "Validé", badge: "bg-emerald-50 text-emerald-700" },
  rejected: { label: "Refusé", badge: "bg-brand-primary-soft text-brand-primary-dark" },
};

type TrackingDocumentStatus = "approved" | "pending" | "missing";

const DOCUMENT_TRACKING_STATUS: Record<
  TrackingDocumentStatus,
  { label: string; badge: string; helper: string; icon: LucideIcon }
> = {
  approved: {
    label: "Validé",
    badge: "bg-emerald-50 text-emerald-700",
    helper: "Validé par le conseiller",
    icon: CheckCircle2,
  },
  pending: {
    label: "À vérifier",
    badge: "bg-amber-50 text-amber-700",
    helper: "Analyse en cours",
    icon: Clock,
  },
  missing: {
    label: "Manquant",
    badge: "bg-brand-primary-soft text-brand-primary-dark",
    helper: "Merci d’ajouter ce document",
    icon: AlertCircle,
  },
};

/* Pictogrammes des pièces (habillage) : l'identifiant peut porter un suffixe, ex. « fiches-paie2 ». */
const DOCUMENT_ICONS: [prefix: string, icon: LucideIcon][] = [
  ["piece-identite", Contact],
  ["domicile", Home],
  ["fiches-paie", Banknote],
  ["avis-imposition", FileText],
  ["rib", Landmark],
];
const documentIcon = (id: string): LucideIcon =>
  DOCUMENT_ICONS.find(([prefix]) => id.startsWith(prefix))?.[1] ?? FileText;

const MOCK_APPLICATION = {
  reference: "LA-2024-0912",
  profile: "Particulier",
  status: "under_review" as const,
  progressPercent: 72,
  updatedAt: "12 mars 2024 - 10:24",
  contact: {
    advisor: "Camille – Lease Auto",
    phone: "01 84 21 83 93",
    mail: "contact@lease-auto.fr",
  },
  documents: [
    { id: "piece-identite", label: "Pièce d’identité", icon: "🪪", status: "approved" },
    { id: "domicile", label: "Justificatif de domicile", icon: "🧾", status: "approved" },
    { id: "fiches-paie", label: "Fiche de paie Janvier", icon: "💶", status: "approved" },
    { id: "fiches-paie2", label: "Fiche de paie Février", icon: "💶", status: "approved" },
    { id: "fiches-paie3", label: "Fiche de paie Mars", icon: "💶", status: "pending" },
    { id: "avis-imposition", label: "Avis d’imposition", icon: "📄", status: "pending" },
    { id: "rib", label: "RIB", icon: "🏦", status: "approved" },
  ] as { id: string; label: string; icon: string; status: TrackingDocumentStatus }[],
  timeline: [
    { icon: Upload, title: "Dossier créé", description: "Vos informations ont été enregistrées", date: "10 mars – 09:15" },
    { icon: FileCheck2, title: "Pièces reçues", description: "6 documents reçus et lisibles", date: "11 mars – 14:32" },
    { icon: Clock, title: "Analyse en cours", description: "Un conseiller vérifie vos pièces", date: "12 mars – 09:05" },
  ],
  alerts: [
    {
      title: "Pièce manquante",
      message: "Merci d’ajouter votre avis d’imposition complet.",
      docId: "avis-imposition",
      status: "pending",
    },
  ],
  messages: [
    {
      author: "Camille – Lease Auto",
      content: "Pouvez-vous ajouter votre avis d’imposition complet ? Merci 🙌",
      date: "12 mars – 10:20",
    },
  ],
};

export default function DossierTrackingPage() {
  const status = STATUS_TEXT[MOCK_APPLICATION.status];
  const missingDocs = MOCK_APPLICATION.documents.filter((doc) => doc.status === "missing").length;
  const trackingStatusLabel =
    missingDocs === 0 ? "Complet" : `Manque ${missingDocs} pièce${missingDocs > 1 ? "s" : ""}`;
  const trackingStatusHelper =
    missingDocs === 0
      ? "Toutes les pièces requises sont en cours de validation."
      : "Ajoutez les pièces manquantes pour accélérer l’analyse.";
  const phoneHref = `tel:${MOCK_APPLICATION.contact.phone.replace(/\s+/g, "")}`;

  return (
    <div className="bg-paper text-slate-700">
      <PageHero
        eyebrow="Espace client • Mon dossier"
        title={
          <>
            Dossier <span className="num">{MOCK_APPLICATION.reference}</span>
          </>
        }
        subtitle={
          <>
            Profil {MOCK_APPLICATION.profile} — dernière mise à jour {MOCK_APPLICATION.updatedAt}
          </>
        }
        aside={
          <div className="surface-glass p-6 md:p-8">
            <p className="eyebrow eyebrow-dark">Progression globale</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="num display-md">{MOCK_APPLICATION.progressPercent}%</p>
              <p className="pb-1 text-sm font-semibold text-white">{trackingStatusLabel}</p>
            </div>
            <div
              role="progressbar"
              aria-label="Progression globale du dossier"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={MOCK_APPLICATION.progressPercent}
              className="mt-4 h-2 overflow-hidden rounded-full bg-white/15"
            >
              <div
                className="h-full w-full rounded-full bg-brand-primary-bright"
                style={{ transform: `translateX(-${100 - MOCK_APPLICATION.progressPercent}%)` }}
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/80">{trackingStatusHelper}</p>
            <p className="num mt-1 text-xs leading-relaxed text-white/65">
              {MOCK_APPLICATION.progressPercent}% complété — réponse sous 48h après réception complète des pièces
            </p>
          </div>
        }
      >
        <span className={clsx("inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold", status.badge)}>
          {status.label}
        </span>
      </PageHero>

      <main className="container-x py-10 md:py-16">
        <div className="grid gap-5 lg:grid-cols-12">
          <Reveal as="section" className="surface p-5 sm:p-8 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold text-night">Pièces justificatives</h2>
              <Link to="/dossier" className="btn btn-ghost btn-sm h-11">
                Ajouter un document
                <Plus />
              </Link>
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {MOCK_APPLICATION.documents.map((doc) => {
                const docStatus = DOCUMENT_TRACKING_STATUS[doc.status];
                const DocIcon = documentIcon(doc.id);
                const StatusIcon = docStatus.icon;
                return (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between gap-3 rounded-[20px] border border-slate-200 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <span
                        aria-hidden
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-paper text-night"
                      >
                        <DocIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-night">{doc.label}</p>
                        <p className="text-xs text-slate-500">{docStatus.helper}</p>
                      </div>
                    </div>
                    <span
                      className={clsx(
                        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                        docStatus.badge,
                      )}
                    >
                      <StatusIcon className="h-3.5 w-3.5" aria-hidden />
                      {docStatus.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <div className="space-y-5 lg:col-span-5">
            <Reveal as="section" delay={0.07} className="surface p-5 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-night">Messages & alertes</h2>
              {MOCK_APPLICATION.alerts.map((alert) => (
                <div key={alert.docId} className="mt-5 rounded-[20px] bg-amber-50 p-5 text-sm">
                  <p className="flex items-center gap-2 font-semibold text-amber-700">
                    <AlertCircle className="h-4 w-4" aria-hidden />
                    {alert.title}
                  </p>
                  <p className="mt-1 leading-relaxed text-slate-700">{alert.message}</p>
                  <Link to="/dossier" className="btn btn-dark btn-sm mt-4 h-11">
                    Ajouter le document
                    <Upload />
                  </Link>
                </div>
              ))}
              <div className="mt-4 space-y-3 text-sm">
                {MOCK_APPLICATION.messages.map((message, index) => (
                  <div key={`${message.author}-${index}`} className="rounded-[20px] bg-paper p-5">
                    <p className="flex items-center gap-2 text-sm font-semibold text-night">
                      <MessageSquare size={16} className="text-brand-primary" aria-hidden />
                      {message.author}
                    </p>
                    <p className="mt-2 leading-relaxed text-slate-700">{message.content}</p>
                    <p className="num mt-2 text-xs text-slate-500">{message.date}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal as="section" delay={0.14} className="surface-night grain relative overflow-hidden p-5 sm:p-8">
              <p className="eyebrow eyebrow-dark">Suivi</p>
              <h2 className="mt-3 font-display text-xl font-semibold">Votre conseiller</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                {MOCK_APPLICATION.contact.advisor} suit votre dossier et vous contacte si une pièce est manquante.
              </p>
              <ul className="mt-5 space-y-1 text-sm">
                <li>
                  <a
                    href={phoneHref}
                    className="num inline-flex min-h-[44px] items-center gap-3 text-white transition-colors hover:text-white/80"
                  >
                    <Phone size={18} className="text-brand-primary-bright" aria-hidden />
                    {MOCK_APPLICATION.contact.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${MOCK_APPLICATION.contact.mail}`}
                    className="inline-flex min-h-[44px] items-center gap-3 text-white transition-colors hover:text-white/80"
                  >
                    <Mail size={18} className="text-brand-primary-bright" aria-hidden />
                    {MOCK_APPLICATION.contact.mail}
                  </a>
                </li>
                <li className="flex min-h-[44px] items-center gap-3 text-white/80">
                  <Clock size={18} className="shrink-0 text-brand-primary-bright" aria-hidden />
                  Réponse sous 48h – suivi en temps réel par email/SMS
                </li>
              </ul>
            </Reveal>
          </div>

          <Reveal as="section" className="surface p-5 sm:p-8 lg:col-span-12">
            <h2 className="font-display text-xl font-semibold text-night">Historique des actions</h2>
            <ol className="mt-6 grid gap-6 md:grid-cols-3 md:gap-5">
              {MOCK_APPLICATION.timeline.map((item, index) => (
                <li key={`${item.title}-${index}`} className="flex gap-4 md:flex-col md:gap-0">
                  <div className="flex flex-col items-center md:flex-row">
                    <span
                      aria-hidden
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-night text-white"
                    >
                      <item.icon size={18} />
                    </span>
                    {index < MOCK_APPLICATION.timeline.length - 1 ? (
                      <span aria-hidden className="mt-2 w-px flex-1 bg-slate-200 md:ml-4 md:mt-0 md:h-px md:w-auto" />
                    ) : null}
                  </div>
                  <div className="pb-1 md:mt-4 md:pr-6">
                    <p className="font-semibold text-night">{item.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{item.description}</p>
                    <p className="num mt-1 text-xs text-slate-500">{item.date}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
