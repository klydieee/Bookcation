import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { NearbyGuide } from "@/components/NearbyGuide";
import { Button } from "@/components/ui/Button";
import { useActivePlanContext } from "@/store/useActivePlan";
import { addDays, dateShort } from "@/lib/format";

export function HotelsPage() {
  const { trip } = useActivePlanContext();
  const city = trip?.destinationCity ?? "";

  return (
    <div>
      <PageHeader
        title="Hotels"
        subtitle={
          trip
            ? `Explore stays near ${city}, ${dateShort(trip.startDateISO)} – ${dateShort(addDays(trip.startDateISO, trip.days))}.`
            : "Search live stays near your current location or any area."
        }
      />
      <div className="p-4 lg:p-8">
        <NearbyGuide city={city} initialService="hotels" />
        {!trip && (
          <div className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
            <h2 className="text-h3">Save a stay to a trip</h2>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              Explore nearby properties. Start a trip to add a stay request
              with check-in, check-out, and guest details.
            </p>
            <Link to="/app/trips?start=1" className="mt-4 inline-block">
              <Button>Start a trip</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
