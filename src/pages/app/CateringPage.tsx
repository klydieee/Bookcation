import { Link } from "react-router-dom";
import { CookingPot } from "@phosphor-icons/react";
import { NearbyGuide } from "@/components/NearbyGuide";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { useActivePlanContext } from "@/store/useActivePlan";

export function CateringPage() {
  const { trip, plan } = useActivePlanContext();
  const city = trip?.destinationCity ?? "";
  const hasHotel = Boolean(
    plan?.items.some(
      (item) =>
        item.kind === "stay" ||
        (item.kind === "place" &&
          item.placeBooking.service === "hotels"),
    ),
  );

  return (
    <div>
      <PageHeader
        title="Catering"
        subtitle={
          city
            ? `Find map-listed catering providers and event services near ${city}.`
            : "Search map-listed catering and event services near any area."
        }
      />
      <div className="p-4 lg:p-8">
        {hasHotel && (
          <div className="mb-5 flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-warning)] bg-[var(--color-warning-tint)] p-4">
            <CookingPot
              size={22}
              className="mt-0.5 shrink-0 text-[var(--color-warning)]"
            />
            <div>
              <h2 className="font-bold">Catering is unavailable with a hotel stay</h2>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                Plan meals with nearby restaurant pickup or delivery instead.
              </p>
              <Link to="/app/food" className="mt-3 inline-block">
                <Button size="sm">Browse nearby restaurants</Button>
              </Link>
            </div>
          </div>
        )}
        <NearbyGuide
          city={city}
          initialService={hasHotel ? "restaurants" : "catering"}
        />
        <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
          Only businesses categorized as catering in map data appear here.
          Availability and prices must be confirmed with the provider.
        </p>
      </div>
    </div>
  );
}
