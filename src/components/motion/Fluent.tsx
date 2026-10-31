import { clsx } from "clsx";
import type { ElementType, ReactNode } from "react";
import { usePointerLight } from "./usePointerLight";

type Effect = "spotlight" | "reveal-border" | "glow" | "none";

interface SurfaceProps {
  children: ReactNode;
  className?: string;
  /** Lighting effect(s). Combine with surface material classes freely. */
  effect?: Effect | Effect[];
  /** Material background. */
  material?: "acrylic" | "mica" | "surface" | "none";
  /** Rounded geometry preset. */
  radius?: "md" | "lg" | "none";
  /** Base depth shadow. */
  depth?: 2 | 3 | 4 | 0;
  /** Add the hover lift micro-interaction. */
  lift?: boolean;
  as?: ElementType;
}

// One surface that composes the Fluent effects: acrylic/mica material,
// rounded geometry, drop shadow, plus cursor-driven spotlight / reveal border
// / glow. Pointer tracking only attaches when a cursor effect is requested.
export function Surface({
  children,
  className,
  effect = "none",
  material = "surface",
  radius = "lg",
  depth = 2,
  lift = false,
  as,
}: SurfaceProps) {
  const effects = Array.isArray(effect) ? effect : [effect];
  const usesPointer =
    effects.includes("spotlight") || effects.includes("reveal-border");
  const { ref, onPointerMove } = usePointerLight<HTMLDivElement>();
  const Tag = (as ?? "div") as ElementType;

  return (
    <Tag
      ref={usesPointer ? ref : undefined}
      onPointerMove={usesPointer ? onPointerMove : undefined}
      className={clsx(
        material === "acrylic" && "acrylic",
        material === "mica" && "mica",
        material === "surface" &&
          "bg-[var(--color-surface)] border border-[var(--color-line)]",
        radius === "lg" && "geo",
        radius === "md" && "geo-md",
        depth === 2 && "depth-2",
        depth === 3 && "depth-3",
        depth === 4 && "depth-4",
        effects.includes("spotlight") && "spotlight",
        effects.includes("reveal-border") && "reveal-border",
        effects.includes("glow") && "glow",
        lift && "lift",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
