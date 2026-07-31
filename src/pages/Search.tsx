import { LayoutGrid, Rows3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

import PropertyFilters from "@/components/property/PropertyFilters";
import PropertyGrid from "@/components/property/PropertyGrid";
import { useFilteredProperties } from "@/hooks/useFilteredProperties";
import { DEFAULT_FILTERS, usePropertyStore } from "@/store/propertyStore";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { properties, filters, setFilters, viewMode, setViewMode } =
    usePropertyStore();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true,
  );

  useEffect(() => {
    const onResize = () => {
      const next = window.innerWidth >= 1024;
      setIsDesktop(next);
      if (!next) setViewMode("grid");
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setViewMode]);

  useEffect(() => {
    const next = {
      query: searchParams.get("q") ?? "",
      status: (searchParams.get("status") ?? "") as
        | ""
        | "for-sale"
        | "for-rent",
      type: (searchParams.get("type") ?? "") as
        | ""
        | "apartment"
        | "house"
        | "villa"
        | "studio"
        | "penthouse"
        | "townhouse",
      city: searchParams.get("city") ?? "",
      minPrice: Number(
        searchParams.get("minPrice") ?? DEFAULT_FILTERS.minPrice,
      ),
      maxPrice: Number(
        searchParams.get("maxPrice") ?? DEFAULT_FILTERS.maxPrice,
      ),
      minBeds: Number(searchParams.get("minBeds") ?? DEFAULT_FILTERS.minBeds),
      minBaths: Number(
        searchParams.get("minBaths") ?? DEFAULT_FILTERS.minBaths,
      ),
      sortBy:
        (searchParams.get("sortBy") as typeof DEFAULT_FILTERS.sortBy | null) ??
        DEFAULT_FILTERS.sortBy,
      amenities: searchParams.get("amenities")
        ? searchParams.get("amenities")!.split(",").filter(Boolean)
        : [],
    };
    usePropertyStore.setState({ filters: { ...DEFAULT_FILTERS, ...next } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const next = new URLSearchParams();
    if (filters.query) next.set("q", filters.query);
    if (filters.status) next.set("status", filters.status);
    if (filters.type) next.set("type", filters.type);
    if (filters.city) next.set("city", filters.city);
    if (filters.minPrice !== DEFAULT_FILTERS.minPrice)
      next.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice !== DEFAULT_FILTERS.maxPrice)
      next.set("maxPrice", String(filters.maxPrice));
    if (filters.minBeds !== DEFAULT_FILTERS.minBeds)
      next.set("minBeds", String(filters.minBeds));
    if (filters.minBaths !== DEFAULT_FILTERS.minBaths)
      next.set("minBaths", String(filters.minBaths));
    if (filters.sortBy !== DEFAULT_FILTERS.sortBy)
      next.set("sortBy", filters.sortBy);
    if (filters.amenities.length)
      next.set("amenities", filters.amenities.join(","));
    setSearchParams(next, { replace: true });
  }, [
    filters.query,
    filters.status,
    filters.type,
    filters.city,
    filters.minPrice,
    filters.maxPrice,
    filters.minBeds,
    filters.minBaths,
    filters.sortBy,
    filters.amenities,
    setSearchParams,
  ]);

  const filtered = useFilteredProperties(properties, filters);
  const effectiveViewMode = isDesktop ? viewMode : "grid";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Search Properties</h1>
          <p className="text-slate-500">{filtered.length} matching listings</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen(true)}
            className="rounded-full border px-4 py-2 text-sm lg:hidden"
          >
            Filters
          </button>
          {isDesktop ? (
            <>
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`rounded-full border p-2 ${viewMode === "grid" ? "bg-brand/10 text-brand" : ""}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`rounded-full border p-2 ${viewMode === "list" ? "bg-brand/10 text-brand" : ""}`}
              >
                <Rows3 className="h-4 w-4" />
              </button>
            </>
          ) : null}
          <Link to="/map" className="rounded-full border px-4 py-2 text-sm">
            Map View
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="hidden lg:block">
          <PropertyFilters />
        </div>
        <div className="min-w-0">
          <PropertyGrid properties={filtered} viewMode={effectiveViewMode} />
        </div>
      </div>

      {filtersOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-20 lg:hidden"
          onClick={() => setFiltersOpen(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="max-h-[calc(100vh-11rem)] overflow-y-auto p-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
              <PropertyFilters onClose={() => setFiltersOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
