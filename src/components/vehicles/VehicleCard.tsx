import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import LazyImage from "@/components/ui/LazyImage";

export interface VehicleCardProps {
  slug?: string;
  image?: string;
  name?: string;
  price?: string;
  monthly?: string;
  city?: string;
  date?: string;
  onClick?: () => void;
}

const VehicleCard = ({
  slug = "toyota-corolla-touring-18-hybrid-sports-active",
  image = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&q=80",
  name = "TOYOTA COROLLA TOURING 1.8i 122 HK HYBRID SPORTS ACTIVE",
  price = "22990",
  monthly = "405",
  city = "Épinay-sur-Seine 93800",
  date = "2024-01-15",
  onClick = () => {},
}: VehicleCardProps) => {
  const { ref, isIntersecting } = useIntersectionObserver(0.15);

  const priceNumber = parseInt(price.replace(/\s/g, ""));
  const monthlyNumber = parseInt(monthly.replace(/\s/g, ""));
  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isIntersecting ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleClick}
    >
      {/* visuel 16/9 */}
      <figure className="relative overflow-hidden aspect-[16/9]">
        <LazyImage
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </figure>

      {/* contenu */}
      <div className="flex flex-1 flex-col gap-3 px-4 py-5">
        {/* titre */}
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 font-inter leading-tight">
          {name}
        </h3>

        {/* prix */}
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-xl font-bold text-[#E50914] font-premium">
            {priceNumber.toLocaleString("fr-FR")} €
          </span>
          <span className="text-sm text-gray-500 font-inter">
            {monthlyNumber.toLocaleString("fr-FR")} €/mois
          </span>
        </div>

        {/* localisation + date */}
        <div className="space-y-1">
          <p className="flex items-center gap-1 text-xs text-gray-500 font-inter">
            <MapPin size={14} className="shrink-0" />
            {city}
          </p>
          <p className="flex items-center gap-1 text-xs text-gray-500 font-inter">
            <Calendar size={14} className="shrink-0" />
            {formattedDate}
          </p>
        </div>

        {/* CTA */}
        <Link
          to={`/vehicules/${slug}`}
          className="mt-auto inline-flex items-center justify-center gap-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-800 transition-all duration-300 hover:border-[#E50914] hover:text-[#E50914] font-inter"
          onClick={(e) => e.stopPropagation()}
        >
          Voir le véhicule
          <ArrowRight size={16} />
        </Link>
      </div>
    </motion.article>
  );
};

export default VehicleCard;
