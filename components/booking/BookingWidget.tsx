"use client"; // form state + router

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { locations } from "@/lib/content";
import { cn } from "@/lib/utils";

export function BookingWidget({ className }: { className?: string }) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0] ?? "";
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0] ?? "";

  const [pickup,   setPickup]   = useState(today);
  const [returnD,  setReturn]   = useState(tomorrow);
  const [location, setLocation] = useState(locations[0]?.id ?? "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ from: pickup, to: returnD, location });
    router.push(`/rent-a-car-cyprus?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "w-full rounded-[var(--radius-xl)] overflow-hidden",
        "bg-[var(--color-surface)] border border-[var(--color-border)]",
        "shadow-[var(--shadow-elevated)]",
        className
      )}
      aria-label="Book a car"
    >
      {/* Fields row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)]">
        {/* Location */}
        <label className="flex flex-col gap-1 px-5 py-4 cursor-pointer group relative">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
            <MapPin size={11} />
            Pickup location
          </span>
          <div className="relative">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full appearance-none bg-transparent text-[var(--color-fg)] text-base font-medium cursor-pointer focus:outline-none pr-5"
              aria-label="Pickup location"
            >
              {locations.map((l) => (
                <option key={l.id} value={l.id} className="bg-[var(--color-surface)] text-[var(--color-fg)]">
                  {l.label}
                  {l.free ? " — Free" : ""}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[var(--color-fg-dim)] pointer-events-none"
            />
          </div>
        </label>

        {/* Pickup date */}
        <label className="flex flex-col gap-1 px-5 py-4 cursor-pointer">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
            <CalendarDays size={11} />
            Pick-up date
          </span>
          <input
            type="date"
            value={pickup}
            min={today}
            onChange={(e) => {
              setPickup(e.target.value);
              if (e.target.value >= returnD) {
                const d = new Date(e.target.value);
                d.setDate(d.getDate() + 1);
                setReturn(d.toISOString().split("T")[0] ?? "");
              }
            }}
            className="bg-transparent text-[var(--color-fg)] text-base font-medium focus:outline-none cursor-pointer"
            aria-label="Pick-up date"
            required
          />
        </label>

        {/* Return date */}
        <label className="flex flex-col gap-1 px-5 py-4 cursor-pointer">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-fg-muted)]">
            <CalendarDays size={11} />
            Return date
          </span>
          <input
            type="date"
            value={returnD}
            min={pickup}
            onChange={(e) => setReturn(e.target.value)}
            className="bg-transparent text-[var(--color-fg)] text-base font-medium focus:outline-none cursor-pointer"
            aria-label="Return date"
            required
          />
        </label>
      </div>

      {/* CTA button */}
      <div className="px-5 py-4 border-t border-[var(--color-border)]">
        <Button type="submit" variant="primary" size="full" className="text-base font-semibold">
          Search available cars →
        </Button>
      </div>
    </form>
  );
}
