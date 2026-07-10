import Link from "next/link";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { brand } from "@/lib/content";

export function FinalCTA() {
  return (
    <section className="py-16 md:py-20 border-t border-[var(--color-border)]" aria-labelledby="cta-heading">
      <div className="container">
        <div className="rounded-[var(--radius-xl)] bg-[var(--color-surface-2)] border border-[var(--color-border)] p-8 md:p-12 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <h2
              id="cta-heading"
              className="text-3xl md:text-4xl font-medium leading-[1.05] tracking-[-0.025em] mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ready to book?
            </h2>
            <p className="text-base text-[var(--color-fg-muted)] max-w-xl leading-relaxed">
              Pick your dates. Get keys delivered in 30 minutes. €200 deposit,
              full insurance, free city delivery.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 h-14 px-6 rounded-[var(--radius-md)] bg-[var(--color-cta)] text-[var(--color-cta-fg)] text-base font-semibold hover:bg-[var(--color-cta-hover)] transition-colors"
            >
              Book now
              <ArrowRight size={16} />
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${brand.phone}`}
                className="inline-flex items-center justify-center gap-2 h-12 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] text-sm font-semibold hover:bg-[var(--color-surface)] transition-colors"
              >
                <Phone size={14} />
                Call
              </a>
              <a
                href={`https://wa.me/${brand.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] text-sm font-semibold hover:bg-[var(--color-surface)] transition-colors"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
