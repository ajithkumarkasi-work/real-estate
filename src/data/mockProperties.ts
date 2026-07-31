import type { Property } from "@/types/property";

const apartmentImages = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
];

const houseImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800",
];

const villaImages = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
];

const interiorImages = [
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
  "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800",
  "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800",
];

const amenitiesPool = [
  "parking",
  "gym",
  "pool",
  "doorman",
  "pet-friendly",
  "garden",
  "balcony",
  "fireplace",
  "elevator",
  "concierge",
  "rooftop",
  "storage",
];

const cityMeta = {
  Delhi: {
    lat: 28.61,
    lng: 77.21,
    neighborhoods: [
      "Connaught Place",
      "Saket",
      "Dwarka",
      "Vasant Kunj",
      "Hauz Khas",
      "Greater Kailash",
    ],
  },
  Mumbai: {
    lat: 19.08,
    lng: 72.88,
    neighborhoods: [
      "Bandra West",
      "Juhu",
      "Powai",
      "Andheri West",
      "Lower Parel",
      "Worli",
    ],
  },
  Bengaluru: {
    lat: 12.97,
    lng: 77.59,
    neighborhoods: [
      "Indiranagar",
      "Whitefield",
      "Koramangala",
      "HSR Layout",
      "Jayanagar",
      "Malleshwaram",
    ],
  },
  Hyderabad: {
    lat: 17.38,
    lng: 78.49,
    neighborhoods: [
      "Banjara Hills",
      "Gachibowli",
      "HITEC City",
      "Jubilee Hills",
      "Kondapur",
      "Kukatpally",
    ],
  },
  Pune: {
    lat: 18.52,
    lng: 73.85,
    neighborhoods: [
      "Koregaon Park",
      "Baner",
      "Wakad",
      "Hinjewadi",
      "Kothrud",
      "Viman Nagar",
    ],
  },
  Chennai: {
    lat: 13.08,
    lng: 80.27,
    neighborhoods: [
      "Adyar",
      "T Nagar",
      "Anna Nagar",
      "Velachery",
      "Nungambakkam",
      "Besant Nagar",
    ],
  },
} as const;

const streetNames = [
  "MG Road",
  "Outer Ring Road",
  "Linking Road",
  "Aundh Road",
  "Anna Salai",
  "Kasturba Road",
  "Residency Road",
  "Jayanagar 4th Block",
  "Bannerghatta Road",
  "Golf Course Road",
];

function pick<T>(items: readonly T[], index: number) {
  return items[index % items.length];
}

function buildProperty(
  index: number,
  type: Property["type"],
  status: Property["status"],
  featured = false,
): Property {
  const cities = Object.keys(cityMeta) as Array<keyof typeof cityMeta>;
  const city = cities[index % cities.length];
  const cityInfo = cityMeta[city];
  const price =
    status === "for-rent"
      ? [22000, 28000, 35000, 45000, 62000, 78000, 95000, 115000, 140000][
          index % 9
        ]
      : [
          5500000, 7200000, 8900000, 11200000, 13800000, 16500000, 19500000,
          23500000, 28500000, 36000000,
        ][index % 10];
  const amenities = amenitiesPool.slice(index % 5, (index % 5) + 5);
  const imagePool =
    type === "house"
      ? houseImages
      : type === "villa" || type === "penthouse"
        ? villaImages
        : apartmentImages;
  const namePrefixes = [
    "Shree",
    "Aarav",
    "Vasudha",
    "Serene",
    "Skyline",
    "Ananta",
    "Tranquil",
    "Heritage",
    "Urban",
    "Green",
  ];
  const typeLabels: Record<Property["type"], string> = {
    apartment: "Residences",
    house: "Villas",
    villa: "Estate Villas",
    studio: "Studios",
    penthouse: "Penthouses",
    townhouse: "Townhomes",
  };
  const neighborhood =
    cityInfo.neighborhoods[index % cityInfo.neighborhoods.length];
  const street = streetNames[index % streetNames.length];
  const prefix = namePrefixes[index % namePrefixes.length];
  const projectName = `${prefix} ${neighborhood} ${typeLabels[type]}`;
  const latOffset = ((index % 7) - 3) * 0.01;
  const lngOffset = ((index % 5) - 2) * 0.012;

  return {
    id: `property-${String(index + 1).padStart(3, "0")}`,
    title: projectName,
    description: `A thoughtfully designed ${type} in ${neighborhood}, ${city} with natural light, premium finishes, and excellent access to dining, transit, and neighborhood amenities. Ideal for buyers and renters who want comfort, flexibility, and strong long-term value.`,
    type,
    status,
    price,
    priceUnit: status === "for-rent" ? "month" : "total",
    bedrooms:
      type === "studio"
        ? 1
        : type === "penthouse" || type === "villa"
          ? 4
          : type === "house"
            ? 3 + (index % 3)
            : 2 + (index % 3),
    bathrooms: type === "studio" ? 1 : 2 + (index % 3),
    area: status === "for-rent" ? 720 + index * 55 : 950 + index * 120,
    yearBuilt: 1998 + (index % 22),
    images: [
      pick(imagePool, index),
      pick(interiorImages, index),
      pick(interiorImages, index + 1),
    ],
    address: `${100 + index * 7} ${street}, ${neighborhood}, ${city}`,
    city,
    neighborhood,
    coordinates: {
      lat: Number((cityInfo.lat + latOffset).toFixed(4)),
      lng: Number((cityInfo.lng + lngOffset).toFixed(4)),
    },
    amenities,
    agentId: `agent-00${(index % 6) + 1}`,
    featured,
    createdAt: new Date(2025, index % 12, ((index * 2) % 27) + 1).toISOString(),
    views: 120 + index * 17,
  };
}

const apartments = Array.from({ length: 20 }, (_, index) =>
  buildProperty(
    index,
    "apartment",
    index < 12 ? "for-rent" : "for-sale",
    index < 4,
  ),
);
const houses = Array.from({ length: 10 }, (_, index) =>
  buildProperty(
    20 + index,
    "house",
    index < 6 ? "for-rent" : "for-sale",
    index >= 4 && index < 6,
  ),
);
const villas = Array.from({ length: 4 }, (_, index) =>
  buildProperty(
    30 + index,
    "villa",
    index < 2 ? "for-sale" : "for-rent",
    index === 0,
  ),
);
const studios = Array.from({ length: 4 }, (_, index) =>
  buildProperty(34 + index, "studio", "for-rent", false),
);
const penthouses = Array.from({ length: 2 }, (_, index) =>
  buildProperty(38 + index, "penthouse", "for-sale", index === 0),
);

export const mockProperties: Property[] = [
  ...apartments,
  ...houses,
  ...villas,
  ...studios,
  ...penthouses,
];
