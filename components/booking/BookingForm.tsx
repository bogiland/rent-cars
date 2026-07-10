"use client"; // form state + redirect

import { useMemo, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { brand, locations } from "@/lib/content";
import type { Car } from "@/lib/types";

interface Props {
  cars: Car[];
  initialCarSlug?: string;
}

export function BookingForm({ cars, initialCarSlug }: Props) {
  const today = new Date().toISOString().split("T")[0]!;
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]!;

  const [carSlug, setCarSlug] = useState(initialCarSlug ?? "");
  const [location, setLocation] = useState(locations[0]?.id ?? "");
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(tomorrow);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const selectedCar = cars.find((c) => c.slug === carSlug);

  const message = useMemo(() => {
    const loc = locations.find((l) => l.id === location)?.label ?? location;
    const carText = selectedCar
      ? `${selectedCar.brand} ${selectedCar.model} ${selectedCar.year} (€${selectedCar.pricePerDay}/day)`
      : "Any car";
    return [
      `Hi Apex Auto! I'd like to book a car.`,
      ``,
      `• Car: ${carText}`,
      `• Pickup: ${loc}`,
      `• Dates: ${from} → ${to}`,
      name ? `• Name: ${name}` : "",
      phone ? `• Phone: ${phone}` : "",
    ].filter(Boolean).join("\n");
  }, [selectedCar, location, from, to, name, phone]);

  const waHref = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(message)}`;
  const callHref = `tel:${brand.phone}`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.open(waHref, "_blank", "noopener,noreferrer");
      }}
      className="bg-(--color-surface) border border-(--color-border) rounded-xl p-6 md:p-8 shadow-(--shadow-card)"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Car */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-widest text-(--color-fg-muted)">Car</span>
          <select
            value={carSlug}
            onChange={(e) => setCarSlug(e.target.value)}
            className="h-12 px-3 rounded-md bg-(--color-surface) border border-(--color-border-strong) text-base focus:outline-none focus:border-(--color-accent)"
          >
            <option value="">Pick any available car</option>
            {cars.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.brand} {c.model} {c.year} — €{c.pricePerDay}/day
              </option>
            ))}
          </select>
        </label>

        {/* Location */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-widest text-(--color-fg-muted)">Pickup</span>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-12 px-3 rounded-md bg-(--color-surface) border border-(--color-border-strong) text-base focus:outline-none focus:border-(--color-accent)"
          >
            {locations.map((l) => (
              <option key={l.id} value={l.id}>{l.label}{l.free ? " — Free" : ""}</option>
            ))}
          </select>
        </label>

        {/* Pick-up */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-widest text-(--color-fg-muted)">Pick-up date</span>
          <input
            type="date"
            value={from}
            min={today}
            onChange={(e) => setFrom(e.target.value)}
            required
            className="h-12 px-3 rounded-md bg-(--color-surface) border border-(--color-border-strong) text-base focus:outline-none focus:border-(--color-accent)"
          />
        </label>

        {/* Return */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-widest text-(--color-fg-muted)">Return date</span>
          <input
            type="date"
            value={to}
            min={from}
            onChange={(e) => setTo(e.target.value)}
            required
            className="h-12 px-3 rounded-md bg-(--color-surface) border border-(--color-border-strong) text-base focus:outline-none focus:border-(--color-accent)"
          />
        </label>

        {/* Name */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-widest text-(--color-fg-muted)">Your name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
            required
            className="h-12 px-3 rounded-md bg-(--color-surface) border border-(--color-border-strong) text-base focus:outline-none focus:border-(--color-accent)"
          />
        </label>

        {/* Phone */}
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-widest text-(--color-fg-muted)">Phone</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+357 ..."
            required
            className="h-12 px-3 rounded-md bg-(--color-surface) border border-(--color-border-strong) text-base focus:outline-none focus:border-(--color-accent)"
          />
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          className="w-full flex-1 inline-flex items-center justify-center gap-2 h-14 rounded-md bg-(--color-cta) text-(--color-cta-fg) text-[15px] font-semibold hover:bg-(--color-cta-hover) transition-colors"
        >
          <MessageCircle size={18} />
          Send via WhatsApp
        </button>
        <a
          href={callHref}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-6 rounded-md border border-(--color-border-strong) text-[15px] font-semibold hover:bg-(--color-surface-2) transition-colors"
        >
          <Phone size={18} />
          Call instead
        </a>
      </div>

      <p className="text-xs text-(--color-fg-dim) mt-4 text-center">
        We'll confirm your booking within 15 minutes. No payment required upfront.
      </p>
    </form>
  );
}
