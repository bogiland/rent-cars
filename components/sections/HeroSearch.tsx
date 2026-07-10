"use client"; // controlled search input, focus dropdown, keyboard nav + animated placeholder

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Car as CarIcon, Layers } from "lucide-react";
import { cars } from "@/lib/content";
import { cn } from "@/lib/utils";

const FLEET = "/rent-a-car-cyprus";

/** Quick-pick models — one recognisable car per top category (real slugs). */
const QUICK_MODEL_SLUGS = [
  "lamborghini-urus-2024",
  "mercedes-benz-g63-amg-2023",
  "porsche-911-carrera-2022",
  "ferrari-488-spider-2022",
];

/** Quick-pick categories — real slugs, matched to CategoriesGrid / FleetFilters. */
const QUICK_CATEGORIES = [
  { slug: "Luxury", label: "Rent Luxury" },
  { slug: "Supercars", label: "Rent Supercars" },
  { slug: "SUV Premium", label: "Rent Premium SUV" },
  { slug: "Sports", label: "Rent Sports" },
];

/** Animated placeholder rotation — real brands / models / categories only. */
const PLACEHOLDERS = [
  "Search for BMW",
  "Search for Supercars",
  "Search for G63 AMG",
  "Search for Convertible",
  "Search for Urus",
];
const STATIC_PLACEHOLDER = "Search cars, brands or categories";

const qHref = (q: string) => `${FLEET}?q=${encodeURIComponent(q)}`;
const catHref = (slug: string) => `${FLEET}?cat=${encodeURIComponent(slug)}`;

type Suggestion = {
  key: string;
  label: string;
  sub: string;
  href: string;
  kind: "model" | "cat" | "car";
};

const QUICK_MODELS: Suggestion[] = QUICK_MODEL_SLUGS.flatMap((slug) => {
  const c = cars.find((x) => x.slug === slug);
  if (!c) return [];
  return [
    {
      key: `m-${slug}`,
      label: `${c.brand} ${c.model}`,
      sub: c.category,
      href: qHref(`${c.brand} ${c.model}`),
      kind: "model",
    },
  ];
});

const QUICK_CATS: Suggestion[] = QUICK_CATEGORIES.map((c) => ({
  key: `c-${c.slug}`,
  label: c.label,
  sub: `${cars.filter((x) => x.category === c.slug).length} cars`,
  href: catHref(c.slug),
  kind: "cat",
}));

function searchCars(query: string): Suggestion[] {
  const ql = query.trim().toLowerCase();
  if (!ql) return [];
  return cars
    .filter((c) => `${c.brand} ${c.model} ${c.category}`.toLowerCase().includes(ql))
    .slice(0, 5)
    .map((c) => ({
      key: `s-${c.slug}`,
      label: `${c.brand} ${c.model}`,
      sub: `${c.category} · €${c.pricePerDay}/day`,
      href: qHref(`${c.brand} ${c.model}`),
      kind: "car" as const,
    }));
}

