import { useEffect, useMemo, useState } from "react";
import { Bed } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import { AIRPORTS } from "@/lib/mock-data";
import type { Hotel, RoomType } from "@/lib/types";
import { Input, Label, Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { NearbyGuide } from "@/components/NearbyGuide";
import { StayTicket } from "@/components/tickets/StayTicket";
import { useActivePlanContext } from "@/store/useActivePlan";
import { useAddToPlan } from "@/store/useAddToPlan";
import { addDays } from "@/lib/format";

type Sort = "price" | "rating" | "stars";

function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(ms / 86400000));
}

export function HotelsPage() {
  const { trip } = useActivePlanContext();
  const { add } = useAddToPlan();
  const cities = useMemo(() => [...new Set(AIRPORTS.map((a) => a.city))], []);

  const [city, setCity] = useState(trip?.destinationCity ?? "");
  const [checkIn, setCheckIn] = useState(() =>
    (trip?.startDateISO ?? new Date(Date.now() + 14 * 86400000).toISOString()).slice(
      0,
      10,
    ),
  );
  const [checkOut, setCheckOut] = useState(() =>
    addDays(
      trip?.startDateISO ?? new Date(Date.now() + 14 * 86400000).toISOString(),
      trip?.days ?? 3,
    ).slice(0, 10),
  );
  const [guests, setGuests] = useState(trip?.travelers ?? 2);
  const [sort, setSort] = useState<Sort>("price");
  const [hotels, setHotels] = useState<Hotel[] | null>(null);
  const [rooms, setRooms] = useState<Record<string, RoomType>>({});

  useEffect(() => {
    if (!city) {
      setHotels(null);
      return;
    }

    let active = true;
    setHotels(null);
    void api.listHotels(city).then((h) => {
      if (active) setHotels(h);
    });
    return () => {
      active = false;
    };
  }, [city]);

  const nights = nightsBetween(checkIn, checkOut);

  const shown = (hotels ?? [])
    .slice()
    .sort((a, b) => {
      if (sort === "price") return a.nightlyFrom - b.nightlyFrom;
      if (sort === "rating") return b.rating - a.rating;
      return b.stars - a.stars;
    });

  function roomOf(h: Hotel): RoomType {
    return rooms[h.id] ?? "Standard";
  }

  function addStay(h: Hotel) {
    const type = roomOf(h);
    const room = h.rooms.find((r) => r.type === type) ?? h.rooms[0];
    add({
      kind: "stay",
      module: "stay",
      dayIndex: 0,
      title: `${h.name} · ${type} · ${nights} night${nights > 1 ? "s" : ""}`,
      price: room.nightly * nights,
      stay: {
        hotelId: h.id,
        hotelName: h.name,
        roomType: type,
        checkInISO: new Date(checkIn).toISOString(),
        checkOutISO: new Date(checkOut).toISOString(),
        nights,
        rooms: 1,
        guests,
        nightly: room.nightly,
      },
    });
  }

  return (
    <div>
      <PageHeader
        title="Hotels"
        subtitle="Find a place to stay, pick a room, and add the nights to your plan."
      />
      <div className="p-4 lg:p-8">
        <NearbyGuide city={city} initialService="hotels" />
        <div className="mb-6 grid grid-cols-2 gap-3 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 shadow-2 md:grid-cols-4">
          <div>
            <Label htmlFor="hcity">City</Label>
            <Select id="hcity" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Choose a city</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="hin">Check in</Label>
            <Input
              id="hin"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hout">Check out</Label>
            <Input
              id="hout"
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="hguests">Guests</Label>
            <Input
              id="hguests"
              type="number"
              min={1}
              max={12}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            />
          </div>
        </div>

        {hotels && hotels.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-4 text-[0.875rem]">
            <div className="flex items-center gap-2">
              <Label htmlFor="hsort">Sort</Label>
              <Select
                id="hsort"
                className="h-9 w-auto"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
              >
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="stars">Stars</option>
              </Select>
            </div>
            <span className="text-[var(--color-ink-muted)]">
              {shown.length} hotels · {nights} night{nights > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {city && !hotels && (
          <p className="text-[var(--color-ink-muted)]">Loading hotels…</p>
        )}

        {city && hotels && shown.length === 0 && (
          <EmptyState
            icon={Bed}
            title="No hotels here yet"
            body="Try another city to see places to stay."
          />
        )}

        {!city && (
          <p className="mb-4 text-[0.875rem] text-[var(--color-ink-muted)]">
            Choose a city or use your location above to explore places nearby. Hotel sample listings follow the selected city or active trip destination.
          </p>
        )}

        <div className="grid gap-4">
          {shown.map((h) => (
            <StayTicket
              key={h.id}
              hotel={h}
              nights={nights}
              roomType={roomOf(h)}
              onRoomChange={(t) =>
                setRooms((prev) => ({ ...prev, [h.id]: t }))
              }
              onAdd={() => addStay(h)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
