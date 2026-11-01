import { Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { NearbyGuide } from "@/components/NearbyGuide";
import { Button } from "@/components/ui/Button";
import { useActivePlanContext } from "@/store/useActivePlan";

export function FoodPage() {
  const { trip } = useActivePlanContext();
  const city = trip?.destinationCity ?? "";

  return (
    <div>
      <PageHeader
        title="Food"
        subtitle={
          city
            ? `Explore live restaurants near your ${city} trip.`
            : "Search live restaurants near your current location or any area."
        }
      />
      <div className="p-4 lg:p-8">
        <NearbyGuide city={city} initialService="restaurants" />
        {!trip && (
          <div className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
            <h2 className="text-h3">Save a restaurant to a trip</h2>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              Explore nearby places now. Start a trip to add a dining request
              with a date, time, and party size.
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
