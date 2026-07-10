import { BadgeEuro, CarFront, ClipboardCheck } from "lucide-react";

const ITEMS = [
  {
    icon: CarFront,
    title: "Wide Range of Cars",
    description:
      "Choose from economy cars, sedans, crossovers, SUVs and premium models for city trips, airport pickups and longer Cyprus routes.",
  },
  {
    icon: BadgeEuro,
    title: "Best Prices, Always",
    description:
      "Compare clear daily and monthly rates, book direct, and avoid marketplace commission or surprise fees at pickup.",
  },
  {
    icon: ClipboardCheck,
    title: "Trusted Rental Experience",
    description:
      "Every car includes insurance, verified availability, quick support and delivery options for tourists and residents alike.",
  },
];

export function WhyUs() {
  return (
    <section className="py-8 md:py-10" aria-labelledby="why-heading">
      <div className="container">
        <h2
          id="why-heading"
          className="mb-6 text-[clamp(1.25rem,1.05rem+0.55vw,1.55rem)] font-semibold tracking-[0] text-[var(--color-fg)]"
        >
          Why Apex Auto is the <span className="text-[var(--color-accent)]">#1</span> Car Marketplace
        </h2>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3" role="list">
          {ITEMS.map(({ icon: Icon, title, description }) => (
            <li key={title} className="rounded-[8px] border border-[var(--color-border)] bg-white p-6">
              <Icon size={34} className="mb-5 text-[var(--color-fg)]" aria-hidden />
              <h3 className="mb-3 text-base font-semibold tracking-[0] text-[var(--color-fg)]">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
