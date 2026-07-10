# LOOP-STATE — Apex Auto (Nicosia, Cyprus) car-rental site

Reference: oneclickdrive.com. Framework: Next.js 15 App Router + Tailwind v4.
Read this FIRST every run.

## Charter's 5 required homepage sections — ALL DONE (exceeded)
1. Header nav (logo + menu + Login/Book now) — DONE (`components/layout/Header.tsx`)
2. Hero + RENT/LONG-TERM/WITH DRIVER toggle + bg image — DONE (`components/sections/Hero.tsx`)
3. Search bar + "View All Cars" — DONE (in Hero)
4. Category grid w/ image + title + "N Cars" — DONE (`components/sections/CategoriesGrid.tsx`)
5. Footer + intro paragraph — DONE (`components/layout/Footer.tsx` + `SeoIntro.tsx`)

Extra sections already built: RecommendedCars, FeaturedFleet, PartnerLogos (brand
logos grid), CitiesGrid, Testimonials (source tabs), FAQ, plus working pages
/fleet (filters+sort+by-make), /fleet/[slug] (gallery, pricing, overview,
dealer card), /booking (WhatsApp form).

## Current task log
- **Clickable listing photos + category cut-out images (SAMPLE)** — IN PROGRESS.
  1. Listing card photos now navigate: CarCardHorizontal hover-zones changed from
     inert <button>s to <Link>s → clicking the photo opens the car page (hover still
     switches photo). tsc clean.
  2. Category tiles → transparent car cut-outs (OCD-style). DID NOT use Higgsfield
     (balance was only 3.9 credits, free plan). Installed `rembg[cpu]` + pillow
     (Python 3.10, --user) → FREE offline background removal, model isnet-general-use.
     Script: scratchpad/cutout.py (crops to alpha bbox, centres on 1200x800 transparent
     canvas). Sample done for Luxury (rolls-royce 4.jpg), Supercars (huracan 1.jpg),
     Premium SUV (urus 3.jpg, right-cropped to drop a background car). Overwrote
     public/cars/categories/{luxury,supercars,suv-premium}.png (originals backed up in
     %TEMP%/claude/scratch-cutouts). CategoriesGrid image class object-cover→object-contain
     p-1.5 so cut-outs sit on the light tile. Remaining 8 categories still full-photo
     PNGs (look letterboxed until converted). AWAITING user OK to convert the other 8
     (also free via rembg): Crossover(hyundai-tucson) Economy(toyota-corolla) SUV(jeep-
     wrangler) Sedan(bmw-5) Electric(tesla-model-y) Sports(porsche-911) Convertible
     (porsche-718) Muscle(ford-mustang). Pick single-car, side/front source photos.
  Notes: rembg keeps ALL foreground vehicles → must pick source photos with one car or
  pre-crop. .next EBUSY-locked by OneDrive again → killed :3000, rm -rf .next, restart.

