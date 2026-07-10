import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/content";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { ThemeProvider } from "@/components/motion/ThemeProvider";
import { AuthProvider } from "@/components/layout/AuthProvider";
import { TopLoadingBar } from "@/components/layout/TopLoadingBar";

// Display — Satoshi (Fontshare), variable 300–900. Characterful, premium.
const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  weight: "300 900",
  variable: "--font-display-src",
  display: "swap",
});

// Body — DM Sans. Calm, legible, deliberately contrasts the display face.
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-src",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${brand.domain}`),
  title: {
    default: `${brand.name} — Premium Car Rental Nicosia`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  keywords: ["car rental Nicosia", "premium car rental Cyprus", "luxury car hire", "SUV rental", "BMW rental Nicosia"],
  openGraph: {
    title: `${brand.name} — Premium Car Rental Nicosia`,
    description: brand.description,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${satoshi.variable} ${dmSans.variable}`}>
      <body>
        <ThemeProvider>
          <LenisProvider>
            <AuthProvider>
              <TopLoadingBar />
              {children}
            </AuthProvider>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
