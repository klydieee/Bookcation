import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

export const TRIP_LAUNCH_EVENT = "bookcation:trip-launch";

export function TripLaunchTransition() {
  const reduceMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    function showTransition() {
      if (reduceMotion) return;
      setVisible(true);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        setVisible(false);
        timer.current = null;
      }, 2400);
    }

    window.addEventListener(TRIP_LAUNCH_EVENT, showTransition);
    return () => {
      window.removeEventListener(TRIP_LAUNCH_EVENT, showTransition);
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [reduceMotion]);

  if (!visible || reduceMotion) return null;

  return (
    <div className="trip-launch-transition" aria-hidden="true">
      <div className="trip-launch-wash" />
      <div className="trip-launch-copy">
        <div className="trip-launch-caption">Your trip starts here</div>
        <div className="trip-launch-subcaption">
          Flights, stays, meals, and rides—planned in one place.
        </div>
      </div>
    </div>
  );
}
