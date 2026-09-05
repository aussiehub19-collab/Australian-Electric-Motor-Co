# FAQ Bank — Australian Electric Motor Co

*Every question below is a real, distinct question extracted from the keyword exports (duplicate
phrasings of the same question — e.g. the ~24 variants of "what's the best/cheapest/fastest electric
dirt bike" that hit the homepage — are consolidated into one canonical Q&A rather than answered once
per phrasing, which is what actually ranks and reads naturally). Facts used in every answer are
limited to what's verifiably true in `src/config/site.js` / `CLAUDE.md` — nothing invented, per your
standing "never fabricate brand facts" rule.*

*Re-checked against the v3 broad-scope dataset and the RFN/front-fork acronym-collision fixes (see
`keyword-map.md` re-analysis note) — no off-topic question made it into this bank; grepped clean for
every contamination marker found during that pass.*

## Homepage FAQ (6–8 questions, highest impact)

Replaces the current 5-question set with these, ranked by combined real search volume from the
~24 homepage-matched question keywords (each ~20 vol individually, but "what's the best/cheapest/
fastest electric dirt bike" cluster combines to real demand):

1. **What is an electric dirt bike?**
   An electric dirt bike is an off-road motorcycle powered by a battery and electric motor instead
   of a petrol engine — same riding position and suspension as a traditional dirt bike, but silent,
   instant-torque power delivery with no exhaust, clutch (on most models), or fuel to carry.

2. **How much does an electric dirt bike cost in Australia?**
   Our range spans from junior/balance bikes through to full-size adult motocross machines, with
   pricing across the catalogue reflecting battery size, power output and brand. Browse [/shop/] to
   filter by category and price, or use the 10% instant discount on crypto (BTC/USDT) payment.

3. **What is the fastest electric dirt bike you sell?**
   Top speed varies by model and power mode — our highest-output full-size motocross bikes are built
   for serious trail and track performance. Check each product's spec sheet on `/shop/full-size-motocross/`
   for exact top speed, as it differs between brands and battery configurations.

4. **Are electric dirt bikes street legal in Australia?**
   Only models built and equipped for road registration — with headlights, indicators, mirrors and a
   compliant VIN — can be road-registered, and this varies by state. Browse our
   [ADR Road-Legal range](/shop/adr-road-legal-dirt-bikes/) for models built for street use, and see
   our [Australian electric dirt bike laws guide](/blog/australian-electric-dirt-bike-laws-guide/)
   for the state-by-state detail.

5. **Do electric dirt bikes need to be registered?**
   Off-road-only electric dirt bikes (the majority of our range) don't need registration when ridden
   on private property or designated trail networks — the same as a petrol dirt bike. Only models
   intended for public roads need ADR registration; see our road-legal category and the laws guide
   linked above.

6. **What's the cheapest electric dirt bike in your range?**
   Our balance and junior/youth models are the most accessible entry point into electric off-road
   riding — browse [Balance & Mini Bikes](/shop/balance-mini-bikes/) and
   [Junior Trials & Youth Dirt Bikes](/shop/junior-trials-youth-dirt-bikes/) for the current lineup
   and pricing.

7. **What payment options do you offer?**
   Direct Bank Transfer, PayID, Pay in 4 (four fortnightly instalments, 0% interest), and a 10%
   instant discount for paying in crypto (BTC/USDT).

8. **Do parts/accessories come with any discount when I buy a bike?**
   Yes — any part, battery, charger, gear or accessory item gets an automatic 5% discount when a
   bike is in the same cart, applied at checkout.

*Speakable schema flag: Q1 and Q4 (the two most likely to be read aloud by a voice assistant /
AI answer engine — definitional + compliance questions).*

---

## Full FAQ page bank (grouped by theme)

### Buying & Pricing
- **What's the best electric dirt bike for a beginner?** → depends on rider age/experience; point to
  the relevant category (balance/junior for kids, adult trail/enduro for adult beginners) rather than
  naming one model, since "best" is subjective — steer to `/compare/` to let the customer decide.
- **What is the best budget electric dirt bike?** → same steer-to-category answer, price-sorted via
  the shop filter's "Price: low to high" sort.
- **How much are motocross bikes?** (full-size-motocross, 140 vol) → range explanation, link to category.
- **What electric dirt bike has the longest range?** → range varies by battery capacity (kWh) and
  rider weight/terrain — link to `/shop/high-capacity-batteries/` for upgrade options and to
  individual product spec sheets for rated range.
- **What is the best electric dirt bike for adults?** (adult-electric-dirt-bikes) → steer to category,
  note the 29-model range spans full-size motocross through mid-weight enduro.

### Registration & Legal
- **Can you register an electric dirt bike?** → yes, if it's one of our ADR road-legal models; link
  to category + laws guide.
- **Are dirt bike helmets road/street legal?** (helmets + adr-road-legal, real question keywords) →
  explain ECE 22.06/AS·NZS 1698 certification is what makes a helmet road-legal, not the bike itself;
  every helmet we stock states its certification on the product page.

### Kids, Youth & Balance Bikes (20 real questions extracted — genuinely the richest single cluster)
- **What age is best for a balance bike?** → general guidance (from ~2 years, varies by child's
  height/confidence), link to `/shop/balance-mini-bikes/` size filter.
- **Are balance bikes good for 2–3 year olds?** → yes, with a size caveat; link to size-filtered category.
- **Do balance bikes have pedals?** → no — that's the point (balance/coordination before pedalling),
  explain briefly.
- **Is a balance bike worth it / better than training wheels?** → comparative answer: balance bikes
  teach balance directly rather than delaying it, most riding schools/coaches now recommend them over
  training wheels.
- **What to look for in a balance bike?** → seat height adjustability, weight, brake (yes/no at this
  age), link to category.

### Brand-specific (real questions per brand, extracted from the exports)
- **KTM:** Is KTM Austrian? Is KTM better than Honda? Is KTM the best dirt bike brand? Does KTM still
  make motorcycles? → factual answers only (KTM is headquartered in Mattighofen, Austria — this is
  a verifiable public fact, not a site claim); "best/better than" questions get a diplomatic answer
  steering to spec comparison via `/compare/`, never disparaging a competitor brand by name.
- **Sur-Ron:** Is a Sur-Ron electric? Is a Sur-Ron an electric dirt bike? Is Sur-Ron the best e-bike?
  → factual (yes, Sur-Ron is fully electric) + steer "best" to `/compare/`.
- **Talaria:** How much is a Talaria X3? What's the cheapest/fastest/newest Talaria? → link to the
  Talaria brand hub's live, current lineup and pricing rather than quoting a number that goes stale.
- **Stark Future:** How long does a Stark VARG battery last? How many kW is a Stark VARG? Does it have
  a clutch? Can you register one in Australia? → answer from the actual product spec sheet data on
  each Stark VARG product page (battery capacity/kWh, peak power, no traditional clutch on a
  direct-drive electric powertrain), not a single flat number that varies by model.
- **Husqvarna:** general brand-heritage question ("are all Husqvarna keys the same") → low priority,
  answer briefly or fold into a general "genuine parts & keys" note rather than a dedicated entry.

### Riding Gear & Safety
- **What is balaclava?** (110 vol, matched to body-armour — genuinely a bit off-topic for a chest
  protector page, better answered as a short aside on the `/shop/gloves-goggles/` or a general gear
  page: an under-helmet balaclava protects against dust/sun and improves helmet hygiene) — see the
  product-gap note on whether to actually stock one.
- **Are dirt bike helmets the same as street helmets?** → no — explain certification differences
  briefly (ECE 22.06 / AS·NZS 1698 for off-road, ADR for street), link to helmets category.

---

## Product & category page FAQ (Batch 3 build target)

Per your "add FAQ blocks everywhere" decision: every category page with 2+ real question-keywords in
its own cluster (from the table above) gets a 2–4 question FAQPage block using those exact questions.
Every individual product page gets a **generic 2-question template** (since SKU-level question data
essentially doesn't exist — same reality as the keyword-map's product appendix):
- "Does the [Product Name] come with a warranty?" → 2-Year Australian Factory Warranty, standard answer.
- "Is the [Product Name] covered by the 5% bundle discount?" → yes if bought with a bike (parts/gear/
  accessories only — bikes themselves aren't included), standard answer.
- **Bikes additionally get:** "Is the [Product Name] road-legal?" → answered from that bike's own
  `roadLegal` field, never guessed.

## Schema notes
- FAQPage JSON-LD on: homepage (existing, content refreshed above), `/faq/` (full bank), every
  category/brand page with a dedicated FAQ block, every product page (generic 2–3 question block).
- Speakable schema: homepage Q1 + Q4 only (see above) — don't over-flag; speakable is meant for the
  single best answer per page, not every answer.
