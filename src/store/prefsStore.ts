import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency } from "@/lib/types";

export type ThemePref = "system" | "light" | "dark";

interface PrefsState {
  theme: ThemePref;
  currency: Currency;
  reduceMotion: "system" | "on" | "off";
  setTheme: (t: ThemePref) => void;
  setCurrency: (c: Currency) => void;
  setReduceMotion: (r: "system" | "on" | "off") => void;
}

export const usePrefs = create<PrefsState>()(
  persist(
    (set) => ({
      theme: "system",
      currency: "PHP",
      reduceMotion: "system",
      setTheme: (theme) => set({ theme }),
      setCurrency: (currency) => set({ currency }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
    }),
    { name: "bookcation.prefs" },
  ),
);

export function resolveDark(theme: ThemePref): boolean {
  return (
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

let themeAnimTimer: ReturnType<typeof setTimeout> | null = null;

export function applyTheme(theme: ThemePref) {
  const dark = resolveDark(theme);
  const root = document.documentElement;

  // Briefly enable color-only transitions for a smooth cross-theme fade.
  root.classList.add("theme-anim");
  if (themeAnimTimer) clearTimeout(themeAnimTimer);
  themeAnimTimer = setTimeout(() => root.classList.remove("theme-anim"), 220);

  root.classList.toggle("dark", dark);
  // keep the pre-paint script's key in sync
  try {
    localStorage.setItem("bookcation.theme", theme);
  } catch {
    /* ignore */
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#0D1330" : "#F4F6FB");
}
