import { useEffect, useState } from "react";
import { AirplaneTilt, MagnifyingGlass } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import { AIRPORTS } from "@/lib/mock-data";
import type { FlightOffer } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { FlightTicket } from "@/components/tickets/FlightTicket";
import { useAddToPlan } from "@/store/useAddToPlan";
import { PageHeader } from "@/components/PageHeader";
import { NearbyGuide } from "@/components/NearbyGuide";

type Sort = "price" | "duration" | "depart";

export function FlightsPage() {
  const { add } = useAddToPlan();
  const [from, setFrom] = useState("MNL");
  const [to, setTo] = useState("CEB");
  const [date, setDate] = useState(() =>
    new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  );
  const [tripType, setTripType] = useState<"one-way" | "round trip">(
    "round trip",
  );
  const [maxStops, setMaxStops] = useState(2);
  const [sort, setSort] = useState<Sort>("price");
  const [results, setResults] = useState<FlightOffer[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    const offers = await api.searchFlights({
      from,
      to,
      dateISO: new Date(date).toISOString(),
      tripType,
    });
    setResults(offers);
    setLoading(false);
  }

  useEffect(() => {
    void search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shown = (results ?? [])
    .filter((o) => o.stops <= maxStops)
    .sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "duration") return a.durationMin - b.durationMin;
      return (
        new Date(a.departISO).getTime() - new Date(b.departISO).getTime()
      );
    });
  const destinationCity =
    AIRPORTS.find((airport) => airport.code === to)?.city ?? to;

  return (
    <div>
      <PageHeader title="Flights" subtitle="Search by airport and date, then add to your plan." />
      <div className="p-4 lg:p-8">
        <NearbyGuide city={destinationCity} initialService="flights" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void search();
          }}
          className="mb-6 grid grid-cols-2 gap-3 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 shadow-2 md:grid-cols-5"
        >
          <div>
            <Label htmlFor="from">From</Label>
            <Select id="from" value={from} onChange={(e) => setFrom(e.target.value)}>
              {AIRPORTS.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.code} · {a.city}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="to">To</Label>
            <Select id="to" value={to} onChange={(e) => setTo(e.target.value)}>
              {AIRPORTS.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.code} · {a.city}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Depart</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="type">Trip</Label>
            <Select
              id="type"
              value={tripType}
              onChange={(e) =>
                setTripType(e.target.value as "one-way" | "round trip")
              }
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

        {results && results.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-4 text-[0.875rem]">
            <div className="flex items-center gap-2">
              <Label htmlFor="stops">Max stops</Label>
              <Select
                id="stops"
                className="h-9 w-auto"
                value={maxStops}
                onChange={(e) => setMaxStops(Number(e.target.value))}
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
                onChange={(e) => setSort(e.target.value as Sort)}
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

        {loading && (
          <p className="text-[var(--color-ink-muted)]">Searching flights…</p>
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
                onAdd={() =>
                  add({
                    kind: "flight",
                    module: "flight",
                    dayIndex: 0,
                    title: `${offer.from.code} to ${offer.to.code} · ${offer.airline}`,
                    price: offer.price,
                    offer,
                  })
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
}
