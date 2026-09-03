# Dirt & Co — Project Instructions

React/Next.js electric dirt bike ecommerce site, Vercel target, deployed via GitHub.

## Architecture
`src/config/site.js` is the single source of truth. Adding an entry to PRODUCTS / CATEGORIES / POSTS
automatically generates pages, routes, metadata, JSON-LD, sitemap entries, and navigation links.
Never hand-write pages. Never hand-edit generated files (`llms.txt`, `.well-known/*`, `vercel.json`).
Edit `src/config/site.js` and run `npm run gen` or `npm run build`.

## Rules
- `npm run crosscheck` must pass before every push.
- Exactly one `<h1>` per page. Meta descriptions ~150 chars. Titles ≤60 chars.
- Product images: 4:3 canvas with WebP/AVIF support.
- Emails entity-encoded (&#64;) everywhere, including JSON-LD.
- Never commit `node_modules/`, `.next/`, `out/`, `docs/` to public outputs.
- Framework Preset on Vercel must be "Next.js".

## Live Placeholders
- Domain: `DOMAIN.com` (update in `SITE.domain` when DNS is live)
- Web3Forms Key: `pending` (form submissions fall back cleanly to thank-you and WhatsApp)
- GSC Verification: `pending`

## Brand Facts (Only these are true — never invent more)
- Founded: 2021 in Sunshine Coast, Queensland, Australia.
- Products: Full-size electric dirt bikes, trail e-motos, youth electric bikes, 72V race batteries.
- Order rules: Free AU shipping on parts/gear >$150 AUD. Crate freight for complete bikes.
- Payment: 5% Crypto discount (BTC/USDT), Direct Bank Transfer, PayID.
- Warranty: 2-Year Australian Factory Warranty on frame, motor, controller, battery.
