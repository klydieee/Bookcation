import { AirplaneTilt } from "@phosphor-icons/react";

export function TripRouteAnimation() {
  return (
    <div className="trip-flight-animation mb-4" aria-hidden="true">
      <span className="trip-route-dot trip-route-dot-start" />
      <span className="trip-route-line" />
      <AirplaneTilt className="trip-route-plane" size={25} weight="fill" />
      <span className="trip-route-dot trip-route-dot-end" />
    </div>
  );
}
