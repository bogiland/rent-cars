import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyBookBar } from "@/components/layout/StickyBookBar";
import { FleetFilters } from "@/components/fleet/FleetFilters";
import { cars } from "@/lib/content";

export const metadata: Metadata = {
  title: "Car Rental Cyprus - Offers",
  description:
    "Browse car rental offers in Cyprus. Compare cars, prices, photos and book direct with full insurance.",
};

export default async function FleetPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string; seats?: string }>;
}) {
  const sp = await searchParams;
  const initialSeats = sp.seats
    ? sp.seats.split(",").map(Number).filter((n) => Number.isFinite(n))
    : [];

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="bg-[#f7f7f7] pb-16 pt-[84px] md:pb-24 md:pt-[146px]">
        <div className="container">
          <FleetFilters
            cars={cars}
            initialCategory={sp.cat ?? "All"}
            initialQuery={sp.q ?? ""}
            initialSeats={initialSeats}
          />
        </div>
      </main>
      <Footer />
      <StickyBookBar heroId="main" />
    </>
  );
}
