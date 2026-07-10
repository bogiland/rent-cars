import Link from "next/link";
import { Instagram, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import { brand } from "@/lib/content";

const LINKS = {
  Resources: [
    { label: "Car Rental Cyprus", href: "/rent-a-car-cyprus" },
    { label: "Luxury Cars", href: "/rent-a-car-cyprus?cat=Luxury" },
    { label: "SUV Rental", href: "/rent-a-car-cyprus?cat=SUV" },
    { label: "Airport Delivery", href: "/booking" },
    { label: "Long Term Rental", href: "/booking" },
  ],
  Company: [
    { label: "About Us", href: "/#about" },
    { label: "Apex Auto App", href: "/booking" },
    { label: "Advertise with us", href: "/booking" },
    { label: "Contact Us", href: "/#contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/#legal" },
    { label: "Terms & Conditions", href: "/#legal" },
    { label: "Terms of Use", href: "/#legal" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#171717] text-white" aria-label="Site footer">
      <div className="container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="mb-5 inline-flex items-center gap-1.5" aria-label="Apex Auto home">
              <span className="text-2xl font-extrabold tracking-[0]">Apex</span>
              <span className="text-2xl font-medium tracking-[0] text-[var(--color-accent-bright)]">Auto</span>
            </Link>
            <p className="max-w-[260px] text-sm leading-relaxed text-white/85">
              Find the best deals on budget and luxury car rentals in Cyprus. Book direct,
              pay your partner directly and avoid commission fees.
            </p>

            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-white">Flexible ways to pay your partner directly</p>
              <ul className="flex flex-wrap gap-2" role="list">
                {brand.paymentMethods.map((method) => (
                  <li key={method} className="rounded-[4px] bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/90">
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group} className="md:col-span-2">
              <h2 className="mb-4 text-base font-medium tracking-[0] text-white/65">/ {group}</h2>
              <ul className="space-y-3" role="list">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white transition-colors hover:text-[var(--color-accent-bright)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-2">
            <h2 className="mb-4 text-base font-medium tracking-[0] text-white/65">/ Support</h2>
            <ul className="space-y-3 text-sm text-white" role="list">
              <li>
                <a href={`tel:${brand.phone}`} className="inline-flex items-center gap-2 hover:text-[var(--color-accent-bright)]">
                  <Phone size={16} /> {brand.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${brand.email}`} className="inline-flex items-center gap-2 hover:text-[var(--color-accent-bright)]">
                  <Mail size={16} /> {brand.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="inline-flex items-center gap-3 text-sm text-white/85">
              <MapPin size={17} className="shrink-0 text-white/60" />
              {brand.address.street}, {brand.address.city} - {brand.address.country}
            </p>
            <p className="text-sm text-white/85">© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/70">Follow us on:</span>
              <a href="/" aria-label="LinkedIn" className="text-white/85 hover:text-white">
                <Linkedin size={18} />
              </a>
              <a href={brand.social.instagram} aria-label="Instagram" className="text-white/85 hover:text-white">
                <Instagram size={18} />
              </a>
              <a href={brand.social.telegram} aria-label="Telegram" className="text-white/85 hover:text-white">
                <Send size={18} />
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-5 text-xs text-white/55">
            {["English", "Greek", "Russian", "Romanian", "German", "French"].map((lang) => (
              <span key={lang}>{lang}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
