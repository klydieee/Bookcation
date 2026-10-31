import { useEffect, useState } from "react";
import { usePrefs } from "@/store/prefsStore";

// True when motion should be suppressed: either the OS asks for it, or the
// user chose "On" in Settings. "Off" forces motion on regardless of OS.
export function usePrefersReducedMotion(): boolean {
  const pref = usePrefs((s) => s.reduceMotion);
  const [osReduce, setOsReduce] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setOsReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (pref === "on") return true;
  if (pref === "off") return false;
  return osReduce;
}

// Keep an html class in sync so pure-CSS effects can also be gated.
export function applyReduceMotionClass(pref: "system" | "on" | "off") {
  const osReduce = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const reduce = pref === "on" || (pref === "system" && osReduce);
  document.documentElement.classList.toggle("reduce-motion", reduce);
}
