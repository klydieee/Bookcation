import type {
  Airport,
  CateringOption,
  FlightOffer,
  Hotel,
  Restaurant,
  RoomType,
} from "./types";

// Sample inventory and prices are deterministic; listed provider names are
// illustrative and do not imply availability or a business partnership.

export const AIRPORTS: Airport[] = [
  { code: "MNL", city: "Manila", name: "Ninoy Aquino International" },
  { code: "CEB", city: "Cebu City", name: "Mactan-Cebu International" },
  { code: "DVO", city: "Davao City", name: "Francisco Bangoy International" },
  { code: "CRK", city: "Angeles", name: "Clark International" },
  { code: "ILO", city: "Iloilo City", name: "Iloilo International" },
  { code: "PPS", city: "Puerto Princesa", name: "Puerto Princesa International" },
  { code: "TAG", city: "Panglao", name: "Bohol-Panglao International" },
  { code: "SIN", city: "Singapore", name: "Changi" },
  { code: "HKG", city: "Hong Kong", name: "Hong Kong International" },
  { code: "NRT", city: "Tokyo", name: "Narita International" },
  { code: "DXB", city: "Dubai", name: "Dubai International" },
  { code: "SYD", city: "Sydney", name: "Sydney Kingsford Smith" },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International" },
  { code: "JFK", city: "New York", name: "John F. Kennedy" },
  { code: "LIS", city: "Lisbon", name: "Humberto Delgado" },
  { code: "LHR", city: "London", name: "Heathrow" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle" },
  { code: "BCN", city: "Barcelona", name: "El Prat" },
  { code: "FCO", city: "Rome", name: "Fiumicino" },
  { code: "SFO", city: "San Francisco", name: "San Francisco Intl" },
  { code: "AMS", city: "Amsterdam", name: "Schiphol" },
  { code: "BER", city: "Berlin", name: "Brandenburg" },
  { code: "DUB", city: "Dublin", name: "Dublin" },
];

const PH_AIRPORT_CODES = new Set([
  "MNL",
  "CEB",
  "DVO",
  "CRK",
  "ILO",
  "PPS",
  "TAG",
]);

const DOMESTIC_AIRLINES: { name: string; code: string }[] = [
  { name: "Cebu Pacific", code: "5J" },
  { name: "Philippine Airlines", code: "PR" },
  { name: "AirAsia Philippines", code: "Z2" },
];

const INTERNATIONAL_AIRLINES: { name: string; code: string }[] = [
  { name: "Philippine Airlines", code: "PR" },
  { name: "Cebu Pacific", code: "5J" },
  { name: "Singapore Airlines", code: "SQ" },
  { name: "Cathay Pacific", code: "CX" },
  { name: "Qatar Airways", code: "QR" },
  { name: "Emirates", code: "EK" },
  { name: "ANA", code: "NH" },
  { name: "United Airlines", code: "UA" },
];

export function airportByCode(code: string): Airport | undefined {
  return AIRPORTS.find((a) => a.code === code.toUpperCase());
}

// Deterministic pseudo-random from a string seed.
function seeded(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function addMinutes(iso: string, min: number): string {
  return new Date(new Date(iso).getTime() + min * 60000).toISOString();
}

export function generateFlights(
  fromCode: string,
  toCode: string,
  dateISO: string,
  tripType: "one-way" | "round trip",
): FlightOffer[] {
  const from = airportByCode(fromCode);
  const to = airportByCode(toCode);
  if (!from || !to || from.code === to.code) return [];

  const domestic =
    PH_AIRPORT_CODES.has(from.code) && PH_AIRPORT_CODES.has(to.code);
  const airlines = domestic ? DOMESTIC_AIRLINES : INTERNATIONAL_AIRLINES;
  const rand = seeded(`${fromCode}-${toCode}-${dateISO}-${tripType}`);
  const baseDuration = 180 + Math.floor(rand() * 480); // 3h to 11h
  const offers: FlightOffer[] = [];

  for (let i = 0; i < 8; i++) {
    const airline =
      i === 0
        ? airlines[0]
        : i === 1 && !domestic
          ? INTERNATIONAL_AIRLINES[0]
          : airlines[Math.floor(rand() * airlines.length)];
    const stops = rand() < 0.5 ? 0 : rand() < 0.8 ? 1 : 2;
    const durationMin = baseDuration + stops * 90 + Math.floor(rand() * 120);
    const departHour = 6 + Math.floor(rand() * 15);
    const departMin = [0, 15, 30, 45][Math.floor(rand() * 4)];
    const date = new Date(dateISO);
    date.setHours(departHour, departMin, 0, 0);
    const departISO = date.toISOString();
    const arriveISO = addMinutes(departISO, durationMin);
    const basePrice = domestic
      ? 2400 + stops * 900 + Math.floor(rand() * 6200)
      : 14000 + stops * 5200 + Math.floor(rand() * 26000);
    const multiplier = tripType === "round trip" ? 1.9 : 1;

    offers.push({
      id: `fl-${fromCode}-${toCode}-${i}`,
      airline: airline.name,
      airlineCode: airline.code,
      from,
      to,
      departISO,
      arriveISO,
      durationMin,
      stops,
      price: Math.round((basePrice * multiplier) / 2) * 2,
      cabin: rand() < 0.75 ? "Economy" : rand() < 0.9 ? "Premium" : "Business",
      tripType,
    });
  }

  return offers.sort((a, b) => a.price - b.price);
}

// ---- Restaurants (keyed loosely by destination city) ----
const RESTAURANT_NAMES = [
  "Jollibee",
  "McDonald's",
  "Mang Inasal",
  "Chowking",
  "Max's Restaurant",
  "Bo's Coffee",
  "Gerry's Grill",
  "Shakey's",
  "Yellow Cab Pizza",
  "Army Navy",
  "Bonchon",
  "Cafe Laguna",
];

const RESTAURANT_CUISINES = [
  "Filipino fast food",
  "Fast food",
  "Filipino barbecue",
  "Chinese fast food",
  "Filipino",
  "Cafe",
  "Filipino grill",
  "Pizza",
  "Pizza",
  "Tex-Mex",
  "Korean",
  "Filipino",
];

function buildMenu(seed: string, cuisine: string) {
  const rand = seeded(seed + cuisine);
  const names = [
    `${cuisine} plate`,
    "Seasonal salad",
    "House special",
    "Grilled catch",
    "Chef's starter",
    "Garden bowl",
  ];
  const allTags: Restaurant["diet"] = [
    "vegetarian",
    "vegan",
    "gluten-free",
    "halal",
    "nut-free",
  ];
  return names.map((name, i) => ({
    id: `${seed}-m${i}`,
    name,
    description: "A kitchen favorite, plated fresh to order.",
    price: 250 + Math.floor(rand() * 900),
    tags: allTags.filter(() => rand() < 0.35),
  }));
}

export function generateRestaurants(city: string): Restaurant[] {
  const rand = seeded("rest-" + city.toLowerCase());
  const list: Restaurant[] = [];
  const modesPool: Restaurant["modes"][] = [
    ["reserve", "pickup", "delivery"],
    ["reserve", "pickup"],
    ["pickup", "delivery"],
    ["reserve"],
  ];
  const dietPool: Restaurant["diet"] = [
    "vegetarian",
    "vegan",
    "gluten-free",
    "halal",
    "nut-free",
  ];

  for (let i = 0; i < 12; i++) {
    const cuisine = RESTAURANT_CUISINES[i];
    const opensHour = 7 + Math.floor(rand() * 5);
    list.push({
      id: `rest-${city.toLowerCase()}-${i}`,
      name: RESTAURANT_NAMES[i % RESTAURANT_NAMES.length],
      cuisine,
      priceTier: ((Math.floor(rand() * 4) + 1) as 1 | 2 | 3 | 4),
      rating: Math.round((3.6 + rand() * 1.4) * 10) / 10,
      etaMin: 20 + Math.floor(rand() * 40),
      neighborhood: ["City center", "Business district", "Waterfront", "Uptown"][
        Math.floor(rand() * 4)
      ],
      opensHour,
      closesHour: 21 + Math.floor(rand() * 3),
      diet: dietPool.filter(() => rand() < 0.4),
      modes: modesPool[Math.floor(rand() * modesPool.length)],
      menu: buildMenu(`rest-${city}-${i}`, cuisine),
    });
  }
  return list;
}

// ---- Stays (hotels) ----
const HOTEL_NAMES = [
  "The Marlow",
  "Harbour House",
  "Aurora Suites",
  "Casa Ferro",
  "The Linden",
  "Seabright Hotel",
  "Grand Alameda",
  "Nook & Key",
  "The Pelican",
  "Rua Nova Rooms",
];

const AMENITIES = [
  "Free Wi-Fi",
  "Breakfast included",
  "Pool",
  "Gym",
  "Pet friendly",
  "Airport shuttle",
  "Rooftop bar",
  "Parking",
  "Spa",
  "24h front desk",
];

export function generateHotels(city: string): Hotel[] {
  const rand = seeded("hotel-" + city.toLowerCase());
  const neighborhoods = ["City center", "Business district", "Waterfront", "Uptown"];
  const list: Hotel[] = [];

  for (let i = 0; i < 10; i++) {
    const stars = (3 + Math.floor(rand() * 3)) as 3 | 4 | 5;
    const baseNightly = 1300 + stars * 700 + Math.floor(rand() * 3600);
    const rooms: Hotel["rooms"] = [
      { type: "Standard" as RoomType, nightly: baseNightly, sleeps: 2 },
      {
        type: "Deluxe" as RoomType,
        nightly: Math.round(baseNightly * 1.4),
        sleeps: 3,
      },
      {
        type: "Suite" as RoomType,
        nightly: Math.round(baseNightly * 2.1),
        sleeps: 4,
      },
    ];
    list.push({
      id: `hotel-${city.toLowerCase()}-${i}`,
      name: HOTEL_NAMES[i % HOTEL_NAMES.length],
      city,
      neighborhood: neighborhoods[Math.floor(rand() * neighborhoods.length)],
      rating: Math.round((3.6 + rand() * 1.4) * 10) / 10,
      stars,
      nightlyFrom: baseNightly,
      amenities: AMENITIES.filter(() => rand() < 0.45).slice(0, 5),
      rooms,
    });
  }
  return list.sort((a, b) => a.nightlyFrom - b.nightlyFrom);
}

// ---- Catering ----
const CATERERS = [
  "Table & Co",
  "Open Fire Catering",
  "Greenleaf Events",
  "The Spread",
  "Harvest Hands",
];
const LOCAL_CATERERS: Record<string, string[]> = {
  "cebu city": ["Cebu Table Co", "Mactan Feast Studio", "Island Gathering Kitchen"],
  manila: ["Metro Feast Studio", "Manila Table Co", "Capital Gathering Kitchen"],
  "davao city": ["Davao Table Co", "Durian City Catering", "Southern Feast Studio"],
  angeles: ["Clark Table Co", "Pampanga Feast Studio", "North Luzon Gathering Kitchen"],
  "iloilo city": ["Iloilo Table Co", "Western Visayas Feast Studio", "Heritage Gathering Kitchen"],
  "puerto princesa": ["Palawan Table Co", "Island Feast Studio", "Puerto Gathering Kitchen"],
  panglao: ["Bohol Table Co", "Panglao Feast Studio", "Island Gathering Kitchen"],
};
const STYLES = ["Buffet", "Plated", "Boxed", "Family style", "Grazing table"];

export function generateCateringOptions(): CateringOption[] {
  return generateCateringOptionsForCity("Philippines");
}

export function generateCateringOptionsForCity(city: string): CateringOption[] {
  const rand = seeded(`catering-v1-${city.toLowerCase()}`);
  const localCaterers = LOCAL_CATERERS[city.toLowerCase()] ?? CATERERS;
  const dietPool: CateringOption["diet"] = [
    "vegetarian",
    "vegan",
    "gluten-free",
    "halal",
    "nut-free",
  ];
  return localCaterers.map((caterer, i) => ({
    id: `cat-${i}`,
    caterer,
    style: STYLES[i % STYLES.length],
    perPerson: 650 + Math.floor(rand() * 1900),
    minGuests: [2, 10, 20][Math.floor(rand() * 3)],
    leadDays: 1 + Math.floor(rand() * 5),
    diet: dietPool.filter(() => rand() < 0.5),
  }));
}
