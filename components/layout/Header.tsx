"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  MapPin,
  Menu,
  Search,
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { brandHref, cars, locations } from "@/lib/content";
import { useAuth } from "@/components/layout/AuthProvider";

type MenuLink = { label: string; href: string; badge?: string };
type MenuColumn = { title: string; links: MenuLink[] };

const LISTING = "/rent-a-car-cyprus";
const cat = (c: string) => `${LISTING}?cat=${encodeURIComponent(c)}`;

/** Brands with fleet counts, most-stocked first — for the Car Brands mega-menu. */
const BRAND_COUNTS = cars.reduce<Record<string, number>>((m, c) => {
  m[c.brand] = (m[c.brand] ?? 0) + 1;
  return m;
}, {});
const BRANDS = Object.keys(BRAND_COUNTS).sort(
  (a, b) => BRAND_COUNTS[b]! - BRAND_COUNTS[a]!,
);

/** "Trending" quick links shown under the Rent a Car mega-menu (OCD-style). */
const TRENDING: MenuLink[] = [
  { label: "7 Seater", href: `${LISTING}?seats=7` },
  { label: "Electric", href: cat("Electric") },
  { label: "Convertible", href: cat("Convertible") },
  { label: "Supercars", href: cat("Supercars") },
];

const MENUS: Record<string, MenuColumn[]> = {
  "Rent a Car": [
    {
      title: "Categories",
      links: [
        { label: "Luxury Car Rental", href: cat("Luxury") },
        { label: "Supercars", href: cat("Supercars") },
        { label: "Sports Cars", href: cat("Sports") },
        { label: "Muscle Cars", href: cat("Muscle") },
        { label: "Electric Cars", href: cat("Electric"), badge: "NEW" },
        { label: "Economy Cars", href: cat("Economy") },
      ],
    },
    {
      title: "Body Types",
      links: [
        { label: "Premium SUV", href: cat("SUV Premium") },
        { label: "SUV", href: cat("SUV") },
        { label: "Sedan", href: cat("Sedan") },
        { label: "Crossover", href: cat("Crossover") },
        { label: "Convertible", href: cat("Convertible") },
      ],
    },
    {
      title: "Rental by Period",
      links: [
        { label: "Daily Rental", href: LISTING },
        { label: "Weekly Rental", href: LISTING },
        { label: "Monthly Rental", href: LISTING },
        { label: "Long-term Lease", href: "/booking", badge: "NEW" },
      ],
    },
  ],
  "Buy a Car": [
    {
      title: "Buy by Category",
      links: [
        { label: "Luxury Cars for Sale", href: cat("Luxury") },
        { label: "Premium SUVs", href: cat("SUV Premium") },
        { label: "Sedans", href: cat("Sedan") },
        { label: "Electric Cars", href: cat("Electric") },
      ],
    },
    {
      title: "Sellers",
      links: [
        { label: "Sell Your Car", href: "/booking" },
        { label: "List with a Dealer", href: "/booking" },
        { label: "Trade-in", href: "/booking" },
      ],
    },
  ],
  "Car with Driver": [
    {
      title: "Chauffeur Services",
      links: [
        { label: "Hourly Chauffeur", href: "/booking" },
        { label: "Airport Transfer", href: "/booking" },
        { label: "Events & Weddings", href: "/booking" },
        { label: "Full-day Hire", href: "/booking" },
      ],
    },
  ],
  Yachts: [
    {
      title: "Yacht Charter",
      links: [
        { label: "Day Charter", href: "/booking" },
        { label: "Sunset Cruise", href: "/booking" },
        { label: "Private Events", href: "/booking" },
      ],
    },
  ],
};

const NAV = [
  "Rent a Car",
  "Buy a Car",
  "Car Brands",
  "Car with Driver",
  "Yachts",
];
const NAV_HREF: Record<string, string> = {
  "Rent a Car": LISTING,
  "Buy a Car": cat("Luxury"),
  "Car Brands": LISTING,
  "Car with Driver": "/booking",
  Yachts: "/booking",
};

const FILTERS = ["Car Type", "Brand & Model", "Model Year", "Price"];

type FilterItem = { label: string; href?: string; openFilters?: boolean };

