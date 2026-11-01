import { useEffect, useRef, useState } from "react";
import {
  AttributionControl,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  Popup,
  setWorkerUrl,
} from "maplibre-gl";
import type { NearbyPlace, NearbySearchResult } from "@/lib/nearby-types";
import mapWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";

setWorkerUrl(mapWorkerUrl);

function formatDistance(meters: number): string {
  return meters < 1000
    ? `${meters} m away`
    : `${(meters / 1000).toFixed(1)} km away`;
}

function createPlaceMarker(
  place: NearbyPlace,
  selected: boolean,
  onSelectPlace: (place: NearbyPlace) => void,
): Marker {
  const element = document.createElement("button");
  element.type = "button";
  element.className = `nearby-map-marker${selected ? " nearby-map-marker--selected" : ""}`;
  element.setAttribute(
    "aria-label",
    `${place.name}, ${formatDistance(place.distanceMeters)}`,
  );
  element.title = place.name;
  element.addEventListener("click", () => onSelectPlace(place));

  const popup = new Popup({ offset: 18, closeButton: false }).setText(
    `${place.name} · ${formatDistance(place.distanceMeters)}`,
  );

  return new Marker({ element, anchor: "bottom" })
    .setLngLat([place.longitude, place.latitude])
    .setPopup(popup);
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
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [mapError, setMapError] = useState("");

  useEffect(() => {
    if (!containerRef.current) return;

    let styleLoaded = false;
    const map = new MapLibreMap({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [center.longitude, center.latitude],
      zoom: 14,
      scrollZoom: false,
      attributionControl: false,
    });
    mapRef.current = map;
    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new AttributionControl({ compact: true }), "bottom-right");
    map.once("load", () => {
      styleLoaded = true;
      setMapError("");
    });
    map.on("error", () => {
      if (!styleLoaded) {
        setMapError("The map couldn't be loaded. Check your connection and try again.");
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.flyTo({
      center: [center.longitude, center.latitude],
      zoom: selectedPlace ? 16 : 14,
      duration: 500,
    });
  }, [center.latitude, center.longitude, selectedPlace]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markers = places.map((place) =>
      createPlaceMarker(
        place,
        selectedPlace?.id === place.id,
        onSelectPlace,
      ).addTo(map),
    );

    if (mapCenter) {
      const element = document.createElement("div");
      element.className = "nearby-map-center-marker";
      element.setAttribute("aria-hidden", "true");
      markers.push(
        new Marker({ element, anchor: "center" })
          .setLngLat([mapCenter.longitude, mapCenter.latitude])
          .setPopup(new Popup({ offset: 12, closeButton: false }).setText(mapCenter.label))
          .addTo(map),
      );
    }

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [mapCenter, onSelectPlace, places, selectedPlace]);

  return (
    <div
      ref={containerRef}
      className="relative z-0 h-64 w-full sm:h-80"
      role="application"
      aria-label={label}
    >
      {mapError && (
        <div
          className="absolute inset-0 z-10 grid place-items-center bg-[var(--color-sunken)] p-6 text-center text-[0.875rem] text-[var(--color-ink-muted)]"
          role="alert"
        >
          {mapError}
        </div>
      )}
    </div>
  );
}
