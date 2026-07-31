import { SearchX } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { usePropertyStore } from "@/store/propertyStore";
import type { Property } from "@/types/property";
import PropertyCard from "./PropertyCard";
import PropertySkeleton from "./PropertySkeleton";

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  viewMode?: "grid" | "list";
}

export default function PropertyGrid({
  properties,
  loading = false,
  viewMode = "grid",
}: PropertyGridProps) {
  const { resetFilters } = usePropertyStore();
  const user = useAuthStore((state) => state.user);

  const isVisitScheduled = (propertyId: string) =>
    Boolean(
      user?.visitRequests.some((visit) => visit.propertyId === propertyId),
    );

  if (loading) {
    return (
      <div
        className={
          viewMode === "grid"
            ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            : "space-y-4"
        }
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <PropertySkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed bg-white p-8 text-center dark:bg-slate-900">
        <SearchX className="h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-xl font-semibold">No properties found</h3>
        <p className="mt-2 text-sm text-slate-500">
          Try adjusting your filters or search terms.
        </p>
        <button
          onClick={resetFilters}
          className="mt-5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          Reset filters
        </button>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          : "space-y-4"
      }
    >
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          viewMode={viewMode}
          visitScheduled={isVisitScheduled(property.id)}
        />
      ))}
    </div>
  );
}
