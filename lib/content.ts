import brandData from "@/content/brand.json";
import carsData from "@/content/cars.json";
import localPhotos from "@/content/local-photos.json";
import testimonialsData from "@/content/testimonials.json";
import faqData from "@/content/faq.json";
import reelsData from "@/content/reels.json";
import type {
  Brand,
  Car,
  CarReel,
  FaqItem,
  Location,
  Testimonial,
  TestimonialsAggregate,
} from "./types";

export const brand: Brand = brandData.brand as Brand;
export const locations: Location[] = brandData.locations as Location[];
export const cars: Car[] = carsData.cars as Car[];

export const testimonials: Testimonial[] =
  testimonialsData.testimonials as Testimonial[];
export const testimonialsAggregate: TestimonialsAggregate =
  testimonialsData.aggregate as TestimonialsAggregate;

export const faq: FaqItem[] = faqData.faq as FaqItem[];
export const carReels: CarReel[] = reelsData.reels as CarReel[];

export function getCarBySlug(slug: string): Car | undefined {
  return cars.find((c) => c.slug === slug);
}

export function getFeaturedCars(limit = 8): Car[] {
  const featured = cars.filter((c) => c.featured);
  const rest = cars
    .filter((c) => !c.featured)
    .sort((a, b) => b.pricePerDay - a.pricePerDay);
  return [...featured, ...rest].slice(0, limit);
}

/* ── Brand landing pages (/rent-<brand>) ─────────────────────────────────── */

