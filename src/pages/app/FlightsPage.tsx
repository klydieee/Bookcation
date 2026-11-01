import { useEffect, useRef, useState } from "react";
import {
  AirplaneTilt,
  MagnifyingGlass,
  NavigationArrow,
} from "@phosphor-icons/react";
import { api } from "@/lib/api";
import { AIRPORTS } from "@/lib/mock-data";
import type { FlightOffer } from "@/lib/types";
import type { NearbyPlace } from "@/lib/nearby-types";
import { addDays, dateShort } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { FlightTicket } from "@/components/tickets/FlightTicket";
import { useAddToPlan } from "@/store/useAddToPlan";
import { useActivePlanContext } from "@/store/useActivePlan";
import { PageHeader } from "@/components/PageHeader";
import { NearbyGuide } from "@/components/NearbyGuide";

type Sort = "price" | "duration" | "depart";
type TripType = "one-way" | "round trip";

function dateInput(iso?: string): string {
  return iso?.slice(0, 10) ?? new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
}

function airportForCity(city?: string) {
  return AIRPORTS.find(
    (airport) => airport.city.toLowerCase() === city?.toLowerCase(),
  );
}

function nearestSupportedAirport(latitude: number, longitude: number) {
  const radians = (value: number) => (value * Math.PI) / 180;
  return AIRPORTS.flatMap((airport) => {
    if (airport.latitude === undefined || airport.longitude === undefined) {
      return [];
    }
    return [{ airport, latitude: airport.latitude, longitude: airport.longitude }];
  })
    .map(({ airport, latitude: airportLatitude, longitude: airportLongitude }) => {
      const latDelta = radians(airportLatitude - latitude);
      const lonDelta = radians(airportLongitude - longitude);
      const a =
        Math.sin(latDelta / 2) ** 2 +
        Math.cos(radians(latitude)) *
          Math.cos(radians(airportLatitude)) *
          Math.sin(lonDelta / 2) ** 2;
      return {
        airport,
        distance: 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
      };
    })
    .sort((a, b) => a.distance - b.distance)[0];
}

function airportForPlace(place: NearbyPlace) {
  const normalizedName = place.name.toLowerCase();
  return AIRPORTS.find(
    (airport) =>
      normalizedName.includes(airport.name.toLowerCase()) ||
      normalizedName.includes(airport.city.toLowerCase()),
  );
}

