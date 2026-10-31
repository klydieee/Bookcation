// Provider-neutral API contract (01 §4, 09_DATA_AND_API). The mock adapter
// returns deterministic data; a real HttpAdapter can swap in later.

import type {
  CateringOption,
  FlightOffer,
  Hotel,
  Restaurant,
} from "./types";
import {
  generateCateringOptions,
  generateFlights,
  generateHotels,
  generateRestaurants,
} from "./mock-data";

export interface FlightQuery {
  from: string;
  to: string;
  dateISO: string;
  tripType: "one-way" | "round trip";
}

export interface BookcationApi {
  searchFlights(q: FlightQuery): Promise<FlightOffer[]>;
  listRestaurants(city: string): Promise<Restaurant[]>;
  listHotels(city: string): Promise<Hotel[]>;
  listCateringOptions(): Promise<CateringOption[]>;
}

// Simulate a small latency so loading states are real.
function delay<T>(value: T, ms = 320): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const mockApi: BookcationApi = {
  searchFlights(q) {
    return delay(generateFlights(q.from, q.to, q.dateISO, q.tripType));
  },
  listRestaurants(city) {
    return delay(generateRestaurants(city || "Lisbon"));
  },
  listHotels(city) {
    return delay(generateHotels(city || "Lisbon"));
  },
  listCateringOptions() {
    return delay(generateCateringOptions());
  },
};

export const api: BookcationApi = mockApi;
