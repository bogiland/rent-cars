"use client"; // source tabs + review carousel

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { testimonials, testimonialsAggregate } from "@/lib/content";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "All", label: "All reviews" },
  { id: "Google", label: "Google", icon: "G" },
  { id: "Trustpilot", label: "Trustpilot", icon: "★" },
  { id: "Booking.com", label: "Booking.com", icon: "B" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const AVATAR_BG = [
  "bg-[var(--color-accent)]",
  "bg-[var(--color-success)]",
  "bg-[#5b8def]",
  "bg-[#e05a5a]",
  "bg-[#9b6bcc]",
  "bg-[#3aa89a]",
];

function SourceIcon({ source }: { source: string }) {
  const map: Record<string, { bg: string; label: string }> = {
    Google: { bg: "bg-[#4285f4]", label: "G" },
    Trustpilot: { bg: "bg-[#00b67a]", label: "★" },
    "Booking.com": { bg: "bg-[#003580]", label: "B" },
  };
  const s = map[source] ?? { bg: "bg-[var(--color-fg-dim)]", label: "?" };
  return (
    <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white", s.bg)}>
      {s.label}
    </span>
  );
}

export function Testimonials() {
  const [tab, setTab] = useState<TabId>("All");
  const trackRef = useRef<HTMLUListElement>(null);

  const filtered =
    tab === "All" ? testimonials : testimonials.filter((t) => t.source === tab);

  const scroll = (dir: -1 | 1) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section
      className="py-11 md:py-16 bg-[var(--color-bg)]"
      aria-labelledby="testimonials-heading"
    >
      <div className="container">
        <h2 id="testimonials-heading" className="mb-5 text-[clamp(1.25rem,1.05rem+0.55vw,1.55rem)] font-semibold tracking-[0] text-[var(--color-fg)]">
          What Our Customers Say
        </h2>

        {/* OCD-style unified filter bar */}
        <div className="mb-6 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-2)]">
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between md:p-5">
            {/* Source tabs */}
            <div role="tablist" aria-label="Review source" className="flex flex-wrap items-center gap-x-1 gap-y-2">
              {TABS.map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "border-b-2 border-[var(--color-fg)] text-[var(--color-fg)]"
                        : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                    )}
                  >
                    {"icon" in t && t.icon && (
                      <span className="text-xs opacity-80">{t.icon}</span>
                    )}
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Aggregate + CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--color-fg)]">Excellent</span>
                <div className="flex items-center gap-0.5" aria-label={`Rated ${testimonialsAggregate.rating} out of 5`}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[var(--color-star)] text-[var(--color-star)]" />
                  ))}
                </div>
                <span className="text-sm font-bold text-[var(--color-fg)]">{testimonialsAggregate.rating}</span>
                <span className="text-sm text-[var(--color-fg-muted)]">
                  {testimonialsAggregate.count.toLocaleString()} reviews
                </span>
              </div>
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-[var(--color-fg)] bg-white px-4 text-sm font-medium text-[var(--color-fg)] transition-colors hover:bg-[var(--color-surface-2)]"
              >
                Write a review
              </button>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Previous reviews"
            className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-fg-muted)] shadow-sm transition-colors hover:border-[var(--color-fg)] hover:text-[var(--color-fg)] md:flex lg:-left-5"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Next reviews"
            className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-fg)] text-white shadow-sm transition-opacity hover:opacity-90 md:flex lg:-right-5"
          >
            <ChevronRight size={20} />
          </button>

          <ul
            ref={trackRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
            role="list"
          >
            {filtered.map((t, i) => (
              <li
                key={t.id}
                className="w-[min(100%,300px)] shrink-0 snap-start sm:w-[280px] lg:w-[calc(25%-12px)]"
              >
                <article className="flex h-full flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white",
                          AVATAR_BG[i % AVATAR_BG.length]
                        )}
                        aria-hidden
                      >
                        {t.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--color-fg)]">{t.name}</p>
                        <p className="text-xs text-[var(--color-fg-dim)]">{t.date}</p>
                      </div>
                    </div>
                    <SourceIcon source={t.source} />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5" aria-label={`Rated ${t.rating} out of 5`}>
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          size={13}
                          className={idx < t.rating ? "fill-[var(--color-star)] text-[var(--color-star)]" : "text-[var(--color-border-strong)]"}
                        />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#4285f4]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      Verified
                    </span>
                  </div>

                  <p className="flex-1 text-sm leading-relaxed text-[var(--color-fg-muted)] line-clamp-5">
                    {t.text}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center">
          <button
            type="button"
            className="text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
          >
            Read all reviews &gt;&gt;
          </button>
        </p>
      </div>
    </section>
  );
}