/** Quick-pick options under each /fleet sub-bar filter (dropdowns). */
const FILTER_MENUS: Record<string, FilterItem[]> = {
  "Car Type": [
    { label: "Luxury", href: cat("Luxury") },
    { label: "Supercars", href: cat("Supercars") },
    { label: "Premium SUV", href: cat("SUV Premium") },
    { label: "SUV", href: cat("SUV") },
    { label: "Sedan", href: cat("Sedan") },
    { label: "Crossover", href: cat("Crossover") },
    { label: "Electric", href: cat("Electric") },
    { label: "Convertible", href: cat("Convertible") },
  ],
  "Brand & Model": BRANDS.slice(0, 10).map((b) => ({
    label: b,
    href: brandHref(b),
  })),
  "Model Year": [2025, 2024, 2023, 2022, 2021, 2020, 2019].map((y) => ({
    label: String(y),
    href: `${LISTING}?q=${y}`,
  })),
  Price: [
    { label: "Under €100 / day", openFilters: true },
    { label: "€100 – €300 / day", openFilters: true },
    { label: "€300 – €700 / day", openFilters: true },
    { label: "€700+ / day", openFilters: true },
  ],
};

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { loggedIn, openLogin } = useAuth();
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState("Cyprus");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const showSearchBar = pathname.startsWith("/rent-");

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 bg-white shadow-none">
        <div className="hidden h-7 border-b border-[var(--color-topbar-border)] bg-[var(--color-topbar)] min-[940px]:block">
          <div className="container flex h-full items-center justify-between text-xs text-[var(--color-fg-muted)]">
            <a href="/">Cyprus</a>
            <div className="flex items-center gap-5">
              <div className="group/loc relative">
                <button
                  type="button"
                  onClick={() => setLocationOpen((v) => !v)}
                  aria-expanded={locationOpen}
                  className="inline-flex items-center gap-1 hover:text-[var(--color-fg)]"
                >
                  <MapPin size={14} /> {location.split(" (")[0]}{" "}
                  <ChevronDown
                    size={13}
                    className={cn(
                      "transition-transform",
                      locationOpen && "rotate-180",
                    )}
                  />
                </button>
                {locationOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setLocationOpen(false)}
                    />
                    <ul
                      className="absolute left-0 top-full z-50 mt-2 w-64 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-1.5 text-left shadow-[var(--shadow-elevated)]"
                      role="list"
                    >
                      {locations.map((loc) => (
                        <li key={loc.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setLocation(loc.label);
                              setLocationOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center justify-between gap-2 rounded-[5px] px-3 py-2 text-left text-sm",
                              loc.label === location
                                ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                                : "text-[var(--color-fg)] hover:bg-[var(--color-surface-2)]",
                            )}
                          >
                            {loc.label}
                            {loc.free && (
                              <span className="text-[10px] font-semibold uppercase text-[var(--color-success)]">
                                Free
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <button className="inline-flex items-center gap-1 hover:text-[var(--color-fg)]">
                USD / ENG <ChevronDown size={13} />
              </button>
            </div>
          </div>
        </div>

        <header>
          <div
            className={cn(
              "container flex items-center justify-between gap-6",
              isHome ? "h-[54px]" : "h-[62px]",
            )}
          >
            <Link
              href="/"
              className="flex shrink-0 items-baseline gap-1.5"
              aria-label="Apex Auto home"
            >
              <span className="text-xl font-extrabold tracking-[0] text-[var(--color-fg)]">
                APEX
              </span>
              <span className="text-xl font-semibold tracking-[0] text-[var(--color-accent)]">
                auto
              </span>
            </Link>

            <nav
              className="hidden flex-1 items-center justify-end gap-1 min-[940px]:flex"
              aria-label="Main navigation"
            >
              {NAV.map((label, navIndex) => {
                const columns = MENUS[label] ?? [];
                // Left-side items open rightward, right-side items open leftward —
                // keeps wide panels inside the viewport (no horizontal overflow).
                const alignClass =
                  navIndex >= 2
                    ? "right-0 origin-top-right"
                    : "left-0 origin-top-left";
                return (
                  <div key={label} className="group/nav relative">
                    <Link
                      href={NAV_HREF[label] ?? LISTING}
                      className="inline-flex items-center gap-1 rounded-[6px] px-3 py-2 text-[13px] font-medium text-[var(--color-fg)] transition-colors duration-300 hover:text-[var(--color-accent)] group-hover/nav:text-[var(--color-accent)]"
                    >
                      {label}
                      <ChevronDown
                        size={13}
                        className="text-[var(--color-fg-muted)] transition-transform duration-[1000ms] ease-[var(--ease-premium)] group-hover/nav:rotate-180"
                      />
                    </Link>
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-3 h-px w-0 bg-[var(--color-accent-bright)] transition-[width] duration-[1000ms] ease-[var(--ease-premium)] group-hover/nav:w-[calc(100%-1.5rem)] group-focus-within/nav:w-[calc(100%-1.5rem)]"
                    />

                    {/* Mega panel — fades + scales in on hover/focus; aligned so it never overflows */}
                    <div
                      className={cn(
                        "invisible absolute top-full z-50 pt-2 translate-y-0 scale-80 transition-transform duration-[1000ms] ease-[var(--ease-premium)] group-hover/nav:visible group-hover/nav:scale-100 group-focus-within/nav:visible group-focus-within/nav:scale-100",
                        alignClass,
                      )}
                    >
                      {label === "Car Brands" ? (
                        <BrandsPanel />
                      ) : (
                        <div
                          className="max-w-[calc(100vw-1.5rem)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-elevated)]"
                          style={{ minWidth: columns.length > 1 ? 520 : 240 }}
                        >
                          <div className="flex gap-8">
                            {columns.map((col) => (
                              <div key={col.title} className="min-w-[150px]">
                                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)]">
                                  {col.title}
                                </p>
                                <ul className="flex flex-col gap-1" role="list">
                                  {col.links.map((l) => (
                                    <li key={l.label}>
                                      <Link
                                        href={l.href}
                                        className="inline-flex items-center gap-2 rounded-[5px] py-1.5 text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-accent)]"
                                      >
                                        {l.label}
                                        {l.badge && (
                                          <span className="rounded-full bg-[var(--color-accent-soft)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[var(--color-accent)]">
                                            {l.badge}
                                          </span>
                                        )}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {label === "Rent a Car" && (
                            <div className="mt-5 border-t border-[var(--color-border)] pt-4">
                              <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-fg-muted)]">
                                Trending
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {TRENDING.map((t) => (
                                  <Link
                                    key={t.label}
                                    href={t.href}
                                    className="inline-flex h-8 items-center rounded-full border border-[var(--color-border-strong)] px-3 text-xs font-medium text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                                  >
                                    {t.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </nav>

            <div className="hidden shrink-0 items-center gap-3 min-[940px]:flex">
              {!isHome && (
                <Link
                  href="/booking"
                  className="inline-flex h-9 items-center justify-center rounded-[6px] border border-[var(--color-accent)] px-4 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-soft)]"
                >
                  Sell Car for Free
                </Link>
              )}
              <button
                type="button"
                onClick={openLogin}
                className="inline-flex h-[34px] items-center justify-center gap-2 rounded-[6px] bg-[var(--color-accent)] px-7 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                {loggedIn ? (
                  <>
                    <UserRound size={15} /> Account
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[var(--color-accent)] bg-[var(--color-accent)] text-white transition-colors hover:bg-[var(--color-accent-hover)] min-[940px]:hidden"
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </header>

        {showSearchBar && (
          <div className="hidden border-b border-[var(--color-border)] min-[940px]:block">
            <div className="container flex h-[56px] items-center justify-between gap-8">
              <form
                action={LISTING}
                className="flex h-10 w-[440px] overflow-hidden rounded-full bg-[#f1f1f1] transition-shadow duration-[var(--dur-fast)] focus-within:shadow-[0_0_0_3px_var(--color-input-focus)]"
              >
                <button
                  type="button"
                  className="inline-flex min-w-[86px] items-center justify-center gap-2 border-r border-[var(--color-border)] text-sm font-medium text-[var(--color-fg)]"
                >
                  Rent <ChevronDown size={15} />
                </button>
                <div className="flex min-w-0 flex-1 items-center gap-2 px-4">
                  <Search size={16} className="text-[var(--color-fg-dim)]" />
                  <input
                    name="q"
                    type="search"
                    placeholder="Search by car brand, model or keyword e.g. Urus"
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-[var(--color-fg)] outline-none focus:outline-none focus-visible:outline-none placeholder:text-[var(--color-fg-muted)]"
                  />
                </div>
              </form>

              <div className="flex items-center gap-3">
                {FILTERS.map((filter, i) => {
                  const items = FILTER_MENUS[filter] ?? [];
                  // Rightmost two open leftward so the panel stays on-screen.
                  const alignFlt = i >= 2 ? "right-0" : "left-0";
                  return (
                    <div key={filter} className="group/flt relative">
                      <button
                        type="button"
                        className="inline-flex h-10 min-w-[108px] items-center justify-center gap-2 border-b border-[var(--color-border)] px-2 text-sm font-medium text-[var(--color-fg)] transition-colors group-hover/flt:border-[var(--color-accent)] group-hover/flt:text-[var(--color-accent)]"
                      >
                        {filter}
                        <ChevronDown
                          size={14}
                          className="transition-transform duration-[var(--dur-fast)] group-hover/flt:rotate-180"
                        />
                      </button>

                      {/* Grows down from the block's bottom edge (origin-top scale-y) */}
                      <div
                        className={cn(
                          "invisible absolute top-full z-50 pt-1.5 origin-top scale-y-90 opacity-0 transition-[opacity,transform] duration-[var(--dur-fast)] ease-[var(--ease-premium)] group-hover/flt:visible group-hover/flt:scale-y-100 group-hover/flt:opacity-100 group-focus-within/flt:visible group-focus-within/flt:scale-y-100 group-focus-within/flt:opacity-100",
                          alignFlt,
                        )}
                      >
                        <ul
                          className="max-h-[60vh] min-w-[200px] max-w-[calc(100vw-1.5rem)] overflow-auto rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-1.5 shadow-[var(--shadow-elevated)]"
                          role="list"
                        >
                          {items.map((it) =>
                            it.href ? (
                              <li key={it.label}>
                                <Link
                                  href={it.href}
                                  className="block rounded-[5px] px-3 py-2 text-sm text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-accent)]"
                                >
                                  {it.label}
                                </Link>
                              </li>
                            ) : (
                              <li key={it.label}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    window.dispatchEvent(
                                      new CustomEvent("open-fleet-filters"),
                                    )
                                  }
                                  className="block w-full rounded-[5px] px-3 py-2 text-left text-sm text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-accent)]"
                                >
                                  {it.label}
                                </button>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("open-fleet-filters"))
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 border-b border-[var(--color-border)] px-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  <SlidersHorizontal size={15} /> Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/35 transition-opacity min-[940px]:hidden",
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setMenuOpen(false)}
      >
        <nav
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-5 transition-transform",
            menuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="mb-5 flex items-center justify-between">
            <span className="text-lg font-extrabold">
              APEX <span className="text-[var(--color-accent)]">auto</span>
            </span>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
          <form
            action={LISTING}
            className="mb-5 flex h-11 items-center gap-2 rounded-full bg-[#f1f1f1] px-4 focus-within:shadow-[0_0_0_3px_var(--color-input-focus)]"
          >
            <Search size={16} className="text-[var(--color-fg-muted)]" />
            <input
              name="q"
              placeholder="Search car"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none focus-visible:outline-none"
            />
          </form>
          <div className="flex flex-col gap-1">
            {NAV.map((label) => (
              <details
                key={label}
                className="group border-b border-[var(--color-border)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold text-[var(--color-fg)] [&::-webkit-details-marker]:hidden">
                  {label}
                  <ChevronDown
                    size={15}
                    className="text-[var(--color-fg-muted)] transition-transform group-open:rotate-180"
                  />
                </summary>
                <ul className="flex flex-col gap-0.5 pb-3" role="list">
                  {(label === "Car Brands"
                    ? BRANDS.slice(0, 12).map((b) => ({
                        label: b,
                        href: brandHref(b),
                      }))
                    : (MENUS[label] ?? []).flatMap((c) => c.links)
                  ).map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-[5px] px-3 py-2 text-sm text-[var(--color-fg-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)]"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <Link
              href="/booking"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-[6px] border border-[var(--color-accent)] text-sm font-semibold text-[var(--color-accent)]"
            >
              Sell
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                openLogin();
              }}
              className="inline-flex h-10 items-center justify-center rounded-[6px] bg-[var(--color-accent)] text-sm font-semibold text-white"
            >
              {loggedIn ? "Account" : "Login"}
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}

function BrandsPanel() {
  return (
    <div className="w-[460px] max-w-[calc(100vw-1.5rem)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-elevated)]">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)]">
        Rent by Brand
      </p>
      <ul className="grid grid-cols-3 gap-x-4 gap-y-0.5" role="list">
        {BRANDS.map((b) => (
          <li key={b}>
            <Link
              href={brandHref(b)}
              className="flex items-center justify-between gap-2 rounded-[5px] py-1.5 text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              <span className="truncate">{b}</span>
              <span className="shrink-0 text-xs text-[var(--color-fg-faint)]">
                {BRAND_COUNTS[b]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
