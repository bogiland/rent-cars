import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  CircleCheck,
  MapPin,
  Clock,
  ChevronDown,
  Gauge,
  Fuel,
  Landmark,
  FileText,
  Star,
  BadgeCheck,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyBookBar } from "@/components/layout/StickyBookBar";
import { CarCard } from "@/components/fleet/CarCard";
import { CarGallery } from "@/components/fleet/CarGallery";
import {
  brand,
  cars,
  faq,
  getCarBySlug,
  getCarFullGallery,
  getCarPreviewGallery,
  getDeposit,
  getMonthlyPrice,
  getOldPrice,
  getWeeklyPrice,
} from "@/lib/content";
import { CarActions } from "@/components/fleet/CarActions";

/** Prepared video slots (up to 4): drop public/cars/<slug>/video.mp4, video2.mp4 … */
function getCarVideos(slug: string): string[] {
  const found: string[] = [];
  const names = ["video", "video2", "video3", "video4"];
  for (const name of names) {
    for (const ext of ["mp4", "webm"]) {
      const rel = `/cars/${slug}/${name}.${ext}`;
      if (fs.existsSync(path.join(process.cwd(), "public", rel))) {
        found.push(rel);
        break;
      }
    }
  }
  return found.slice(0, 4);
}

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) return { title: "Car not found" };
  return {
    title: `Rent ${car.brand} ${car.model} ${car.year} in Nicosia — from €${car.pricePerDay}/day`,
    description: `Rent ${car.brand} ${car.model} ${car.year} in Nicosia, Cyprus. €${car.pricePerDay}/day, free delivery, full insurance.`,
  };
}

const SAFETY = ["ABS", "Airbags", "ISOFIX", "Cruise Control", "Parking Sensors"];
const COMFORT = ["Climate Control", "Keyless Entry", "Apple CarPlay / Android Auto", "Bluetooth", "USB Charging"];

