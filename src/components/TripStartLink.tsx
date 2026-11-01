import type { MouseEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { TRIP_LAUNCH_EVENT } from "./motion/TripLaunchTransition";

export function TripStartLink({ children }: { children: ReactNode }) {
  function startTransition(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    window.dispatchEvent(new Event(TRIP_LAUNCH_EVENT));
  }

  return (
    <Link to="/app/trips?start=1" onClick={startTransition}>
      {children}
    </Link>
  );
}
