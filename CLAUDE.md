# Australian Electric Motor Co — Project Instructions

React/Next.js (App Router) electric dirt bike ecommerce site. Vercel target, deployed via GitHub —
push to `main` deploys automatically. No client-editable CMS for site content — the one exception is
`/admin/orders/` + `/admin/send-payment-email/`, a small passcode-gated order dashboard + compose
tool (see Live status below) backed by Upstash Redis, not a general backend.

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

## Live status (as of Sept 2026)
- **Domain + GSC:** `SITE.domain` = `australianelectricmotorco.com.au`, DNS delegated to Vercel
  nameservers, GSC + Bing verified and sitemap submitted. Live, not a placeholder.
- **Email:** contact (`/contact/`), wholesale (`/wholesale/`) and order (`/checkout/`) all send
  branded HTML mail via Zoho SMTP (`lib/mailer.ts`, `lib/emailTemplate.ts`). Needs
  `ZOHO_SMTP_USER` + `ZOHO_SMTP_PASSWORD` (a Zoho app-specific password) in Vercel env vars — see
  `.env.example`. Without them, `sendMail()` returns `{sent:false}`, the API responds 503, and the
  form/checkout UI falls back to its WhatsApp/phone message.
- **Checkout (`/checkout/`):** cart is items-only in the side drawer (`components/CartDrawer.tsx`,
  `lib/useCartStorage.ts`, `lib/cart.ts`) — delivery details, payment method, Pay in 4, and the
  WhatsApp-vs-Email choice all live on the checkout page. Both channels carry an order number
  (`lib/order.ts#generateOrderNumber`, client-generated). Email places two sends: a notification to
  the business (with a "Send Payment Details" button, see below) and a confirmation to the customer
  promising a follow-up payment-details email.
- **`/admin/orders/` + `/admin/send-payment-email/`:** `app/api/order` best-effort records every
  order to `lib/orderStore.ts` (Upstash Redis, via Vercel's Storage tab → Create Database. That
  flow lets you pick any env var prefix, so `resolveCredentials()` checks several likely names —
  `UPSTASH_REDIS_REST_*`, `KV_REST_API_*`, `STORAGE_REST_API_*`, `STORAGE_KV_REST_API_*` — instead
  of requiring one exact prefix; without any of them checkout still emails/WhatsApps fine, orders
  just don't appear in the dashboard). `/admin/orders/` lists them; opening
  one goes to `/admin/send-payment-email/?id=<orderNumber>`, which fetches that order
  (`app/api/admin/orders/[id]`) and pre-fills the payment-details compose form — same destination
  the button in the order notification email opens. Sending marks the order `payment-sent`. All
  three admin API routes are gated on `ADMIN_PASSCODE` (server-only env var, `X-Admin-Passcode`
  header, checked in `lib/adminAuth.ts`) — the pages render for anyone who finds the URL, but
  nothing loads or sends without it. `robots.txt` disallows `/admin/`.
- **Analytics:** GA4 via `components/Analytics.tsx`, gated on `NEXT_PUBLIC_GA_ID` — empty means no
  tag renders at all.

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
- No client-editable content CMS (the order dashboard is not one — see Live status). No
  banned-term compliance list configured for this vertical.