export default async function CarDetailPage({ params }: Params) {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) notFound();

  const gallery = getCarPreviewGallery(car);
  const fullGallery = getCarFullGallery(car);
  const videoUrls = getCarVideos(car.slug);
  const old = getOldPrice(car.pricePerDay);
  const weekly = getWeeklyPrice(car.pricePerDay);
  const oldWeekly = getOldPrice(weekly);
  const monthly = getMonthlyPrice(car.pricePerDay);
  const oldMonthly = getOldPrice(monthly);
  const deposit = getDeposit(car);
  const doors = car.category === "Sedan" ? 4 : 5;
  const bags = car.seats >= 5 ? 3 : 2;
  const similar = cars.filter((c) => c.category === car.category && c.slug !== car.slug).slice(0, 5);

  const callHref = `tel:${brand.phone.replace(/\s/g, "")}`;
  const waHref = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(
    `Hi! I'd like to rent the ${car.brand} ${car.model} ${car.year}.`
  )}`;

  const OVERVIEW: Array<[string, string | number]> = [
    ["Body Type", car.category],
    ["Make", car.brand],
    ["Model", car.model],
    ["Gearbox", car.transmission],
    ["Seating Capacity", `${car.seats} passengers`],
    ["No. of Doors", doors],
    ["Fits No. of Bags", bags],
    ["Fuel Type", car.fuel],
    ["Power", `${car.power} hp`],
    ["Year", car.year],
  ];

  const PRICING = [
    { label: "/ day", price: car.pricePerDay, oldPrice: old, active: true },
    { label: "/ week", price: weekly, oldPrice: oldWeekly, active: false },
    { label: "/ month", price: monthly, oldPrice: oldMonthly, active: false },
  ];

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="pt-24 md:pt-32 pb-16">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-fg-muted)]" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--color-fg)]">Home</Link>
            <span aria-hidden>›</span>
            <Link href="/rent-a-car-cyprus" className="hover:text-[var(--color-fg)]">Nicosia</Link>
            <span aria-hidden>›</span>
            <Link href={`/rent-a-car-cyprus?cat=${encodeURIComponent(car.category)}`} className="hover:text-[var(--color-fg)]">{car.category}</Link>
            <span aria-hidden>›</span>
            <span className="text-[var(--color-fg)]">{car.brand} {car.model} {car.year}</span>
          </nav>

          {/* Title row — brand chip + save/share, OCD-style */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-[-0.01em]">
              Rent {car.brand} {car.model} {car.year} in Nicosia
            </h1>
            <CarActions car={car} />
          </div>

          {/* Gallery — mosaic that opens a lightbox (all photos + prepared video slots) */}
          <CarGallery
            images={gallery}
            lightboxImages={fullGallery}
            alt={`${car.brand} ${car.model} ${car.year}`}
            videoUrls={videoUrls}
            callHref={callHref}
            waHref={waHref}
          />

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* ── Left column. order-2 on mobile so the booking card comes FIRST on phones ── */}
            <div className="order-2 min-w-0 lg:order-1">
              {/* Meta row */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="flex items-center gap-1.5 text-sm text-[var(--color-fg-muted)]">
                    <MapPin size={13} className="text-[var(--color-accent)]" /> Nicosia, Cyprus
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-fg-dim)]">
                    <Clock size={12} /> Updated this week
                  </p>
                </div>
                <ul className="flex gap-1.5" role="list">
                  {[String(car.year), car.category, car.transmission].map((chip) => (
                    <li key={chip} className="rounded-[var(--radius-sm)] border border-[var(--color-border)] px-2.5 py-1 text-xs text-[var(--color-fg-muted)]">
                      {chip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* PRICING */}
              <section aria-labelledby="pricing-h" className="mb-8">
                <h2 id="pricing-h" className="mb-3 border-b border-[var(--color-border)] pb-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-fg)]">
                  Pricing
                </h2>
                <div className="overflow-hidden rounded-[12px] border border-[var(--color-border)]">
                  <div className="grid grid-cols-3 divide-x divide-[var(--color-border)] bg-[var(--color-surface-2)]">
                    {PRICING.map((p) => (
                      <div key={p.label} className={"px-4 py-4 text-center " + (p.active ? "bg-white" : "")}>
                        <p className="text-xs text-[var(--color-fg-dim)] line-through">EUR {p.oldPrice.toLocaleString("en-US")}</p>
                        <p className="text-lg font-bold text-[var(--color-accent)]">EUR {p.price.toLocaleString("en-US")}</p>
                        <p className="text-xs text-[var(--color-fg-muted)]">{p.label}</p>
                      </div>
                    ))}
                  </div>
                  <dl className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)] text-sm">
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <dt className="text-[var(--color-fg-muted)]">Included mileage limit</dt>
                      <dd className="font-medium">{brand.policies.dailyKmLimit} km / day</dd>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <dt className="text-[var(--color-fg-muted)]">Additional mileage charge</dt>
                      <dd className="font-medium">EUR 0.20 / km</dd>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2.5">
                      <dt className="text-[var(--color-fg-muted)]">Security deposit</dt>
                      <dd className="font-medium">EUR {deposit}</dd>
                    </div>
                  </dl>
                  <div className="flex flex-wrap gap-x-6 gap-y-1.5 border-t border-[var(--color-border)] px-4 py-3">
                    <span className="flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]">
                      <CircleCheck size={13} className="text-[var(--color-success)]" /> Minimum 1 day rental
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]">
                      <CircleCheck size={13} className="text-[var(--color-success)]" /> Insurance included
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]">
                      <CircleCheck size={13} className="text-[var(--color-success)]" /> Free Nicosia delivery
                    </span>
                  </div>
                </div>
              </section>

              {/* CAR OVERVIEW */}
              <section aria-labelledby="overview-h" className="mb-8">
                <h2 id="overview-h" className="mb-3 border-b border-[var(--color-border)] pb-2 text-sm font-semibold uppercase tracking-[0.12em]">
                  Car Overview
                </h2>
                <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                  {OVERVIEW.map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between border-b border-[var(--color-border)] py-2.5 text-sm">
                      <dt className="text-[var(--color-fg-muted)]">{k}</dt>
                      <dd className="font-medium text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              {/* FEATURES & SPECS — native <details> accordions, zero JS */}
              <section aria-labelledby="features-h" className="mb-8">
                <h2 id="features-h" className="mb-3 border-b border-[var(--color-border)] pb-2 text-sm font-semibold uppercase tracking-[0.12em]">
                  Features &amp; Specs
                </h2>
                {[
                  { title: "Included features", items: car.features, open: true },
                  { title: "Safety features", items: SAFETY, open: false },
                  { title: "Comfort & Convenience", items: COMFORT, open: false },
                ].map((group) => (
                  <details key={group.title} open={group.open} className="group border-b border-[var(--color-border)]">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
                      {group.title}
                      <ChevronDown size={15} className="text-[var(--color-fg-dim)] transition-transform group-open:rotate-180" />
                    </summary>
                    <ul className="flex flex-wrap gap-x-6 gap-y-2 pb-4" role="list">
                      {group.items.map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-sm text-[var(--color-fg-muted)]">
                          <CircleCheck size={13} className="shrink-0 text-[var(--color-success)]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </section>

              {/* DESCRIPTION */}
              <section aria-labelledby="desc-h" className="mb-8">
                <h2 id="desc-h" className="mb-3 border-b border-[var(--color-border)] pb-2 text-sm font-semibold uppercase tracking-[0.12em]">
                  Description &amp; Highlights
                </h2>
                <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  Rent and drive this {car.brand} {car.model} {car.year} in Nicosia, Cyprus for
                  EUR {car.pricePerDay}/day or EUR {monthly.toLocaleString("en-US")}/month. The rate includes full
                  insurance and a standard mileage limit of {brand.policies.dailyKmLimit} km/day
                  (EUR 0.20 per additional km). A security deposit of EUR {deposit} is required,
                  fully refunded within 24 hours of return. Free delivery anywhere in Nicosia and
                  at Larnaca Airport (LCA). This car has {doors} doors and seats up to {car.seats} passengers.
                  Contact {brand.name} directly for bookings and inquiries.
                </p>
              </section>

              {/* Requirements + FAQ */}
              <section aria-labelledby="req-h" className="mb-2">
                <details className="group border-b border-[var(--color-border)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold uppercase tracking-[0.12em] [&::-webkit-details-marker]:hidden">
                    Requirements to rent this car
                    <ChevronDown size={15} className="text-[var(--color-fg-dim)] transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="space-y-2 pb-4" role="list">
                    {[
                      `Driver age ${brand.policies.minAge}+ with ${brand.policies.minLicenseYears}+ years of driving experience`,
                      "Valid passport or national ID",
                      "Valid driver's license (international licenses accepted)",
                      `Credit or debit card for the EUR ${deposit} deposit`,
                    ].map((r) => (
                      <li key={r} className="flex items-center gap-1.5 text-sm text-[var(--color-fg-muted)]">
                        <CircleCheck size={13} className="shrink-0 text-[var(--color-success)]" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </details>
                <details className="group border-b border-[var(--color-border)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold uppercase tracking-[0.12em] [&::-webkit-details-marker]:hidden">
                    Frequently asked questions
                    <ChevronDown size={15} className="text-[var(--color-fg-dim)] transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="space-y-4 pb-4">
                    {faq.slice(0, 4).map((f) => (
                      <div key={f.id}>
                        <p className="text-sm font-medium">{f.q}</p>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--color-fg-muted)]">{f.a}</p>
                      </div>
                    ))}
                  </div>
                </details>
              </section>
            </div>

            {/* ── Right column — dealer card. order-1 on mobile: booking above content ── */}
            <aside className="order-1 self-start lg:order-2 lg:sticky lg:top-32">
              <div className="overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-white">
                {/* Dealer identity — avatar, name, rating, trips, open status */}
                <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-5 py-4">
                  <div
                    className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-[#151515] text-white ring-2 ring-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                    aria-hidden
                  >
                    <span className="text-xl font-extrabold tracking-[-0.04em]">
                      A<span className="text-[var(--color-accent)]">A</span>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-base font-bold tracking-[-0.01em] text-[var(--color-fg)]">
                        {brand.name}
                      </p>
                      <BadgeCheck size={15} className="shrink-0 text-[var(--color-accent)]" aria-label="Verified dealer" />
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                      <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-fg)]">
                        <Star size={12} className="fill-[var(--color-star)] text-[var(--color-star)]" />
                        4.8<span className="font-normal text-[var(--color-fg-muted)]">/5</span>
                      </span>
                      <span className="text-[var(--color-fg-dim)]">·</span>
                      <span className="text-[var(--color-fg-muted)]">600+ trips</span>
                    </div>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]">
                      <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
                      Open Now · Nicosia
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-4 flex items-baseline justify-center gap-2">
                    <span className="text-sm text-[var(--color-fg-dim)] line-through">€{old}</span>
                    <span className="text-2xl font-bold text-[var(--color-accent)]">€{car.pricePerDay}</span>
                    <span className="text-sm text-[var(--color-fg-muted)]">/day</span>
                  </div>

                  <p className="mb-3 text-center text-xs font-medium text-[var(--color-fg-muted)]">
                    Book Directly from {brand.name}
                  </p>

                  <Link
                    href={`/booking?car=${car.slug}`}
                    className="mb-2 inline-flex h-12 w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-cta)] text-base font-semibold text-[var(--color-cta-fg)] transition-colors hover:bg-[var(--color-cta-hover)]"
                  >
                    Book this car
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    <a href={callHref} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-call)] text-sm font-semibold text-[var(--color-call)] transition-colors hover:bg-[var(--color-call)] hover:text-white">
                      <Phone size={14} /> Call
                    </a>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-whatsapp)] text-sm font-semibold text-[var(--color-whatsapp-fg)] transition-colors hover:bg-[var(--color-whatsapp)] hover:text-white"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  </div>

                  <p className="mt-4 rounded-[var(--radius-md)] bg-[var(--color-surface-2)] p-3 text-xs leading-relaxed text-[var(--color-fg-muted)]">
                    <span className="font-semibold text-[var(--color-fg)]">Note:</span> Free delivery in Nicosia
                    &amp; Larnaca Airport. Deposit EUR {deposit}, refunded same day. Free cancellation up to 24h.
                  </p>
                </div>

                {/* Rental terms mini-grid */}
                <div className="border-t border-[var(--color-border)] p-5">
                  <p className="mb-3 text-sm font-semibold">Rental Terms</p>
                  <ul className="grid grid-cols-2 gap-2.5" role="list">
                    {[
                      { icon: Gauge, label: "Mileage Policy" },
                      { icon: Fuel, label: "Fuel Policy" },
                      { icon: Landmark, label: "Deposit Policy" },
                      { icon: FileText, label: "Rental Policy" },
                    ].map(({ icon: Icon, label }) => (
                      <li key={label} className="flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]">
                        <Icon size={13} className="shrink-0" /> {label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>

          {/* Recommended */}
          {similar.length > 0 && (
            <section className="mt-14 border-t border-[var(--color-border)] pt-8" aria-labelledby="rec-h">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 id="rec-h" className="text-xl md:text-2xl font-semibold tracking-[-0.01em]">
                  Recommended Car Rentals
                </h2>
                <Link
                  href="/rent-a-car-cyprus"
                  className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-accent)] px-4 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent-soft)]"
                >
                  View More →
                </Link>
              </div>
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5" role="list">
                {similar.map((c) => (
                  <li key={c.slug} className="h-full">
                    <CarCard car={c} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <StickyBookBar heroId="main" />
    </>
  );
}
