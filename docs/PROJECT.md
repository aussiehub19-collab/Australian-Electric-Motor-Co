# Project Strategy: Australian Electric Motor Co (WebForge v9.1 Vercel Build)

*Last verified against the live site: 2026-09-05.*

## 1. Brand Identity
- **Name:** Australian Electric Motor Co (short: AEMC)
- **Tagline:** Australia's Premier Electric Dirt Bike Specialist & High-Voltage Moto Engineering
- **Domain:** `australianelectricmotorco.com.au` (set in `SITE.domain`, DNS **not yet connected** — see Live Placeholders)
- **Deploy:** Vercel, GitHub auto-deploy on push to `main`. No client backend/CMS.
- **Primary Keyword:** electric dirt bike
- **HQ:** Sydney, New South Wales, Australia. Dispatch: Unit 3, 42 Enterprise Circuit, Prestons, NSW 2170. ABN 97 628 671 689.
- **Founded:** 2021.
- **Target Market:** Australian off-road riders, private-acreage owners, motocross racers, parents of junior riders, station/farm managers wanting silent, high-torque electric performance.

## 2. Competitive Edge & Positioning
- **Terrain Hardening:** 40°C+ ambient thermal dissipation, IP67 sealed electronics for creek crossings and bull-dust.
- **Instant Torque:** 0-RPM peak torque delivery beating conventional 250cc-450cc four-stroke petrol bikes.
- **Zero Trail Noise:** unlocks private acreage riding and noise-restricted properties.
- **Australian Backing:** Sydney/NSW dispatch, 2-Year factory warranty, NSW spare-parts inventory, 10% instant crypto discount (BTC/USDT), Pay in 4 (0% interest), Direct Bank Transfer, PayID.
- **Bundle economics:** any part/battery/charger/accessory/gear item is automatically 5% off when a bike is in the same cart — a real, functioning cart feature, not just marketing copy.

## 3. Architecture & Standards
- **Framework:** Next.js App Router (React 19, TypeScript), Tailwind CSS.
- **Deployment:** Vercel via GitHub auto-deploy (`trailingSlash: true`, live API-less static content).
- **Single source of truth:** `src/config/site.js` assembles `PRODUCTS` (253, every one with a real
  normalised 1000×1000 photo) from `ebikes.js`, `batteries-chargers.js`, `riding-gear.js`,
  `gear-generic.js`, `accessories.js`, `parts.js`, plus `CATEGORIES` (55, cleaned Sept 2026 — see
  §6) and `POSTS` (3 blog posts).
- **SEO & AI Visibility:** Store/Organization/BikeStore + FAQPage JSON-LD on the homepage (enriched
  with foundingDate, foundingLocation, areaServed, numberOfItems, knowsAbout, sameAs, brand, logo,
  makesOffer/AggregateOffer), Product + BreadcrumbList on every product page. Full agent-ready file
  set (`llms.txt`, `auth.md`, all `.well-known/*`, `webmcp.js`) present and correctly typed on Vercel,
  bar one known Vercel platform limitation (extensionless `.well-known/*` files serve as
  `application/octet-stream` regardless of config — accepted, not worth routing around).
- **Titles/descriptions:** generated via `lib/seo.ts` (`buildSeoTitle`, `truncateDescription`) — keeps
  every product/category/brand title ≤60 chars and never appends a stray ellipsis to an
  already-short description. (Sept 2026 fix — was 90-127 chars on product pages before.)

## 4. Site structure (post-cleanup, Sept 2026)

A legacy `/electric-dirt-bikes/*` page tree duplicated `/shop/*` for the same keywords (same
titles/H1s/product lists) and 4 `CATEGORIES` entries were exact duplicates of a populated sibling
with zero products of their own. Both were removed and 301-redirected to the real page — **the shop
catalogue under `/shop/` is now the single, canonical URL for every category.** A bike-tagging bug
that silently mis-classified every kids/junior/balance bike as "adult" was also fixed (was leaking
35 kids bikes into the 29-bike adult category).

| Section | Categories | Live products |
|---|---|---|
| Electric Dirt Bikes | 9 (adult/kids hubs + 6 leaf + root) | 69 |
| Parts & Upgrades | 20 (3 currently empty — no stock yet) | 90 |
| Riding Gear | 6 | 36 |
| Accessories | 5 | 58 |
| Brands | 14 (Surron, Talaria, Stark Future, E-Ride Pro, KTM, Husqvarna, GASGAS, Kuberg, OSET, RFN/Apollo, Arctic Leopard, STACYC, Thumpstar, UBCO) | — |

Empty categories with no stock yet (excluded from current keyword targeting — see
`keyword-map.md`): `wiring-harnesses`, `linkage-triangles`, `belt-drive-kits`.

## 5. Forms & payments
- **Provider:** `web3forms` (`FORMS.provider`). **Key is `'pending'`** — forms fall back cleanly to
  the thank-you page but deliver no email. WhatsApp (+61 480 031 899) is the only live order channel
  until a real key is set.
- **Payment:** 10% crypto (BTC/USDT), Pay in 4, Direct Bank Transfer, PayID.

## 6. Live placeholders — block GSC/keyword-mapping work until resolved
1. **Domain DNS** — `australianelectricmotorco.com.au` does not resolve. Every canonical/OG/JSON-LD/
   sitemap URL already points there. Connect it in Vercel → Domains + your DNS provider.
2. **`SITE.gscVerification`** — literal string `'pending'`. Replace with the real GSC meta-tag value
   once the domain is connected and the property is added in Search Console.
3. **`FORMS.web3formsKey`** — literal string `'pending'`. Sign up free at web3forms.com for a real key.

## 7. Backend
No client CMS/backend. Pure static content editing via `src/config/site.js` and the product config
files, through Claude Code.
