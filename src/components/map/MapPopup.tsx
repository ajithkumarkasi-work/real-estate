import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { formatPriceWithUnitINR } from "@/lib/utils";
import type { Property } from "@/types/property";

interface MapPopupProps {
  property: Property;
  onClose: () => void;
}

export default function MapPopup({ property, onClose }: MapPopupProps) {
  const navigate = useNavigate();

  return (
    <div className="relative w-72 overflow-hidden rounded-2xl border bg-white shadow-2xl dark:bg-slate-900">
      <button
        aria-label="Close popup"
        onClick={onClose}
        className="absolute right-2 top-2 rounded-full bg-white p-1 shadow"
      >
        <X className="h-4 w-4" />
      </button>
      <img
        src={property.images[0]}
        alt={property.title}
        className="h-20 w-full object-cover"
      />
      <div className="space-y-2 p-3">
        <p className="text-lg font-bold">
          {formatPriceWithUnitINR(property.price, property.priceUnit)}
        </p>
        <h4 className="line-clamp-2 text-sm font-semibold">{property.title}</h4>
        <p className="text-xs text-slate-500">
          {property.bedrooms} bd • {property.bathrooms} ba
        </p>
        <button
          onClick={() => navigate(`/property/${property.id}`)}
          className="w-full rounded-full bg-brand px-3 py-2 text-sm font-semibold text-white"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
