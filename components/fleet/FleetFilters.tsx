"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Plus, SlidersHorizontal, X } from "lucide-react";
import { CarCard } from "@/components/fleet/CarCard";
import { CarCardHorizontal } from "@/components/fleet/CarCardHorizontal";
import {
  FleetFilterDrawer,
  type AdvancedFilters,
  type FleetBounds,
} from "@/components/fleet/FleetFilterDrawer";
import {
  brandHref,
  getCarColor,
  getCarMileage,
  getCarsByBrand,
  getFeaturedCars,
} from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Car } from "@/lib/types";

const CATEGORIES = [
  "All",
  "Luxury",
  "Supercars",
  "Sports",
  "SUV Premium",
  "SUV",
  "Crossover",
  "Sedan",
  "Convertible",
  "Electric",
  "Muscle",
  "Economy",
];

const PRICE_RANGES = [
  { id: "any", label: "Any price", min: 0, max: Infinity },
  { id: "u50", label: "Under EUR 50", min: 0, max: 50 },
  { id: "50-100", label: "EUR 50 - 100", min: 50, max: 100 },
  { id: "100-300", label: "EUR 100 - 300", min: 100, max: 300 },
  { id: "300+", label: "EUR 300+", min: 300, max: Infinity },
] as const;

const SORTS = [
  { id: "popular", label: "Recommended" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "newest", label: "Newest first" },
] as const;

interface Props {
  cars: Car[];
  initialCategory?: string;
  initialQuery?: string;
  initialSeats?: number[];
  /** Brand landing page (/rent-<brand>): seeds the brand filter + headline. */
  initialBrand?: string;
}

