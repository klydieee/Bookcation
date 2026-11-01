import type {
  NearbyCategory,
  NearbyPlace,
  NearbySearchResult,
} from "../src/lib/nearby-types";

export type { NearbyCategory, NearbyPlace, NearbySearchResult };

const GEOAPIFY_CATEGORIES: Record<NearbyCategory, string[]> = {
  flights: ["airport"],
  hotels: [
    "accommodation.hotel",
    "accommodation.hostel",
    "accommodation.motel",
    "accommodation.guest_house",
  ],
  restaurants: [
    "catering.restaurant",
    "catering.fast_food",
    "catering.cafe",
    "catering.food_court",
  ],
  catering: ["commercial.food_and_drink"],
  venues: ["entertainment"],
  rides: ["service.taxi", "rental.car"],
};

const SEARCH_RADIUS_METERS = 5000;
const AIRPORT_SEARCH_RADIUS_METERS = 50000;
const MAX_RESULTS = 30;
const ATTRIBUTION = "© OpenStreetMap contributors";

interface GeoapifyLocation {
  lat: number;
  lon: number;
  formatted: string;
}

interface GeoapifyPlaceProperties {
  place_id: string;
  name?: string;
  address_line1?: string;
  address_line2?: string;
  formatted?: string;
  lat: number;
  lon: number;
  categories?: string[];
  website?: string;
  phone?: string;
  contact?: { phone?: string };
}

interface GeoapifyPlacesResponse {
  features?: Array<{ properties?: GeoapifyPlaceProperties }>;
}

