# Australian Electric Motor Co — Project Instructions

React/Next.js (App Router) electric dirt bike ecommerce site. Vercel target, deployed via GitHub —
push to `main` deploys automatically. No client backend (static content, no `/admin`).

## Architecture
`src/config/site.js` is the single source of truth (it assembles `PRODUCTS` from `ebikes.js`,
`batteries-chargers.js`, `riding-gear.js`, `gear-generic.js`, `accessories.js`, `parts.js`). Adding
an entry to PRODUCTS / CATEGORIES / POSTS automatically generates its page, route, metadata,
JSON-LD, sitemap entry, and nav links. Never hand-write a page for a new product. Never hand-edit
generated files (`public/llms.txt`, `public/.well-known/*`, `vercel.json`, `public/robots.txt`,
`public/*.txt` IndexNow key) — they're written by `scripts/gen-agent-files.mjs` from this config;
edit the config and run `npm run gen` or `npm run build` (which runs `gen` via `prebuild`).

Titles/descriptions for product and category pages go through `lib/seo.ts`
(`buildSeoTitle`, `truncateDescription`) — never re-introduce a raw `${name} | ... | ...` template
or an unconditional `.slice(0,150) + '...'`; both caused a sitewide title/description bug fixed in
Sept 2026.

## Rules
- `npm run crosscheck` should pass before every push (see note below — it's a partial check).
- Exactly one `<h1>` per page. Titles ≤60 chars via `buildSeoTitle()`. Meta descriptions ~150 chars
  via `truncateDescription()`.
- Product images: normalised to a 1000×1000 white-background square (`scripts/normalize-product-images.mjs`).
  Every product must have a real local image in `public/images/products/` — never leave a bare
  Unsplash placeholder on a real product.
- Emails entity-encoded (`&#64;`) everywhere, including JSON-LD.
- Never commit `node_modules/`, `.next/`, `out/`, `docs/` to public outputs.
- Framework Preset on Vercel must be "Next.js" (a wrong preset ignores `vercel.json` and 404s the site).
- `scripts/crosscheck.mjs` currently checks agent-ready files, `auth.md`/`ucp` shape, banned-term
  scan, and product data completeness — it does **not** check title/description length, JSON-LD
  validity, or mobile/accessibility. Don't treat "crosscheck passes" as "SEO/a11y clean checked" —
  Sept 2026's full audit was done manually; re-run that kind of pass before trusting a big change.

## Live placeholders — must be resolved before GSC / keyword-mapping work has any effect
- **Domain:** `SITE.domain` = `australianelectricmotorco.com.au`, and every canonical/OG/JSON-LD/
  sitemap URL already points there — but the domain does **not resolve** (DNS not connected as of
  Sept 2026). The only live URL is the Vercel deployment. Connect the domain in the Vercel dashboard
  + DNS before submitting the sitemap to Search Console; until then, canonicals point nowhere.
- **GSC verification:** `SITE.gscVerification` = `'pending'` — the meta tag renders with that literal
  string. Replace with the real verification code once the domain is connected and the property is added.
- **Web3Forms key:** `FORMS.web3formsKey` = `'pending'` — contact/order/wholesale forms fall back
  cleanly to the thank-you page but deliver nowhere. WhatsApp is the only live order channel until
  a real key is set.

## Brand facts (only these are true — never invent more)
- Founded: 2021, Sydney, New South Wales, Australia. HQ/dispatch: Unit 3, 42 Enterprise Circuit,
  Prestons, NSW 2170. ABN 97 628 671 689.
- Products: full-size electric motocross, trail/enduro, road-legal (ADR), junior/youth, balance/mini
  bikes, utility/farm e-bikes, 72V batteries & fast chargers, parts, riding gear, accessories.
- Order rules: free AU shipping on parts/gear/accessories over $150 AUD; enclosed-crate freight
  ($180) for complete bikes.
- Payment: 10% instant discount on crypto (BTC/USDT), Pay in 4 (0% interest, 4 fortnightly
  instalments), Direct Bank Transfer, PayID.
- Bundle discount: any part/battery/charger/accessory/gear item gets 5% off automatically when a
  bike is in the same cart.
- Warranty: 2-Year Australian Factory Warranty on frame, motor, controller, battery.
- No client backend/CMS. No banned-term compliance list configured for this vertical.
