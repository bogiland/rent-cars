"use client"; // heart toggle = shared auth/favorites state

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Phone, MessageCircle, Gauge, BadgeCheck, Flame } from "lucide-react";
import {
  brand,
  getCarPreviewGallery,
  getOldPrice,
  getMonthlyPrice,
} from "@/lib/content";
import { useAuth } from "@/components/layout/AuthProvider";
import { cn } from "@/lib/utils";
import type { Car } from "@/lib/types";

interface CarCardProps {
  car: Car;
  /** Show the monthly rate line (day + month). Default on — matches spec. */
  showMonthly?: boolean;
  /** Sizes hint for next/image across layouts (grid vs carousel). */
  sizes?: string;
}

export function CarCard({
  car,
  showMonthly = true,
  sizes = "(max-width: 640px) 90vw, 310px",
}: CarCardProps) {
  const { isFavorite, toggleFavorite } = useAuth();
  const liked = isFavorite(car.slug);

  // Hover across the photo (left→right) to preview the car's other shots,
  // matching the horizontal listing cards.
  const gallery = useMemo(() => getCarPreviewGallery(car), [car]);
  const [photo, setPhoto] = useState(0);
  const currentPhoto = gallery[photo] ?? gallery[0] ?? "/cars/placeholder.svg";
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gallery.length < 2) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const idx = Math.min(gallery.length - 1, Math.max(0, Math.floor(ratio * gallery.length)));
    setPhoto(idx);
  };

  const oldPrice = getOldPrice(car.pricePerDay);
  const monthly = getMonthlyPrice(car.pricePerDay);
  const cur = brand.currencySymbol;

  const callHref = `tel:${brand.phone.replace(/\s/g, "")}`;
  const waHref = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
    `Hi! I'd like to rent the ${car.brand} ${car.model} ${car.year}.`
  )}`;

  return (
    <article className="group flex h-full w-full max-w-[310px] flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-[transform,border-color,box-shadow] duration-[var(--dur-fast)] ease-[var(--ease-premium)] hover:-translate-y-1 hover:border-[var(--color-accent-bright)] hover:shadow-[var(--shadow-card-hover)]">
      {/* Photo — 3:2, top corners follow the card via overflow-hidden.
          Move the mouse left→right to browse the car's other photos. */}
      <div
        className="relative aspect-[3/2] overflow-hidden bg-[var(--color-surface-2)]"
        onMouseMove={onMove}
        onMouseLeave={() => setPhoto(0)}
      >
        <Link
          href={`/rent-a-car-cyprus/${car.slug}`}
          className="absolute inset-0"
          aria-label={`${car.brand} ${car.model} ${car.year}`}
        >
          <Image
            key={currentPhoto}
            src={currentPhoto}
            alt={`${car.brand} ${car.model} ${car.year} — rent in Nicosia`}
            fill
            sizes={sizes}
            className="object-cover"
          />
        </Link>

        {gallery.length > 1 && (
          <div className="pointer-events-none absolute inset-x-3 bottom-2.5 z-10 flex gap-1">
            {gallery.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-0.5 flex-1 rounded-full transition-colors",
                  photo === i ? "bg-white" : "bg-white/45"
                )}
              />
            ))}
          </div>
        )}

        {car.featured && (
          <span className="pointer-events-none absolute left-3 top-3 z-10 inline-flex h-6 items-center gap-1 rounded-full bg-white px-2.5 text-[10px] font-bold uppercase text-[var(--color-danger)] shadow-sm">
            <Flame size={11} fill="currentColor" /> Hot Deal
          </span>
        )}

        {/* Heart badge — white circle, chip border, bright-orange icon only */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(car.slug);
          }}
          aria-label={liked ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={liked}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-border-strong)] bg-white transition-transform duration-[var(--dur-fast)] ease-[var(--ease-premium)] hover:scale-105"
        >
          <Heart
            size={15}
            className={liked ? "text-[var(--color-accent)]" : "text-[var(--color-fg-muted)]"}
            fill={liked ? "var(--color-accent)" : "none"}
          />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2.5 p-[15px]">
        {/* Name — black, accent only on hover */}
        <Link href={`/rent-a-car-cyprus/${car.slug}`} className="min-w-0">
          <h3 className="truncate text-lg font-semibold leading-tight text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors">
            {car.brand} {car.model}{" "}
            <span className="font-normal text-[var(--color-fg-muted)]">
              {car.year}
            </span>
          </h3>
        </Link>

        {/* Price — struck old + accent new (day), month secondary */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-baseline gap-2">
            <span className="tnum text-sm font-normal text-[var(--color-fg-dim)] line-through">
              {cur}
              {oldPrice}
            </span>
            <span className="tnum text-lg font-semibold leading-none tracking-[0.5px] text-[var(--color-accent)]">
              {cur}
              {car.pricePerDay}
              <span className="text-xs font-normal text-[var(--color-fg-dim)]">
                {" "}
                /day
              </span>
            </span>
          </div>
          {showMonthly && (
            <span className="tnum text-xs text-[var(--color-fg-muted)]">
              {cur}
              {monthly.toLocaleString("en-US")}
              <span className="text-[var(--color-fg-dim)]"> /mo.</span>
            </span>
          )}
        </div>

        {/* Spec line — quiet, no accent noise */}
        <p className="flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]">
          <Gauge size={13} className="shrink-0" />
          {brand.policies.dailyKmLimit} km/day · {car.transmission}
        </p>

        {/* Trust row — muted, single accentless line (OCD keeps cards calm) */}
        <div className="flex items-center gap-2 text-[11px] text-[var(--color-fg-muted)]">
          <span className="inline-flex items-center gap-1">
            <BadgeCheck size={13} className="shrink-0 text-[var(--color-success)]" />
            Insurance included
          </span>
        </div>

        {/* Contact CTAs — OCD-style outlined: violet Call, green WhatsApp */}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
          <a
            href={callHref}
            aria-label={`Call about ${car.brand} ${car.model}`}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-call)] text-[13px] font-semibold text-[var(--color-call)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--color-call)] hover:text-white"
          >
            <Phone size={14} className="shrink-0" />
            Call
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp about ${car.brand} ${car.model}`}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-whatsapp)] text-[13px] font-semibold text-[var(--color-whatsapp-fg)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--color-whatsapp)] hover:text-white"
          >
            <MessageCircle size={14} className="shrink-0" />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
