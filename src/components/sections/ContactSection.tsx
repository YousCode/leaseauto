"use client";

import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight, Clock, Instagram, Mail, MapPin, Phone, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const schema = z.object({
  nom: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  tel: z.string().min(10, "Téléphone requis"),
  projet: z.string().min(1, "Sélectionnez un projet"),
  message: z.string().min(10, "Décrivez votre besoin"),
});

type FormData = z.infer<typeof schema>;

const REVIEWS_URL =
  "https://www.google.com/search?sa=X&sca_esv=6a0b219675808712&sxsrf=ANbL-n6zw8TriEPW1S9ObJM7ZajW-hcIgA:1769505889594&q=Lease+Auto+Avis&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxIxNDY0MLAwNzczsrSwNLYwMzSzNNzAyPiKkd8nNbE4VcGxtCRfwbEss3gRK7oIAH42MQs_AAAA&rldimm=13100877629893861691&tbm=lcl&hl=fr-FR&ved=2ahUKEwixquiPs6uSAxVLfaQEHTySBl4Q9fQKegQIPxAG&biw=1470&bih=801&dpr=2&aic=0#lkt=LocalPoiReviews";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Lease%20Auto%2042%20Boulevard%20Foch%2093800%20%C3%89pinay-sur-Seine";

const labelClass = "mb-2 block text-sm font-medium text-night";
const fieldState = (invalid: boolean) => (invalid ? "border-red-500 focus:border-red-500" : "");

const FieldError = ({ id, msg }: { id: string; msg?: string }) =>
  msg ? (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-red-500">
      {msg}
    </p>
  ) : null;

const infoLabel = "text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50";

type ContactSectionProps = {
  /** Affiche l'en-tête (h2) de la section. À désactiver quand un PageHero porte déjà le titre. */
  showHeading?: boolean;
};

