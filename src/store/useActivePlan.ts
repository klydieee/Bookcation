import { useTrips, activePlan } from "./tripStore";

// Returns the currently active trip and its active plan, if any.
export function useActivePlanContext() {
  const activeTripId = useTrips((s) => s.activeTripId);
  const trips = useTrips((s) => s.trips);
  const trip = trips.find((t) => t.id === activeTripId) ?? null;
  const plan = trip ? activePlan(trip) ?? null : null;
  return { trip, plan };
}
