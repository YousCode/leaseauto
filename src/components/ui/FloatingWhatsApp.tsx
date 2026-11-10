import { MessageCircle } from "lucide-react";

const num = import.meta.env.VITE_WHATSAPP_NUM || "33767793106";

/** Raccourci WhatsApp flottant : pastille « nuit » nette, sans ombre. */
export default function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${num}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Discuter sur WhatsApp"
      title="Discuter sur WhatsApp"
      className="group fixed bottom-4 right-4 z-30 grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-night text-white transition-[background-color,transform] duration-300 ease-out hover:bg-brand-ink active:scale-[0.98] md:bottom-6 md:right-6"
    >
      <MessageCircle aria-hidden className="h-6 w-6" />
      <span
        aria-hidden
        className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-night bg-emerald-600 transition-colors duration-300 group-hover:border-brand-ink"
      />
    </a>
  );
}
