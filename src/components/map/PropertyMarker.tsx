import { motion } from "framer-motion";

import type { Property } from "@/types/property";

interface PropertyMarkerProps {
  property: Property;
  isSelected: boolean;
  onClick: () => void;
}

function formatPrice(price: number, unit: Property["priceUnit"]) {
  if (price >= 1000000)
    return `${(price / 1000000).toFixed(1)}M${unit === "month" ? "/mo" : ""}`;
  if (price >= 1000)
    return `${(price / 1000).toFixed(1)}k${unit === "month" ? "/mo" : ""}`;
  return `${price}${unit === "month" ? "/mo" : ""}`;
}

export default function PropertyMarker({
  property,
  isSelected,
  onClick,
}: PropertyMarkerProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.08 }}
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold shadow-lg ${isSelected ? "bg-brand text-white" : "bg-white text-slate-900"}`}
    >
      {formatPrice(property.price, property.priceUnit)}
    </motion.button>
  );
}
