import { useLocation, useNavigate } from "react-router-dom";
import { useTrips } from "./tripStore";
import { useActivePlanContext } from "./useActivePlan";
import type { PlanItem } from "@/lib/types";
import { uid } from "./id";

// Adds an item to the active plan. If there is no active trip, routes the user
// to Trips to start one.
export function useAddToPlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const { trip, plan } = useActivePlanContext();
  const addItem = useTrips((s) => s.addItem);

  // Distributes Omit over the union so each member keeps its own fields.
  type NewItem = PlanItem extends infer T
    ? T extends PlanItem
      ? Omit<T, "id">
      : never
    : never;

  function add(partial: NewItem): boolean {
    if (!trip || !plan) {
      navigate("/app/trips?start=1");
      return false;
    }
    addItem(trip.id, plan.id, { ...partial, id: uid("item") } as PlanItem);
    const params = new URLSearchParams(location.search);
    const guideTripId =
      params.get("guide") ??
      (location.pathname === `/app/guide/${trip.id}` ? trip.id : null);
    const guideStep = Number(params.get("step"));
    if (
      guideTripId === trip.id &&
      Number.isInteger(guideStep) &&
      guideStep >= 0 &&
      guideStep < 5
    ) {
      params.set("step", String(guideStep + 1));
      params.set("status", "added");
      params.set(
        "service",
        ["flight", "stay", "food", "catering", "ride"][guideStep],
      );
      navigate(`/app/guide/${trip.id}?${params.toString()}`);
    }
    return true;
  }

  return { add, hasActivePlan: Boolean(trip && plan), trip, plan };
}
