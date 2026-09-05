# Keyword Strategy & Entity Map: Australian Electric Motor Co

*Every URL below was verified live against the site on 2026-09-05 — this replaces the previous
version, which mapped keywords to fictional products (Apex 72R, Ironstone CR450, Terra X) and
category paths (`/shop/full-size-electric-dirt-bikes/`, `/shop/batteries-performance-parts/`) that
never existed in the real catalogue.*

## Primary Focus Term
- **electric dirt bike** — Target URL: `/` (homepage) + `/shop/` (full catalogue)

## Secondary Keywords & Content Mapping
1. **electric dirt bikes australia** → `/shop/electric-dirt-bikes/`
2. **australian electric motor co** → `/` (brand/navigational)
3. **pay in 4 electric dirt bike** → `/finance/`
4. **crypto discount electric dirt bike** → `/shop/` (10% BTC/USDT discount banner + cart)
5. **surron australia dealer** → `/brands/surron/`
6. **talaria sting r australia** → `/shop/trail-mid-weight-enduro/talaria-sting-r-mx4/`
7. **stark future varg australia** → `/shop/full-size-motocross/stark-varg-mx-60hp/` (+ `/brands/stark-future/` for the full range)
8. **adult electric dirt bike** → `/shop/adult-electric-dirt-bikes/` (29 models)
9. **kids electric dirt bike** → `/shop/kids-youth-electric-dirt-bikes/` (35 models)
10. **road legal electric dirt bike australia** → `/shop/adr-road-legal-dirt-bikes/` (6 models, ADR-compliant)
11. **farm electric dirt bike / station e moto** → `/shop/utility-farm-e-bikes/` (UBCO 2X2 range)
12. **high performance electric motocross** → `/shop/full-size-motocross/`
13. **72v electric dirt bike nsw** → `/shop/high-capacity-batteries/` (+ any 72V-spec bike page)
14. **electric trail bike australia** → `/shop/trail-mid-weight-enduro/`
15. **e-ride pro ss 72v** → `/shop/trail-mid-weight-enduro/e-ride-pro-ss-30/` (+ `/brands/e-ride-pro/`)
16. **molicel 72v battery pack** → `/shop/high-capacity-batteries/ebmx-72v-42ah-high-discharge-race-battery/` (+ `/shop/high-capacity-batteries/nexbat-80v-60ah-pro-race-battery-ultra-bee/`)
17. **electric dirt bike vs 250cc petrol** → `/blog/electric-dirt-bike-vs-petrol-australia/`
18. **charging electric dirt bike off grid / outback** → `/blog/charging-electric-dirt-bikes-off-grid/`
19. **electric dirt bike laws australia** → `/blog/australian-electric-dirt-bike-laws-guide/`

## Full category → URL reference (55 categories)

**Electric Dirt Bikes** (`/shop/<slug>/`): `electric-dirt-bikes` (root, 69), `adult-electric-dirt-bikes` (29), `full-size-motocross` (10), `trail-mid-weight-enduro` (13), `kids-youth-electric-dirt-bikes` (35), `junior-trials-youth-dirt-bikes` (17), `balance-mini-bikes` (18), `adr-road-legal-dirt-bikes` (6), `utility-farm-e-bikes` (5)

**Parts & Upgrades**: `parts-upgrades` (90), `batteries-chargers` (50) → `high-capacity-batteries` (34), `fast-chargers` (16); `controllers-electronics` (11) → `aftermarket-controllers` (4), `displays-throttles` (7); `suspension-steering` (5) → `front-forks` (3), `rear-shocks` (1); `brakes-rotors` (9) → `complete-brake-sets` (1), `oversized-rotors` (3), `pads-lines` (5); `wheels-drivetrain` (15) → `wheel-sets-tyres` (14), `sprockets-chains` (1)

**Riding Gear**: `riding-gear` (36), `helmets` (8), `body-armour` (12), `body-armour-protection` (2), `gloves-goggles` (8), `boots` (6)

**Accessories**: `accessories` (58), `bike-stands-tools` (15), `storage-transport` (7), `graphics-plastics-kits` (30), `maintenance-chemicals` (6)

**Brands** (`/brands/<slug>/`): surron, talaria, stark-future, e-ride-pro, ktm, husqvarna, gasgas, kuberg, oset, rfn-apollo, arctic-leopard, stacyc, thumpstar, ubco

## Excluded from current keyword targeting — no stock yet
`wiring-harnesses`, `linkage-triangles`, `belt-drive-kits` — real category pages exist but have 0
products. Don't target keywords at these until they're stocked; revisit once products are added.

## Unused blog clusters (write next, once GSC is connected and indexing traffic is real)
- Battery care / lithium longevity in Australian heat (pairs with `high-capacity-batteries`)
- Sur-Ron vs Talaria vs Stark VARG comparison (pairs with `/compare/`)
- Financing a farm e-bike fleet (pairs with `utility-farm-e-bikes` + `/finance/`)
- Road-legal ADR registration process state-by-state (pairs with `adr-road-legal-dirt-bikes`)

## Schema entity alignments (as shipped on the homepage JSON-LD)
- `knowsAbout`: Electric dirt bikes, Electric motocross bikes, 72V lithium battery systems, Off-road riding gear, Road-legal (ADR) electric motorcycles
- `areaServed`: Australia (Country-level; `address.addressRegion` is NSW)
- `sameAs`: Instagram, YouTube (`BRAND.sameAs` in `src/config/site.js` — verify these are real, active accounts before treating them as a trust signal)