- **Recommended block + nav collapse + copper burger + lightbox toolbar + load-bar** — DONE.
  1. Recommended cars re-added to listing (user reversed the earlier removal): static
     3-card block (NOT carousel), placed UNDER the "Showing 1-25 of N cars" row, light
     turquoise bg (new tokens --color-recommend-bg #e3f6f2 / -border #bfe8e0). Source =
     getFeaturedCars(3) (brand pages: getCarsByBrand(brand).slice(0,3)), only when ≥3.
     Heading "Recommended for you" / "Recommended {Brand}s". 28 articles = 25 + 3.
  2. Header nav overflow (~930px): main nav + right buttons + /rent search sub-bar +
     burger all switched md → `min-[940px]` so links collapse into the burger below
     940px instead of wrapping.
  3. Burger button recoloured from pale gray to filled copper accent
     (bg-accent + white icon + hover accent-hover).
  4. Detail lightbox (CarGallery) overhauled: top toolbar of icon-buttons — photo
     counter, Zoom in/out (also click image to toggle, scales 1.9×, resets per slide),
     Film (jump to first video), Phone (callHref), WhatsApp (waHref), Close. Opening /
     switching a photo plays a grow-in animation (.animate-lightbox-in keyframe,
     reduced-motion aware). Video: supports up to 4 clips; empty → "coming soon"
     placeholder slide.
  5. Photo/video capacity raised: getCarFullGallery 5 → 16; getCarVideos scans
     video.mp4 / video2..4.(mp4|webm) → up to 4, passed as videoUrls. Drop files in
     public/cars/<slug>/ and they appear.
  6. Global blue page-load bar: new client `components/layout/TopLoadingBar.tsx`
     (--color-loadbar #2f6bff), fixed top z-200, starts on internal-link click,
     completes on pathname commit. Mounted in app/layout.tsx.
  7. Detail mosaic photos shrunk (OCD-style): main/right min-h 340→250, middles
     165→121, sizes tightened.
  Verified :3000 — /, listing, detail, brand all 200; recommended block renders (28
  articles; "Recommended BMWs" on /rent-bmw); tsc clean. Interactive bits (toolbar,
  zoom, burger colour, nav collapse, load-bar) are client-only, not in curl HTML.

- **Remove top-picks plate + wire detail-page lightbox gallery + video slot** — DONE.
  1. Removed the "Top picks for you / Hand-selected…" plate from FleetFilters (user
     asked to remove it after previously requesting it). Dropped now-unused imports
     (Gem, CarCard, getFeaturedCars, getCarsByBrand) + the topPicks memo. brandHref/
     make-chip links stay. Listing back to 25 articles.
  2. Detail-page gallery was a STATIC grid (inert "Show all photos"); a full lightbox
     `components/fleet/CarGallery.tsx` already existed but was never wired in. Extended
     it (added lightboxImages + videoUrl props, slides model, video/placeholder stage,
     video thumb in the rail) and wired it into `app/rent-a-car-cyprus/[slug]/page.tsx`
     replacing the static grid. Grid = 4-tile mosaic (getCarPreviewGallery); lightbox
     browses the full set via new `getCarFullGallery(car)` (up to 5 real photos) +
     Esc/arrows/thumbnails.
  3. Prepared VIDEO slot: `getCarVideo(slug)` in the detail page (server, node:fs)
     checks `public/cars/<slug>/video.mp4|.webm`; when absent the lightbox shows a
     "Walkaround video coming soon" placeholder slide + a play-icon thumbnail. Drop a
     video file in the folder and it plays automatically — no code change. (content.ts
     stays fs-free since it's imported by client components; the fs check lives in the
     server page like PartnerLogos does.)
  Verified :3000 — /, listing, detail, brand all 200; plate gone (0 matches, 25
  articles); mosaic "Show all photos" renders; tsc clean. Lightbox+video are
  client-only so not visible in curl HTML (expected). .next EBUSY-locked by OneDrive
  mid-edit again → killed :3000, rm -rf .next, restarted (per charter).

- **OCD batch: route rename + brand pages + top-3 plate + visual tweaks** — DONE.
  1. Route `/fleet` → `/rent-a-car-cyprus` (folder moved incl. `[slug]`). ALL internal
     links/forms/breadcrumbs/router.push updated. `.git` is empty (not a real repo) so
     moved via filesystem, no history. Header `showSearchBar` now `startsWith("/rent-")`.
  2. Brand landing pages `/rent-<brand>` via root `app/[make]/page.tsx`
     (`dynamicParams=false`, `generateStaticParams` = rent-<slug> for each fleet brand;
     unknown → notFound → 404). Reuses `FleetFilters` with new `initialBrand` prop
     (seeds q + "Rent {brand} in Cyprus" H1 + branded breadcrumb). "Rent Cars by Make"
     chips are now `<Link href={brandHref(make)}>` (real nav, not client sort). Header
     Brand&Model dropdown, mobile Car Brands, BrandsPanel → brandHref too. PartnerLogos
     kept on `?q=` (lists non-fleet brands like Kia/Lexus/Haval → would 404 as pages).
     New helpers in lib/content.ts: brandSlug/brandHref/getBrands/brandFromParam/
     getCarsByBrand.
  3. Top-3 premium plate (Gem icon, accent-soft gradient) in FleetFilters, rendered
     right AFTER the make-chips section, before results. Source: getFeaturedCars(3) on
     the main listing, getCarsByBrand(brand).slice(0,3) on brand pages; only shows when
     ≥3 picks (so single-car brands like Ford skip it).
  4. Top utility strip (Arabic/Nicosia/EUR·EN): new tokens --color-topbar #f6ece1 +
     --color-topbar-border #ecdccb (warm copper-tinted white) replacing bg-[#f7f7f7].
  5. Premium badge: lucide `Diamond` (rhombus) → `Gem` (cut diamond) in CarCardHorizontal
     (removed fill so it reads as a gem).
  6. Homepage CategoriesGrid tiles: aspect-[3/2] → aspect-[16/9] (shorter, ~20px less
     height/tile) so "See More" surfaces; side padding left minimal as requested.
  7. Listing pages side padding +20px: `.container` → wrapper with
     px-[calc(var(--container-px)+20px)] on both /rent-a-car-cyprus and /rent-<brand>.
  8. /fleet right sidebar un-stuck: removed `sticky top-[168px]` (now scrolls away).
  9. Tablet/mobile: mobile per-photo arrows REMOVED from CarCardHorizontal (progress-bar
     taps remain); its horizontal split shifted md→lg so tablet shows 2 vertical cards
     (list grid `md:grid-cols-2 lg:grid-cols-1`). Homepage carousels (Recommended,
     Featured) peek ~1.5 on tablet: card width `w-[80%] md:w-[58%] lg:w-[285px]`.
  Verified on :3001 — /, /rent-a-car-cyprus, detail, /booking, /rent-ford|bmw|range-rover|
  mercedes-benz all 200; /fleet + bad brand 404; plate renders (main + branded);
  counts: cyprus 25+3 plate=28 articles, bmw 3+3=6, ford 1 (plate hidden). tsc clean.
  NOTE: dev server now runs on :3001 (prior zombie on :3000 PID 9020 was killed).

- **CTA hover + booking button + Moldova fix** — DONE.
  Call/WhatsApp buttons (CarCard, CarCardHorizontal, /fleet/[slug] dealer card):
  hover now fills full brand colour + white text/icon (was faint /10 tint) —
  `hover:bg-[var(--color-call)] hover:text-white` / whatsapp equivalent. Icons use
  currentColor so they turn white too. Booking "Send via WhatsApp" submit enlarged
  for mobile (text-[15px], icon 18, w-full) — global type-scale reduction had made
  it look tiny. Fixed forbidden `+373` placeholder in BookingForm → `+357`. Repo
  grep confirms zero Moldova/+373 refs.
  NOTE: mega-menu panels also had rounded corners removed earlier (user asked for
  square dropdown blocks).
  ⚠️ Dev server .next got corrupted by OneDrive mid-edit (bare 21-byte 500 on all
  routes, tsc clean). Fixed per charter: killed :3000, `rm -rf .next`, restarted
  `pnpm dev` (now running in Claude background, task bcy58cnhb). All routes 200.
- **Polish batch (OCD parity, user-requested)** — DONE.
  1. CategoriesGrid ("Browse Car Rentals"): now grid-cols-5 (10 tiles = 2 rows),
     tight gaps (gap-x-1.5→3), and shrinking side padding via custom wrapper
     (px-1.5 sm:px-3 md:px-4 lg:container) instead of .container.
  2. Header main nav mega-menu: added scale-95→100 + origin-top hover/focus
     animation (fade + slight grow).
  3. /fleet sub-bar filters (Car Type / Brand & Model / Model Year / Price):
     converted from flat links to animated dropdowns (origin-top scale-y-90→100,
     grows downward). Car Type→cat links, Brand→q links, Year→?q=year (works via
     hay search), Price→opens filter drawer. FILTER_MENUS in Header.tsx.
  4. Typography: reduced global @theme scale ~13-15% (base 0.9→0.8125rem/13px,
     hero text-5xl max 2.5→2.125rem, etc.) to match OCD's tighter rendering.
     BROAD change — flag for review.
  5. Mega-menu overflow FIX: panels now align by nav index (first 2 open right via
     left-0, rest open left via right-0) + max-w-[calc(100vw-1.5rem)] — no more
     horizontal overflow off the site edge. Same max-w on filter dropdowns.
  tsc clean; / /fleet /booking /fleet/[slug] all 200; grid=10 tiles/5-col verified.
- **P5 Dealer card (/fleet/[slug])** — DONE. Replaced the plain wordmark header of
  the right sticky booking card with an OCD-style dealer identity row: 60×60 dark
  circular "AA" monogram avatar (ring + shadow), brand name + verified BadgeCheck,
  4.8/5 star rating, "600+ trips", green "Open Now · Nicosia". Icons Star/BadgeCheck
  added. Price/CTA/terms below untouched. tsc clean, detail routes 200.
- **Fleet reduced 53 → 25** (user request: less design, more dev). Balanced across
  all 11 categories (SUV Premium 6, Luxury 5, Supercars 4, Muscle 2, Electric 2,
  Sedan/Crossover/SUV/Sports/Convertible/Economy 1 each). Backup of the 53-car
  cars.json saved in scratchpad (cars.json.bak53). Kept all previously-photographed
  cars. lib/content.ts slug-keyed maps (BRAND_OVERRIDE etc.) harmless for dropped
  slugs.
- **P4 Real car photos — ALL 25 DONE.** Every car now has 5 real Wikimedia Commons
  photos in `public/cars/<slug>/1..5.jpg`, cars.json image+gallery point at them.
  New angle-targeting (fetch-angles.mjs): separate `<model> interior` sub-search +
  spread exterior picks → most cars get front/side/rear + a real interior shot.
  User prefs locked: max 5 photos/car, real photos only (NO Higgsfield/AI — offered,
  user chose real Commons). Minor imperfections to maybe touch up later: porsche-718
  photo5 is a Cayman (not Boxster); some interiors are older-gen (gmc-yukon 2004,
  audi-r8 2012). netcarshow.com stays UNREACHABLE (000). Verified: /fleet=25 cards,
  all detail routes 200, images serve 200 image/jpeg, tsc clean.
- **P4 Real car photos — TOP-10 featured DONE (batch 1, superseded by ALL-25 above)**. netcarshow.com
  is UNREACHABLE from both WebFetch and curl (conn refused / HTTP 000 — blocks
  datacenter IPs). Pivoted to **Wikimedia Commons** (free-license, spec-allowed):
  search via `commons.wikimedia.org/w/api.php action=query generator=search
  gsrnamespace=6 prop=imageinfo iiurlwidth=1600`, download direct
  `upload.wikimedia.org` thumbs. Scripts in scratchpad (fetch-photos*.mjs).
  Watch out: Commons rate-limits (HTTP 429) — need ~1.5s between downloads +
  backoff. Downloaded 5 real photos each (50KB–1MB, verified) for:
  bmw-x6-2024, porsche-cayenne-2021, mercedes-gle-coupe-2021, bmw-x5-40i-2019,
  lamborghini-huracan-evo-2023, lamborghini-urus-2024, ferrari-488-spider-2022,
  mclaren-720s-2022, rolls-royce-ghost-2023, bentley-bentayga-2023. Files in
  `public/cars/<slug>/1..5.jpg`; cars.json image+gallery updated for those 10.
  getCarPreviewGallery already prefers car.gallery → cards + detail mosaic show
  real photos. next.config untouched (local files). Review notes: some Huracán
  shots are Super Trofeo race-livery; a few are auto-show floor shots. REMAINING:
  43 non-featured cars (awaiting user OK on batch 1).
- **P3 Header mega-menu (OCD parity)** — DONE. Rent a Car panel already had 3
  columns (Categories / Body Types / Rental by Period); added a "Trending" chip
  row (7 Seater / Electric / Convertible / Supercars) under it. Car Brands panel
  now shows per-brand fleet counts (`BRAND_COUNTS`, sorted most-stocked first).
  Added `seats` query param support: `app/fleet/page.tsx` parses `?seats=7,…` →
  `FleetFilters initialSeats` → seeds drawer seats filter (reset clears it).
  Verified: /fleet=53 cards, ?seats=7=7, ?cat=Electric=3, ?cat=Muscle=2.
  Menu is CSS hover/focus (opens on hover, closes on mouse-leave) — kept as-is
  per "don't refactor working code"; ESC-close would need JS conversion (offered).
- **P2 Filter drawer (/fleet)** — DONE. New `components/fleet/FleetFilterDrawer.tsx`
  = framer-motion right sheet (ESC + backdrop click close, body-scroll lock).
  Sections: Fuel (counts), Mileage (Upto 10k…150k), Transmission Auto/Manual
  (counts), Doors & Seats 2/4/5/7 (counts), Exterior Color swatches, Price dual
  slider, Year dual slider. Sticky footer: Reset all (outline) + Show Results (N)
  (dark, closes). `FleetFilters.tsx` now owns `advanced` state, applies it in the
  `filtered` memo, has a "Filters" toolbar button + a `.range-thumb` slider CSS in
  globals.css. Mileage + colour are derived deterministically in `lib/content.ts`
  (`getCarMileage`, `getCarColor`, `EXTERIOR_COLORS`) — cars.json untouched.
  Header's /fleet sub-bar "Filters" button now dispatches `open-fleet-filters`
  (window CustomEvent) which FleetFilters listens for. tsc clean, routes 200.
- **P1 Login modal (OCD-style)** — DONE. New `components/layout/AuthProvider.tsx`
  = client context (loggedIn, phone, favorites Set, openLogin/login/logout,
  isFavorite/toggleFavorite) persisted to localStorage (`apex-auth`,
  `apex-favorites`); mounted in `app/layout.tsx` inside Lenis. Rewrote
  `LoginModal.tsx` to OCD spec: title "Log in to access your favorites…",
  WhatsApp number field w/ dial-code select (+357/+971/+7/+380/+40), orange
  "Continue", "Or" divider, 4 social icon buttons (Apple/Facebook/Google/Email,
  inline SVG, no-op onClick), "Don't have an account? Sign up" toggle, ToS
  consent. Signed-in view shows phone + Log out. Hearts in CarCard,
  CarCardHorizontal + save in CarActions now call `toggleFavorite` (opens login
  when logged out, else toggles persistent favourite). Header Login buttons call
  `openLogin`, show "Account" when logged in. tsc clean, all routes 200.
- **Catalogue expansion** — DONE. Grew fleet 22 → 53 cars with OCD-style models
  (Lamborghini, Ferrari, McLaren, Rolls-Royce, Bentley, Porsche, Range Rover,
  Tesla, muscle, etc.). Added categories: Luxury, Supercars, Sports, Convertible,
  Electric, Muscle. Files: `content/cars.json`, `lib/content.ts` (photo maps,
  getDeposit tiers), `FleetFilters.tsx` (category chips), `CategoriesGrid.tsx`.
  Generator kept at `/tmp/gen-cars.js` (not committed).

## Notes for next run
- Screenshots via preview tool hang on this project (Lenis rAF never idles) —
  verify with `curl` HTTP codes + `preview_eval` DOM measurements instead.
- Real car photos are the only remaining "AI look" gap. Mechanism ready: drop
  `public/cars/<slug>.jpg` and set `car.image` — it overrides stock (priority in
  `getCarImage`). User said they'll supply images.
- OneDrive corrupts `.next` occasionally → `rm -rf .next` if EINVAL readlink.

## needs-me (user decisions)
- (none open)
