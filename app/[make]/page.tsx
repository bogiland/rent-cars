import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyBookBar } from "@/components/layout/StickyBookBar";
import { FleetFilters } from "@/components/fleet/FleetFilters";
import { brandFromParam, brandSlug, cars, getBrands } from "@/lib/content";

interface Params {
  params: Promise<{ make: string }>;
}

// Only the enumerated brand slugs render; anything else 404s.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getBrands().map((b) => ({ make: `rent-${brandSlug(b)}` }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { make } = await params;
  const brandName = brandFromParam(make);
  if (!brandName) return { title: "Not found" };
  return {
    title: `Rent ${brandName} in Cyprus — Offers & Prices`,
    description: `Rent a ${brandName} in Cyprus. Compare ${brandName} models, prices and photos, book direct with full insurance and delivery.`,
  };
}

export default async function BrandPage({ params }: Params) {
  const { make } = await params;
  const brandName = brandFromParam(make);
  if (!brandName) notFound();

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="bg-[#f7f7f7] pb-16 pt-[92px] md:pb-24 md:pt-[156px]">
        <div className="mx-auto w-full max-w-[var(--container-max)] px-[calc(var(--container-px)+20px)]">
          <FleetFilters cars={cars} initialBrand={brandName} />
        </div>
      </main>
      <Footer />
      <StickyBookBar heroId="main" />
    </>
  );
}
