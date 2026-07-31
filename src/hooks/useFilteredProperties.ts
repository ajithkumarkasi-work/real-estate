import { useMemo } from "react";

import type { Property, PropertyFilters } from "@/types/property";

export function useFilteredProperties(
  properties: Property[],
  filters: PropertyFilters,
) {
  return useMemo(() => {
    const query = filters.query.toLowerCase().trim();
    const filtered = properties.filter((property) => {
      const queryMatches =
        !query ||
        [
          property.title,
          property.address,
          property.neighborhood,
          property.city,
        ].some((value) => value.toLowerCase().includes(query));
      const cityMatches = !filters.city || property.city === filters.city;
      const typeMatches = !filters.type || property.type === filters.type;
      const statusMatches =
        !filters.status || property.status === filters.status;
      const priceMatches =
        property.price >= filters.minPrice &&
        property.price <= filters.maxPrice;
      const bedsMatches = property.bedrooms >= filters.minBeds;
      const bathsMatches = property.bathrooms >= filters.minBaths;
      const amenitiesMatch = filters.amenities.every((amenity) =>
        property.amenities.includes(amenity),
      );

      return (
        queryMatches &&
        cityMatches &&
        typeMatches &&
        statusMatches &&
        priceMatches &&
        bedsMatches &&
        bathsMatches &&
        amenitiesMatch
      );
    });

    return filtered.sort((left, right) => {
      if (filters.sortBy === "price-asc") return left.price - right.price;
      if (filters.sortBy === "price-desc") return right.price - left.price;
      if (filters.sortBy === "popular") return right.views - left.views;
      return (
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
    });
  }, [filters, properties]);
}