export function FlightsPage() {
  const { add } = useAddToPlan();
  const { trip } = useActivePlanContext();
  const [from, setFrom] = useState("MNL");
  const [to, setTo] = useState(() => airportForCity(trip?.destinationCity)?.code ?? "CEB");
  const [date, setDate] = useState(() => dateInput(trip?.startDateISO));
  const [returnDate, setReturnDate] = useState(() =>
    trip
      ? dateInput(addDays(trip.startDateISO, trip.days))
      : dateInput(addDays(new Date().toISOString(), 17)),
  );
  const [originCoordinates, setOriginCoordinates] = useState<string | null>(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [locating, setLocating] = useState(false);
  const [tripType, setTripType] = useState<TripType>("round trip");
  const [maxStops, setMaxStops] = useState(2);
  const [sort, setSort] = useState<Sort>("price");
  const [results, setResults] = useState<FlightOffer[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [flightAdded, setFlightAdded] = useState(false);
  const requestId = useRef(0);

  async function search(query?: {
    from: string;
    to: string;
    date: string;
    returnDate: string;
    tripType: TripType;
  }) {
    const request = query ?? { from, to, date, returnDate, tripType };
    const currentRequestId = ++requestId.current;
    setLoading(true);
    setSearchError("");
    try {
      const offers = await api.searchFlights({
        from: request.from,
        to: request.to,
        dateISO: new Date(`${request.date}T12:00:00`).toISOString(),
        tripType: request.tripType,
        ...(request.tripType === "round trip"
          ? {
              returnDateISO: new Date(
                `${request.returnDate}T12:00:00`,
              ).toISOString(),
            }
          : {}),
      });
      if (currentRequestId === requestId.current) {
        setResults(offers);
        setFlightAdded(false);
      }
    } catch (error) {
      if (currentRequestId === requestId.current) {
        setSearchError(
          error instanceof Error ? error.message : "Flight search failed.",
        );
        setResults([]);
      }
    } finally {
      if (currentRequestId === requestId.current) setLoading(false);
    }
  }

  useEffect(() => {
    if (!trip) {
      void search();
      return;
    }
    const destination = airportForCity(trip.destinationCity);
    const departureDate = dateInput(trip.startDateISO);
    const arrivalDate = dateInput(addDays(trip.startDateISO, trip.days));
    const destinationCode = destination?.code ?? to;
    setTo(destinationCode);
    setDate(departureDate);
    setReturnDate(arrivalDate);
    void search({
      from,
      to: destinationCode,
      date: departureDate,
      returnDate: arrivalDate,
      tripType,
    });
    // Load active-trip defaults once per trip; manual edits remain user-controlled.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip?.id]);

  const shown = (results ?? [])
    .filter((offer) => offer.stops <= maxStops)
    .sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "duration") return a.durationMin - b.durationMin;
      return new Date(a.departISO).getTime() - new Date(b.departISO).getTime();
    });
  const departureAirport = AIRPORTS.find((airport) => airport.code === from);
  const destinationAirport = AIRPORTS.find((airport) => airport.code === to);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Location access is not available in this browser.");
      return;
    }
    setLocating(true);
    setLocationMessage("Waiting for location permission…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearest = nearestSupportedAirport(
          coords.latitude,
          coords.longitude,
        );
        setLocating(false);
        if (!nearest || nearest.distance > 250000) {
          setOriginCoordinates(null);
          setLocationMessage(
            "We could not match your location to a supported airport. Choose a departure airport manually.",
          );
          return;
        }
        const nextFrom = nearest.airport.code;
        setFrom(nextFrom);
        setOriginCoordinates(
          `${coords.latitude.toFixed(4)},${coords.longitude.toFixed(4)}`,
        );
        void search({ from: nextFrom, to, date, returnDate, tripType });
        setLocationMessage(
          `Nearest supported airport: ${nearest.airport.code} · ${nearest.airport.city}.`,
        );
      },
      (error) => {
        setLocating(false);
        setLocationMessage(
          error.code === error.PERMISSION_DENIED
            ? "Location permission was denied. Choose your departure airport manually."
            : "Your location could not be determined. Choose your departure airport manually.",
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  }

  return (
    <div>
      <PageHeader
        title="Flights"
        subtitle="Your trip destination and dates are prefilled. Choose a departure airport or use your location."
      />
      <div className="p-4 lg:p-8">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void search();
          }}
          className="mb-6 grid grid-cols-2 gap-3 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 shadow-2 md:grid-cols-6"
        >
          <div>
            <Label htmlFor="from">From</Label>
            <Select
              id="from"
              value={from}
              onChange={(event) => {
                setFrom(event.target.value);
                setOriginCoordinates(null);
              }}
            >
              {AIRPORTS.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.code} · {airport.city}
                </option>
              ))}
            </Select>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="mt-1 px-1"
              onClick={useCurrentLocation}
              disabled={locating}
            >
              <NavigationArrow size={15} weight="bold" />
              {locating ? "Finding airport…" : "Use my location"}
            </Button>
          </div>
          <div>
            <Label htmlFor="to">To</Label>
            <Select
              id="to"
              value={to}
              onChange={(event) => setTo(event.target.value)}
            >
              {AIRPORTS.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.code} · {airport.city}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="depart">Depart</Label>
            <Input
              id="depart"
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                if (returnDate < event.target.value) {
                  setReturnDate(event.target.value);
                }
              }}
              required
            />
          </div>
          {tripType === "round trip" && (
            <div>
              <Label htmlFor="return">Return</Label>
              <Input
                id="return"
                type="date"
                value={returnDate}
                min={date}
                onChange={(event) => setReturnDate(event.target.value)}
                required
              />
            </div>
          )}
          <div>
            <Label htmlFor="type">Trip</Label>
            <Select
              id="type"
              value={tripType}
              onChange={(event) => setTripType(event.target.value as TripType)}
            >
              <option value="round trip">Round trip</option>
              <option value="one-way">One-way</option>
            </Select>
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              <MagnifyingGlass size={18} weight="bold" />
              Search
            </Button>
          </div>
        </form>

        {locationMessage && (
          <p className="mb-4 text-sm text-[var(--color-ink-muted)]" role="status">
            {locationMessage}
          </p>
        )}
        {trip && (
          <p className="mb-4 rounded-[var(--radius-sm)] bg-[var(--color-primary-tint)] px-4 py-3 text-sm text-[var(--color-primary-ink)]">
            Planning {dateShort(new Date(`${date}T12:00:00`).toISOString())}
            {tripType === "round trip" &&
              ` – ${dateShort(new Date(`${returnDate}T12:00:00`).toISOString())}`}
            {" "}· {departureAirport?.city ?? from} to{" "}
            {destinationAirport?.city ?? to}
          </p>
        )}

        <NearbyGuide
          city={departureAirport?.city ?? ""}
          initialService="flights"
          initialCoordinates={originCoordinates}
          onAirportSelect={(place) => {
            const airport = airportForPlace(place);
            if (airport) {
              setFrom(airport.code);
              setOriginCoordinates(null);
              void search({ from: airport.code, to, date, returnDate, tripType });
              setLocationMessage(
                `Departure airport set to ${airport.code} · ${airport.city}.`,
              );
            } else {
              setLocationMessage(
                "Choose a supported airport from the departure list.",
              );
            }
          }}
        />

        <section aria-labelledby="flight-options-title">
          <div className="mb-4">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--color-primary-ink)]">
              Sample booking options
            </p>
            <h2 id="flight-options-title" className="text-h2 mt-1">
              Compare flights
            </h2>
            <p className="mt-1 text-[0.875rem] text-[var(--color-ink-muted)]">
              Nearby airports are based on your departure location. Flight offers
              are illustrative and are not live airline inventory.
            </p>
          </div>

          {results && results.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-4 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-3 text-[0.875rem]">
              <div className="flex items-center gap-2">
                <Label htmlFor="stops">Max stops</Label>
                <Select
                  id="stops"
                  className="h-9 w-auto"
                  value={maxStops}
                  onChange={(event) => setMaxStops(Number(event.target.value))}
                >
                  <option value={0}>Nonstop</option>
                  <option value={1}>1 stop</option>
                  <option value={2}>2 stops</option>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="sort">Sort</Label>
                <Select
                  id="sort"
                  className="h-9 w-auto"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as Sort)}
                >
                  <option value="price">Price</option>
                  <option value="duration">Duration</option>
                  <option value="depart">Departure</option>
                </Select>
              </div>
              <span className="text-[var(--color-ink-muted)]">
                {shown.length} flights
              </span>
            </div>
          )}

          {searchError && (
            <p className="mb-3 text-sm text-[var(--color-error)]" role="alert">
              {searchError}
            </p>
          )}
          {flightAdded && (
            <p
              className="mb-3 rounded-[var(--radius-sm)] bg-[var(--color-success-tint)] px-4 py-3 text-sm font-semibold text-[var(--color-success)]"
              role="status"
            >
              Flight added to your active trip plan.
            </p>
          )}
          {loading && (
            <p className="text-[var(--color-ink-muted)]" role="status">
              Searching flights…
            </p>
          )}
          {!loading && results && shown.length === 0 && (
            <EmptyState
              icon={AirplaneTilt}
              title="No flights match"
              body="Try a different route, date, or raise the stops filter."
            />
          )}
          <div className="grid gap-4">
            {!loading &&
              shown.map((offer) => (
                <FlightTicket
                  key={offer.id}
                  offer={offer}
                  onAdd={() => {
                    setFlightAdded(
                      add({
                      kind: "flight",
                      module: "flight",
                      dayIndex: 0,
                      title: `${offer.from.code} to ${offer.to.code} · ${offer.airline}`,
                      price: offer.price,
                      offer,
                      }),
                    );
                  }}
                />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
