import { useNavigate } from "react-router-dom";

import { formatPriceWithUnitINR } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { usePropertyStore } from "@/store/propertyStore";

interface PropertySuggestionProps {
  propertyId: string;
}

export default function PropertySuggestion({
  propertyId,
}: PropertySuggestionProps) {
  const navigate = useNavigate();
  const { close } = useChatStore();
  const property = usePropertyStore((state) =>
    state.properties.find((entry) => entry.id === propertyId),
  );

  if (!property) return null;

  return (
    <div className="mt-3 flex items-center gap-3 rounded-2xl border bg-white p-2 dark:bg-slate-900">
      <img
        src={property.images[0]}
        alt={property.title}
        className="h-16 w-16 rounded-xl object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">
          {formatPriceWithUnitINR(property.price, property.priceUnit)}
        </p>
        <p className="truncate text-sm text-slate-500">{property.title}</p>
        <p className="text-xs text-slate-400">
          {property.bedrooms} bd • {property.bathrooms} ba
        </p>
      </div>
      <button
        onClick={() => {
          close();
          navigate(`/property/${property.id}`);
        }}
        className="rounded-full bg-brand px-3 py-2 text-xs font-semibold text-white"
      >
        View
      </button>
    </div>
  );
}