/** "Range Rover" → "range-rover", "Mercedes-Benz" → "mercedes-benz". */
export function brandSlug(brandName: string): string {
  return brandName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Link to a brand's rental landing page, e.g. "/rent-ford". */
export function brandHref(brandName: string): string {
  return `/rent-${brandSlug(brandName)}`;
}

/** All brands present in the fleet, sorted most-stocked first. */
export function getBrands(): string[] {
  const counts = cars.reduce<Record<string, number>>((m, c) => {
    m[c.brand] = (m[c.brand] ?? 0) + 1;
    return m;
  }, {});
  return Object.keys(counts).sort((a, b) => counts[b]! - counts[a]!);
}

/** Resolve a "/rent-<slug>" param (with or without the "rent-" prefix) back to a brand. */
export function brandFromParam(param: string): string | undefined {
  const target = param.replace(/^rent-/, "");
  return getBrands().find((b) => brandSlug(b) === target);
}

/** Cars for a given brand landing page, priciest first. */
export function getCarsByBrand(brandName: string): Car[] {
  return cars
    .filter((c) => c.brand === brandName)
    .sort((a, b) => b.pricePerDay - a.pricePerDay);
}

/** Import-market label (OCD-style "GCC" tag next to year/category) — grouped by brand. */
const ORIGIN_BY_BRAND: Record<string, string> = {
  Ford: "American",
  Dodge: "American",
  Jeep: "American",
  Cadillac: "American",
  GMC: "American",
  Chevrolet: "American",
  Tesla: "American",
  Toyota: "Japanese",
  Nissan: "Japanese",
  Lexus: "Japanese",
  Hyundai: "Korean",
  Kia: "Korean",
  Audi: "European",
  BMW: "European",
  Mercedes: "European",
  "Mercedes-Benz": "European",
  Porsche: "European",
  Volkswagen: "European",
  Renault: "European",
  "Range Rover": "European",
};

export function getCarOrigin(car: Car): string {
  return ORIGIN_BY_BRAND[car.brand] ?? "GCC";
}

/** Small stable hash of a string → non-negative int. Used to derive believable
    per-car facts (mileage, colour) deterministically without touching cars.json. */
function slugHash(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Estimated odometer (km). Age-driven baseline (~14k/yr) + deterministic jitter,
    so the /fleet mileage filter has real, stable values to work against. */
export function getCarMileage(car: Car): number {
  const CURRENT_YEAR = 2026;
  const age = Math.max(0, CURRENT_YEAR - car.year);
  const jitter = slugHash(car.slug) % 9000; // 0–9k spread
  const km = age * 14000 + jitter + 2500;
  return Math.round(km / 500) * 500; // round to tidy 500s
}

/** Exterior colour palette (name + swatch). Deterministic per car so the colour
    filter is stable across renders. */
export const EXTERIOR_COLORS = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#f2f2f2" },
  { name: "Silver", hex: "#c6c6c6" },
  { name: "Grey", hex: "#6d6d6d" },
  { name: "Blue", hex: "#2b4c7e" },
  { name: "Red", hex: "#a52121" },
  { name: "Green", hex: "#2c5f34" },
  { name: "Beige", hex: "#cbb68c" },
] as const;

export function getCarColor(car: Car): (typeof EXTERIOR_COLORS)[number] {
  return EXTERIOR_COLORS[slugHash(car.slug) % EXTERIOR_COLORS.length]!;
}

export function getCategories(): Array<{ name: string; count: number }> {
  const map = new Map<string, number>();
  for (const c of cars) map.set(c.category, (map.get(c.category) ?? 0) + 1);
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/** Category → catalog-style image (isolated car cutout, OCD-like product shot). */
export function getCategoryImage(category: string): string {
  const map: Record<string, string> = {
    "SUV Premium": "/cars/categories/suv-premium.png",
    SUV: "/cars/categories/suv.png",
    Sedan: "/cars/categories/sedan.png",
    Crossover: "/cars/categories/crossover.png",
    Economy: "/cars/categories/economy.png",
    Luxury: "/cars/categories/luxury.png",
    Supercars: "/cars/categories/supercars.png",
    Sports: "/cars/categories/sports.png",
    Convertible: "/cars/categories/convertible.png",
    Electric: "/cars/categories/electric.png",
    Muscle: "/cars/categories/muscle.png",
  };
  return map[category] ?? "/cars/placeholder.svg";
}

/* ── Stock photos, brand-matched ─────────────────────────────────
   RULE: a photo may only be used for a car of the SAME make, or a
   neutral body-type shot where the badge isn't readable. A Mustang
   on a "Porsche Cayenne" card instantly reads as fake — never mix.
   When the client provides real fleet photos, drop files into
   /public/cars/<slug>.jpg and set car.image — it takes priority.  */
const U = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=85&auto=format&fit=crop`;

/** 18 verified real car photos (all return 200 from Unsplash). Body-type honest. */
const IMG = {
  bmwSuvBlack: U("photo-1606664515524-ed2f786a0bd6"),   // BMW X — dark showroom
  bmwBlue: U("photo-1555215695-3004980ad54e"),          // BMW — blue, street
  darkSedanRoad: U("photo-1580273916550-e323be2ae537"), // dark sedan, road
  porscheDark: U("photo-1503376780353-7e6692767b70"),   // Porsche — motion
  whiteSuv: U("photo-1617788138017-80ad40651399"),      // white premium SUV — studio
  blackLuxSedan: U("photo-1583121274602-3e2820c69888"), // black luxury sedan
  audiGrey: U("photo-1610768764270-790fbec18178"),      // Audi — grey
  greySuv: U("photo-1568844293986-8d0400bd4745"),       // grey compact SUV
  darkSuvRoad: U("photo-1533473359331-0135ef1b58bf"),   // dark SUV, road
  whiteSedan: U("photo-1542362567-b07e54358753"),       // white sedan
  darkSedan: U("photo-1590362891991-f776e747a588"),     // dark sedan
  crossover: U("photo-1606016159991-dfe4f2746ad5"),     // crossover
  supercarOrange: U("photo-1544829099-b9a0c07fad1a"),   // orange supercar
  sportsCoupe: U("photo-1503736334956-4c8f8e92946d"),   // sports coupe
  convertible: U("photo-1552519507-da3b142c6e3d"),      // convertible
  muscle: U("photo-1580414057403-c5f451f30e1c"),        // muscle car
  electric: U("photo-1560958089-b8a1929cea89"),         // Tesla-style
  silverSedan: U("photo-1494905998402-395d579af36f"),   // silver sedan
} as const;

/** Strong brand/hero pins — brand-plausible shot for recognisable cars. */
const BRAND_OVERRIDE: Record<string, string> = {
  "bmw-x6-2024": IMG.bmwSuvBlack,
  "bmw-x5-40i-2019": IMG.darkSuvRoad,
  "bmw-g30-seria-5-2021": IMG.bmwBlue,
  "bmw-seria-5-2021": IMG.bmwBlue,
  "porsche-cayenne-2021": IMG.porscheDark,
  "porsche-911-carrera-2022": IMG.porscheDark,
  "porsche-718-boxster-2024": IMG.convertible,
  "mercedes-gle-coupe-2021": IMG.whiteSuv,
  "audi-q7-2017": IMG.audiGrey,
  "audi-q5-2017": IMG.audiGrey,
  "audi-a7-2013": IMG.audiGrey,
  "audi-r8-v10-2023": IMG.supercarOrange,
  "lamborghini-huracan-evo-2023": IMG.supercarOrange,
  "ferrari-488-spider-2022": IMG.sportsCoupe,
  "mclaren-720s-2022": IMG.porscheDark,
  "ford-mustang-gt-2023": IMG.muscle,
  "dodge-charger-r-t-2022": IMG.muscle,
  "tesla-model-y-2024": IMG.electric,
  "tesla-model-3-2024": IMG.electric,
};

/** Category pools — rotated per car so no two cars in a category repeat back-to-back. */
const CATEGORY_POOL: Record<string, string[]> = {
  "SUV Premium": [IMG.bmwSuvBlack, IMG.whiteSuv, IMG.darkSuvRoad, IMG.greySuv, IMG.audiGrey],
  SUV: [IMG.darkSuvRoad, IMG.greySuv, IMG.whiteSuv, IMG.crossover],
  Crossover: [IMG.crossover, IMG.greySuv, IMG.audiGrey, IMG.darkSuvRoad],
  Sedan: [IMG.darkSedan, IMG.silverSedan, IMG.bmwBlue, IMG.darkSedanRoad],
  Luxury: [IMG.blackLuxSedan, IMG.darkSedanRoad, IMG.bmwSuvBlack, IMG.whiteSuv],
  Supercars: [IMG.supercarOrange, IMG.sportsCoupe, IMG.porscheDark],
  Sports: [IMG.porscheDark, IMG.sportsCoupe],
  Convertible: [IMG.convertible, IMG.sportsCoupe],
  Muscle: [IMG.muscle, IMG.sportsCoupe],
  Electric: [IMG.electric, IMG.silverSedan, IMG.whiteSedan],
  Economy: [IMG.whiteSedan, IMG.silverSedan, IMG.darkSedan],
};

/** Precompute a stable slug → image assignment: overrides win, rest round-robin
    their category pool so a filtered category never shows one photo repeatedly. */
const ASSIGNED: Record<string, string> = (() => {
  const out: Record<string, string> = {};
  const counter: Record<string, number> = {};
  for (const car of cars) {
    if (BRAND_OVERRIDE[car.slug]) {
      out[car.slug] = BRAND_OVERRIDE[car.slug]!;
      continue;
    }
    const pool = CATEGORY_POOL[car.category] ?? [IMG.darkSedan];
    const i = counter[car.category] ?? 0;
    out[car.slug] = pool[i % pool.length]!;
    counter[car.category] = i + 1;
  }
  return out;
})();

/** Real licensed per-car photos (local files in /public/cars/<slug>.jpg).
    Empty for now — AI renders were removed as they looked unrealistic. Drop a
    real licensed photo here per slug to give any car its exact model shot. */
const GENERATED: Record<string, string> = {};

/** Photos you drop into public/cars/local/<slug>.jpg (auto-synced to a manifest). */
const LOCAL: Record<string, string> = localPhotos as Record<string, string>;

/** Car → image. Your local photo wins; then json photo; then render; then pool. */
export function getCarImage(car: Car): string {
  if (LOCAL[car.slug]) return LOCAL[car.slug]!;
  if (car.image && car.image !== "/cars/placeholder.svg") return car.image;
  return GENERATED[car.slug] ?? ASSIGNED[car.slug] ?? IMG.darkSedan;
}

/** "Old" price for the strike-through (marketing trick: +20–25%). */
export function getOldPrice(price: number): number {
  return Math.round(price * 1.2);
}

/** Weekly price (≈ daily × 6.3 — one day free vs 7×). */
export function getWeeklyPrice(daily: number): number {
  return Math.round(daily * 6.3);
}

/** Monthly price (≈ daily × 25, agency standard discount). */
export function getMonthlyPrice(daily: number): number {
  return Math.round(daily * 25);
}

/** Deposit by class. Exotics scale with the daily rate. */
export function getDeposit(car: Car): number {
  if (car.category === "Supercars" || car.category === "Luxury") return 2000;
  if (car.category === "Sports" || car.category === "Convertible") return 1000;
  if (car.category === "SUV Premium" || car.category === "Muscle") return 500;
  if (car.category === "SUV" || car.category === "Crossover" || car.category === "Electric") return 350;
  return 200;
}

/** Gallery: the SAME car photo in different crops (never other cars —
    a "Cayenne" gallery showing a BMW screams fake). Unsplash crop
    params give left / right / detail framings of one shot. */
export function getCarGallery(car: Car): string[] {
  const main = getCarImage(car);
  const base = main.split("?")[0]!;
  return [
    main,
    `${base}?w=800&h=600&q=85&auto=format&fit=crop&crop=left`,
    `${base}?w=800&h=600&q=85&auto=format&fit=crop&crop=right`,
    `${base}?w=800&h=600&q=85&auto=format&fit=crop&crop=bottom`,
  ];
}

const PREVIEW_GALLERY_SCENES = {
  luxuryInterior: U("photo-1603386329225-868f9b1ee6c9"),
  cabinDetail: U("photo-1503736334956-4c8f8e92946d"),
  suvLifestyle: U("photo-1533473359331-0135ef1b58bf"),
  cityDrive: U("photo-1449965408869-eaa3f722e40d"),
  sportsFront: U("photo-1544829099-b9a0c07fad1a"),
  convertible: U("photo-1552519507-da3b142c6e3d"),
  electric: U("photo-1560958089-b8a1929cea89"),
} as const;

export function getCarPreviewGallery(car: Car): string[] {
  const main = getCarImage(car);
  if (car.gallery?.length > 1 && car.gallery.some((src) => src !== "/cars/placeholder.svg")) {
    return car.gallery.slice(0, 4);
  }

  const sets: Record<string, string[]> = {
    Luxury: [main, PREVIEW_GALLERY_SCENES.luxuryInterior, PREVIEW_GALLERY_SCENES.cabinDetail, PREVIEW_GALLERY_SCENES.cityDrive],
    Supercars: [main, PREVIEW_GALLERY_SCENES.sportsFront, PREVIEW_GALLERY_SCENES.cabinDetail, PREVIEW_GALLERY_SCENES.cityDrive],
    Sports: [main, PREVIEW_GALLERY_SCENES.sportsFront, PREVIEW_GALLERY_SCENES.cabinDetail, PREVIEW_GALLERY_SCENES.cityDrive],
    Convertible: [main, PREVIEW_GALLERY_SCENES.convertible, PREVIEW_GALLERY_SCENES.cabinDetail, PREVIEW_GALLERY_SCENES.cityDrive],
    Electric: [main, PREVIEW_GALLERY_SCENES.electric, PREVIEW_GALLERY_SCENES.cabinDetail, PREVIEW_GALLERY_SCENES.cityDrive],
    "SUV Premium": [main, PREVIEW_GALLERY_SCENES.suvLifestyle, PREVIEW_GALLERY_SCENES.luxuryInterior, PREVIEW_GALLERY_SCENES.cabinDetail],
    SUV: [main, PREVIEW_GALLERY_SCENES.suvLifestyle, PREVIEW_GALLERY_SCENES.luxuryInterior, PREVIEW_GALLERY_SCENES.cityDrive],
    Crossover: [main, PREVIEW_GALLERY_SCENES.suvLifestyle, PREVIEW_GALLERY_SCENES.cabinDetail, PREVIEW_GALLERY_SCENES.cityDrive],
    Sedan: [main, PREVIEW_GALLERY_SCENES.cityDrive, PREVIEW_GALLERY_SCENES.luxuryInterior, PREVIEW_GALLERY_SCENES.cabinDetail],
    Economy: [main, PREVIEW_GALLERY_SCENES.cityDrive, PREVIEW_GALLERY_SCENES.cabinDetail, PREVIEW_GALLERY_SCENES.suvLifestyle],
    Muscle: [main, PREVIEW_GALLERY_SCENES.sportsFront, PREVIEW_GALLERY_SCENES.cabinDetail, PREVIEW_GALLERY_SCENES.cityDrive],
  };

  return (sets[car.category] ?? [main, PREVIEW_GALLERY_SCENES.cityDrive, PREVIEW_GALLERY_SCENES.cabinDetail, PREVIEW_GALLERY_SCENES.suvLifestyle]).slice(0, 4);
}

/** Every real photo for the detail-page lightbox (up to 16), else the preview set. */
export function getCarFullGallery(car: Car): string[] {
  if (car.gallery?.length && car.gallery.some((src) => src !== "/cars/placeholder.svg")) {
    return car.gallery.filter((src) => src !== "/cars/placeholder.svg").slice(0, 16);
  }
  return getCarPreviewGallery(car);
}
