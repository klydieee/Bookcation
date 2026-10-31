import type {
  Airport,
  CateringOption,
  FlightOffer,
  Hotel,
  Restaurant,
  RoomType,
} from "./types";

// All airline, restaurant, and caterer names are fictional (01 §12.8).

export const AIRPORTS: Airport[] = [
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

const AIRLINES: { name: string; code: string }[] = [
  { name: "Skyloom Air", code: "SK" },
  { name: "Northwind", code: "NW" },
  { name: "Azure Lines", code: "AZ" },
  { name: "Meridian", code: "MD" },
  { name: "Harbor Jet", code: "HJ" },
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

  const rand = seeded(`${fromCode}-${toCode}-${dateISO}-${tripType}`);
  const baseDuration = 180 + Math.floor(rand() * 480); // 3h to 11h
  const offers: FlightOffer[] = [];

  for (let i = 0; i < 8; i++) {
    const airline = AIRLINES[Math.floor(rand() * AIRLINES.length)];
    const stops = rand() < 0.5 ? 0 : rand() < 0.8 ? 1 : 2;
    const durationMin = baseDuration + stops * 90 + Math.floor(rand() * 120);
    const departHour = 6 + Math.floor(rand() * 15);
    const departMin = [0, 15, 30, 45][Math.floor(rand() * 4)];
    const date = new Date(dateISO);
    date.setHours(departHour, departMin, 0, 0);
    const departISO = date.toISOString();
    const arriveISO = addMinutes(departISO, durationMin);
    const basePrice = 180 + stops * -30 + Math.floor(rand() * 520);
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
const CUISINES = [
  "Portuguese",
  "Seafood",
  "Italian",
  "Japanese",
  "Mexican",
  "Vegan",
  "Steakhouse",
  "Thai",
  "French bistro",
  "Bakery",
];

const RESTAURANT_NAMES = [
  "Casa do Mar",
  "The Blue Kettle",
  "Olive & Ash",
  "Hanami",
  "El Rincón",
  "Verdant",
  "Ironwood Grill",
  "Lemongrass",
  "Petite Rue",
  "Dawn Bakehouse",
  "Saltwater Table",
  "Nonna's Kitchen",
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
    price: 9 + Math.floor(rand() * 26),
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
    const cuisine = CUISINES[Math.floor(rand() * CUISINES.length)];
    const opensHour = 7 + Math.floor(rand() * 5);
    list.push({
      id: `rest-${city.toLowerCase()}-${i}`,
      name: RESTAURANT_NAMES[i % RESTAURANT_NAMES.length],
      cuisine,
      priceTier: ((Math.floor(rand() * 4) + 1) as 1 | 2 | 3 | 4),
      rating: Math.round((3.6 + rand() * 1.4) * 10) / 10,
      etaMin: 20 + Math.floor(rand() * 40),
      neighborhood: ["Old Town", "Riverside", "Market District", "Hillside"][
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
  const neighborhoods = ["Old Town", "Riverside", "Market District", "Hillside"];
  const list: Hotel[] = [];

  for (let i = 0; i < 10; i++) {
    const stars = (3 + Math.floor(rand() * 3)) as 3 | 4 | 5;
    const baseNightly = 70 + stars * 30 + Math.floor(rand() * 120);
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
const STYLES = ["Buffet", "Plated", "Boxed", "Family style", "Grazing table"];

export function generateCateringOptions(): CateringOption[] {
  const rand = seeded("catering-v1");
  const dietPool: CateringOption["diet"] = [
    "vegetarian",
    "vegan",
    "gluten-free",
    "halal",
    "nut-free",
  ];
  return CATERERS.map((caterer, i) => ({
    id: `cat-${i}`,
    caterer,
    style: STYLES[i % STYLES.length],
    perPerson: 18 + Math.floor(rand() * 42),
    minGuests: [2, 10, 20][Math.floor(rand() * 3)],
    leadDays: 1 + Math.floor(rand() * 5),
    diet: dietPool.filter(() => rand() < 0.5),
  }));
}
