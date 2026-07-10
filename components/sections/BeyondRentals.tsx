import Link from "next/link";
import { Plane, UserCheck, CalendarRange, ArrowRight } from "lucide-react";

const SERVICES = [
  {
    icon: Plane,
    title: "Airport Transfer",
    desc: "Meet & greet at LCA. Driver waits with your name at arrivals.",
    href: "/booking",
  },
  {
    icon: UserCheck,
    title: "Car with Driver",
    desc: "Professional chauffeur by the hour or day. Business or events.",
    href: "/rent-a-car-cyprus?cat=driver",
  },
  {
    icon: CalendarRange,
    title: "Long-term Lease",
    desc: "Monthly rentals from €750. Unlimited mileage, full service.",
    href: "/rent-a-car-cyprus?cat=long-term",
  },
];

export function BeyondRentals() {
  return (
    <section className="py-12 md:py-16 border-t border-[var(--color-border)]" aria-labelledby="beyond-heading">
      <div className="container">
        <div className="mb-6 md:mb-8">
          <h2 id="beyond-heading" className="text-2xl md:text-3xl font-semibold tracking-[-0.02em]">
            Beyond car rentals
          </h2>
          <p className="text-sm text-[var(--color-fg-muted)] mt-1.5">
            More ways to get where you need to go
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4" role="list">
          {SERVICES.map(({ icon: Icon, title, desc, href }) => (
            <li key={title}>
              <Link
                href={href}
                className="group flex flex-col h-full p-5 md:p-6 rounded-[var(--radius-lg)] bg-[var(--color-surface-2)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors"
              >
                <span className="inline-flex w-11 h-11 rounded-[var(--radius-md)] bg-white border border-[var(--color-border)] items-center justify-center mb-4">
                  <Icon size={20} className="text-[var(--color-accent)]" aria-hidden />
                </span>
                <h3 className="text-base font-semibold mb-1.5">{title}</h3>
                <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed mb-4">{desc}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
                  Learn more
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
