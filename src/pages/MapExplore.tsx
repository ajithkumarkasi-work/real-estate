import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";

import MapView from "@/components/map/MapView";
import PropertyFilters from "@/components/property/PropertyFilters";
import PropertyCard from "@/components/property/PropertyCard";
import { useFilteredProperties } from "@/hooks/useFilteredProperties";
import { useAuthStore } from "@/store/authStore";
import { usePropertyStore } from "@/store/propertyStore";

export default function MapExplore() {
  const [searchParams] = useSearchParams();
  const { properties, filters } = usePropertyStore();
  const user = useAuthStore((state) => state.user);
  const filtered = useFilteredProperties(properties, filters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"map" | "details">("map");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const detailsScrollRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const focusId = searchParams.get("focus");
    if (!focusId) return;

    const existsInFiltered = filtered.some(
      (property) => property.id === focusId,
    );
    if (!existsInFiltered) return;

    setSelectedId(focusId);
  }, [filtered, searchParams]);

  useEffect(() => {
    if (!selectedId) return;
    if (activeTab !== "details") return;

    const timer = window.setTimeout(() => {
      const target = refs.current[selectedId];
      const container = detailsScrollRef.current;
      if (!target || !container) return;

      const nextTop =
        target.offsetTop - container.clientHeight / 2 + target.clientHeight / 2;

      container.scrollTo({
        top: Math.max(0, nextTop),
        behavior: "smooth",
      });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [selectedId, activeTab, filtered.length]);

  useEffect(() => {
    if (activeTab !== "details") return;
    if (!selectedId && filtered.length) {
      setSelectedId(filtered[0].id);
    }
  }, [activeTab, filtered, selectedId]);

  const detailsContent = (
    <div className="space-y-5">
      <div className="space-y-4 pb-2">
        {filtered.map((property) => (
          <div
            key={property.id}
            ref={(node) => {
              refs.current[property.id] = node;
            }}
            className={`rounded-3xl border transition ${
              selectedId === property.id
                ? "border-brand/60 bg-brand/10 shadow-sm dark:bg-brand/20"
                : "border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            }`}
          >
            <div
              onClick={() => setSelectedId(property.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedId(property.id);
                }
              }}
              className="block w-full cursor-pointer bg-transparent text-left"
            >
              <PropertyCard
                property={property}
                visitScheduled={Boolean(
                  user?.visitRequests.some(
                    (visit) => visit.propertyId === property.id,
                  ),
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="flex h-full min-h-0 flex-col lg:hidden">
        <div className="border-b bg-white/90 px-4 py-3 backdrop-blur dark:bg-slate-900/90">
          <div className="flex justify-center">
            <div className="inline-grid w-full max-w-xs grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
              <button
                onClick={() => setActiveTab("map")}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  activeTab === "map"
                    ? "bg-brand text-white shadow"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  activeTab === "details"
                    ? "bg-brand text-white shadow"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                Details
              </button>
            </div>
          </div>
        </div>
        {activeTab === "map" ? (
          <main className="min-h-0 flex-1 p-4 md:p-6">
            <MapView
              properties={filtered}
              selectedId={selectedId ?? undefined}
              onSelect={setSelectedId}
              onMarkerSelect={(id) => {
                setSelectedId(id);
                setActiveTab("details");
              }}
            />
          </main>
        ) : (
          <section
            ref={detailsScrollRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-28 pt-4 md:px-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {filtered.length} properties
              </p>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>
            {detailsContent}
          </section>
        )}
      </div>

      <div className="hidden h-full min-h-0 lg:grid lg:grid-cols-[420px_1fr]">
        <aside className="min-h-0 border-r bg-white dark:bg-slate-900">
          <div className="h-full min-h-0 overflow-y-auto p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {filtered.length} properties
              </p>
              <button
                type="button"
                onClick={() => setShowDesktopFilters((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {showDesktopFilters ? "Hide Filters" : "Filters"}
              </button>
            </div>
            {showDesktopFilters ? (
              <div className="mb-5">
                <PropertyFilters onClose={() => setShowDesktopFilters(false)} />
              </div>
            ) : null}
            {detailsContent}
          </div>
        </aside>
        <main className="min-h-0 p-4 lg:p-0">
          <div className="h-full p-4 lg:p-0">
            <MapView
              properties={filtered}
              selectedId={selectedId ?? undefined}
              onSelect={setSelectedId}
            />
          </div>
        </main>
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
