"use client"; // save toggle + native share

import { useState } from "react";
import { Heart, Share2, Check } from "lucide-react";
import { useAuth } from "@/components/layout/AuthProvider";
import type { Car } from "@/lib/types";

/** OCD-style save + share controls in the detail-page title row. */
export function CarActions({ car }: { car: Car }) {
  const { isFavorite, toggleFavorite } = useAuth();
  const saved = isFavorite(car.slug);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const title = `Rent ${car.brand} ${car.model} ${car.year}`;
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={share}
        aria-label="Share this car"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-strong)] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
      >
        {copied ? <Check size={16} className="text-[var(--color-success)]" /> : <Share2 size={16} />}
      </button>
      <button
        type="button"
        onClick={() => toggleFavorite(car.slug)}
        aria-pressed={saved}
        aria-label={saved ? "Remove from saved" : "Save this car"}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border-strong)] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
      >
        <Heart
          size={16}
          className={saved ? "text-[var(--color-accent)]" : ""}
          fill={saved ? "var(--color-accent)" : "none"}
        />
      </button>
    </div>
  );
}
