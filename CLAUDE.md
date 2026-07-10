# Apex Auto — Portfolio project rules

> Любое изменение в этом проекте проходит через эти правила. Глобальный `~/.claude/CLAUDE.md`
> (агентские правила) — родитель; этот файл уточняет под Apex Auto.

---

## What this is

Standalone премиум-портфолио. Демонстрационный сайт международного премиум-проката
**Apex Auto** (вымышленный бренд). Данные авто реальные — взяты из аналитики rentcar
как фактура. Английская локаль по умолчанию; архитектура `[locale]` готова к расширению.

**Не клиентский проект.** Цель — выложиться по максимуму как витрина мастерства.

---

## Stack (зафиксирован)

- Next.js 15 App Router · TypeScript strict · React 19
- Tailwind CSS v4 (`@theme` в `app/globals.css`)
- Radix UI primitives + CVA + tailwind-merge
- GSAP + ScrollTrigger, Lenis, Framer Motion
- React Hook Form + Zod (booking-форма)
- Контент: типизированный JSON в `/content` (Sanity подключим позже одной обёрткой)
- Иконки: lucide-react

**НЕ используем здесь:** R3F/3D (выбран «premium, сдержанно»), Sanity SDK,
i18n routing (пока только en), кастомный курсор.

---

## Design tokens (единственный источник правды — `app/globals.css`)

| Категория | Значения |
|---|---|
| Bg | `--color-bg #0a0a0a`, `--color-surface #141414`, `--color-surface-2 #1c1c1c` |
| Fg | `--color-fg #e8e2d5` (beige), `--color-fg-muted #b8b5ad`, `--color-fg-dim #6f6c66` |
| Accent | `--color-accent #e8e2d5` (beige on black), `--color-accent-fg #0a0a0a` |
| Borders | `--color-border #2a2a2a` |
| Шрифты | `--font-display: Satoshi`, `--font-body: DM Sans` |
| Типографика | fluid через clamp: `--text-step--1` … `--text-step-6` |
| Сетка | 8px: `--spacing-1` … `--spacing-24` |
| Радиусы | `--radius-sm/md/lg/xl/full` |
| Тени | `--shadow-sm/md/elevated` |
| Easing | `--ease-premium: cubic-bezier(0.16, 1, 0.3, 1)` — для ВСЕХ анимаций |
| Durations | `--duration-fast 200ms`, `--duration-base 600ms`, `--duration-slow 900ms` |

**Хардкод цветов и размеров в JSX/CSS запрещён.** Только токены / Tailwind v4 классы,
которые их читают (`bg-bg`, `text-fg`, `text-fg-muted`, и т.д.).

**Шрифт Satoshi** не в Google Fonts. Подключим через `next/font/local` когда положим
`.woff2` в `public/fonts/`. Пока fallback: Inter / system-ui (через CSS-переменную).

---

## Adaptiveness (важно)

**Mobile-first.** Базовые стили = мобайл. `md:`/`lg:` — для планшета/десктопа.

Контрольные точки тестирования: **375 / 390 / 430 / 768 / 1024 / 1280 / 1440 px**.

**Sticky Book CTA — всегда виден** после прохождения hero:
- Mobile (<768px): фиксированная нижняя панель `position: fixed; bottom: 0` с CTA «Book now»
  и краткой ценой/состоянием выбора. Учитывает `env(safe-area-inset-bottom)`.
- Tablet/Desktop: sticky CTA в шапке (`position: sticky; top: 0`) + опциональный
  floating action button в правом нижнем углу.
- Скрыт только пока hero-форма в вьюпорте (IntersectionObserver) — там у пользователя
  уже есть полная booking-форма. Как только hero ушёл — Book-кнопка появляется.

---

## Code rules

- **TypeScript strict.** Никаких `any` — используем `unknown` + type guards.
- **RSC по умолчанию.** `"use client"` только в:
  - формах (BookingWidget, BookingForm),
  - интерактивных фильтрах (FleetFilters),
  - GSAP/Lenis-провайдерах,
  - галерее (CarGallery).
  Каждый `"use client"` — с однострочным комментарием почему.
- **Анимируем только `transform` и `opacity`.** Никаких `width/height/top/left`.
- **`prefers-reduced-motion`** — глобально отключает тяжёлое движение (уже в `globals.css`).
- **Bundle budget:** <130 KB JS gzip на маршрут. Проверяем `pnpm run analyze`.
- **Image:** `next/image` всегда, `alt` обязателен, hero-фото с `priority`.
- **Имена:** PascalCase для компонентов, useCamelCase для хуков, camelCase для утилит.
- **Импорты:** `@/...` через path alias, без относительных `../../../`.
- **Барьеры:** UI primitives в `components/ui`, секции в `components/sections`,
  доменное (booking/fleet) — в одноимённых папках. Без барьерных `index.ts` в UI.

---

## Project structure

```
sites/portfolio/
├── app/
│   ├── layout.tsx · page.tsx · globals.css
│   ├── fleet/page.tsx · fleet/[slug]/page.tsx
│   ├── booking/page.tsx
│   ├── sitemap.ts · robots.ts · opengraph-image.tsx
├── components/
│   ├── ui/            Button, Input, Select, Card, Dialog (Radix + CVA)
│   ├── layout/        Header, Footer, StickyBookBar
│   ├── sections/      Hero, FeaturedFleet, Categories, WhyUs, Testimonials, FAQ, FinalCTA
│   ├── booking/       BookingWidget, BookingForm, DateRangePicker, LocationSelect
│   ├── fleet/         FleetGrid, CarCard, FleetFilters, CarGallery, CarSpecs, CarOptions
│   └── motion/        LenisProvider, GsapReveal, useReducedMotion
├── content/           cars.json (22 авто), brand.json
├── lib/               types.ts, utils.ts (cn, formatPrice), content.ts (typed loader), seo.ts
├── public/cars/       placeholder.svg (готов), затем реальные фото
└── public/og/         OG-картинки
```

---

## Workflow when editing

1. **Сначала прочитать этот файл** и `app/globals.css` (токены).
2. **Никаких параллельных правок секций** — одна секция = один шаг.
3. **После каждого шага** — стоп и ревью пользователем. Замечания одним батчем.
4. **Polish-pass** перед DoD: иерархия типографики, контраст AA, мобайл @375,
   reduced-motion, Lighthouse ≥95 mobile.

---

## Definition of Done (для портфолио)

- [ ] Lighthouse Performance ≥95 на мобайле (LCP <2 s, INP <200 ms, CLS <0.1)
- [ ] JSON-LD валиден (`AutoRental` + `Car` + `FAQPage`)
- [ ] sitemap.xml + robots.txt + OG-image работают
- [ ] Один `<h1>` на странице, focus-visible виден, контраст AA
- [ ] Работает на 375 / 768 / 1280
- [ ] Sticky Book CTA появляется после hero на всех ширинах
- [ ] Booking-форма валидируется (Zod), success-state виден
- [ ] Никаких хардкод-цветов / placeholder-текстов
- [ ] Bundle <130 KB JS gzip на маршрут (`pnpm run analyze`)
