import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

interface BrandItem {
  slug: string;
  label: string;
}

// Ordered brand list. `slug` maps to public/brands/<slug>.svg when available.
const BRANDS: BrandItem[] = [
  { slug: "bmw", label: "BMW" },
  { slug: "mercedes", label: "Mercedes-Benz" },
  { slug: "audi", label: "Audi" },
  { slug: "porsche", label: "Porsche" },
  { slug: "volkswagen", label: "Volkswagen" },
  { slug: "kia", label: "Kia" },
  { slug: "lexus", label: "Lexus" },
  { slug: "renault", label: "Renault" },
  { slug: "hyundai", label: "Hyundai" },
  { slug: "haval", label: "Haval" },
];

/** Read once at build/render which logo files actually exist. */
function getAvailableLogos(): Set<string> {
  try {
    const dir = path.join(process.cwd(), "public", "brands");
    const files = fs.readdirSync(dir);
    return new Set(files.filter((f) => f.endsWith(".svg")).map((f) => f.replace(/\.svg$/, "")));
  } catch {
    return new Set();
  }
}

export function PartnerLogos() {
  const available = getAvailableLogos();

  return (
    <section id="brands" className="py-11 md:py-[72px]" aria-labelledby="brands-heading">
      <div className="container">
        <div className="pb-4 mb-8 border-b border-[var(--color-border)]">
          <h2 id="brands-heading" className="text-[clamp(1.25rem,1.05rem+0.55vw,1.55rem)] font-semibold tracking-[0] text-[var(--color-fg)]">
            All Brands
          </h2>
          <p className="text-base text-[var(--color-fg-muted)] mt-1">
            Rent from {BRANDS.length} trusted manufacturers in our Nicosia fleet
          </p>
        </div>

        {/* Full-width boxed grid, 6 columns desktop / 3 mobile */}
        <ul
          className="grid grid-cols-3 md:grid-cols-6 w-full border-l border-t border-[var(--color-border)] rounded-[12px] overflow-hidden"
          role="list"
        >
          {BRANDS.map((b) => {
            const hasLogo = available.has(b.slug);
            return (
              <li key={b.slug} className="border-r border-b border-[var(--color-border)]">
                <Link
                  href={`/rent-a-car-cyprus?q=${encodeURIComponent(b.label)}`}
                  className="group flex flex-col items-center justify-center gap-2 h-28 px-3"
                >
                  {hasLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/brands/${b.slug}.svg`}
                      alt={`${b.label} logo`}
                      width={40}
                      height={40}
                      className="h-9 w-auto object-contain grayscale opacity-70 transition-all duration-[var(--dur-fast)] group-hover:grayscale-0 group-hover:opacity-100"
                    />
                  ) : (
                    // Monogram fallback for brands without an SVG (Mercedes, Lexus, Haval)
                    <span className="flex items-center justify-center w-9 h-9 rounded-full border border-[var(--color-border-strong)] text-xs font-bold text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg)] group-hover:border-[var(--color-fg)] transition-colors">
                      {b.label.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <span className="text-[13px] text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg)] transition-colors text-center leading-tight">
                    {b.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
