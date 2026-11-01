import { lazy, Suspense, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  AirplaneTilt,
  Bed,
  CalendarBlank,
  Car,
  CheckCircle,
  Clock,
  CookingPot,
  ForkKnife,
  GlobeHemisphereWest,
  MagnifyingGlass,
  MapPin,
  NavigationArrow,
  Phone,
  Storefront,
  Users,
  X,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type {
  NearbyCategory,
  NearbyPlace,
  NearbySearchResult,
} from "@/lib/nearby-types";
import { useActivePlanContext } from "@/store/useActivePlan";
import { useAddToPlan } from "@/store/useAddToPlan";
import { addDays } from "@/lib/format";
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

function dateFieldValue(iso?: string): string {
  if (!iso) {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }
  return iso.slice(0, 10);
}

export function NearbyGuide({
  city,
  initialService,
  initialCoordinates,
  onAirportSelect,
}: {
  city: string;
  initialService?: NearbyCategory;
  initialCoordinates?: string | null;
  onAirportSelect?: (place: NearbyPlace) => void;
}) {
  const [service, setService] = useState<NearbyCategory>(
    initialService ?? "restaurants",
  );
  const [coordinates, setCoordinates] = useState<string | null>(
    initialCoordinates ?? null,
  );
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
  const { trip, plan } = useActivePlanContext();
  const { add, hasActivePlan } = useAddToPlan();
  const [bookingDate, setBookingDate] = useState(() =>
    dateFieldValue(trip?.startDateISO),
  );
  const [bookingEndDate, setBookingEndDate] = useState(() =>
    dateFieldValue(
      trip ? addDays(trip.startDateISO, trip.days) : undefined,
    ),
  );
  const [bookingTime, setBookingTime] = useState("19:00");
  const [partySize, setPartySize] = useState(trip?.travelers ?? 2);
  const [bookingMode, setBookingMode] = useState<
    "reserve" | "pickup" | "delivery"
  >("reserve");
  const [imageFailed, setImageFailed] = useState(false);
  const hasHotel = Boolean(
    plan?.items.some(
      (item) =>
        item.kind === "stay" ||
        (item.kind === "place" &&
          item.placeBooking.service === "hotels"),
    ),
  );
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
  const tripLastDay = trip
    ? addDays(trip.startDateISO, Math.max(0, trip.days - 1)).slice(0, 10)
    : undefined;
  const hotelCheckoutDate = trip
    ? addDays(trip.startDateISO, trip.days).slice(0, 10)
    : bookingEndDate;

  useEffect(() => {
    setCoordinates(initialCoordinates ?? null);
    setManualLocation("");
    setLocationInput("");
    setSelectedPlace(null);
  }, [initialCoordinates]);

  useEffect(() => {
    if (!trip) return;
    setBookingDate(dateFieldValue(trip.startDateISO));
    setBookingEndDate(dateFieldValue(addDays(trip.startDateISO, trip.days)));
    setPartySize(trip.travelers);
  }, [trip?.id]);

  useEffect(() => {
    setImageFailed(false);
  }, [selectedPlace?.id]);

  useEffect(() => {
    if (!selectedPlace) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedPlace(null);
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedPlace]);

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
            : `Showing nearby ${currentService.label.toLowerCase()} near ${city}.`,
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

  function addPlaceBooking() {
    if (!selectedPlace || !trip) return;
    const scheduledDate = new Date(`${bookingDate}T${bookingTime}:00`);
    const dayIndex = Math.max(
      0,
      Math.min(
        trip.days - 1,
        Math.floor(
          (Date.parse(`${bookingDate}T12:00:00`) -
            Date.parse(`${dateFieldValue(trip.startDateISO)}T12:00:00`)) /
            86400000,
        ),
      ),
    );
    const module =
      service === "restaurants"
        ? "food"
        : service === "hotels"
          ? "stay"
          : service === "catering"
            ? "catering"
            : service === "flights"
              ? "flight"
              : "trip";
    const mode = service === "restaurants" ? bookingMode : undefined;
    const title = `${selectedPlace.name} · ${
      mode === "reserve"
        ? "table request"
        : mode === "pickup"
          ? "pickup request"
          : mode === "delivery"
            ? "delivery request"
            : `${currentService.label.toLowerCase()} request`
    }`;
    const added = add({
      kind: "place",
      module,
      dayIndex,
      title,
      price: 0,
      placeBooking: {
        service,
        place: selectedPlace,
        dateISO: scheduledDate.toISOString(),
        timeISO: scheduledDate.toISOString(),
        ...(service === "hotels"
          ? {
              endDateISO: new Date(`${bookingEndDate}T12:00:00`).toISOString(),
            }
          : {}),
        partySize,
        ...(mode ? { mode } : {}),
      },
    });
    if (added) {
      setSelectedPlace(null);
      setLocationMessage(`${selectedPlace.name} added to ${plan?.name ?? "your trip"}.`);
    }
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
            <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--color-primary-ink)]">
              Live map discovery
            </p>
            <div className="flex items-center gap-2">
              <MapPin
                size={20}
                weight="fill"
                className="text-[var(--color-primary-ink)]"
              />
              <h2 className="text-h3">
                {coordinates
                  ? `Explore near you · ${currentService.label}`
                  : manualLocation
                    ? `Explore near ${manualLocation}`
                    : city
                      ? `Explore near ${city}`
                      : "Explore a location"}
              </h2>
            </div>
            <p className="mt-1 text-[0.875rem] text-[var(--color-ink-muted)]">
              {coordinates
                ? `Live ${currentService.label.toLowerCase()} are centered on your current location. Select a place to highlight it on the map.`
                : manualLocation
                  ? `Live places are centered on ${manualLocation}. Select a result to locate it on the map.`
                  : city
                    ? service === "flights"
                      ? "The departure airport sets the map area. Change it above or use your current location to find nearby airports."
                      : "Your trip destination sets the map area. Change it above or search another area to explore."
                    : "Search an area or use your location. Results are live map places; booking options are shown separately below."}
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

        {hasHotel && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-[var(--color-primary-tint)] p-3">
            <p className="text-[0.875rem] text-[var(--color-ink)]">
              A hotel stay is on your plan, so catering is unavailable. Nearby
              restaurants may offer pickup or delivery; confirm with each restaurant.
            </p>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => chooseService("restaurants")}
              disabled={service === "restaurants"}
            >
              Browse nearby restaurants
            </Button>
          </div>
        )}

        {locationMessage && (
          <p className="mt-3 text-[0.875rem] text-[var(--color-ink-muted)]" role="status">
            {locationMessage}
          </p>
        )}
      </div>

      <div className="grid border-t border-[var(--color-line)] lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.85fr)]">
        <div className="relative overflow-hidden border-b border-[var(--color-line)] bg-[var(--color-sunken)] lg:border-b-0 lg:border-r">
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
                className="absolute bottom-3 left-3 z-[1000] rounded-[var(--radius-sm)] bg-[var(--color-surface)] px-3 py-2 text-[0.8rem] font-bold text-[var(--color-primary-ink)] shadow-2"
              >
                Open full map
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

        <div className="min-w-0 p-4 sm:p-5">
          <div className="mb-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-h4">
                Nearby {currentService.label.toLowerCase()}
              </h3>
              {places.length > 0 && (
                <span className="rounded-[var(--radius-pill)] bg-[var(--color-sunken)] px-2.5 py-1 text-xs font-semibold text-[var(--color-ink-muted)]">
                  {places.length} places
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              Select a place to focus the map.
            </p>
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
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <p className="text-[0.875rem] text-[var(--color-ink-muted)]">
              {hasSearchLocation
                ? `No ${currentService.label.toLowerCase()} found within ${searchRadius}. Place coverage varies by area.`
                : "Search a city or area, or use your current location to find nearby services."}
            </p>
            {service === "catering" && hasSearchLocation && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => chooseService("restaurants")}
              >
                Try nearby restaurants instead
              </Button>
            )}
          </div>
        )}
        <div className="grid max-h-80 gap-2 overflow-y-auto pr-1">
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
              <span className="shrink-0 text-xs font-bold text-[var(--color-primary-ink)]">
                Details
              </span>
            </button>
          ))}
        </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 border-t border-[var(--color-line)] px-4 py-3 text-[0.75rem] text-[var(--color-ink-muted)] sm:px-5">
          Map tiles by{" "}
          <a
            href="https://openfreemap.org/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            OpenFreeMap
          </a>
          {" · "}
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
          . Results and photos depend on local map coverage.
      </div>
      {selectedPlace && (
        <dialog
          open
          aria-modal="true"
          aria-labelledby="nearby-place-title"
          className="fixed inset-0 z-[1200] m-0 flex h-full max-h-none w-full max-w-none items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedPlace(null);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setSelectedPlace(null);
          }}
        >
          <div className="my-auto grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] shadow-3 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
            <div className="relative min-h-56 bg-[var(--color-sunken)] sm:min-h-72">
              {selectedPlace.imageUrl && !imageFailed ? (
                <img
                  src={selectedPlace.imageUrl}
                  alt={`Community map photo of ${selectedPlace.name}`}
                  className="h-full min-h-56 w-full object-cover sm:min-h-72"
                  referrerPolicy="no-referrer"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="grid min-h-56 place-items-center p-8 text-center text-sm text-[var(--color-ink-muted)] sm:min-h-72">
                  <div>
                    <MapPin
                      size={38}
                      weight="duotone"
                      className="mx-auto mb-2 text-[var(--color-primary-ink)]"
                    />
                    No community photo is available in the map data for this place.
                  </div>
                </div>
              )}
              {selectedPlace.imageCreditUrl && selectedPlace.imageUrl && (
                <a
                  href={selectedPlace.imageCreditUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-3 left-3 rounded bg-black/65 px-2 py-1 text-xs font-semibold text-white underline"
                >
                  Photo source
                </a>
              )}
            </div>

            <div className="p-5 sm:p-7">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--color-primary-ink)]">
                    {currentService.label} · {formatDistance(selectedPlace.distanceMeters)}
                  </p>
                  <h2 id="nearby-place-title" className="text-h2 mt-1">
                    {selectedPlace.name}
                  </h2>
                </div>
                <button
                  type="button"
                  autoFocus
                  aria-label="Close place details"
                  onClick={() => setSelectedPlace(null)}
                  className="rounded-full p-2 text-[var(--color-ink-muted)] hover:bg-[var(--color-sunken)]"
                >
                  <X size={20} />
                </button>
              </div>

              {selectedPlace.description && (
                <p className="mb-3 text-sm text-[var(--color-ink-muted)]">
                  {selectedPlace.description}
                </p>
              )}
              <dl className="grid gap-2 text-sm text-[var(--color-ink-muted)]">
                {selectedPlace.address && (
                  <div className="flex items-start gap-2">
                    <MapPin size={17} className="mt-0.5 shrink-0" />
                    <dd>{selectedPlace.address}</dd>
                  </div>
                )}
                {selectedPlace.openingHours && (
                  <div className="flex items-start gap-2">
                    <Clock size={17} className="mt-0.5 shrink-0" />
                    <dd>{selectedPlace.openingHours}</dd>
                  </div>
                )}
                {selectedPlace.phone && (
                  <div className="flex items-start gap-2">
                    <Phone size={17} className="mt-0.5 shrink-0" />
                    <dd>
                      <a className="underline" href={`tel:${selectedPlace.phone}`}>
                        {selectedPlace.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {selectedPlace.website && (
                  <div className="flex items-start gap-2">
                    <GlobeHemisphereWest size={17} className="mt-0.5 shrink-0" />
                    <dd>
                      <a
                        className="underline"
                        href={selectedPlace.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit website
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              {service === "flights" ? (
                <div className="mt-5 border-t border-[var(--color-line)] pt-4">
                  <p className="text-sm text-[var(--color-ink-muted)]">
                    Airports help you choose a departure point. Flight options
                    and dates are set in the flight search form.
                  </p>
                  {onAirportSelect && (
                    <Button
                      className="mt-3 w-full"
                      onClick={() => {
                        onAirportSelect(selectedPlace);
                        setSelectedPlace(null);
                      }}
                    >
                      Use as departure airport
                    </Button>
                  )}
                </div>
              ) : (
                <div className="mt-5 border-t border-[var(--color-line)] pt-4">
                  <h3 className="text-h4">Add a booking request</h3>
                  <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                    This adds the place to your trip draft. It does not contact
                    the business or confirm availability.
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        className="mb-1 flex items-center gap-1 text-xs font-semibold"
                        htmlFor="nearby-booking-date"
                      >
                        <CalendarBlank size={14} />
                        {service === "hotels" ? "Check in" : "Date"}
                      </label>
                      <Input
                        id="nearby-booking-date"
                        type="date"
                        value={bookingDate}
                        min={trip ? dateFieldValue(trip.startDateISO) : undefined}
                        max={tripLastDay}
                        onChange={(event) => setBookingDate(event.target.value)}
                      />
                    </div>
                    {service === "hotels" ? (
                      <div>
                        <label
                          className="mb-1 flex items-center gap-1 text-xs font-semibold"
                          htmlFor="nearby-booking-checkout"
                        >
                          <CalendarBlank size={14} />
                          Check out
                        </label>
                        <Input
                          id="nearby-booking-checkout"
                          type="date"
                          value={bookingEndDate}
                          min={bookingDate}
                          max={hotelCheckoutDate}
                          onChange={(event) =>
                            setBookingEndDate(event.target.value)
                          }
                        />
                      </div>
                    ) : (
                      <div>
                        <label
                          className="mb-1 flex items-center gap-1 text-xs font-semibold"
                          htmlFor="nearby-booking-time"
                        >
                          <Clock size={14} />
                          Time
                        </label>
                        <Input
                          id="nearby-booking-time"
                          type="time"
                          value={bookingTime}
                          onChange={(event) => setBookingTime(event.target.value)}
                        />
                      </div>
                    )}
                    {service === "restaurants" && (
                      <div>
                        <label
                          className="mb-1 block text-xs font-semibold"
                          htmlFor="nearby-booking-mode"
                        >
                          Dining option
                        </label>
                        <select
                          id="nearby-booking-mode"
                          value={bookingMode}
                          onChange={(event) =>
                            setBookingMode(
                              event.target.value as
                                | "reserve"
                                | "pickup"
                                | "delivery",
                            )
                          }
                          className="h-11 w-full rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-[var(--color-canvas)] px-3 text-sm"
                        >
                          <option value="reserve">Reserve a table</option>
                          <option value="pickup">Pickup</option>
                          <option value="delivery">Delivery</option>
                        </select>
                      </div>
                    )}
                    {(service === "restaurants" ||
                      service === "hotels" ||
                      service === "catering" ||
                      service === "venues") && (
                      <div>
                        <label
                          className="mb-1 flex items-center gap-1 text-xs font-semibold"
                          htmlFor="nearby-booking-party"
                        >
                          <Users size={14} />
                          {service === "hotels" ? "Guests" : "People"}
                        </label>
                        <Input
                          id="nearby-booking-party"
                          type="number"
                          min={1}
                          max={200}
                          value={partySize}
                          onChange={(event) =>
                            setPartySize(Number(event.target.value))
                          }
                        />
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
                    Price and availability are not supplied by the map. Confirm
                    details directly with the business.
                  </p>
                  {hasActivePlan ? (
                    <Button
                      className="mt-4 w-full"
                      onClick={addPlaceBooking}
                      disabled={
                        !bookingDate ||
                        (service === "hotels"
                          ? !bookingEndDate || bookingEndDate <= bookingDate
                          : !bookingTime) ||
                        !Number.isFinite(partySize) ||
                        partySize < 1
                      }
                    >
                      <CheckCircle size={17} weight="bold" />
                      Add request to {plan?.name ?? "trip"}
                    </Button>
                  ) : (
                    <Link
                      to="/app/trips?start=1"
                      className="mt-4 inline-flex w-full justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-4 py-3 text-sm font-bold text-[var(--color-on-primary)] hover:bg-[var(--color-primary-hover)]"
                    >
                      Start a trip to add this place
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
