import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "bg-black p-6 rounded-lg border border-gray-800 h-full flex flex-col",
        className,
      )}
    >
      <div className="bg-[#DA1212] p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 flex-grow">{description}</p>
    </motion.div>
  );
};

export default ServiceCard;
