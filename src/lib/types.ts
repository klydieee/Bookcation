// Domain model. Terms follow 01_PRODUCT_BRIEF §9 (glossary).

export type ModuleId = "flight" | "food" | "catering" | "stay" | "trip";

export type Currency = "PHP" | "USD" | "EUR" | "GBP";

// ---- Flights ----
export interface Airport {
  code: string; // IATA, e.g. "JFK"
  city: string;
  name: string;
}

export interface FlightSegment {
  from: Airport;
  to: Airport;
  departISO: string;
  arriveISO: string;
  durationMin: number;
  flightNo: string;
}

export interface FlightOffer {
  id: string;
  airline: string;
  airlineCode: string;
  from: Airport;
  to: Airport;
  departISO: string;
  arriveISO: string;
  durationMin: number;
  stops: number;
  price: number; // per traveler
  cabin: "Economy" | "Premium" | "Business";
  tripType: "one-way" | "round trip";
}

// ---- Food ----
export type ServiceMode = "reserve" | "pickup" | "delivery";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: DietTag[];
}

export type DietTag =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "halal"
  | "nut-free";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceTier: 1 | 2 | 3 | 4;
  rating: number; // illustrative
  etaMin: number; // delivery eta
  neighborhood: string;
  opensHour: number; // 24h local
  closesHour: number;
  diet: DietTag[];
  modes: ServiceMode[];
  menu: MenuItem[];
}

export interface Reservation {
  restaurantId: string;
  restaurantName: string;
  partySize: number;
  timeISO: string;
  mode: ServiceMode;
}

// ---- Stays (hotels) ----
export type RoomType = "Standard" | "Deluxe" | "Suite";

export interface Hotel {
  id: string;
  name: string;
  city: string;
  neighborhood: string;
  rating: number; // illustrative, out of 5
  stars: 3 | 4 | 5;
  nightlyFrom: number; // lowest room price per night
  amenities: string[];
  rooms: { type: RoomType; nightly: number; sleeps: number }[];
}

export interface StayReservation {
  hotelId: string;
  hotelName: string;
  roomType: RoomType;
  checkInISO: string;
  checkOutISO: string;
  nights: number;
  rooms: number;
  guests: number;
  nightly: number;
}

// ---- Catering ----
export interface CateringOption {
  id: string;
  caterer: string;
  style: string; // e.g. "Buffet", "Plated", "Boxed"
  perPerson: number;
  minGuests: number;
  leadDays: number;
  diet: DietTag[];
}

export interface CateringQuote {
  optionId: string;
  caterer: string;
  style: string;
  guests: number;
  perPerson: number;
  total: number;
  dateISO: string;
}

export interface RideReservation {
  provider: "Grab" | "Uber";
  from: string;
  to: string;
  timeISO: string;
}

// ---- Plan items ----
export type PlanItemKind =
  | "flight"
  | "reservation"
  | "stay"
  | "catering"
  | "ride"
  | "note";

export interface PlanItemBase {
  id: string;
  kind: PlanItemKind;
  dayIndex: number; // which day of the trip
  title: string;
  price: number;
  module: ModuleId;
}

export interface FlightPlanItem extends PlanItemBase {
  kind: "flight";
  offer: FlightOffer;
}

export interface ReservationPlanItem extends PlanItemBase {
  kind: "reservation";
  reservation: Reservation;
}

export interface StayPlanItem extends PlanItemBase {
  kind: "stay";
  stay: StayReservation;
}

export interface CateringPlanItem extends PlanItemBase {
  kind: "catering";
  quote: CateringQuote;
}

export interface RidePlanItem extends PlanItemBase {
  kind: "ride";
  ride: RideReservation;
}

export interface NotePlanItem extends PlanItemBase {
  kind: "note";
  note: string;
}

export type PlanItem =
  | FlightPlanItem
  | ReservationPlanItem
  | StayPlanItem
  | CateringPlanItem
  | RidePlanItem
  | NotePlanItem;

// ---- Trips and plans ----
export interface Plan {
  id: string;
  name: string; // "Plan A"
  isActive: boolean;
  items: PlanItem[];
  createdISO: string;
}

export interface Trip {
  id: string;
  name: string;
  destinationCity: string;
  startDateISO: string;
  days: number;
  travelers: number;
  plans: Plan[];
  createdISO: string;
}

// ---- Bookings ----
export interface Booking {
  id: string;
  reference: string;
  tripName: string;
  planName: string;
  createdISO: string;
  total: number;
  items: PlanItem[];
}

export interface Conflict {
  itemId: string;
  message: string;
  fix: string;
}
