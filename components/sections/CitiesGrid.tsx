import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

const CITIES = [
  {
    name: "Nicosia",
    cars: "22+",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80&auto=format&fit=crop",
  },
  {
    name: "Larnaca Airport",
    cars: "18+",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80&auto=format&fit=crop",
  },
  {
    name: "Limassol",
    cars: "15+",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80&auto=format&fit=crop",
  },
  {
    name: "Paphos",
    cars: "10+",
    image: "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=800&q=80&auto=format&fit=crop",
  },
];

export function CitiesGrid() {
  return (
    <section className="py-11 md:py-[72px]" aria-labelledby="cities-heading">
      <div className="container">
        <div className="pb-4 mb-8 border-b border-[var(--color-border)]">
          <h2 id="cities-heading" className="text-[clamp(1.25rem,1.05rem+0.55vw,1.55rem)] font-semibold tracking-[0] text-[var(--color-fg)]">
            Find car rental near you
          </h2>
          <p className="text-base text-[var(--color-fg-muted)] mt-1">
            Free delivery to your location across Cyprus
          </p>
        </div>

        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4" role="list">
          {CITIES.map((city) => (
            <li key={city.name}>
              <Link
                href="/rent-a-car-cyprus"
                className="group relative block aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden"
              >
                <Image
                  src={city.image}
                  alt={`Car rental in ${city.name}`}
                  fill
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-premium)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(0,0,0,0.75)_100%)]" />
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <p className="flex items-center gap-1 text-white font-semibold text-base md:text-lg leading-tight">
                    <MapPin size={14} className="shrink-0" />
                    {city.name}
                  </p>
                  <p className="text-white/80 text-xs mt-0.5">{city.cars} cars available</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
