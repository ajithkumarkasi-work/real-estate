import { Bath, BedDouble, Heart, MapPin, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
import { useFavoritesStore } from "@/store/favoritesStore";
import type { Property } from "@/types/property";
import { cn, formatPriceWithUnitINR } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  viewMode?: "grid" | "list";
  visitScheduled?: boolean;
}

const statusClasses: Record<Property["status"], string> = {
  "for-rent": "bg-emerald-500 text-white",
  "for-sale": "bg-blue-500 text-white",
  sold: "bg-slate-500 text-white",
  rented: "bg-slate-500 text-white",
};

export default function PropertyCard({
  property,
  viewMode = "grid",
  visitScheduled = false,
}: PropertyCardProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const { toggle, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(property.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "group overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-xl dark:bg-slate-900",
        viewMode === "list" && "md:h-[230px]",
      )}
    >
      <Link
        to={`/property/${property.id}`}
        state={{ backgroundLocation: location }}
        className={cn(
          viewMode === "list" ? "block md:flex md:h-full" : "block",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-slate-200",
            viewMode === "list"
              ? "aspect-[4/3] md:h-full md:w-[320px] md:shrink-0"
              : "aspect-[4/3]",
          )}
        >
          <img
            src={property.images[0]}
            alt={property.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold capitalize",
              statusClasses[property.status],
            )}
          >
            {property.status.replace("-", " ")}
          </span>
          {visitScheduled ? (
            <span className="absolute left-3 top-12 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
              Visit Scheduled
            </span>
          ) : null}
          <button
            aria-label="Toggle favorite"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (!isAuthenticated) {
                toast.error("Please log in to save favorites");
                return;
              }
              toggle(property.id);
            }}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-700 shadow-md backdrop-blur"
          >
            <Heart
              className={cn("h-4 w-4", favorite && "fill-red-500 text-red-500")}
            />
          </button>
        </div>
        <div className="space-y-3 p-4 md:p-5">
          <div>
            <p className="text-2xl font-bold text-slate-950 dark:text-white">
              {formatPriceWithUnitINR(property.price, property.priceUnit)}
            </p>
            <h3 className="mt-1 truncate text-lg font-semibold">
              {property.title}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4 shrink-0" />
              <span
                className={cn(
                  "min-w-0",
                  viewMode === "list" ? "md:line-clamp-2" : "truncate",
                )}
              >
                {property.address}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" /> {property.bedrooms}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" /> {property.bathrooms}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Maximize2 className="h-4 w-4" /> {property.area} sqft
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
