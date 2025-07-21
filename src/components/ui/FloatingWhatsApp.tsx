import { MessageCircle } from "lucide-react";

const num = import.meta.env.VITE_WHATSAPP_NUM; // 33767793106

export default function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${num}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Discuter sur WhatsApp"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600
                 text-white p-4 rounded-full shadow-lg z-50 transition-colors duration-300"
    >
      <MessageCircle size={24} />
    </a>
  );
}
