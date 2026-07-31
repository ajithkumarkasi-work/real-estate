import { useEffect, useMemo } from "react";

import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { formatPriceWithUnitINR } from "@/lib/utils";
import type { Property } from "@/types/property";
import MapPopup from "./MapPopup";

interface MapViewProps {
  properties: Property[];
  selectedId?: string;
  onSelect: (id: string | null) => void;
  onMarkerSelect?: (id: string) => void;
}

interface Bounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

function getBoundsFromProperties(properties: Property[]): Bounds | null {
  if (!properties.length) return null;

  const longitudes = properties.map((property) => property.coordinates.lng);
  const latitudes = properties.map((property) => property.coordinates.lat);

  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);

  const lngSpan = maxLng - minLng;
  const latSpan = maxLat - minLat;

  const lngPad = Math.max(0.12, lngSpan * 0.35);
  const latPad = Math.max(0.12, latSpan * 0.35);

  return {
    west: minLng - lngPad,
    south: minLat - latPad,
    east: maxLng + lngPad,
    north: maxLat + latPad,
  };
}

function createPriceIcon(property: Property, isSelected: boolean) {
  const label = formatPriceWithUnitINR(property.price, property.priceUnit);
  const background = isSelected ? "#1B4FFF" : "#ffffff";
  const color = isSelected ? "#ffffff" : "#0f172a";
  const border = isSelected ? "none" : "1px solid rgba(15,23,42,0.12)";

  return L.divIcon({
    className: "property-price-marker",
    html: `<div style="background:${background};color:${color};padding:6px 10px;border-radius:999px;font-size:12px;font-weight:700;box-shadow:0 6px 18px rgba(15,23,42,0.25);border:${border};white-space:nowrap;">${label}</div>`,
    iconSize: [92, 34],
    iconAnchor: [46, 17],
  });
}

function FitBoundsController({ bounds }: { bounds: Bounds | null }) {
  const map = useMap();

  useEffect(() => {
    if (!bounds) return;

    map.fitBounds(
      [
        [bounds.south, bounds.west],
        [bounds.north, bounds.east],
      ],
      {
        padding: [56, 56],
        maxZoom: 13,
        animate: true,
      },
    );
  }, [bounds, map]);

  return null;
}

function DeselectOnMapClick({
  onSelect,
}: {
  onSelect: (id: string | null) => void;
}) {
  useMapEvents({
    click: () => onSelect(null),
  });

  return null;
}

export default function MapView({
  properties,
  selectedId,
  onSelect,
  onMarkerSelect,
}: MapViewProps) {
  const bounds = useMemo(
    () => getBoundsFromProperties(properties),
    [properties],
  );

  if (!properties.length) {
    return (
      <div className="flex h-full min-h-[520px] items-center justify-center rounded-3xl border bg-white p-8 text-center text-sm text-slate-500 dark:bg-slate-900">
        No properties found for the current filters.
      </div>
    );
  }

  return (
    <div className="h-full min-h-[520px] overflow-hidden rounded-3xl border">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBoundsController bounds={bounds} />
        <DeselectOnMapClick onSelect={onSelect} />
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.coordinates.lat, property.coordinates.lng]}
            icon={createPriceIcon(property, selectedId === property.id)}
            eventHandlers={{
              click: (event) => {
                event.originalEvent.stopPropagation();
                onSelect(property.id);
                onMarkerSelect?.(property.id);
              },
            }}
          >
            {selectedId === property.id ? (
              <Popup closeButton={false} closeOnClick={false}>
                <MapPopup property={property} onClose={() => onSelect(null)} />
              </Popup>
            ) : null}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
