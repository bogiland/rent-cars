import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cars as allCars } from "@/lib/content";
import { CarCard } from "@/components/fleet/CarCard";

export function FeaturedFleet() {
  const affordable = [...allCars].sort((a, b) => a.pricePerDay - b.pricePerDay).slice(0, 8);
  const luxury = [...allCars]
    .filter((car) => ["Luxury", "Supercars", "SUV Premium", "Sports"].includes(car.category))
    .slice(0, 8);

  return (
    <>
      <CarRow
        id="affordable-heading"
        title="Affordable Car Rental Cyprus"
        description="Enjoy budget-friendly car rentals starting from EUR 30/day with direct booking and clear rates."
        href="/rent-a-car-cyprus"
        cars={affordable}
      />

      <div className="container py-5 md:py-6">
        <Link
          href="/booking"
          className="relative mx-auto flex min-h-[110px] max-w-[970px] overflow-hidden rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface-2)]"
        >
          <Image
            src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1600&q=85&auto=format&fit=crop"
            alt=""
            fill
            sizes="(min-width: 768px) 970px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.96),rgba(255,255,255,0.78),rgba(255,255,255,0.3))]" />
          <div className="relative z-10 flex flex-col justify-center px-6 py-5 md:px-10">
            <p className="text-xl font-bold text-[var(--color-fg)] md:text-2xl">Lease for 6 Months</p>
            <p className="mt-1 max-w-xl text-sm font-medium text-[var(--color-fg-muted)]">
              BMW, Mercedes, Kia and Hyundai rentals with full insurance and airport delivery.
            </p>
            <span className="mt-3 inline-flex h-9 w-fit items-center rounded-[6px] bg-[var(--color-accent)] px-4 text-sm font-semibold text-white">
              Book Now
            </span>
          </div>
        </Link>
      </div>

      <CarRow
        id="luxury-heading"
        title="Luxury & Sports Cars"
        description="Drive in style with premium SUVs, sports cars and high-end models for business trips or special days."
        href="/rent-a-car-cyprus?cat=Luxury"
        cars={luxury}
      />
    </>
  );
}

function CarRow({
  id,
  title,
  description,
  href,
  cars,
}: {
  id: string;
  title: string;
  description: string;
  href: string;
  cars: typeof allCars;
}) {
  return (
    <section className="py-8 md:py-10" aria-labelledby={id}>
      <div className="container">
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-dashed border-[var(--color-border)] pb-3">
          <div>
            <h2 id={id} className="text-[clamp(1.25rem,1.05rem+0.55vw,1.55rem)] font-semibold tracking-[0] text-[var(--color-fg)]">
              {title}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{description}</p>
          </div>
          <Link
            href={href}
            className="hidden h-9 items-center justify-center gap-1.5 rounded-[6px] bg-[var(--color-cta)] px-4 text-sm font-semibold text-[var(--color-cta-fg)] transition-colors hover:bg-[var(--color-cta-hover)] sm:inline-flex"
          >
            View Offers
            <ArrowRight size={14} />
          </Link>
        </div>

        <ul className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-2" role="list">
          {cars.map((car) => (
            <li key={`${id}-${car.slug}`} className="w-[80%] shrink-0 snap-start md:w-[58%] lg:w-[285px]">
              <CarCard car={car} sizes="(min-width:1024px) 285px, (min-width:768px) 58vw, 80vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