export const ContactSection = ({ showHeading = true }: ContactSectionProps) => {
  const uid = useId();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { toast } = useToast();
  const projet = watch("projet") ?? "";

  const onSubmit = async (data: FormData) => {
    const subject = encodeURIComponent(`Demande contact Lease Auto - ${data.nom}`);
    const body = encodeURIComponent(
      `Nom : ${data.nom}\nEmail : ${data.email}\nTéléphone : ${data.tel}\nProjet : ${data.projet}\n\nMessage :\n${data.message}`
    );

    try {
      await navigator.clipboard.writeText(
        `To: leaseauto.epinay@gmail.com\nSubject: ${decodeURIComponent(subject)}\n\n${decodeURIComponent(body)}`
      );
    } catch {
      // Presse-papiers indisponible : le brouillon d'email s'ouvre quand même.
    }

    window.location.href = `mailto:leaseauto.epinay@gmail.com?subject=${subject}&body=${body}`;

    toast({
      title: "Brouillon ouvert",
      description: "Un email prérempli vers leaseauto.epinay@gmail.com a été généré. Vérifiez puis envoyez.",
      duration: 4500,
    });

    reset();
  };

  const ids = {
    nom: `${uid}-nom`,
    email: `${uid}-email`,
    tel: `${uid}-tel`,
    projet: `${uid}-projet`,
    message: `${uid}-message`,
  };
  const err = (name: keyof FormData) => `${ids[name]}-error`;
  const describedBy = (name: keyof FormData) => (errors[name] ? err(name) : undefined);

  return (
    <section className="section bg-paper">
      <div className="container-x">
        {showHeading ? (
          <SectionHeading
            eyebrow="Contact"
            title="Louer ou acheter votre prochain véhicule ?"
            subtitle={
              <>
                Nos experts Lease Auto vous accompagnent du choix jusqu’à la clé en main.{" "}
                <span className="font-semibold text-night">Financement 100% sur-mesure.</span>
              </>
            }
          />
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-6">
          {/* Formulaire */}
          <Reveal className="surface p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Formulaire</p>
                <h2 className="display-md mt-4 text-night">Demande rapide</h2>
              </div>
              <a href={REVIEWS_URL} target="_blank" rel="noreferrer" className="chip num min-h-[36px] hover:border-slate-300">
                <Star aria-hidden className="h-3.5 w-3.5 fill-brand-primary text-brand-primary" />
                4,9/5 Google
                <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
              </a>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {["Réponse rapide", "Financement", "Livraison possible"].map((item) => (
                <li key={item} className="chip">
                  {item}
                </li>
              ))}
            </ul>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor={ids.nom} className={labelClass}>
                    Votre nom *
                  </label>
                  <input
                    id={ids.nom}
                    autoComplete="name"
                    aria-invalid={!!errors.nom}
                    aria-describedby={describedBy("nom")}
                    {...register("nom")}
                    className={`field ${fieldState(!!errors.nom)}`}
                  />
                  <FieldError id={err("nom")} msg={errors.nom?.message} />
                </div>

                <div>
                  <label htmlFor={ids.email} className={labelClass}>
                    Votre e-mail *
                  </label>
                  <input
                    id={ids.email}
                    type="email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={describedBy("email")}
                    {...register("email")}
                    className={`field ${fieldState(!!errors.email)}`}
                  />
                  <FieldError id={err("email")} msg={errors.email?.message} />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor={ids.tel} className={labelClass}>
                    Votre téléphone *
                  </label>
                  <input
                    id={ids.tel}
                    type="tel"
                    autoComplete="tel"
                    aria-invalid={!!errors.tel}
                    aria-describedby={describedBy("tel")}
                    {...register("tel")}
                    className={`field ${fieldState(!!errors.tel)}`}
                  />
                  <FieldError id={err("tel")} msg={errors.tel?.message} />
                </div>

                <div>
                  <label htmlFor={ids.projet} className={labelClass}>
                    Type de projet *
                  </label>
                  <input type="hidden" {...register("projet")} />
                  <Select value={projet} onValueChange={(value) => setValue("projet", value, { shouldValidate: true })}>
                    <SelectTrigger
                      id={ids.projet}
                      aria-invalid={!!errors.projet}
                      aria-describedby={describedBy("projet")}
                      className={`h-12 rounded-2xl border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-none transition-colors focus:border-night focus:ring-0 data-[state=open]:border-night data-[placeholder]:text-slate-400 ${fieldState(
                        !!errors.projet
                      )}`}
                    >
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="loa-lld" className="rounded-xl py-2.5">
                        Location (LOA / LLD)
                      </SelectItem>
                      <SelectItem value="achat" className="rounded-xl py-2.5">
                        Achat comptant ou financement
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError id={err("projet")} msg={errors.projet?.message} />
                </div>
              </div>

              <div>
                <label htmlFor={ids.message} className={labelClass}>
                  Votre message *
                </label>
                <textarea
                  id={ids.message}
                  rows={6}
                  aria-invalid={!!errors.message}
                  aria-describedby={describedBy("message")}
                  {...register("message")}
                  placeholder="Ex : BMW Série 3, budget 400€/mois, livraison mars…"
                  className={`field h-auto min-h-[160px] resize-y py-3.5 leading-relaxed ${fieldState(!!errors.message)}`}
                />
                <FieldError id={err("message")} msg={errors.message?.message} />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg w-full">
                {isSubmitting ? (
                  "Envoi en cours..."
                ) : (
                  <>
                    Envoyer ma demande gratuite
                    <ArrowUpRight />
                  </>
                )}
              </button>

              <p className="text-xs leading-relaxed text-slate-500">
                En cliquant, vous ouvrez un email prérempli. Vos informations ne sont pas stockées.
              </p>
            </form>
          </Reveal>

          {/* Coordonnées */}
          <Reveal delay={0.08} className="lg:sticky lg:top-24">
            <div className="surface-night grain relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand-ink/70 blur-[100px]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-40 -left-28 h-72 w-72 rounded-full bg-brand-primary/20 blur-[110px]"
              />

              <div className="relative z-10">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow eyebrow-dark">Agence</p>
                    <h2 className="display-md mt-4">Contact direct</h2>
                  </div>
                  <a
                    href={REVIEWS_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="4,9 sur 5 : voir les avis Google"
                    className="chip-dark num min-h-[36px] transition-colors hover:border-white/40"
                  >
                    <Star aria-hidden className="h-3.5 w-3.5 fill-white text-white" />
                    4,9/5
                    <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="mt-8">
                  <p className={infoLabel}>Téléphone</p>
                  <a
                    href="tel:0184218393"
                    className="num mt-2 block font-display text-4xl font-bold tracking-tight text-white transition-colors hover:text-white/80 sm:text-[2.75rem]"
                  >
                    01 84 21 83 93
                  </a>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <a href="tel:0184218393" className="btn btn-primary">
                    <Phone />
                    Appeler
                  </a>
                  <a href="mailto:leaseauto.epinay@gmail.com" className="btn btn-ghost-dark">
                    <Mail />
                    Email
                  </a>
                </div>

                <dl className="mt-8 divide-y divide-white/10 border-t border-white/10">
                  <div className="py-5">
                    <dt className={infoLabel}>Email</dt>
                    <dd className="mt-2">
                      <a
                        href="mailto:leaseauto.epinay@gmail.com"
                        className="break-all text-base font-medium text-white underline-offset-4 hover:underline"
                      >
                        leaseauto.epinay@gmail.com
                      </a>
                    </dd>
                  </div>

                  <div className="py-5">
                    <dt className={`flex items-center gap-2 ${infoLabel}`}>
                      <MapPin aria-hidden className="h-3.5 w-3.5 text-brand-primary-bright" /> Adresse
                    </dt>
                    <dd className="mt-3">
                      <a
                        href={MAPS_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="group block rounded-[20px] border border-white/10 bg-white/5 p-5 transition-colors duration-300 hover:border-white/30"
                      >
                        <span className="block font-display text-lg font-semibold text-white">Lease Auto</span>
                        <span className="mt-1 block text-white/65">42 Bd Foch</span>
                        <span className="block text-white/65">93800 Épinay-sur-Seine</span>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                          Ouvrir sur Google Maps
                          <ArrowUpRight
                            aria-hidden
                            className="h-4 w-4 text-brand-primary-bright transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </span>
                      </a>
                    </dd>
                  </div>

                  <div className="py-5">
                    <dt className={`flex items-center gap-2 ${infoLabel}`}>
                      <Clock aria-hidden className="h-3.5 w-3.5 text-brand-primary-bright" /> Horaires
                    </dt>
                    <dd className="num mt-2 font-display text-xl font-semibold text-white">Lun–Sam 9h–19h</dd>
                  </div>

                  <div className="pt-5">
                    <dt className={infoLabel}>Nos réseaux</dt>
                    <dd className="mt-3 flex gap-3">
                      <a
                        href="https://instagram.com/leaseauto.epinay"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Instagram"
                        className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition-colors duration-300 hover:border-white hover:bg-white hover:text-night"
                      >
                        <Instagram aria-hidden className="h-[18px] w-[18px]" />
                      </a>
                      <a
                        href="https://tiktok.com/@leaseauto.epinay"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="TikTok"
                        className="inline-flex h-11 items-center rounded-full border border-white/15 px-4 text-xs font-semibold text-white/80 transition-colors duration-300 hover:border-white hover:bg-white hover:text-night"
                      >
                        <span aria-hidden>TikTok</span>
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