async function fetchJson<T>(url: URL, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("Geoapify rejected the API key. Check its configuration.");
      }
      if (response.status === 429) {
        throw new Error("Geoapify's free daily request limit was reached.");
      }
      throw new Error(`Geoapify returned ${response.status}.`);
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Geoapify did not respond in time. Please try again.");
    }
    if (error instanceof TypeError) {
      throw new Error("Geoapify could not be reached. Check the server connection.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function resolveLocation(
  query: string,
  apiKey: string,
): Promise<{ latitude: number; longitude: number; label: string }> {
  const url = new URL("https://api.geoapify.com/v1/geocode/search");
  url.searchParams.set("text", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("apiKey", apiKey);
  const response = await fetchJson<{ results?: GeoapifyLocation[] }>(url);
  const match = response.results?.[0];
  if (!match) {
    throw new Error("No matching location found. Try a nearby city or area.");
  }
  return {
    latitude: match.lat,
    longitude: match.lon,
    label: match.formatted,
  };
}

function isCoordinate(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

function distanceMeters(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
): number {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = radians(to.latitude - from.latitude);
  const longitudeDelta = radians(to.longitude - from.longitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(from.latitude)) *
      Math.cos(radians(to.latitude)) *
      Math.sin(longitudeDelta / 2) ** 2;
  return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function toNearbyPlace(
  properties: GeoapifyPlaceProperties,
  center: { latitude: number; longitude: number },
  category: NearbyCategory,
): NearbyPlace | null {
  const name = properties.name ?? properties.address_line1;
  if (!name || !properties.place_id) return null;
  const categoryValue = (properties.categories ?? []).find((value) =>
    GEOAPIFY_CATEGORIES[category].some(
      (prefix) => value === prefix || value.startsWith(`${prefix}.`),
    ),
  );
  const categoryLabel = categoryValue?.split(".").pop()?.replaceAll("_", " ");

  return {
    id: properties.place_id,
    name,
    category: categoryLabel ?? category,
    latitude: properties.lat,
    longitude: properties.lon,
    address:
      properties.address_line2 ??
      properties.formatted ??
      "",
    distanceMeters: distanceMeters(center, {
      latitude: properties.lat,
      longitude: properties.lon,
    }),
    ...(properties.website ? { website: properties.website } : {}),
    ...(properties.phone ?? properties.contact?.phone
      ? { phone: properties.phone ?? properties.contact?.phone }
      : {}),
  };
}

export async function searchNearby(
  input: {
    category: NearbyCategory;
    latitude?: number;
    longitude?: number;
    query?: string;
  },
  apiKey: string,
): Promise<NearbySearchResult> {
  if (!apiKey) {
    throw new Error(
      "Nearby search is not configured. Add GEOAPIFY_API_KEY to your local environment and Vercel project settings.",
    );
  }

  let center: { latitude: number; longitude: number; label: string };
  if (input.latitude !== undefined && input.longitude !== undefined) {
    if (
      !isCoordinate(input.latitude, -90, 90) ||
      !isCoordinate(input.longitude, -180, 180)
    ) {
      throw new Error("The supplied coordinates are invalid.");
    }
    center = {
      latitude: input.latitude,
      longitude: input.longitude,
      label: `${input.latitude.toFixed(3)}, ${input.longitude.toFixed(3)}`,
    };
  } else if (input.query) {
    center = await resolveLocation(input.query, apiKey);
  } else {
    throw new Error("Provide coordinates or a city/area to search.");
  }

  const url = new URL("https://api.geoapify.com/v2/places");
  url.searchParams.set("categories", GEOAPIFY_CATEGORIES[input.category].join(","));
  if (input.category === "catering") {
    url.searchParams.set("name", "catering");
  }
  const searchRadius =
    input.category === "flights"
      ? AIRPORT_SEARCH_RADIUS_METERS
      : SEARCH_RADIUS_METERS;
  url.searchParams.set(
    "filter",
    `circle:${center.longitude},${center.latitude},${searchRadius}`,
  );
  url.searchParams.set("bias", `proximity:${center.longitude},${center.latitude}`);
  url.searchParams.set("limit", String(MAX_RESULTS));
  const response = await fetchJson<GeoapifyPlacesResponse>(url, {
    headers: { "x-api-key": apiKey },
  });
  const places = (response.features ?? [])
    .map((feature) =>
      feature.properties
        ? toNearbyPlace(feature.properties, center, input.category)
        : null,
    )
    .filter((place): place is NearbyPlace => place !== null)
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, MAX_RESULTS);

  return {
    center,
    places,
    attribution: ATTRIBUTION,
  };
}

export async function handleNearbyRequest(
  request: Request,
  apiKey: string,
): Promise<Response> {
  if (request.method !== "GET") {
    return Response.json(
      { error: "Only GET requests are supported." },
      { status: 405, headers: { Allow: "GET" } },
    );
  }

  const params = new URL(request.url).searchParams;
  const supportedCategories: NearbyCategory[] = [
    "flights",
    "hotels",
    "restaurants",
    "catering",
    "venues",
    "rides",
  ];
  const category = params.get("category") as NearbyCategory | null;
  if (!category || !supportedCategories.includes(category)) {
    return Response.json(
      { error: "Choose a supported nearby category." },
      { status: 400 },
    );
  }

  const latitudeText = params.get("lat");
  const longitudeText = params.get("lon");
  const query = params.get("q")?.trim();
  if (query && query.length > 120) {
    return Response.json(
      { error: "Location searches must be 120 characters or fewer." },
      { status: 400 },
    );
  }
  if ((latitudeText === null) !== (longitudeText === null)) {
    return Response.json(
      { error: "Both latitude and longitude are required." },
      { status: 400 },
    );
  }

  try {
    const result = await searchNearby(
      {
        category,
        latitude: latitudeText === null ? undefined : Number(latitudeText),
        longitude: longitudeText === null ? undefined : Number(longitudeText),
        query: query || undefined,
      },
      apiKey,
    );
    return Response.json(result, {
      headers: { "Cache-Control": "private, max-age=30" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nearby search failed.";
    const status =
      message.startsWith("Provide ") || message.startsWith("The supplied ")
        ? 400
        : message.startsWith("Nearby search is not configured")
          ? 503
          : 502;
    return Response.json({ error: message }, { status });
  }
}
