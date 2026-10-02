import { Link } from "react-router-dom";
import { CheckCircle2, Clock, FileCheck2, Mail, MessageSquare, Upload } from "lucide-react";
import { FooterSection } from "@/components/sections";
import clsx from "clsx";

const STATUS_TEXT: Record<
  "draft" | "submitted" | "under_review" | "approved" | "rejected",
  { label: string; badge: string }
> = {
  draft: { label: "Brouillon", badge: "bg-brand-primary-soft text-brand-primary-dark" },
  submitted: { label: "Envoyé", badge: "bg-[#E6F0FF] text-[#0B4BC7]" },
  under_review: { label: "En cours d’analyse", badge: "bg-brand-primary-soft text-brand-primary-dark" },
  approved: { label: "Validé", badge: "bg-[#ECFDF3] text-[#067647]" },
  rejected: { label: "Refusé", badge: "bg-brand-primary-soft text-brand-primary-dark" },
};

type TrackingDocumentStatus = "approved" | "pending" | "missing";

const DOCUMENT_TRACKING_STATUS: Record<
  TrackingDocumentStatus,
  { label: string; badge: string; helper: string }
> = {
  approved: {
    label: "🟢 Validé",
    badge: "bg-[#ECFDF3] text-[#067647]",
    helper: "Validé par le conseiller",
  },
  pending: {
    label: "🟡 À vérifier",
    badge: "bg-brand-primary-soft text-brand-primary-dark",
    helper: "Analyse en cours",
  },
  missing: {
    label: "🔴 Manquant",
    badge: "bg-brand-primary-soft text-brand-primary-dark",
    helper: "Merci d’ajouter ce document",
  },
};

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
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#334155]">
      <main className="px-4 pt-8 pb-16 md:px-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#E2E8F0] md:p-10">
            <p className="text-xs uppercase tracking-[0.4em] text-[#94A3B8]">Espace client • Mon dossier</p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-semibold leading-tight">
                  Dossier {MOCK_APPLICATION.reference}
                </h1>
                <p className="mt-2 text-sm text-[#64748B]">
                  Profil {MOCK_APPLICATION.profile} — dernière mise à jour {MOCK_APPLICATION.updatedAt}
                </p>
              </div>
              <span className={clsx("rounded-full px-4 py-2 text-sm font-semibold", status.badge)}>
                {status.label}
              </span>
            </div>
            <div className="mt-6 space-y-3 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5">
              <div>
                <p className="text-sm font-semibold text-[#64748B]">Progression globale</p>
                <p className="text-base font-semibold text-brand-primary">{trackingStatusLabel}</p>
                <p className="text-xs text-[#94A3B8]">{trackingStatusHelper}</p>
              </div>
              <div className="h-3 rounded-full bg-[#E2E8F0]">
                <div
                  className="h-full rounded-full bg-brand-primary transition-all"
                  style={{ width: `${MOCK_APPLICATION.progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-[#64748B]">
                {MOCK_APPLICATION.progressPercent}% complété — réponse sous 48h après réception complète des pièces
              </p>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#E2E8F0] md:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Pièces justificatives</h2>
                <Link
                  to="/dossier"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-primary"
                >
                  Ajouter un document
                </Link>
              </div>
              <ul className="mt-5 space-y-3 text-sm">
                {MOCK_APPLICATION.documents.map((doc) => {
                  const docStatus = DOCUMENT_TRACKING_STATUS[doc.status];
                  return (
                    <li
                      key={doc.id}
                      className="flex flex-col gap-3 rounded-2xl border border-[#E2E8F0] p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl" aria-hidden="true">
                          {doc.icon}
                        </span>
                        <div>
                          <p className="font-semibold text-[#1E293B]">{doc.label}</p>
                          <p className="text-xs text-[#64748B]">{docStatus.helper}</p>
                        </div>
                      </div>
                      <span className={clsx("rounded-full px-4 py-1 text-xs font-semibold", docStatus.badge)}>
                        {docStatus.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#E2E8F0]">
                <h2 className="text-lg font-semibold">Messages & alertes</h2>
                {MOCK_APPLICATION.alerts.map((alert) => (
                  <div
                    key={alert.docId}
                    className="mt-4 rounded-2xl border border-brand-primary-soft bg-brand-primary-soft p-4 text-sm"
                  >
                    <p className="font-semibold text-brand-primary-dark">{alert.title}</p>
                    <p className="mt-1 text-[#64748B]">{alert.message}</p>
                    <Link
                      to="/dossier"
                      className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-primary"
                    >
                      Ajouter le document
                      <Upload size={14} />
                    </Link>
                  </div>
                ))}
                <div className="mt-4 space-y-3 text-sm">
                  {MOCK_APPLICATION.messages.map((message, index) => (
                    <div key={`${message.author}-${index}`} className="rounded-2xl border border-[#E2E8F0] p-4">
                      <p className="flex items-center gap-2 text-sm font-semibold text-[#1E293B]">
                        <MessageSquare size={16} className="text-brand-primary" />
                        {message.author}
                      </p>
                      <p className="mt-2 text-[#64748B]">{message.content}</p>
                      <p className="mt-1 text-xs text-[#94A3B8]">{message.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#E2E8F0]">
                <h2 className="text-lg font-semibold">Votre conseiller</h2>
                <p className="mt-2 text-sm text-[#64748B]">
                  {MOCK_APPLICATION.contact.advisor} suit votre dossier et vous contacte si une pièce est manquante.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[#1E293B]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-brand-primary" />
                    {MOCK_APPLICATION.contact.phone}
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail size={18} className="text-brand-primary" />
                    {MOCK_APPLICATION.contact.mail}
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock size={18} className="text-brand-primary" />
                    Réponse sous 48h – suivi en temps réel par email/SMS
                  </li>
                </ul>
              </div>
            </section>
          </div>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#E2E8F0] md:p-8">
            <h2 className="text-lg font-semibold">Historique des actions</h2>
            <div className="mt-4 space-y-4">
              {MOCK_APPLICATION.timeline.map((item, index) => (
                <div key={`${item.title}-${index}`} className="flex gap-3">
                  <div className="mt-1 rounded-full bg-brand-primary-soft p-3 text-brand-primary">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E293B]">{item.title}</p>
                    <p className="text-sm text-[#64748B]">{item.description}</p>
                    <p className="text-xs text-[#94A3B8]">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
