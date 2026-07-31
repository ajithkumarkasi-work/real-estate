import { Search, X } from "lucide-react";

import { usePropertyStore } from "@/store/propertyStore";
import type { PropertyType } from "@/types/property";

const cities = [
  "",
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Chennai",
];
const types: Array<{ label: string; value: PropertyType }> = [
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Studio", value: "studio" },
  { label: "Penthouse", value: "penthouse" },
  { label: "Townhouse", value: "townhouse" },
];
const amenities = [
  "pool",
  "gym",
  "parking",
  "pet-friendly",
  "garden",
  "balcony",
  "fireplace",
  "doorman",
];

interface PropertyFiltersProps {
  onClose?: () => void;
}

export default function PropertyFilters({ onClose }: PropertyFiltersProps) {
  const { filters, setFilters, resetFilters, properties } = usePropertyStore();
  const resultCount = properties.filter((property) => {
    const matchesQuery =
      !filters.query ||
      [
        property.title,
        property.address,
        property.neighborhood,
        property.city,
      ].some((value) =>
        value.toLowerCase().includes(filters.query.toLowerCase()),
      );
    const matchesCity = !filters.city || property.city === filters.city;
    const matchesType = !filters.type || property.type === filters.type;
    const matchesStatus = !filters.status || property.status === filters.status;
    const matchesPrice =
      property.price >= filters.minPrice && property.price <= filters.maxPrice;
    const matchesBeds = property.bedrooms >= filters.minBeds;
    const matchesBaths = property.bathrooms >= filters.minBaths;
    const matchesAmenities = filters.amenities.every((amenity) =>
      property.amenities.includes(amenity),
    );
    return (
      matchesQuery &&
      matchesCity &&
      matchesType &&
      matchesStatus &&
      matchesPrice &&
      matchesBeds &&
      matchesBaths &&
      matchesAmenities
    );
  }).length;

  const toggleAmenity = (value: string) => {
    setFilters({
      amenities: filters.amenities.includes(value)
        ? filters.amenities.filter((item) => item !== value)
        : [...filters.amenities, value],
    });
  };

  const toggleType = (value: PropertyType) => {
    setFilters({ type: filters.type === value ? "" : value });
  };

  return (
    <aside className="space-y-6 rounded-3xl border bg-white p-5 dark:bg-slate-900">
      {onClose ? (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Search
        </label>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={filters.query}
            onChange={(event) => setFilters({ query: event.target.value })}
            placeholder="Search by location"
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Status
        </label>
        <div className="grid grid-cols-3 gap-2">
          {["", "for-sale", "for-rent"].map((status) => (
            <button
              type="button"
              key={status || "all"}
              onClick={() =>
                setFilters({ status: status as typeof filters.status })
              }
              className={`rounded-2xl border px-3 py-2 text-sm ${filters.status === status ? "border-brand bg-brand/10 text-brand" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"}`}
            >
              {status === ""
                ? "All"
                : status === "for-sale"
                  ? "For Sale"
                  : "For Rent"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Property Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {types.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <input
                type="checkbox"
                checked={filters.type === type.value}
                onChange={() => toggleType(type.value)}
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          City
        </label>
        <select
          value={filters.city}
          onChange={(event) => setFilters({ city: event.target.value })}
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          {cities.map((city) => (
            <option key={city || "all"} value={city}>
              {city || "All Cities"}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Min Price
          </label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(event) =>
              setFilters({ minPrice: Number(event.target.value) })
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Max Price
          </label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(event) =>
              setFilters({ maxPrice: Number(event.target.value) })
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Bedrooms
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4].map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => setFilters({ minBeds: value })}
              className={`rounded-2xl border px-3 py-2 text-sm ${filters.minBeds === value ? "border-brand bg-brand/10 text-brand" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"}`}
            >
              {value === 0 ? "Any" : `${value}+`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Bathrooms
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => setFilters({ minBaths: value })}
              className={`rounded-2xl border px-3 py-2 text-sm ${filters.minBaths === value ? "border-brand bg-brand/10 text-brand" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"}`}
            >
              {value === 0 ? "Any" : `${value}+`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Amenities
        </label>
        <div className="grid grid-cols-2 gap-2">
          {amenities.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm capitalize text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(event) =>
            setFilters({ sortBy: event.target.value as typeof filters.sortBy })
          }
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price Low-High</option>
          <option value="price-desc">Price High-Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      <div className="flex items-center justify-between gap-3 border-t pt-4">
        <button
          onClick={resetFilters}
          className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Reset Filters
        </button>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
          {resultCount} results
        </span>
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          Close Filters
        </button>
      ) : null}
    </aside>
  );
}
