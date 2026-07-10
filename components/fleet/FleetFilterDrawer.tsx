"use client"; // slide-in sheet with local draft interactions

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { EXTERIOR_COLORS } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Car } from "@/lib/types";

export interface AdvancedFilters {
  fuels: string[];
  transmissions: string[];
  seats: number[];
  colors: string[];
  mileageMax: number | null;
  priceMin: number;
  priceMax: number;
  yearMin: number;
  yearMax: number;
}

export interface FleetBounds {
  priceMin: number;
  priceMax: number;
  yearMin: number;
  yearMax: number;
}

const FUELS = ["Petrol", "Diesel", "Electric", "Hybrid"] as const;
const MILEAGE_STEPS = [10000, 30000, 60000, 90000, 120000, 150000] as const;
const SEAT_OPTIONS = [2, 4, 5, 7] as const;

const kLabel = (n: number) => `${Math.round(n / 1000)}k`;

interface Props {
  open: boolean;
  onClose: () => void;
  allCars: Car[];
  bounds: FleetBounds;
  value: AdvancedFilters;
  onChange: (patch: Partial<AdvancedFilters>) => void;
  onReset: () => void;
  resultCount: number;
}

export function FleetFilterDrawer({
  open,
  onClose,
  allCars,
  bounds,
  value,
  onChange,
  onReset,
  resultCount,
}: Props) {
  // ESC to close + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const count = (pred: (c: Car) => boolean) => allCars.filter(pred).length;

  const toggleIn = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Filters">
          <motion.div
            className="absolute inset-0 bg-[var(--color-overlay)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-[92vw] max-w-[420px] flex-col bg-white shadow-[var(--shadow-elevated)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
              <h2 className="text-base font-semibold text-[var(--color-fg)]">Filters</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-surface-2)]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {/* Fuel */}
              <Section title="Fuel Type">
                <div className="flex flex-wrap gap-2">
                  {FUELS.map((f) => (
                    <Chip
                      key={f}
                      active={value.fuels.includes(f)}
                      onClick={() => onChange({ fuels: toggleIn(value.fuels, f) })}
                    >
                      {f}{" "}
                      <span className="opacity-60">{count((c) => c.fuel === f)}</span>
                    </Chip>
                  ))}
                </div>
              </Section>

              {/* Mileage */}
              <Section title="Mileage">
                <div className="flex flex-wrap gap-2">
                  {MILEAGE_STEPS.map((m) => (
                    <Chip
                      key={m}
                      active={value.mileageMax === m}
                      onClick={() => onChange({ mileageMax: value.mileageMax === m ? null : m })}
                    >
                      Upto {kLabel(m)}
                    </Chip>
                  ))}
                </div>
              </Section>

              {/* Transmission */}
              <Section title="Transmission">
                <div className="flex flex-wrap gap-2">
                  {(["Automatic", "Manual"] as const).map((t) => (
                    <Chip
                      key={t}
                      active={value.transmissions.includes(t)}
                      onClick={() => onChange({ transmissions: toggleIn(value.transmissions, t) })}
                    >
                      {t === "Automatic" ? "Auto" : "Manual"}{" "}
                      <span className="opacity-60">{count((c) => c.transmission === t)}</span>
                    </Chip>
                  ))}
                </div>
              </Section>

              {/* Doors & Seats */}
              <Section title="Doors & Seats">
                <div className="flex flex-wrap gap-2">
                  {SEAT_OPTIONS.map((s) => (
                    <Chip
                      key={s}
                      active={value.seats.includes(s)}
                      onClick={() => onChange({ seats: toggleIn(value.seats, s) })}
                    >
                      {s} Seats <span className="opacity-60">{count((c) => c.seats === s)}</span>
                    </Chip>
                  ))}
                </div>
              </Section>

              {/* Exterior Color */}
              <Section title="Exterior Color">
                <div className="flex flex-wrap gap-3">
                  {EXTERIOR_COLORS.map((col) => {
                    const active = value.colors.includes(col.name);
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => onChange({ colors: toggleIn(value.colors, col.name) })}
                        aria-pressed={active}
                        title={col.name}
                        aria-label={col.name}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 transition-shadow",
                          active
                            ? "ring-2 ring-[var(--color-accent)]"
                            : "ring-1 ring-[var(--color-border-strong)] hover:ring-[var(--color-fg-muted)]"
                        )}
                      >
                        <span className="h-6 w-6 rounded-full" style={{ background: col.hex }} />
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* Price range */}
              <Section title="Price range (per day)">
                <DualRange
                  min={bounds.priceMin}
                  max={bounds.priceMax}
                  step={5}
                  valueMin={value.priceMin}
                  valueMax={value.priceMax}
                  onChange={(lo, hi) => onChange({ priceMin: lo, priceMax: hi })}
                  format={(n) => `€${n}`}
                />
              </Section>

              {/* Year */}
              <Section title="Year">
                <DualRange
                  min={bounds.yearMin}
                  max={bounds.yearMax}
                  step={1}
                  valueMin={value.yearMin}
                  valueMax={value.yearMax}
                  onChange={(lo, hi) => onChange({ yearMin: lo, yearMax: hi })}
                  format={(n) => String(n)}
                />
              </Section>
            </div>

            {/* Sticky footer */}
            <div className="flex items-center gap-3 border-t border-[var(--color-border)] px-5 py-4 shadow-[var(--shadow-sticky)]">
              <button
                type="button"
                onClick={onReset}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border-strong)] text-sm font-semibold text-[var(--color-fg)] transition-colors hover:bg-[var(--color-surface-2)]"
              >
                Reset all
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 flex-[1.4] items-center justify-center rounded-[var(--radius-md)] bg-[#151515] text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                Show Results ({resultCount})
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[var(--color-border)] pb-5 pt-5 first:pt-0">
      <h3 className="mb-3 text-sm font-semibold text-[var(--color-fg)]">{title}</h3>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 items-center gap-1 rounded-full border px-3.5 text-xs font-medium transition-colors",
        active
          ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
          : "border-[var(--color-border-strong)] bg-white text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
      )}
    >
      {children}
    </button>
  );
}

/** Dual-thumb range built from two overlaid native inputs (accessible + keyboard). */
function DualRange({
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChange,
  format,
}: {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onChange: (lo: number, hi: number) => void;
  format: (n: number) => string;
}) {
  const span = Math.max(1, max - min);
  const loPct = ((valueMin - min) / span) * 100;
  const hiPct = ((valueMax - min) / span) * 100;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-medium text-[var(--color-fg)]">
        <span>{format(valueMin)}</span>
        <span>{format(valueMax)}</span>
      </div>
      <div className="relative h-6">
        {/* Track */}
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[var(--color-surface-3)]" />
        {/* Selected fill */}
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[var(--color-accent)]"
          style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          aria-label="Minimum"
          onChange={(e) => onChange(Math.min(Number(e.target.value), valueMax - step), valueMax)}
          className="range-thumb pointer-events-none absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          aria-label="Maximum"
          onChange={(e) => onChange(valueMin, Math.max(Number(e.target.value), valueMin + step))}
          className="range-thumb pointer-events-none absolute inset-x-0 top-0 h-6 w-full appearance-none bg-transparent"
        />
      </div>
    </div>
  );
}
