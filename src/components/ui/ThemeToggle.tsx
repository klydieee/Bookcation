import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { applyTheme, resolveDark, usePrefs } from "@/store/prefsStore";

// Reactive theme toggle. Dark state is derived from the store (and the OS
// preference when theme is "system"), so the icon/label always re-render on
// change. The icon crossfades/rotates between sun and moon.
export function ThemeToggle({ className }: { className?: string }) {
  const theme = usePrefs((s) => s.theme);
  const setTheme = usePrefs((s) => s.setTheme);
  const [isDark, setIsDark] = useState(() => resolveDark(theme));

  // Recompute when the stored theme changes, or when the OS preference
  // changes while we're following the system.
  useEffect(() => {
    setIsDark(resolveDark(theme));
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (usePrefs.getState().theme === "system") setIsDark(mq.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  function toggle() {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    setIsDark(next === "dark");
  }

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      title="Toggle theme"
      onClick={toggle}
      className={
        "press relative grid h-10 w-10 place-items-center overflow-hidden rounded-[var(--radius-sm)] text-[var(--color-ink)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--color-sunken)] " +
        (className ?? "")
      }
    >
      <Sun
        size={20}
        weight="bold"
        className={
          "col-start-1 row-start-1 transition-all duration-[var(--dur-base)] ease-[var(--ease-out-quint)] " +
          (isDark
            ? "scale-50 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100")
        }
      />
      <Moon
        size={20}
        weight="bold"
        className={
          "col-start-1 row-start-1 transition-all duration-[var(--dur-base)] ease-[var(--ease-out-quint)] " +
          (isDark
            ? "scale-100 rotate-0 opacity-100"
            : "scale-50 -rotate-90 opacity-0")
        }
      />
    </button>
  );
}
