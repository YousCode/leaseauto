"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, MessageCircle, MapPin, Clock, Instagram, Star, ExternalLink, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-red-500 text-xs mt-1 font-medium">{msg}</p> : null;

export const ContactSection = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    const subject = encodeURIComponent(`Demande contact Lease Auto - ${data.nom}`);
    const body = encodeURIComponent(
      `Nom : ${data.nom}\nEmail : ${data.email}\nTéléphone : ${data.tel}\nProjet : ${data.projet}\n\nMessage :\n${data.message}`
    );

    try {
      await navigator.clipboard.writeText(
        `To: leaseauto.epinay@gmail.com\nSubject: ${decodeURIComponent(subject)}\n\n${decodeURIComponent(body)}`
      );
    } catch {}

    window.location.href = `mailto:leaseauto.epinay@gmail.com?subject=${subject}&body=${body}`;

    toast({
      title: "Brouillon ouvert",
      description: "Un email prérempli vers leaseauto.epinay@gmail.com a été généré. Vérifie et envoie.",
      duration: 4500,
    });

    reset();
  };

  return (
    <section className="w-full bg-gradient-to-b from-[#F9F9F9] to-white py-16 md:py-24 px-4 relative overflow-hidden">
      {/* halos */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-[#c7d2fe]/40 blur-[110px]" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#cfd9e9]/40 blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-6xl xl:max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-light text-transparent bg-gradient-to-r from-[#0f172a] to-[#334155] bg-clip-text mb-4 md:mb-6 font-premium tracking-wide">
            Louer ou acheter votre prochain véhicule ?
          </h2>
          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto font-inter leading-relaxed">
            Nos experts Lease Auto vous accompagnent du choix jusqu’à la clé en main.
            <span className="font-semibold text-[#1f3a8a]"> Financement 100% sur-mesure.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 lg:gap-8 items-start lg:items-stretch">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="bg-white/90 backdrop-blur-sm p-6 md:p-8 lg:p-10 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-500 h-full flex flex-col"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-[#1f2937]">Formulaire</p>
                <h3 className="mt-1 text-2xl font-semibold text-[#111]">Demande rapide</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Réponse rapide • Financement • Livraison possible
                </p>
              </div>

              <a
                href={REVIEWS_URL}
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-[#111] hover:bg-slate-200"
              >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                4,9/5 Google <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    {...register("nom")}
                    placeholder="Votre nom *"
                    className={`h-12 pl-10 bg-white/60 border-gray-200 transition-all focus-visible:ring-[#1f3a8a]/20 ${
                      errors.nom ? "border-red-500 focus-visible:ring-red-500/25" : "hover:border-[#1f3a8a]/30 focus-visible:border-[#1f3a8a]"
                    }`}
                  />
                  <FieldError msg={errors.nom?.message} />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="email"
                    {...register("email")}
                    placeholder="Votre e-mail *"
                    className={`h-12 pl-10 bg-white/60 border-gray-200 transition-all focus-visible:ring-[#1f3a8a]/20 ${
                      errors.email ? "border-red-500 focus-visible:ring-red-500/25" : "hover:border-[#1f3a8a]/30 focus-visible:border-[#1f3a8a]"
                    }`}
                  />
                  <FieldError msg={errors.email?.message} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="tel"
                    {...register("tel")}
                    placeholder="Votre téléphone *"
                    className={`h-12 pl-10 bg-white/60 border-gray-200 transition-all focus-visible:ring-[#1f3a8a]/20 ${
                      errors.tel ? "border-red-500 focus-visible:ring-red-500/25" : "hover:border-[#1f3a8a]/30 focus-visible:border-[#1f3a8a]"
                    }`}
                  />
                  <FieldError msg={errors.tel?.message} />
                </div>

                <div className="relative">
                  <input type="hidden" {...register("projet")} />
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none z-10" />
                  <Select onValueChange={(value) => setValue("projet", value, { shouldValidate: true })}>
                    <SelectTrigger
                      className={`h-12 pl-10 bg-white/60 border-gray-200 hover:border-[#1f3a8a]/30 data-[state=open]:border-[#1f3a8a] ${
                        errors.projet ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Type de projet *" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loa-lld">Location (LOA / LLD)</SelectItem>
                      <SelectItem value="achat">Achat comptant ou financement</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError msg={errors.projet?.message} />
                </div>
              </div>

              <div className="relative">
                <MessageCircle className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
                <Textarea
                  {...register("message")}
                  placeholder="Ex : BMW Série 3, budget 400€/mois, livraison mars…"
                  className={`pl-12 pt-10 bg-white/60 border-gray-200 hover:border-[#1f3a8a]/30 focus-visible:ring-2 focus-visible:ring-[#1f3a8a]/20 min-h-[150px] ${
                    errors.message ? "border-red-500" : "focus-visible:border-[#1f3a8a]"
                  }`}
                />
                <FieldError msg={errors.message?.message} />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 md:h-14 bg-gradient-to-r from-[#e84b3c] to-[#f0655b] hover:from-[#d84032] hover:to-[#e9584c] text-white rounded-xl font-inter font-medium text-base md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <span className="inline-flex items-center gap-2">
                  {isSubmitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer ma demande gratuite
                    </>
                  )}
                </span>
              </Button>

              <p className="text-xs text-gray-500">
                En cliquant, vous ouvrez un email prérempli. Vos informations ne sont pas stockées.
              </p>
            </form>
          </motion.div>

          {/* Contacts */}
          <motion.div
            initial={{ opacity: 0, x: 22 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-24 space-y-6 h-full"
          >
            <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 lg:p-10 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
              <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-[#0f172a] to-[#1f2937] rounded-2xl flex items-center justify-center shadow-lg">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-premium text-[#111]">Contact direct</h4>
                    <a
                      href={REVIEWS_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#1f3a8a]"
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="font-semibold">(4.9/5)</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <a
                  href="tel:0184218393"
                  className="h-12 rounded-xl bg-gradient-to-r from-[#e84b3c] to-[#f0655b] text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition"
                >
                  <Phone className="w-4 h-4" />
                  Appeler
                </a>
                <a 
                  href="mailto:leaseauto.epinay@gmail.com"
                  className="h-12 rounded-xl border border-[#f3b8b0] bg-white font-semibold flex items-center justify-center gap-2 text-[#b33527] hover:border-[#e84b3c] hover:text-[#9f2b20] hover:bg-[#fff7f5] transition"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </div>

              <div className="space-y-6">
                <div>
                  <h5 className="text-sm font-semibold text-[#111] mb-1">Téléphone</h5>
                  <a
                    href="tel:0184218393"
                    className="text-2xl font-bold text-[#0f172a] hover:underline block"
                  >
                    01 84 21 83 93
                  </a>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-[#111] mb-1">Email</h5>
                  <a
                    href="mailto:leaseauto.epinay@gmail.com"
                    className="text-[#0f172a] font-semibold hover:underline break-all block"
                  >
                    leaseauto.epinay@gmail.com
                  </a>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-[#111] mb-2 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" /> Adresse
                  </h5>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-gray-200 bg-gray-50 p-4 hover:border-[#1f3a8a]/25 transition"
                  >
                    <p className="font-semibold text-gray-900">Lease Auto</p>
                    <p className="text-gray-700">42 Bd Foch</p>
                    <p className="text-gray-700">93800 Épinay-sur-Seine</p>
                    <p className="mt-2 text-sm font-semibold text-[#e84b3c] inline-flex items-center gap-2">
                      Ouvrir sur Google Maps <ExternalLink className="w-4 h-4" />
                    </p>
                  </a>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-[#111] mb-2 flex items-center">
                    <Clock className="w-5 h-5 mr-2" /> Horaires
                  </h5>
                  <p className="text-xl font-semibold text-gray-800">Lun–Sam 9h–19h</p>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-[#111] mb-2">Nos réseaux</h5>
                  <div className="flex gap-3">
                    <a
                      href="https://instagram.com/leaseauto.epinay"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-6 h-6 text-[#1f3a8a]" />
                    </a>
                    <a
                      href="https://tiktok.com/@leaseauto.epinay"
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                      aria-label="TikTok"
                    >
                      <span className="w-6 h-6 flex items-center justify-center text-xs font-semibold text-[#1f3a8a]">
                        TikTok
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
