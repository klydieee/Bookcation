export type NearbyCategory =
  | "flights"
  | "hotels"
  | "restaurants"
  | "catering"
  | "venues"
  | "rides";

export interface NearbyPlace {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  distanceMeters: number;
  imageUrl?: string;
  imageCreditUrl?: string;
  description?: string;
  openingHours?: string;
  website?: string;
  phone?: string;
}

export interface NearbySearchResult {
  center: { latitude: number; longitude: number; label: string };
  places: NearbyPlace[];
  attribution: string;
  warning?: string;
}
