"use client"; // accordion open/close state

import { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";
import Link from "next/link";
import { faq, brand } from "@/lib/content";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [open, setOpen] = useState<string | null>(faq[0]?.id ?? null);

  return (
    <section className="py-11 md:py-[72px] border-t border-[var(--color-border)]" aria-labelledby="faq-heading">
      <div className="container grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14">
        {/* Left column — heading + contact CTA */}
        <div>
          <h2
            id="faq-heading"
            className="text-2xl md:text-3xl font-medium leading-[1.05] tracking-[-0.025em] mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Frequently asked
          </h2>
          <p className="text-base text-[var(--color-fg-muted)] leading-relaxed mb-7">
            Short answers about insurance, deposits, delivery, documents and cancellation.
            Anything else — message us on WhatsApp.
          </p>
          <Link
            href={`https://wa.me/${brand.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-12 px-5 rounded-[var(--radius-md)] bg-[var(--color-cta)] text-[var(--color-cta-fg)] text-sm font-semibold hover:bg-[var(--color-cta-hover)] transition-colors"
          >
            <MessageCircle size={16} />
            Ask on WhatsApp
          </Link>
        </div>

        {/* Right column — accordion */}
        <ul className="flex flex-col gap-2" role="list">
          {faq.map((item) => {
            const isOpen = open === item.id;
            return (
              <li
                key={item.id}
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${item.id}`}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[var(--color-surface-2)] transition-colors"
                >
                  <span className="text-base font-semibold text-[var(--color-fg)]">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "shrink-0 text-[var(--color-fg-muted)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-premium)]",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <div
                  id={`faq-${item.id}`}
                  role="region"
                  className={cn(
                    "grid transition-[grid-template-rows] duration-[var(--dur-base)] ease-[var(--ease-premium)]",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-[var(--color-fg-muted)] leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
