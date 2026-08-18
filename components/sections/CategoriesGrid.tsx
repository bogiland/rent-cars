"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Search } from "lucide-react";
import { cars, getCategoryImage } from "@/lib/content";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { slug: "Luxury", label: "Rent Luxury" },
  { slug: "Sports", label: "Rent Sports" },
  { slug: "SUV", label: "Rent SUV" },
  { slug: "monthly", label: "Rent Monthly" },
  { slug: "Economy", label: "Cheap Rent a Car" },
  { slug: "Supercars", label: "Rent Supercars" },
  { slug: "Convertible", label: "Rent Convertible" },
  { slug: "Electric", label: "Rent Electric" },
  { slug: "driver", label: "Car With Driver", href: "/booking" },
  { slug: "Muscle", label: "Rent Muscle" },
  { slug: "SUV Premium", label: "Rent Premium SUV" },
  { slug: "Crossover", label: "Rent Crossover" },
  { slug: "Sedan", label: "Rent Sedan" },
];

export function CategoriesGrid() {
  const [showAll, setShowAll] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const visible = showAll ? CATEGORIES : CATEGORIES.slice(0, 10);

  return (
    <section
      className="pt-9 pb-6 md:pt-12 md:pb-8"
      aria-labelledby="categories-heading"
    >
      {/* Tighter, shrinking side padding on small screens (OCD-style edge-to-edge feel) */}
      <div className="container">
        <div className="relative mb-6 text-left md:mb-8">
          <h2
            id="categories-heading"
            className="animate-premium-reveal text-[clamp(1.22rem,1.05rem+0.45vw,1.42rem)] font-semibold tracking-[0] text-[var(--color-fg)]"
          >
            Browse Car Rentals in{" "}
            <button
              type="button"
              onClick={() => setCityOpen((v) => !v)}
              aria-expanded={cityOpen}
              className="group/city relative inline-flex items-center gap-1 border-b border-[var(--color-accent)] pb-1 text-[var(--color-accent)]"
            >
              Cyprus
              <ChevronDown
                size={14}
                className={cn(
                  "transition-transform duration-[1000ms] ease-[var(--ease-premium)]",
                  cityOpen && "rotate-180",
                )}
              />
              <span
                aria-hidden
                className={cn(
                  "absolute -bottom-px left-0 h-px bg-[var(--color-accent-bright)] transition-[width] duration-[1000ms] ease-[var(--ease-premium)]",
                  cityOpen ? "w-full opacity-100" : "w-0 opacity-0",
                )}
              />
            </button>
          </h2>

          {cityOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setCityOpen(false)}
              />
              <div className="absolute left-0 top-[calc(100%+12px)] z-30 w-[min(540px,calc(100vw-2rem))] origin-top scale-100 rounded-[8px] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-elevated)] animate-[city-menu-in_1000ms_var(--ease-premium)_both] md:left-[9.5rem]">
                <p className="mb-2 text-xs font-medium uppercase text-[var(--color-fg)]">
                  Search your city
                </p>
                <label className="mb-4 flex h-10 items-center gap-2 rounded-[6px] border border-[var(--color-border-strong)] px-3 focus-within:border-[var(--color-accent)]">
                  <Search size={17} className="text-[var(--color-fg-faint)]" />
                  <input
                    type="search"
                    placeholder="Search"
                    className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-muted)]"
                  />
                </label>
                <p className="mb-3 text-sm font-semibold text-[var(--color-fg)]">
                  Cyprus
                </p>
                <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-[var(--color-fg-muted)] sm:grid-cols-3">
                  {[
                    "Nicosia",
                    "Limassol",
                    "Larnaca",
                    "Paphos",
                    "Ayia Napa",
                  ].map((city) => (
                    <Link
                      key={city}
                      href={`/rent-a-car-cyprus?location=${encodeURIComponent(city.toLowerCase().replaceAll(" ", "-"))}`}
                      onClick={() => setCityOpen(false)}
                      className="transition-colors hover:text-[var(--color-accent)]"
                    >
                      {city}
                    </Link>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-5 inline-flex items-center gap-1 text-sm text-[var(--color-accent)]"
                >
                  More cities <ChevronDown size={13} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Phone: 3×3 (9 tiles). md+: 5 cols. Images + gaps ~30% smaller than before
            and fluid via clamp() — they grow/shrink with the viewport. */}
        <ul
          className="mx-auto grid max-w-[1060px] grid-cols-3 gap-x-[clamp(0.6rem,2.5vw,3.5rem)] gap-y-[clamp(1.2rem,3vw,2.2rem)] md:grid-cols-5"
          role="list"
        >
          {visible.map((cat, index) => {
            const count =
              cat.slug === "driver" || cat.slug === "monthly"
                ? cars.length
                : cars.filter((c) => c.category === cat.slug).length;
            const href =
              "href" in cat && cat.href
                ? cat.href
                : cat.slug === "monthly"
                  ? "/rent-a-car-cyprus"
                  : `/rent-a-car-cyprus?cat=${encodeURIComponent(cat.slug)}`;
            const imageCategory =
              cat.slug === "driver"
                ? "Luxury"
                : cat.slug === "monthly"
                  ? "Sedan"
                  : cat.slug;

            return (
              <li
                key={cat.slug}
                className={cn(
                  "animate-premium-reveal",
                  index % 3 === 1 && "animate-premium-reveal-delay-1",
                  index % 3 === 2 && "animate-premium-reveal-delay-2",
                  !showAll && index === 9 ? "hidden md:block" : undefined,
                )}
              >
                <Link
                  href={href}
                  className="group flex flex-col items-center text-center"
                >
                  {/* OCD-style: the cutout car floats on the page — no card box, just the photo */}
                  <div className="relative mx-auto mb-2 aspect-[2.1/1] w-[72%] md:w-[80%] lg:w-[90%]">
                    {/* Soft contact shadow so the cutout car is grounded, not floating */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-[17%] bottom-[2%] h-[8%] rounded-[50%] bg-black/25 blur-[6px] transition-transform duration-[var(--dur-base)] ease-[var(--ease-premium)] group-hover:scale-x-105"
                    />
                    <Image
                      src={getCategoryImage(imageCategory)}
                      alt={cat.label}
                      fill
                      sizes="(min-width: 1024px) 170px, (min-width: 768px) 14vw, 22vw"
                      className="object-contain object-bottom transition-transform duration-[var(--dur-base)] ease-[var(--ease-premium)] group-hover:scale-[1.06]"
                    />
                  </div>
                  <p className="text-[10px] font-bold uppercase leading-tight tracking-[0] text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-accent)] md:text-[11px] lg:text-[14px]">
                    {cat.label}
                  </p>
                  <p className="mt-0.5 text-[9px] leading-none text-[var(--color-fg-muted)] md:text-[10px] lg:text-[11px]">
                    {Math.max(count, cat.slug === "driver" ? 6 : 1)} Cars
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-9 flex justify-center md:mt-12">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex h-9 min-w-[210px] items-center justify-center gap-2 rounded-[6px] border border-[var(--color-border-strong)] text-xs font-medium text-[var(--color-fg)] transition-colors duration-[var(--dur-fast)] ease-[var(--ease-premium)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-2)]"
          >
            {showAll ? "See Less" : "See More"}
            <ChevronDown
              size={15}
              className={`transition-transform duration-[var(--dur-fast)] ${showAll ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
