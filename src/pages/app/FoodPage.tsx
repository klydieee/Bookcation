import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ForkKnife, Star } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import type { Restaurant, ServiceMode } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Label, Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { NearbyGuide } from "@/components/NearbyGuide";
import { useActivePlanContext } from "@/store/useActivePlan";
import { useAddToPlan } from "@/store/useAddToPlan";

const MODE_LABEL: Record<ServiceMode, string> = {
  reserve: "Reserve a table",
  pickup: "Schedule pickup",
  delivery: "Order delivery",
};

export function FoodPage() {
  const { trip } = useActivePlanContext();
  const { add } = useAddToPlan();
  const city = trip?.destinationCity ?? "";
  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null);
  const [cuisine, setCuisine] = useState("all");
  const [diet, setDiet] = useState("all");

  useEffect(() => {
    if (!city) {
      setRestaurants(null);
      return;
    }

    let active = true;
    setRestaurants(null);
    void api.listRestaurants(city).then((r) => {
      if (active) setRestaurants(r);
    });
    return () => {
      active = false;
    };
  }, [city]);

  const cuisines = useMemo(
    () => [...new Set((restaurants ?? []).map((r) => r.cuisine))].sort(),
    [restaurants],
  );

  const shown = (restaurants ?? []).filter(
    (r) =>
      (cuisine === "all" || r.cuisine === cuisine) &&
      (diet === "all" || r.diet.includes(diet as Restaurant["diet"][number])),
  );

  function reserve(r: Restaurant, mode: ServiceMode) {
    const t = new Date(trip?.startDateISO ?? Date.now());
    t.setHours(19, 30, 0, 0);
    add({
      kind: "reservation",
      module: "food",
      dayIndex: 0,
      title: `${r.name} · ${MODE_LABEL[mode].toLowerCase()}`,
      price:
        mode === "reserve"
          ? 0
          : Math.round(r.menu.reduce((s, m) => s + m.price, 0) / r.menu.length) *
            2,
      reservation: {
        restaurantId: r.id,
        restaurantName: r.name,
        partySize: trip?.travelers ?? 2,
        timeISO: t.toISOString(),
        mode,
      },
    });
  }

  return (
    <div>
      <PageHeader
        title="Food"
        subtitle={
          city
            ? `Restaurants for your ${city} trip. Reserve, schedule pickup, or order delivery.`
            : "Use your location or search a city or area for nearby restaurants, or start a trip to browse food at your destination."
        }
      />
      <div className="p-4 lg:p-8">
        <NearbyGuide city={city} initialService="restaurants" />
        {!city && (
          <div className="mb-6 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
            <h2 className="text-h3">No trip destination selected</h2>
            <p className="mt-2 text-[0.875rem] text-[var(--color-ink-muted)]">
              Use the map to search live restaurants around your current location or any city. Sample restaurant cards are shown only for an active trip destination.
            </p>
            <Link
              to="/app/trips?start=1"
              className="mt-4 inline-flex rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-4 py-2.5 text-[0.875rem] font-semibold text-[var(--color-on-primary)] hover:bg-[var(--color-primary-hover)]"
            >
              Start a trip
            </Link>
          </div>
        )}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="cuisine">Cuisine</Label>
            <Select
              id="cuisine"
              className="h-9 w-auto"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            >
              <option value="all">All</option>
              {cuisines.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="diet">Diet</Label>
            <Select
              id="diet"
              className="h-9 w-auto"
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
            >
              <option value="all">Any</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten-free</option>
              <option value="halal">Halal</option>
              <option value="nut-free">Nut-free</option>
            </Select>
          </div>
        </div>

        {city && !restaurants && (
          <p className="text-[var(--color-ink-muted)]">Loading restaurants…</p>
        )}

        {city && restaurants && shown.length === 0 && (
          <EmptyState
            icon={ForkKnife}
            title="Nothing matches those filters"
            body="Clear the cuisine or diet filter to see more places."
          />
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((r) => (
            <RestaurantTile key={r.id} r={r} onReserve={reserve} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RestaurantTile({
  r,
  onReserve,
}: {
  r: Restaurant;
  onReserve: (r: Restaurant, mode: ServiceMode) => void;
}) {
  // Photo tile (4:5) with a food-hued gradientless placeholder band.
  return (
    <div className="lift group overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] shadow-2">
      <div
        className="flex aspect-[4/5] items-end overflow-hidden p-4"
        style={{ background: "var(--color-food-tint)" }}
      >
        <ForkKnife
          size={40}
          weight="duotone"
          className="text-[var(--color-food)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-quint)] group-hover:scale-110"
        />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-h3">{r.name}</h3>
          <span className="flex items-center gap-1 text-[0.875rem] text-[var(--color-ink-muted)]">
            <Star size={14} weight="fill" className="text-[var(--color-catering)]" />
            <span className="tnum">{r.rating.toFixed(1)}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-1 text-[0.75rem]">
          <span className="rounded-[var(--radius-pill)] bg-[var(--color-sunken)] px-2 py-0.5">
            {r.cuisine}
          </span>
          <span className="rounded-[var(--radius-pill)] bg-[var(--color-sunken)] px-2 py-0.5">
            {"$".repeat(r.priceTier)}
          </span>
          <span className="rounded-[var(--radius-pill)] bg-[var(--color-sunken)] px-2 py-0.5">
            {r.etaMin} min
          </span>
        </div>
        <div className="mt-1 flex flex-wrap gap-2">
          {r.modes.map((m) => (
            <Button
              key={m}
              size="sm"
              variant={m === "reserve" ? "primary" : "secondary"}
              onClick={() => onReserve(r, m)}
            >
              {m === "reserve"
                ? "Reserve"
                : m === "pickup"
                  ? "Pickup"
                  : "Delivery"}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
