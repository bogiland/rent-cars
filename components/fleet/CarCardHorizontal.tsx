"use client"; // hover gallery zones + photo index state

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Camera,
  CircleCheck,
  Flame,
  Gauge,
  Gem,
  Grid2x2,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import {
  brand,
  getCarOrigin,
  getCarPreviewGallery,
  getMonthlyPrice,
  getOldPrice,
} from "@/lib/content";
import { useAuth } from "@/components/layout/AuthProvider";
import type { Car } from "@/lib/types";
import { cn } from "@/lib/utils";

const BENEFITS = "1 day rental available · Rent with Crypto · Insurance included";
const PHOTO_COUNT = 4;

export function CarCardHorizontal({ car, premium = true }: { car: Car; premium?: boolean }) {
  const { isFavorite, toggleFavorite } = useAuth();
  const liked = isFavorite(car.slug);
  const [photo, setPhoto] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const gallery = useMemo(() => getCarPreviewGallery(car).slice(0, PHOTO_COUNT), [car]);
  const isLastPhoto = photo === PHOTO_COUNT - 1;
  const currentPhoto = gallery[photo] ?? gallery[0] ?? "/cars/placeholder.svg";
  const old = getOldPrice(car.pricePerDay);
  const monthly = getMonthlyPrice(car.pricePerDay);
  const oldMonthly = getOldPrice(monthly);

  const callHref = `tel:${brand.phone.replace(/\s/g, "")}`;
  const waHref = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
    `Hi! I'd like to rent the ${car.brand} ${car.model} ${car.year}.`
  )}`;

  const goToPhoto = (index: number) => {
    setPhoto(index);
    setShowGrid(index === PHOTO_COUNT - 1);
  };

  return (
    <article className="group grid overflow-hidden rounded-[9px] border border-[var(--color-border)] bg-white transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] lg:grid-cols-[370px_1fr]">
      <div
        className="relative aspect-[16/9] min-h-[150px] bg-[var(--color-surface-2)] lg:aspect-auto lg:min-h-[210px]"
        onMouseLeave={() => setShowGrid(false)}
      >
        {/* Hover zones — move across image to switch photos (OCD-style); each
            zone is also a link so clicking the photo opens the car's page. */}
        <div className="absolute inset-0 z-10 flex" aria-hidden>
          {gallery.map((_, index) => (
            <Link
              key={index}
              href={`/rent-a-car-cyprus/${car.slug}`}
              tabIndex={-1}
              aria-hidden
              className="h-full flex-1"
              onMouseEnter={() => goToPhoto(index)}
            />
          ))}
        </div>

        <Link href={`/rent-a-car-cyprus/${car.slug}`} className="absolute inset-0 z-0" aria-label={`${car.brand} ${car.model}`}>
          {!showGrid ? (
            <Image
              key={currentPhoto}
              src={currentPhoto}
              alt={`${car.brand} ${car.model} ${car.year} photo ${photo + 1}`}
              fill
              sizes="(min-width:1024px) 370px, (min-width:768px) 50vw, 100vw"
              className="object-cover transition-opacity duration-200"
            />
          ) : (
            /* 4th photo — mini grid preview like OneClickDrive interior/collage */
            <div className="grid h-full grid-cols-2 grid-rows-2 gap-0.5 bg-black/20">
              {gallery.map((src, i) => (
                <div key={src} className="relative overflow-hidden">
                  <Image
                    src={src}
                    alt={`${car.brand} ${car.model} preview ${i + 1}`}
                    fill
                    sizes="185px"
                    className="object-cover"
                  />
                </div>
              ))}
              <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[var(--color-fg)] shadow-sm">
                  <Grid2x2 size={13} /> Show all photos
                </span>
              </span>
            </div>
          )}
        </Link>

        {premium && (
          <span className="pointer-events-none absolute left-3 top-3 z-20 inline-flex h-6 items-center gap-1 rounded-full bg-white px-2.5 text-[10px] font-bold uppercase text-[#7d42e8] shadow-sm">
            <Gem size={11} /> Premium
          </span>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            toggleFavorite(car.slug);
          }}
          aria-label={liked ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={liked}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[var(--color-fg-muted)] shadow-sm"
        >
          <Heart size={14} className={liked ? "fill-[var(--color-accent)] text-[var(--color-accent)]" : ""} />
        </button>

        {/* No arrows — desktop switches via hover zones, mobile via the tap
            targets on the progress bars below (OCD-style, uncluttered image). */}

        {/* Progress bars — hover/tap switches photo */}
        <div className="pointer-events-none absolute bottom-2.5 left-3 right-3 z-20 flex items-center gap-1.5">
          <div className="pointer-events-auto flex flex-1 items-center gap-1.5">
            {gallery.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToPhoto(index)}
                onMouseEnter={() => goToPhoto(index)}
                onFocus={() => goToPhoto(index)}
                aria-label={`Show photo ${index + 1}`}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-150",
                  photo === index ? "bg-white" : "bg-white/45 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        </div>

        <span className="pointer-events-none absolute bottom-6 right-3 z-20 inline-flex items-center gap-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          <Camera size={11} /> {photo + 1}/{gallery.length}
          {isLastPhoto && !showGrid && (
            <span className="ml-0.5 hidden sm:inline">· hover for grid</span>
          )}
        </span>
      </div>

      <div className="grid gap-2.5 p-3 lg:grid-cols-[minmax(0,1fr)_190px] lg:p-4">
        <div className="min-w-0">
          <Link href={`/rent-a-car-cyprus/${car.slug}`} className="group/title">
            <h3 className="text-base font-semibold leading-snug tracking-[0] text-[var(--color-fg)] group-hover/title:text-[var(--color-accent)]">
              {car.brand} {car.model} {car.year}
            </h3>
          </Link>

          <ul className="mt-1.5 flex flex-wrap gap-1.5" role="list">
            <Spec icon={<CalendarDays size={12} />} label={String(car.year)} />
            <Spec label={car.category.replace(" Premium", "")} />
            <Spec label={getCarOrigin(car)} />
          </ul>

          <p className="mt-2 flex items-start gap-1.5 text-xs leading-snug text-[var(--color-fg-muted)]">
            <CircleCheck size={13} className="mt-0.5 shrink-0 text-[var(--color-success)]" />
            {BENEFITS}
          </p>

          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]">
            <MapPin size={13} /> Nicosia, Cyprus
          </p>
        </div>

        <div className="flex flex-col justify-between gap-2 lg:text-right">
          <div>
            {car.featured && (
              <span className="mb-1 inline-flex h-5 items-center gap-1 rounded-full bg-[var(--color-danger)]/10 px-2 text-[10px] font-bold uppercase text-[var(--color-danger)]">
                <Flame size={11} fill="currentColor" /> Hot Deal
              </span>
            )}
            <p className="flex items-baseline gap-1.5 lg:justify-end">
              <span className="text-[11px] text-[var(--color-fg-dim)] line-through">EUR {old}</span>
              <span className="text-lg font-bold leading-tight text-[var(--color-accent)]">
                EUR {car.pricePerDay} <span className="text-xs font-normal text-[var(--color-fg-muted)]">/ day</span>
              </span>
            </p>
            <p className="flex items-center gap-1 text-[11px] text-[var(--color-fg-muted)] lg:justify-end">
              <Gauge size={11} /> {brand.policies.dailyKmLimit} km/day
            </p>
            <p className="mt-1.5 flex items-baseline gap-1.5 lg:justify-end">
              <span className="text-[11px] text-[var(--color-fg-dim)] line-through">
                EUR {oldMonthly.toLocaleString("en-US")}
              </span>
              <span className="text-base font-bold leading-tight text-[var(--color-accent)]">
                EUR {monthly.toLocaleString("en-US")}{" "}
                <span className="text-xs font-normal text-[var(--color-fg-muted)]">/ month</span>
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:col-span-2">
          <a
            href={callHref}
            aria-label={`Call about ${car.brand} ${car.model}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] border border-[var(--color-call)] text-sm font-semibold text-[var(--color-call)] transition-colors hover:bg-[var(--color-call)] hover:text-white"
          >
            <Phone size={14} />
            Call
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp about ${car.brand} ${car.model}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] border border-[var(--color-whatsapp)] text-sm font-semibold text-[var(--color-whatsapp-fg)] transition-colors hover:bg-[var(--color-whatsapp)] hover:text-white"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

function Spec({ icon, label }: { icon?: React.ReactNode; label: string }) {
  return (
    <li className="inline-flex h-6 items-center gap-1 rounded-full border border-[var(--color-border)] bg-white px-2.5 text-[11px] text-[var(--color-fg-muted)]">
      {icon}
      {label}
    </li>
  );
}
