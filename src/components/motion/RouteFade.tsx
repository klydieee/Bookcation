import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";

// Re-mounts its subtree on path change so the enter animation replays.
// Purely presentational; the key swap is what drives the CSS animation.
export function RouteFade({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="enter-up">
      {children}
    </div>
  );
}
