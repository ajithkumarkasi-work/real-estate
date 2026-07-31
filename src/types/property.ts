export type PropertyType =
  | "apartment"
  | "house"
  | "villa"
  | "studio"
  | "penthouse"
  | "townhouse";
export type PropertyStatus = "for-sale" | "for-rent" | "sold" | "rented";

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  priceUnit: "month" | "total";
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt: number;
  images: string[];
  address: string;
  city: string;
  neighborhood: string;
  coordinates: { lat: number; lng: number };
  amenities: string[];
  agentId: string;
  featured: boolean;
  createdAt: string;
  views: number;
}

export interface PropertyFilters {
  query: string;
  city: string;
  type: PropertyType | "";
  status: PropertyStatus | "";
  minPrice: number;
  maxPrice: number;
  minBeds: number;
  minBaths: number;
  amenities: string[];
  sortBy: "price-asc" | "price-desc" | "newest" | "popular";
}
