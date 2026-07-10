"use client"; // dropdown open state, keyboard nav, router navigation

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, ChevronDown, Check } from "lucide-react";
import { locations } from "@/lib/content";
import type { Location } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Pickup-location picker (OCD-style city-picker analogue). We serve one market
 * (Cyprus) with 5 real delivery points from brand.json — picking one browses the
 * fleet with that pickup pre-noted (?location=<id>, same param BookingWidget uses).
 */
export function LocationPicker() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [selectedId, setSelectedId] = useState(locations[0]?.id ?? "");
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = locations.find((l) => l.id === selectedId) ?? locations[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const choose = (loc: Location) => {
    setSelectedId(loc.id);
    setOpen(false);
    setActive(-1);
    router.push(`/rent-a-car-cyprus?location=${encodeURIComponent(loc.id)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActive((i) => Math.min(locations.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      if (open && active >= 0 && locations[active]) {
        e.preventDefault();
        choose(locations[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] pl-3 pr-2.5 text-xs font-medium text-[var(--color-fg)] transition-colors duration-[var(--dur-fast)] ease-[var(--ease-premium)] hover:border-[var(--color-accent)]"
      >
        <MapPin size={14} className="shrink-0 text-[var(--color-accent)]" />
        <span className="max-w-[52vw] truncate sm:max-w-none">
          <span className="text-[var(--color-fg-muted)]">Pickup:</span> {selected?.label}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "shrink-0 text-[var(--color-fg-muted)] transition-transform duration-[var(--dur-fast)]",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Pickup location"
          className="absolute left-0 top-[calc(100%+8px)] z-30 w-[max(100%,260px)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2 shadow-[var(--shadow-elevated)]"
        >
          {locations.map((loc, i) => {
            const isSel = loc.id === selectedId;
            const isActive = i === active;
            return (
              <li key={loc.id} role="option" aria-selected={isSel}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(loc)}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-4 py-2 text-left transition-colors duration-[var(--dur-fast)]",
                    isActive ? "bg-[var(--color-surface-2)]" : "bg-transparent"
                  )}
                >
                  <MapPin size={14} className="shrink-0 text-[var(--color-fg-muted)]" />
                  <span className="min-w-0 flex-1 truncate text-sm text-[var(--color-fg)]">
                    {loc.label}
                  </span>
                  {loc.free && (
                    <span className="shrink-0 rounded-full bg-[var(--color-accent-soft)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-[var(--color-accent)]">
                      Free
                    </span>
                  )}
                  {isSel && <Check size={14} className="shrink-0 text-[var(--color-accent)]" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
