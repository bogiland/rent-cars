"use client"; // needs IntersectionObserver to watch hero

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { brand } from "@/lib/content";
import { cn } from "@/lib/utils";

interface Props {
  /** id of the hero section to watch */
  heroId?: string;
}

export function StickyBookBar({ heroId = "hero" }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        setVisible(!(entry?.isIntersecting ?? true));
      },
      { threshold: 0.1 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, [heroId]);

  /* ── Mobile-only fixed bottom bar — solid, no floating desktop pill ── */
  return (
    <div
      className={cn(
        "fixed bottom-0 inset-x-0 z-40 md:hidden",
        "bg-[var(--color-surface)]",
        "border-t border-[var(--color-border)]",
        "px-3 py-3 flex items-center gap-3",
        "transition-transform duration-[var(--dur-base)] ease-[var(--ease-premium)]",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        visible ? "translate-y-0" : "translate-y-full"
      )}
      aria-label="Book a car"
      style={{ boxShadow: "var(--shadow-sticky)" }}
    >
      <a
        href={`tel:${brand.phone}`}
        aria-label="Call us"
        className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-fg)]"
      >
        <Phone size={16} />
      </a>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold leading-none text-[var(--color-fg)]">
          From €30 / day
        </p>
        <p className="text-xs text-[var(--color-fg-dim)] mt-1 truncate">
          Free delivery · Full insurance
        </p>
      </div>
      <Link
        href="/booking"
        className="inline-flex items-center justify-center gap-1.5 h-12 px-5 rounded-[var(--radius-md)] bg-[var(--color-cta)] text-[var(--color-cta-fg)] text-sm font-semibold hover:bg-[var(--color-cta-hover)] transition-colors"
      >
        Book now
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
