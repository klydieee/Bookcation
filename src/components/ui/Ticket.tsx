import { clsx } from "clsx";
import type { ModuleId } from "@/lib/types";
import type { ReactNode } from "react";

/**
 * The Ticket (03_DESIGN_SYSTEM §8): every priced, bookable object shares this
 * anatomy — rail, body, perforation, stub. Notches are real transparency so
 * they work in dark mode and over photos. Border + shadow live on the outer
 * wrapper because the mask clips anything on the masked element.
 */

const railColor: Record<ModuleId, string> = {
  flight: "var(--color-flight)",
  food: "var(--color-food)",
  catering: "var(--color-catering)",
  stay: "var(--color-stay)",
  trip: "var(--color-trip)",
};

interface TicketProps {
  module: ModuleId;
  body: ReactNode;
  stub: ReactNode;
  selected?: boolean;
  className?: string;
}

export function Ticket({
  module,
  body,
  stub,
  selected,
  className,
}: TicketProps) {
  // Radial-gradient mask punches half-circle notches between body and stub.
  const notch = 10; // --notch
  const maskPos = "70%"; // perforation sits ~70% across on wide layouts
  const mask = `radial-gradient(circle ${notch}px at ${maskPos} 0, transparent ${notch}px, #000 ${
    notch + 1
  }px), radial-gradient(circle ${notch}px at ${maskPos} 100%, transparent ${notch}px, #000 ${
    notch + 1
  }px)`;

  return (
    <div
      className={clsx(
        "lift relative rounded-[var(--radius-md)]",
        selected
          ? "ring-2 ring-[var(--color-primary)]"
          : "ring-1 ring-[var(--color-line)]",
        className,
      )}
      style={{
        filter: "drop-shadow(0 6px 16px rgb(15 26 54 / 0.12))",
      }}
    >
      <article
        className="relative overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface)]"
        style={{
          WebkitMaskImage: mask,
          maskImage: mask,
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
        }}
      >
        <div className="flex flex-col @[520px]:flex-row">
          {/* rail */}
          <div
            aria-hidden
            className="h-1 w-full @[520px]:h-auto @[520px]:w-1 shrink-0"
            style={{ background: railColor[module] }}
          />
          {/* body */}
          <div className="flex-1 p-4">{body}</div>
          {/* perforation */}
          <div
            aria-hidden
            className="mx-4 border-t-[1.5px] border-dashed border-[var(--color-line-strong)] @[520px]:mx-0 @[520px]:border-t-0 @[520px]:border-l-[1.5px]"
          />
          {/* stub */}
          <div className="flex items-center justify-between gap-3 p-4 @[520px]:w-44 @[520px]:flex-col @[520px]:items-stretch @[520px]:justify-center">
            {stub}
          </div>
        </div>
      </article>
    </div>
  );
}