/** Local prefers-reduced-motion hook (no shared hook exists yet in the project). */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchCars(query), [query]);
  const showQuick = query.trim() === "";
  const items = useMemo<Suggestion[]>(
    () => (showQuick ? [...QUICK_MODELS, ...QUICK_CATS] : results),
    [showQuick, results]
  );

  // Reset highlight whenever the visible list changes.
  useEffect(() => {
    setActive(-1);
  }, [query, open]);

  // Close on click / focus outside the widget.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    setActive(-1);
    inputRef.current?.blur();
    router.push(href);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (active >= 0 && items[active]) return go(items[active].href);
    return go(query.trim() ? qHref(query.trim()) : FLEET);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      setActive((i) => Math.min(items.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(-1, i - 1));
    } else if (e.key === "Enter") {
      if (open && active >= 0 && items[active]) {
        e.preventDefault();
        go(items[active].href);
      }
      // otherwise the <form> onSubmit handles it (search current query)
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  /* ── Animated placeholder ─────────────────────────────────────────────── */
  const reduced = usePrefersReducedMotion();
  const [phrase, setPhrase] = useState(0);
  const [phraseOn, setPhraseOn] = useState(true);
  const animate = !reduced && !focused && query === "";

  useEffect(() => {
    if (!animate) {
      setPhraseOn(true);
      return;
    }
    let fade: ReturnType<typeof setTimeout>;
    const cycle = setInterval(() => {
      setPhraseOn(false);
      fade = setTimeout(() => {
        setPhrase((i) => (i + 1) % PLACEHOLDERS.length);
        setPhraseOn(true);
      }, 260);
    }, 2600);
    return () => {
      clearInterval(cycle);
      clearTimeout(fade);
    };
  }, [animate]);

  return (
    <div ref={rootRef} className="relative w-full max-w-[510px]">
      <form
        action={FLEET}
        method="get"
        onSubmit={submit}
        aria-label="Search cars"
        className="flex h-[42px] w-full items-stretch gap-1 rounded-full bg-white p-[3px] shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-shadow duration-[var(--dur-fast)] ease-[var(--ease-premium)] focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.2),0_0_0_3px_var(--color-input-focus)] md:h-[40px]"
      >
        <div className="relative flex min-w-0 flex-1 items-center pl-3 md:pl-3.5">
          <Search size={20} strokeWidth={2} className="shrink-0 text-[var(--color-fg-dim)]" />
          <div className="relative min-w-0 flex-1">
            <input
              ref={inputRef}
              type="search"
              name="q"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => {
                setFocused(true);
                setOpen(true);
              }}
              onBlur={() => setFocused(false)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              role="combobox"
              aria-expanded={open}
              aria-controls="hero-search-listbox"
              aria-autocomplete="list"
              aria-label="Search cars"
              className="h-full w-full min-w-0 bg-transparent px-2 text-[15px] text-[var(--color-fg)] outline-none focus:outline-none focus-visible:outline-none md:text-sm"
            />
            {query === "" && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-2 flex items-center overflow-hidden whitespace-nowrap text-[15px] text-[var(--color-fg-muted)] md:text-sm"
              >
                <span
                  className={cn(!reduced && "transition-opacity duration-[260ms] ease-[var(--ease-premium)]")}
                  style={{ opacity: phraseOn ? 1 : 0 }}
                >
                  {reduced ? STATIC_PLACEHOLDER : PLACEHOLDERS[phrase]}
                </span>
              </span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex h-full min-w-[142px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 border-white bg-[var(--color-accent)] px-4 text-sm font-semibold text-[var(--color-accent-fg)] shadow-[0_0_0_1px_rgba(204,71,0,0.15)] transition-colors duration-[var(--dur-fast)] ease-[var(--ease-premium)] hover:bg-[var(--color-accent-hover)] md:min-w-[156px] md:px-7 md:text-[13px]"
        >
          <span className="hidden sm:inline">View All Cars</span>
          <span className="sm:hidden">Search</span>
          <ArrowRight size={15} aria-hidden />
        </button>
      </form>

      {open && (
        <div
          id="hero-search-listbox"
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] py-2 text-left shadow-[var(--shadow-elevated)]"
        >
          {showQuick ? (
            <>
              <GroupLabel>Popular models</GroupLabel>
              {QUICK_MODELS.map((s, i) => (
                <Row key={s.key} s={s} idx={i} active={active} onActivate={setActive} onSelect={go} />
              ))}
              <GroupLabel>Browse categories</GroupLabel>
              {QUICK_CATS.map((s, i) => (
                <Row
                  key={s.key}
                  s={s}
                  idx={QUICK_MODELS.length + i}
                  active={active}
                  onActivate={setActive}
                  onSelect={go}
                />
              ))}
            </>
          ) : results.length > 0 ? (
            results.map((s, i) => (
              <Row key={s.key} s={s} idx={i} active={active} onActivate={setActive} onSelect={go} />
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-[var(--color-fg-muted)]">
              No matches. Press Enter to browse all cars.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-fg-faint)]">
      {children}
    </p>
  );
}

function Row({
  s,
  idx,
  active,
  onActivate,
  onSelect,
}: {
  s: Suggestion;
  idx: number;
  active: number;
  onActivate: (i: number) => void;
  onSelect: (href: string) => void;
}) {
  const isActive = idx === active;
  const Icon = s.kind === "cat" ? Layers : CarIcon;
  return (
    <button
      type="button"
      role="option"
      aria-selected={isActive}
      onMouseEnter={() => onActivate(idx)}
      onMouseDown={(e) => e.preventDefault()} // keep input focus so blur doesn't pre-empt the click
      onClick={() => onSelect(s.href)}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-2 text-left transition-colors duration-[var(--dur-fast)]",
        isActive ? "bg-[var(--color-surface-2)]" : "bg-transparent"
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-accent)]">
        <Icon size={15} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-[var(--color-fg)]">{s.label}</span>
        <span className="block truncate text-xs text-[var(--color-fg-muted)]">{s.sub}</span>
      </span>
      <ArrowRight size={14} className="shrink-0 text-[var(--color-fg-faint)]" aria-hidden />
    </button>
  );
}
