import { Heart } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import PropertyGrid from "@/components/property/PropertyGrid";
import { useFavoritesStore } from "@/store/favoritesStore";
import { usePropertyStore } from "@/store/propertyStore";

export default function Favorites() {
  const ids = useFavoritesStore((state) => state.ids);
  const properties = usePropertyStore((state) => state.properties);
  const favoriteProperties = useMemo(
    () => properties.filter((property) => ids.includes(property.id)),
    [properties, ids],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <h1 className="mb-4 text-3xl font-bold">{ids.length} saved properties</h1>
      {favoriteProperties.length ? (
        <PropertyGrid properties={favoriteProperties} />
      ) : (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border bg-white p-8 text-center dark:bg-slate-900">
          <Heart className="h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-2xl font-bold">No saved properties yet</h2>
          <p className="mt-2 text-slate-500">
            Start browsing and save homes you like.
          </p>
          <Link
            to="/search"
            className="mt-5 rounded-full bg-brand px-4 py-2 font-semibold text-white"
          >
            Start Browsing
          </Link>
        </div>
      )}
    </div>
  );
}
