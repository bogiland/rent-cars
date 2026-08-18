import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedCars } from "@/lib/content";
import { CarCard } from "@/components/fleet/CarCard";

export function RecommendedCars() {
  const cars = getFeaturedCars(8);

  return (
    <section className="py-8 md:py-10" aria-labelledby="recommended-heading">
      <div className="container">
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-dashed border-[var(--color-border)] pb-3">
          <div>
            <h2
              id="recommended-heading"
              className="text-[clamp(1.25rem,1.05rem+0.55vw,1.55rem)] font-semibold tracking-[0] text-[var(--color-fg)]"
            >
              Recommended Cars Just for You
            </h2>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
              Still looking for the perfect ride? Here are some personalized
              recommendations from our Cyprus fleet.
            </p>
          </div>
          <Link
            href="/rent-a-car-cyprus"
            className="hidden h-9 items-center justify-center gap-1.5 rounded-[6px] bg-[var(--color-cta)] px-4 text-sm font-semibold text-[var(--color-cta-fg)] transition-colors hover:bg-[var(--color-cta-hover)] sm:inline-flex"
          >
            View Offers
            <ArrowRight size={14} />
          </Link>
        </div>

        <ul
          className="no-scrollbar flex snap-x gap-2 overflow-x-auto pb-4 md:gap-3"
          role="list"
        >
          {cars.map((car) => (
            <li
              key={car.slug}
              className="w-[80%] shrink-0 snap-start sm:w-[52%] md:w-[44%] lg:w-[285px]"
            >
              <CarCard
                car={car}
                sizes="(min-width:1024px) 285px, (min-width:768px) 44vw, 80vw"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
