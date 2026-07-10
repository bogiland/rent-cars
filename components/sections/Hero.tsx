"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HeroSearch } from "@/components/sections/HeroSearch";

const TABS = [
  { id: "rent", label: "Rent" },
  { id: "buy", label: "Buy" },
  { id: "sell", label: "Sell" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function Hero() {
  const [tab, setTab] = useState<TabId>("rent");

  return (
    <section
      className="pt-[54px] pb-0 md:pt-[90px]"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto w-full max-w-[calc(100vw-20px)] px-0 md:max-w-[calc(100vw-40px)]">
        <div className="relative flex min-h-[286px] sm:min-h-[310px] md:min-h-[338px]">
          {/* Image + scrims live in their own clipped, rounded layer so the search
              dropdown (rendered in the content layer below) can overflow the banner
              without being cut off by overflow-hidden. */}
          <div className="absolute inset-0 overflow-hidden rounded-[12px]">
            <Image
              src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=2200&q=85&auto=format&fit=crop"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[70%_58%] md:object-[center_58%]"
            />
            {/* Light edges, subtle darkening only in the centre behind the text
                (OCD-style) — corners stay bright, no black strip near the header. */}
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.25)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_56%_82%_at_50%_50%,rgba(0,0,0,0.42),transparent_72%)]" />
          </div>

          <div className="relative z-10 flex w-full flex-col items-center justify-center gap-5 px-4 py-4 text-center md:translate-y-1 md:gap-[40px] md:px-10 md:py-5">
            <div
              role="tablist"
              aria-label="Service type"
              className="animate-premium-reveal inline-flex rounded-full bg-white p-[3px] shadow-[0_2px_10px_rgba(0,0,0,0.12)]"
            >
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "h-7 min-w-[70px] whitespace-nowrap rounded-full px-4 text-xs font-medium uppercase tracking-[0.02em] transition-colors duration-[var(--dur-fast)] sm:min-w-[88px] md:h-8",
                    tab === t.id
                      ? "bg-[var(--color-accent)] text-[var(--color-accent-fg)]"
                      : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="animate-premium-reveal animate-premium-reveal-delay-1 flex flex-col items-center gap-2">
              <h1
                id="hero-heading"
                className="text-[clamp(1.12rem,0.98rem+0.5vw,1.35rem)] font-bold uppercase leading-[1.08] tracking-[0.01em] text-white [text-shadow:0_1px_1px_rgba(0,0,0,0.35)]"
              >
                Rent a Car Cyprus
              </h1>
              <p className="max-w-[92vw] text-sm font-light leading-snug text-white md:text-[15px] [text-shadow:0_1px_1px_rgba(0,0,0,0.35)]">
                Car Rental in Cyprus. Book Direct. No Commission Fees.
              </p>
            </div>

            <div className="animate-premium-reveal animate-premium-reveal-delay-2 w-full max-w-[510px]">
              <HeroSearch />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
