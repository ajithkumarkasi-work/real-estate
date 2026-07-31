import { create } from "zustand";

import { mockProperties } from "@/data/mockProperties";
import type { Property, PropertyFilters } from "@/types/property";

export const DEFAULT_FILTERS: PropertyFilters = {
  query: "",
  city: "",
  type: "",
  status: "",
  minPrice: 0,
  maxPrice: 10000000,
  minBeds: 0,
  minBaths: 0,
  amenities: [],
  sortBy: "newest",
};

interface PropertyState {
  properties: Property[];
  filters: PropertyFilters;
  viewMode: "grid" | "list";
  setFilters: (partial: Partial<PropertyFilters>) => void;
  resetFilters: () => void;
  setViewMode: (mode: "grid" | "list") => void;
  addProperty: (property: Property) => void;
  updateProperty: (id: string, partial: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  getById: (id: string) => Property | undefined;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: mockProperties,
  filters: DEFAULT_FILTERS,
  viewMode: "grid",
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  setViewMode: (mode) => set({ viewMode: mode }),
  addProperty: (property) =>
    set((state) => ({ properties: [property, ...state.properties] })),
  updateProperty: (id, partial) =>
    set((state) => ({
      properties: state.properties.map((property) =>
        property.id === id ? { ...property, ...partial } : property,
      ),
    })),
  deleteProperty: (id) =>
    set((state) => ({
      properties: state.properties.filter((property) => property.id !== id),
    })),
  getById: (id) => get().properties.find((property) => property.id === id),
}));
