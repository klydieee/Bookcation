import { lazy, Suspense, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  AirplaneTilt,
  Bed,
  Car,
  CookingPot,
  ForkKnife,
  MagnifyingGlass,
  MapPin,
  NavigationArrow,
  Storefront,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type {
  NearbyCategory,
  NearbyPlace,
  NearbySearchResult,
} from "@/lib/nearby-types";
import { useActivePlanContext } from "@/store/useActivePlan";
import { Button } from "./ui/Button";
import { Input } from "./ui/Field";

const NearbyMap = lazy(() => import("./NearbyMap"));

interface NearbyService {
  id: NearbyCategory;
  label: string;
  icon: Icon;
}

const SERVICES: NearbyService[] = [
  { id: "flights", label: "Airports", icon: AirplaneTilt },
  { id: "hotels", label: "Hotels", icon: Bed },
  { id: "restaurants", label: "Restaurants", icon: ForkKnife },
  { id: "catering", label: "Catering", icon: CookingPot },
  { id: "venues", label: "Events & attractions", icon: Storefront },
  { id: "rides", label: "Rides & taxis", icon: Car },
];

function openStreetMapUrl(latitude: number, longitude: number) {
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
}

function formatDistance(meters: number): string {
  return meters < 1000
    ? `${meters} m away`
    : `${(meters / 1000).toFixed(1)} km away`;
}

export function NearbyGuide({
  city,
  initialService,
}: {
  city: string;
  initialService?: NearbyCategory;
}) {
  const [service, setService] = useState<NearbyCategory>(
    initialService ?? "restaurants",
  );
  const [coordinates, setCoordinates] = useState<string | null>(null);
  const [manualLocation, setManualLocation] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  const [locating, setLocating] = useState(false);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [mapCenter, setMapCenter] = useState<NearbySearchResult["center"] | null>(
    null,
  );
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const { plan } = useActivePlanContext();
  const hasHotel = Boolean(plan?.items.some((item) => item.kind === "stay"));
  const availableServices = hasHotel
    ? SERVICES.filter((entry) => entry.id !== "catering")
    : SERVICES;
  const currentService =
    availableServices.find((entry) => entry.id === service) ??
    availableServices.find((entry) => entry.id === "restaurants") ??
    SERVICES[2]!;
  const liveLocation = Boolean(coordinates || manualLocation);
  const hasSearchLocation = liveLocation || Boolean(city);
  const searchRadius = currentService.id === "flights" ? "50 km" : "5 km";
  const placeForMap = selectedPlace
    ? { latitude: selectedPlace.latitude, longitude: selectedPlace.longitude }
    : mapCenter;

  useEffect(() => {
    const controller = new AbortController();
    const locationParams = new URLSearchParams({ category: service });
    if (coordinates) {
      const [latitude, longitude] = coordinates.split(",");
      locationParams.set("lat", latitude);
      locationParams.set("lon", longitude);
    } else {
      const query = manualLocation || city;
      if (!query) {
        setPlaces([]);
        setMapCenter(null);
        setSearchError("");
        setSearching(false);
        return () => controller.abort();
      }
      locationParams.set("q", query);
    }

    setSearching(true);
    setSearchError("");
    setSelectedPlace(null);
    void fetch(`/api/nearby?${locationParams}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = (await response.json()) as
          | NearbySearchResult
          | { error: string };
        if (!response.ok) {
          throw new Error(
            "error" in payload ? payload.error : "Nearby search failed.",
          );
        }
        return payload as NearbySearchResult;
      })
      .then((result) => {
        setPlaces(result.places);
        setMapCenter(result.center);
        setSearchError(result.warning ?? "");
        setLocationMessage(
          liveLocation
            ? `Showing nearby places near ${manualLocation || "your current location"}.`
            : `Showing nearby places for your ${city} trip destination.`,
        );
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setPlaces([]);
        setMapCenter(null);
        setSearchError(
          error instanceof Error
            ? error.message
            : "Nearby search failed. Please try again.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setSearching(false);
      });

    return () => controller.abort();
  }, [city, coordinates, liveLocation, manualLocation, retryCount, service]);

  useEffect(() => {
    if (hasHotel && service === "catering") {
      setService("restaurants");
      setSelectedPlace(null);
    }
  }, [hasHotel, service]);

  function chooseService(nextService: NearbyCategory) {
    setService(nextService);
    setSelectedPlace(null);
  }

  function requestLocation() {
    if (!window.isSecureContext) {
      setLocationMessage("Current location requires a secure connection (HTTPS or localhost).");
      return;
    }

    if (!navigator.geolocation) {
      setLocationMessage("Location access is not available in this browser.");
      return;
    }

    setLocating(true);
    setLocationMessage("Waiting for location permission…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates(
          `${coords.latitude.toFixed(3)},${coords.longitude.toFixed(3)}`,
        );
        setMapCenter({
          latitude: coords.latitude,
          longitude: coords.longitude,
          label: "Your current location",
        });
        setManualLocation("");
        setLocationInput("");
        setSelectedPlace(null);
        setLocating(false);
        setLocationMessage(
          "Location found. Searching nearby places. Your approximate coordinates are only used for this search.",
        );
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied. Enter a city, neighborhood, or address below to search live map data."
            : error.code === error.POSITION_UNAVAILABLE
              ? "Your location could not be determined. Enter a city, neighborhood, or address below to search live map data."
              : "Location took too long. Try again or enter a city, neighborhood, or address below.";
        setLocating(false);
        setLocationMessage(message);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  function searchManualLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = locationInput.trim();
    if (!query) return;
    setCoordinates(null);
    setManualLocation(query);
    setSelectedPlace(null);
    setLocationMessage(`Searching for places around ${query}.`);
  }

  return (
    <section className="mb-6 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] shadow-2">
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin size={20} weight="fill" className="text-[var(--color-primary-ink)]" />
              <h2 className="text-h3">
                {coordinates
                  ? "Nearby services · your location"
                  : manualLocation
                    ? `Nearby services · ${manualLocation}`
                    : city
                      ? `Nearby services · ${city} trip`
                      : "Nearby services"}
              </h2>
            </div>
            <p className="mt-1 text-[0.875rem] text-[var(--color-ink-muted)]">
              {coordinates
                ? "Live results are centered on your current location. You can also search another area."
                : manualLocation
                  ? `Nearby places are centered on ${manualLocation}.`
                  : city
                    ? "Use your current location, enter an area, or browse services around your active trip destination."
                    : "Use your current location or enter an area to browse live places. A trip destination is optional."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {liveLocation && city && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setCoordinates(null);
                  setManualLocation("");
                  setLocationInput("");
                  setSelectedPlace(null);
                  setLocationMessage(
                    city
                      ? `Searching the active trip destination: ${city}.`
                      : "Enter a city or area to search.",
                  );
                }}
              >
                Use trip destination
              </Button>
            )}
            <Button
              size="sm"
              variant="secondary"
              onClick={requestLocation}
              disabled={locating}
            >
              <NavigationArrow size={17} weight="bold" />
              {locating ? "Finding location…" : "Use my location"}
            </Button>
          </div>
        </div>

        <form
          className="mt-3 flex flex-wrap gap-2"
          onSubmit={searchManualLocation}
          role="search"
          aria-label="Search a nearby area"
        >
          <Input
            aria-label="City, neighborhood, or address"
            className="min-w-[14rem] flex-1"
            placeholder="Enter a city, neighborhood, or address"
            value={locationInput}
            onChange={(event) => setLocationInput(event.target.value)}
          />
          <Button
            type="submit"
            variant="secondary"
            disabled={!locationInput.trim()}
          >
            <MagnifyingGlass size={17} weight="bold" />
            Search this area
          </Button>
        </form>

        <div
          className="mt-4 flex gap-2 overflow-x-auto pb-2"
          role="tablist"
          aria-label="Nearby service categories"
        >
          {availableServices.map((entry) => {
            const ServiceIcon = entry.icon;
            const selected = service === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => chooseService(entry.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-[var(--radius-pill)] border px-3 py-2 text-[0.875rem] font-semibold transition-colors ${
                  selected
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-tint)] text-[var(--color-primary-ink)]"
                    : "border-[var(--color-line)] bg-[var(--color-canvas)] text-[var(--color-ink-muted)] hover:bg-[var(--color-sunken)]"
                }`}
              >
                <ServiceIcon size={17} weight={selected ? "fill" : "bold"} />
                {entry.label}
              </button>
            );
          })}
        </div>

        {locationMessage && (
          <p className="mt-3 text-[0.875rem] text-[var(--color-ink-muted)]" role="status">
            {locationMessage}
          </p>
        )}
      </div>

      <div className="relative overflow-hidden border-y border-[var(--color-line)] bg-[var(--color-sunken)]">
        {placeForMap ? (
          <div className="relative">
            <Suspense
              fallback={
                <div className="grid h-64 place-items-center text-[0.875rem] text-[var(--color-ink-muted)] sm:h-80">
                  Loading map…
                </div>
              }
            >
              <NearbyMap
                center={placeForMap}
                mapCenter={mapCenter}
                places={places}
                selectedPlace={selectedPlace}
                onSelectPlace={setSelectedPlace}
                label={`Map showing ${currentService.label.toLowerCase()} near ${mapCenter?.label ?? "the selected place"}`}
              />
            </Suspense>
            <a
              href={openStreetMapUrl(
                placeForMap.latitude,
                placeForMap.longitude,
              )}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-3 right-3 z-[1000] rounded-[var(--radius-sm)] bg-[var(--color-surface)] px-3 py-2 text-[0.8rem] font-bold text-[var(--color-primary-ink)] shadow-2"
            >
              Open in OpenStreetMap
            </a>
          </div>
        ) : (
          <div className="grid h-64 place-items-center px-6 text-center text-[0.875rem] text-[var(--color-ink-muted)] sm:h-80">
            {searching
              ? "Finding this location on the map…"
              : "Search a location to load the map."}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-h4">
            {coordinates
              ? `${currentService.label} near you`
              : manualLocation
                ? `${currentService.label} around ${manualLocation}`
                : city
                  ? `${currentService.label} around ${city}`
                  : `${currentService.label} nearby`}
          </h3>
          <span className="text-[0.75rem] text-[var(--color-ink-muted)]">
            ©{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              OpenStreetMap contributors
            </a>
          </span>
        </div>
        {searchError && (
          <div
            className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-[var(--color-error-tint)] p-3 text-[0.875rem] text-[var(--color-error)]"
            role="alert"
          >
            <span>{searchError}</span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setRetryCount((count) => count + 1)}
            >
              Try again
            </Button>
          </div>
        )}
        {searching && (
          <p className="mb-3 text-[0.875rem] text-[var(--color-ink-muted)]" role="status">
            Searching Geoapify…
          </p>
        )}
        {!searching && !searchError && places.length === 0 && (
          <p className="mb-3 text-[0.875rem] text-[var(--color-ink-muted)]">
            {hasSearchLocation
              ? `No ${currentService.label.toLowerCase()} found within ${searchRadius}. Place coverage varies by area.`
              : "Search a city or area, or use your current location to find nearby services."}
          </p>
        )}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <button
              key={place.id}
              type="button"
              onClick={() => setSelectedPlace(place)}
              className={`flex min-w-0 items-center gap-3 rounded-[var(--radius-sm)] border p-3 text-left transition-colors ${
                selectedPlace?.id === place.id
                  ? "border-[var(--color-primary)] bg-[var(--color-primary-tint)]"
                  : "border-[var(--color-line)] bg-[var(--color-canvas)] hover:bg-[var(--color-sunken)]"
              }`}
            >
              <MapPin
                size={20}
                weight="fill"
                className="mt-0.5 shrink-0 text-[var(--color-primary-ink)]"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.875rem] font-semibold">
                  {place.name}
                </span>
                <span className="block text-[0.75rem] capitalize text-[var(--color-ink-muted)]">
                  {place.category} · {formatDistance(place.distanceMeters)}
                </span>
                {place.address && (
                  <span className="mt-1 block truncate text-[0.75rem] text-[var(--color-ink-muted)]">
                    {place.address}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[0.75rem] text-[var(--color-ink-muted)]">
          Nearby places powered by{" "}
          <a
            href="https://www.geoapify.com/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Geoapify
          </a>
          {" · "}©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            OpenStreetMap contributors
          </a>
          . Results depend on local map coverage.
        </p>
        <Link
          to={
            service === "flights"
              ? "/app/flights"
              : service === "hotels"
                ? "/app/hotels"
                : service === "restaurants"
                  ? "/app/food"
                  : service === "rides"
                    ? "/app/rides"
                    : "/app/catering"
          }
          className="mt-4 inline-flex rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-4 py-2.5 text-[0.875rem] font-semibold text-[var(--color-on-primary)] hover:bg-[var(--color-primary-hover)]"
        >
          {service === "flights"
            ? "Compare airline flights"
            : service === "venues"
              ? "Browse event venues"
              : `Browse ${currentService.label.toLowerCase()}`}
        </Link>
      </div>
    </section>
  );
}
