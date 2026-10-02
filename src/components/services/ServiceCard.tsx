import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { DURATION, EASE, DISTANCE } from "@/lib/motion";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  delay?: number;
  className?: string;
}

const ServiceCard = ({
  title,
  description,
  icon,
  delay = 0,
  className,
}: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: DISTANCE }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION, ease: EASE, delay: delay * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "bg-black p-6 rounded-lg border border-slate-800 h-full flex flex-col",
        className,
      )}
    >
      <div className="bg-brand-primary p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 flex-grow">{description}</p>
    </motion.div>
  );
};

export default ServiceCard;
