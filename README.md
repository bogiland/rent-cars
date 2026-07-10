# Apex Auto — Portfolio

Standalone premium car-rental portfolio site.

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck
pnpm lint
pnpm build
pnpm analyze      # ANALYZE=true next build
```

> Node ≥ 20.

## Stack

Next.js 15 · React 19 · TypeScript strict · Tailwind v4 · Radix · CVA ·
GSAP + Lenis · Framer Motion · React Hook Form + Zod.

## Structure

- `app/` — routes (Home, /fleet, /fleet/[slug], /booking)
- `components/ui` — primitives (Radix + CVA)
- `components/sections` — page blocks (Hero, FeaturedFleet, …)
- `components/booking` — BookingWidget + form
- `components/fleet` — catalog grid + car detail
- `components/layout` — Header, Footer, StickyBookBar
- `content/` — typed JSON content (cars.json, brand.json)
- `lib/` — types, utils, typed content loader, SEO helpers

## Rules

Read `CLAUDE.md` before editing. Design tokens are the only source of truth —
hardcoded colors/sizes are forbidden.
