import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Booking,
  Conflict,
  Plan,
  PlanItem,
  Trip,
} from "@/lib/types";
import { bookingRef, uid } from "./id";

interface TripState {
  trips: Trip[];
  bookings: Booking[];
  activeTripId: string | null;

  createTrip: (input: {
    name: string;
    destinationCity: string;
    startDateISO: string;
    days: number;
    travelers: number;
  }) => string;
  deleteTrip: (tripId: string) => void;
  setActiveTrip: (tripId: string | null) => void;

  activePlanId: (tripId: string) => string | null;
  setActivePlan: (tripId: string, planId: string) => void;
  forkPlan: (tripId: string, planId: string) => string;
  promotePlan: (tripId: string, planId: string) => void;

  addItem: (tripId: string, planId: string, item: PlanItem) => void;
  removeItem: (tripId: string, planId: string, itemId: string) => void;
  moveItem: (
    tripId: string,
    planId: string,
    itemId: string,
    dayIndex: number,
  ) => void;

  checkout: (tripId: string, planId: string) => string;
  deleteBooking: (bookingId: string) => void;
  resetDemo: () => void;
}

function planLetter(count: number): string {
  // A, B, C, ...
  return `Plan ${String.fromCharCode(65 + count)}`;
}

export const useTrips = create<TripState>()(
  persist(
    (set, get) => ({
      trips: [],
      bookings: [],
      activeTripId: null,

      createTrip: (input) => {
        const tripId = uid("trip");
        const plan: Plan = {
          id: uid("plan"),
          name: "Plan A",
          isActive: true,
          items: [],
          createdISO: new Date().toISOString(),
        };
        const trip: Trip = {
          id: tripId,
          name: input.name,
          destinationCity: input.destinationCity,
          startDateISO: input.startDateISO,
          days: input.days,
          travelers: input.travelers,
          plans: [plan],
          createdISO: new Date().toISOString(),
        };
        set((s) => ({ trips: [trip, ...s.trips], activeTripId: tripId }));
        return tripId;
      },

      deleteTrip: (tripId) =>
        set((s) => ({
          trips: s.trips.filter((t) => t.id !== tripId),
          bookings: s.bookings.filter((booking) => booking.tripId !== tripId),
          activeTripId:
            s.activeTripId === tripId ? null : s.activeTripId,
        })),

      setActiveTrip: (tripId) => set({ activeTripId: tripId }),

      activePlanId: (tripId) => {
        const trip = get().trips.find((t) => t.id === tripId);
        return trip?.plans.find((p) => p.isActive)?.id ?? null;
      },

      setActivePlan: (tripId, planId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId
              ? t
              : {
                  ...t,
                  plans: t.plans.map((p) => ({
                    ...p,
                    isActive: p.id === planId,
                  })),
                },
          ),
        })),

      forkPlan: (tripId, planId) => {
        const newId = uid("plan");
        set((s) => ({
          trips: s.trips.map((t) => {
            if (t.id !== tripId) return t;
            const src = t.plans.find((p) => p.id === planId);
            if (!src) return t;
            const copy: Plan = {
              id: newId,
              name: planLetter(t.plans.length),
              isActive: true,
              createdISO: new Date().toISOString(),
              items: src.items.map((it) => ({ ...it, id: uid("item") })),
            };
            return {
              ...t,
              plans: [
                ...t.plans.map((p) => ({ ...p, isActive: false })),
                copy,
              ],
            };
          }),
        }));
        return newId;
      },

      promotePlan: (tripId, planId) =>
        // "Make this the plan" — mark active (A/B are peers, so this is activation)
        get().setActivePlan(tripId, planId),

      addItem: (tripId, planId, item) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId
              ? t
              : {
                  ...t,
                  plans: t.plans.map((p) =>
                    p.id !== planId
                      ? p
                      : { ...p, items: [...p.items, item] },
                  ),
                },
          ),
        })),

      removeItem: (tripId, planId, itemId) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId
              ? t
              : {
                  ...t,
                  plans: t.plans.map((p) =>
                    p.id !== planId
                      ? p
                      : {
                          ...p,
                          items: p.items.filter((it) => it.id !== itemId),
                        },
                  ),
                },
          ),
        })),

      moveItem: (tripId, planId, itemId, dayIndex) =>
        set((s) => ({
          trips: s.trips.map((t) =>
            t.id !== tripId
              ? t
              : {
                  ...t,
                  plans: t.plans.map((p) =>
                    p.id !== planId
                      ? p
                      : {
                          ...p,
                          items: p.items.map((it) =>
                            it.id === itemId ? { ...it, dayIndex } : it,
                          ),
                        },
                  ),
                },
          ),
        })),

      checkout: (tripId, planId) => {
        const trip = get().trips.find((t) => t.id === tripId);
        const plan = trip?.plans.find((p) => p.id === planId);
        if (!trip || !plan) return "";
        const booking: Booking = {
          id: uid("bk"),
          tripId,
          planId,
          reference: bookingRef(),
          tripName: trip.name,
          planName: plan.name,
          createdISO: new Date().toISOString(),
          total: plan.items.reduce((sum, it) => sum + it.price, 0),
          items: plan.items.map((it) => ({ ...it })),
        };
        set((s) => ({ bookings: [booking, ...s.bookings] }));
        return booking.id;
      },

      deleteBooking: (bookingId) =>
        set((s) => ({
          bookings: s.bookings.filter((booking) => booking.id !== bookingId),
        })),

      resetDemo: () =>
        set({ trips: [], bookings: [], activeTripId: null }),
    }),
    { name: "bookcation.trips" },
  ),
);

// ---- Selectors / helpers ----

export function planTotal(plan: Plan): number {
  return plan.items.reduce((sum, it) => sum + it.price, 0);
}

export function activePlan(trip: Trip): Plan | undefined {
  return trip.plans.find((p) => p.isActive) ?? trip.plans[0];
}

// Conflict detection (01 §3.3, claim P0): a meal scheduled on the same day
// as a flight segment that is in the air at the reservation time.
export function detectConflicts(plan: Plan): Conflict[] {
  const conflicts: Conflict[] = [];
  const flights = plan.items.filter((i) => i.kind === "flight");
  const reservations = plan.items.filter((i) => i.kind === "reservation");

  for (const res of reservations) {
    if (res.kind !== "reservation") continue;
    const resTime = new Date(res.reservation.timeISO).getTime();
    for (const fl of flights) {
      if (fl.kind !== "flight") continue;
      if (fl.dayIndex !== res.dayIndex) continue;
      const dep = new Date(fl.offer.departISO).getTime();
      const arr = new Date(fl.offer.arriveISO).getTime();
      if (resTime >= dep && resTime <= arr) {
        conflicts.push({
          itemId: res.id,
          message: `${res.title} overlaps a flight that is in the air.`,
          fix: "Move the reservation to after you land, or to another day.",
        });
      }
    }
  }
  return conflicts;
}

// Compare two plans: added, removed, changed, and deltas.
export interface PlanDiff {
  added: PlanItem[];
  removed: PlanItem[];
  costDelta: number;
}

export function diffPlans(a: Plan, b: Plan): PlanDiff {
  const key = (it: PlanItem) => `${it.kind}:${it.title}:${it.price}`;
  const aKeys = new Set(a.items.map(key));
  const bKeys = new Set(b.items.map(key));
  const added = b.items.filter((it) => !aKeys.has(key(it)));
  const removed = a.items.filter((it) => !bKeys.has(key(it)));
  return { added, removed, costDelta: planTotal(b) - planTotal(a) };
}