export function FleetFilters({
  cars,
  initialCategory = "All",
  initialQuery = "",
  initialSeats = [],
  initialBrand,
}: Props) {
  const [category, setCategory] = useState(
    CATEGORIES.includes(initialCategory) ? initialCategory : "All"
  );
  const [price, setPrice] = useState<(typeof PRICE_RANGES)[number]["id"]>("any");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("popular");
  const [q, setQ] = useState(initialBrand ?? initialQuery);

  // Recommended 3-car suggestion shown under the results count.
  const topPicks = useMemo(
    () => (initialBrand ? getCarsByBrand(initialBrand).slice(0, 3) : getFeaturedCars(3)),
    [initialBrand]
  );

  const bounds: FleetBounds = useMemo(() => {
    const prices = cars.map((c) => c.pricePerDay);
    const years = cars.map((c) => c.year);
    return {
      priceMin: Math.floor(Math.min(...prices) / 5) * 5,
      priceMax: Math.ceil(Math.max(...prices) / 5) * 5,
      yearMin: Math.min(...years),
      yearMax: Math.max(...years),
    };
  }, [cars]);

  const makeAdvanced = (): AdvancedFilters => ({
    fuels: [],
    transmissions: [],
    seats: [],
    colors: [],
    mileageMax: null,
    priceMin: bounds.priceMin,
    priceMax: bounds.priceMax,
    yearMin: bounds.yearMin,
    yearMax: bounds.yearMax,
  });
  const [advanced, setAdvanced] = useState<AdvancedFilters>(() => ({
    ...makeAdvanced(),
    seats: initialSeats,
  }));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const patchAdvanced = (patch: Partial<AdvancedFilters>) =>
    setAdvanced((prev) => ({ ...prev, ...patch }));
  const resetAdvanced = () => setAdvanced(makeAdvanced());

  const advancedActive =
    advanced.fuels.length > 0 ||
    advanced.transmissions.length > 0 ||
    advanced.seats.length > 0 ||
    advanced.colors.length > 0 ||
    advanced.mileageMax !== null ||
    advanced.priceMin !== bounds.priceMin ||
    advanced.priceMax !== bounds.priceMax ||
    advanced.yearMin !== bounds.yearMin ||
    advanced.yearMax !== bounds.yearMax;

  // Header's "Filters" button (in the /fleet sub-bar) opens this drawer.
  useEffect(() => {
    const open = () => setDrawerOpen(true);
    window.addEventListener("open-fleet-filters", open);
    return () => window.removeEventListener("open-fleet-filters", open);
  }, []);

  const makesTrackRef = useRef<HTMLUListElement>(null);
  const scrollMakes = (dir: -1 | 1) => {
    makesTrackRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  const makes = useMemo(() => Array.from(new Set(cars.map((c) => c.brand))), [cars]);

  const filtered = useMemo(() => {
    const range = PRICE_RANGES.find((r) => r.id === price)!;
    const ql = q.trim().toLowerCase();
    const list = cars.filter((car) => {
      if (category !== "All" && car.category !== category) return false;
      if (car.pricePerDay < range.min || car.pricePerDay > range.max) return false;
      if (ql) {
        const hay = `${car.brand} ${car.model} ${car.year} ${car.category}`.toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      // Advanced (drawer) filters
      if (advanced.fuels.length && !advanced.fuels.includes(car.fuel)) return false;
      if (advanced.transmissions.length && !advanced.transmissions.includes(car.transmission)) return false;
      if (advanced.seats.length && !advanced.seats.includes(car.seats)) return false;
      if (advanced.colors.length && !advanced.colors.includes(getCarColor(car).name)) return false;
      if (advanced.mileageMax !== null && getCarMileage(car) > advanced.mileageMax) return false;
      if (car.pricePerDay < advanced.priceMin || car.pricePerDay > advanced.priceMax) return false;
      if (car.year < advanced.yearMin || car.year > advanced.yearMax) return false;
      return true;
    });

    if (sort === "price-asc") list.sort((a, b) => a.pricePerDay - b.pricePerDay);
    if (sort === "price-desc") list.sort((a, b) => b.pricePerDay - a.pricePerDay);
    if (sort === "newest") list.sort((a, b) => b.year - a.year);
    return list;
  }, [cars, category, price, q, sort, advanced]);

  const categoryLabel = initialBrand
    ? `Rent ${initialBrand} in Cyprus`
    : category === "All"
      ? "Car Rental Cyprus"
      : `${category} Car Rental Cyprus`;
  const hasFilters = category !== "All" || price !== "any" || q.trim().length > 0 || advancedActive;

  return (
    <div>
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[var(--color-fg)]">Home</Link>
        <span aria-hidden>&gt;</span>
        <span>Cyprus</span>
        <span aria-hidden>&gt;</span>
        <span className="text-[var(--color-fg)]">{initialBrand ?? (category === "All" ? "Rent a Car" : category)}</span>
      </nav>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <section className="mb-6 rounded-[8px] bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.05)] md:p-6" aria-labelledby="fleet-heading">
            <h1 id="fleet-heading" className="text-[clamp(1.45rem,1.1rem+0.9vw,2rem)] font-semibold tracking-[0] text-[var(--color-fg)]">
              {categoryLabel}
            </h1>
            <p className="mt-3 max-w-4xl text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Rent cars in Cyprus with transparent pricing and no hidden fees. Compare offers,
              check photos quickly and book directly with full insurance and delivery options.
            </p>

            <div className="mt-8">
              <div className="mb-5 flex items-center gap-8 border-b border-[var(--color-border)]">
                <button className="border-b-2 border-[var(--color-accent)] pb-3 text-sm font-semibold text-[var(--color-fg)]">
                  Rent Cars by Make
                </button>
                <button className="pb-3 text-sm font-medium text-[var(--color-fg-muted)]">
                  Trending Cars
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => scrollMakes(-1)}
                  aria-label="Previous brands"
                  className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f7f7f7] text-[var(--color-fg-muted)] md:inline-flex"
                >
                  <ChevronLeft size={18} />
                </button>
                <ul ref={makesTrackRef} className="no-scrollbar flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1" role="list">
                  {makes.map((make) => {
                    const active = initialBrand?.toLowerCase() === make.toLowerCase();
                    return (
                      <li key={make} className="shrink-0">
                        <Link
                          href={brandHref(make)}
                          className={cn(
                            "inline-flex h-9 items-center rounded-full border px-3.5 text-xs font-medium transition-colors",
                            active
                              ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                              : "border-[var(--color-border-strong)] bg-white text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                          )}
                        >
                          Rent {make}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <button
                  type="button"
                  onClick={() => scrollMakes(1)}
                  aria-label="Next brands"
                  className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f7f7f7] text-[var(--color-fg-muted)] md:inline-flex"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </section>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setCategory("All");
                  setPrice("any");
                  setQ("");
                  resetAdvanced();
                }}
                className="inline-flex h-8 items-center gap-1 rounded-[5px] border border-[var(--color-border-strong)] bg-white px-3 text-xs text-[var(--color-fg-muted)]"
              >
                Clear All Filters <X size={13} />
              </button>
            )}
            {category !== "All" && (
              <button
                type="button"
                onClick={() => setCategory("All")}
                className="inline-flex h-8 items-center gap-1 rounded-[5px] border border-[var(--color-accent)] bg-white px-3 text-xs text-[var(--color-accent)]"
              >
                {category} <X size={13} />
              </button>
            )}
            {q.trim() && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="inline-flex h-8 items-center gap-1 rounded-[5px] border border-[var(--color-accent)] bg-white px-3 text-xs text-[var(--color-accent)]"
              >
                {q.trim()} <X size={13} />
              </button>
            )}
          </div>

          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[var(--color-fg-muted)]">
              Showing <span className="font-semibold text-[var(--color-fg)]">1 - {filtered.length}</span> of {cars.length} cars
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-[var(--color-border-strong)] bg-white px-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <SlidersHorizontal size={15} /> Filters
                {advancedActive && (
                  <span className="ml-0.5 h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                )}
              </button>
              <label className="hidden items-center gap-2 text-sm text-[var(--color-fg-muted)] sm:flex">
                Price
                <span className="relative inline-flex items-center">
                  <select
                    value={price}
                    onChange={(event) => setPrice(event.target.value as typeof price)}
                    className="h-9 appearance-none rounded-[6px] border border-[var(--color-border)] bg-white py-0 pl-2.5 pr-8 text-sm text-[var(--color-fg)] outline-none"
                  >
                    {PRICE_RANGES.map((range) => (
                      <option key={range.id} value={range.id}>{range.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-2.5 text-[var(--color-fg-muted)]" />
                </span>
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--color-fg-muted)]">
                <SlidersHorizontal size={15} /> Sort by
                <span className="relative inline-flex items-center">
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as typeof sort)}
                    className="h-9 appearance-none rounded-[6px] border border-[var(--color-border)] bg-white py-0 pl-2.5 pr-8 text-sm text-[var(--color-fg)] outline-none"
                  >
                    {SORTS.map((sortItem) => (
                      <option key={sortItem.id} value={sortItem.id}>{sortItem.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-2.5 text-[var(--color-fg-muted)]" />
                </span>
              </label>
            </div>
          </div>

          {topPicks.length >= 3 && (
            <section
              className="mb-6 rounded-[10px] border border-[var(--color-recommend-border)] bg-[var(--color-recommend-bg)] p-4 md:p-5"
              aria-label="Recommended cars"
            >
              {/* Mobile: horizontal swipe (next card peeks in → "scroll right").
                  sm+: falls back to a 2/3-col grid. */}
              <ul
                className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
                role="list"
              >
                {topPicks.map((car) => (
                  <li key={car.slug} className="flex w-[82%] shrink-0 snap-start justify-center sm:w-auto">
                    <CarCard car={car} sizes="(min-width:1024px) 260px, (min-width:640px) 45vw, 82vw" />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <ul className="mb-5 flex flex-wrap gap-2 lg:hidden" role="list" aria-label="Categories">
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              const count = cat === "All" ? cars.length : cars.filter((car) => car.category === cat).length;
              return (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "h-9 rounded-full border px-3 text-xs font-semibold",
                      active
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                        : "border-[var(--color-border)] bg-white text-[var(--color-fg-muted)]"
                    )}
                  >
                    {cat} <span className="opacity-65">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {filtered.length === 0 ? (
            <div className="rounded-[8px] bg-white py-16 text-center">
              <p className="mb-2 text-lg font-semibold">No cars match your filters</p>
              <p className="text-sm text-[var(--color-fg-muted)]">Try another brand, category or price range.</p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1" role="list">
              {filtered.map((car, index) => (
                <li key={car.slug}>
                  <CarCardHorizontal car={car} premium={index < 8} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="space-y-4">
            <AdApp />
            <BookingTips />
            <AdTile
              title="Free Cyprus Airport Delivery"
              subtitle="Book premium cars direct"
              image="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=900&q=85&auto=format&fit=crop"
            />
            <AdTile
              title="Weekend Luxury Deals"
              subtitle="Promote your partners here"
              image="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=85&auto=format&fit=crop"
            />
          </div>
        </aside>
      </div>

      <FleetFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        allCars={cars}
        bounds={bounds}
        value={advanced}
        onChange={patchAdvanced}
        onReset={resetAdvanced}
        resultCount={filtered.length}
      />
    </div>
  );
}

function AdApp() {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[var(--color-border)] bg-white p-4 text-center">
      <div className="mx-auto mb-3 flex h-14 w-44 items-center justify-center rounded-[16px] bg-[#151515] text-white shadow-sm">
        <span className="text-xl font-extrabold">APEX</span>
        <span className="ml-1 text-xl font-medium text-[var(--color-accent)]">auto</span>
      </div>
      <p className="text-lg font-bold leading-tight text-[var(--color-accent)]">Download the Apex Auto App</p>
      <p className="mt-1 text-xs text-[var(--color-fg-muted)]">Book in seconds. Drive in minutes.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <span className="rounded-[4px] bg-black px-2 py-2 text-[10px] font-semibold text-white">Google Play</span>
        <span className="rounded-[4px] bg-black px-2 py-2 text-[10px] font-semibold text-white">App Store</span>
      </div>
    </div>
  );
}

function BookingTips() {
  return (
    <button className="flex h-12 w-full items-center justify-between rounded-[8px] border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-fg)]">
      Booking Tips
      <Plus size={16} />
    </button>
  );
}

function AdTile({ title, subtitle, image }: { title: string; subtitle: string; image: string }) {
  return (
    <Link href="/booking" className="relative block aspect-[3/4] overflow-hidden rounded-[10px] bg-black">
      <Image src={image} alt="" fill sizes="300px" className="object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.82))]" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-2xl font-extrabold uppercase leading-[1.04] text-white">{title}</p>
        <p className="mt-2 text-sm font-semibold text-white/85">{subtitle}</p>
      </div>
    </Link>
  );
}
