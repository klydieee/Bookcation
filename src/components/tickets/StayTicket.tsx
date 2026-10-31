import { Bed, Star } from "@phosphor-icons/react";
import type { Hotel, RoomType } from "@/lib/types";
import { Ticket } from "@/components/ui/Ticket";
import { ModuleBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import { money } from "@/lib/format";
import { usePrefs } from "@/store/prefsStore";
import { CountUp } from "@/components/motion/CountUp";

export function StayTicket({
  hotel,
  nights,
  roomType,
  onRoomChange,
  onAdd,
}: {
  hotel: Hotel;
  nights: number;
  roomType: RoomType;
  onRoomChange: (t: RoomType) => void;
  onAdd?: () => void;
}) {
  const currency = usePrefs((s) => s.currency);
  const room = hotel.rooms.find((r) => r.type === roomType) ?? hotel.rooms[0];
  const total = room.nightly * nights;

  return (
    <Ticket
      module="stay"
      body={
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <ModuleBadge module="stay">
              <Bed size={14} weight="bold" />
              {hotel.name}
            </ModuleBadge>
            <span className="flex items-center gap-1 text-[0.875rem] text-[var(--color-ink-muted)]">
              <Star size={14} weight="fill" className="text-[var(--color-catering)]" />
              <span className="tnum">{hotel.rating.toFixed(1)}</span>
            </span>
          </div>
          <div className="text-[0.875rem] text-[var(--color-ink-muted)]">
            {hotel.stars}-star · {hotel.neighborhood}, {hotel.city}
          </div>
          <div className="flex flex-wrap gap-1 text-[0.75rem]">
            {hotel.amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="rounded-[var(--radius-pill)] bg-[var(--color-sunken)] px-2 py-0.5"
              >
                {a}
              </span>
            ))}
          </div>
          <label className="sr-only" htmlFor={`room-${hotel.id}`}>
            Room type for {hotel.name}
          </label>
          <Select
            id={`room-${hotel.id}`}
            className="mt-1 h-9 w-auto"
            value={roomType}
            onChange={(e) => onRoomChange(e.target.value as RoomType)}
          >
            {hotel.rooms.map((r) => (
              <option key={r.type} value={r.type}>
                {r.type} · {money(r.nightly, currency)}/night · sleeps {r.sleeps}
              </option>
            ))}
          </Select>
        </div>
      }
      stub={
        <>
          <div>
            <CountUp
              className="num-lg tnum block"
              value={total}
              format={(n) => money(n, currency)}
            />
            <div className="text-[0.75rem] text-[var(--color-ink-muted)]">
              {nights} night{nights > 1 ? "s" : ""}
            </div>
          </div>
          {onAdd && (
            <Button size="sm" onClick={onAdd}>
              Add to plan
            </Button>
          )}
        </>
      }
    />
  );
}
