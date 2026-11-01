import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { NearbyPlace, NearbySearchResult } from "@/lib/nearby-types";
import "leaflet/dist/leaflet.css";

function MapViewUpdater({
  latitude,
  longitude,
  zoom,
}: {
  latitude: number;
  longitude: number;
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView([latitude, longitude], zoom);
  }, [latitude, longitude, map, zoom]);
  return null;
}

function formatDistance(meters: number): string {
  return meters < 1000
    ? `${meters} m away`
    : `${(meters / 1000).toFixed(1)} km away`;
}

export default function NearbyMap({
  center,
  mapCenter,
  places,
  selectedPlace,
  onSelectPlace,
  label,
}: {
  center: { latitude: number; longitude: number };
  mapCenter: NearbySearchResult["center"] | null;
  places: NearbyPlace[];
  selectedPlace: NearbyPlace | null;
  onSelectPlace: (place: NearbyPlace) => void;
  label: string;
}) {
  return (
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={14}
      scrollWheelZoom={false}
      className="z-0 h-64 w-full sm:h-80"
      aria-label={label}
    >
      <MapViewUpdater
        latitude={center.latitude}
        longitude={center.longitude}
        zoom={selectedPlace ? 16 : 14}
      />
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {mapCenter && (
        <CircleMarker
          center={[mapCenter.latitude, mapCenter.longitude]}
          radius={6}
          pathOptions={{
            color: "var(--color-primary-ink)",
            fillColor: "var(--color-primary)",
            fillOpacity: 0.9,
          }}
        >
          <Popup>{mapCenter.label}</Popup>
        </CircleMarker>
      )}
      {places.map((place) => (
        <CircleMarker
          key={place.id}
          center={[place.latitude, place.longitude]}
          radius={selectedPlace?.id === place.id ? 9 : 7}
          eventHandlers={{ click: () => onSelectPlace(place) }}
          pathOptions={{
            color: "var(--color-primary-ink)",
            fillColor: "var(--color-primary)",
            fillOpacity: 0.8,
          }}
        >
          <Popup>
            <strong>{place.name}</strong>
            <br />
            {formatDistance(place.distanceMeters)}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
