import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyBookBar } from "@/components/layout/StickyBookBar";
import { BookingForm } from "@/components/booking/BookingForm";
import { cars } from "@/lib/content";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Book your car — Apex Auto Nicosia",
  description:
    "Reserve your premium car in 60 seconds. Confirmation by WhatsApp in under 15 minutes. Free delivery, full insurance.",
};

const HOW = [
  "Fill the form — takes 60 seconds",
  "We confirm by WhatsApp within 15 minutes",
  "Choose pickup or free delivery to your hotel",
  "Pay on pickup. No prepayment.",
];

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ car?: string }>;
}) {
  const sp = await searchParams;

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="pt-24 md:pt-28 pb-16 md:pb-24">
        <div className="container">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-14">
            {/* Left — form */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-fg-muted)] mb-2">
                Booking
              </p>
              <h1
                className="text-4xl md:text-5xl font-medium tracking-[-0.03em] leading-[1.05] mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Reserve your car.
              </h1>
              <p className="text-base text-[var(--color-fg-muted)] mb-8 max-w-xl">
                Send your request — we'll confirm in under 15 minutes via WhatsApp.
                No prepayment required.
              </p>

              <BookingForm cars={cars} initialCarSlug={sp.car} />
            </div>

            {/* Right — how it works */}
            <aside className="lg:sticky lg:top-28 self-start">
              <div className="rounded-[var(--radius-xl)] bg-[var(--color-surface-2)] border border-[var(--color-border)] p-6 md:p-7">
                <h2
                  className="text-xl font-medium mb-5 tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  How it works
                </h2>
                <ol className="flex flex-col gap-3" role="list">
                  {HOW.map((step, i) => (
                    <li key={step} className="flex items-start gap-3 text-sm text-[var(--color-fg-muted)]">
                      <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-fg)] text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>

                <hr className="my-6 border-[var(--color-border)]" />

                <ul className="flex flex-col gap-2 text-sm text-[var(--color-fg-muted)]" role="list">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[var(--color-accent)]" />
                    Free cancellation up to 24h
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[var(--color-accent)]" />
                    Full CASCO + RCA included
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[var(--color-accent)]" />
                    Free delivery — city &amp; airport
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
      <StickyBookBar heroId="main" />
    </>
  );
}
