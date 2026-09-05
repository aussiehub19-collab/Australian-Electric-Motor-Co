# Product Gap Analysis — Australian Electric Motor Co

*Re-verified against the v3 broad-scope (unfiltered, 15,920-keyword) dataset — see `keyword-map.md`
re-analysis note. The Alpinestars finding got stronger, not weaker: more of the long tail is real
apparel-intent demand, not noise (spot-checked the top 30 rows by volume).*

## T1 — Act on this: Alpinestars gear-brand hub gap

**45,860 combined monthly search volume across 3,739 keyword variants (spelling variants "alpine
star"/"alpine stars"/"alpinestar" included), zero dedicated brand presence.**

| Keyword | Volume | KD |
|---|---|---|
| alpinestars | 5,400 | 39 |
| alpine star | 1,900 | 37 |
| alpinestars boots | 1,600 | 10 |
| boots alpinestar | 1,300 | 12 |
| alpinestars helmet | 1,300 | 18 |
| alpine stars | 1,300 | 29 |
| alpinestar | 880 | 38 |
| alpinestars jacket | 880 | 17 |
| alpinestars australia | 720 | 15 |
| alpine star boots | 590 | 12 |
| *+3,729 more, mostly long-tail product/model/spelling variants* | | |

We already stock 5 genuine Alpinestars products (Supertech SM5 Compass Helmet, Bionic Action V2
Protection Jacket, Tech 3S Youth + Tech 7 Enduro Boots) — but they're scattered across generic
categories (helmets, body-armour, boots) with no brand grouping, unlike every bike brand (Surron,
Talaria, KTM...), which gets its own `/brands/<slug>/` hub. Someone searching "alpinestars boots
australia" has no page on the site that says "here's everything we carry from this brand."

**Recommendation:** extend the existing brand-hub pattern to gear brands. This is architecturally
identical to what already exists for bike brands (same template, same `CATEGORIES` section-type
mechanism) — not a new build pattern, just a new instance of one. Flagged as **Batch 6** in
`keyword-map.md`, pending your go-ahead since it's a real structural addition, not a content edit.

## T2 — Smaller version of the same pattern: Fox Racing

**60 combined volume, 3 keywords** — much smaller than Alpinestars, but we do stock 5 Fox Racing
products (V1 Matte Black Helmet, Youth V1 Leed Helmet, Youth Titan Sport Roost Deflector) with the
same "no brand grouping" gap. Low priority on its own; bundle into Batch 6 if you approve it, since
the incremental cost of one more brand-hub page is small once the template exists.

**Bell Helmets, Leatt, Oakley, Sidi, O'Neal, Mobius, 100%** also fit this pattern (each 1–3 real
products, no hub) but returned no measurable search volume in this export — not worth a dedicated
hub yet on data alone. Revisit if Alpinestars/Fox hubs perform well.

## Confirmed NOT a gap: hydration packs

"Dirt bike hydration pack" and related terms combine to ~1,680 monthly volume — real demand — but
we already stock a **Hydration Pack (2L)** product. No new product needed; this is really a
*visibility* opportunity (make sure it's easy to find, and blog post #24 in `blog-plan.md` links to
it), not a catalogue gap.

## Known gaps that are about stock, not strategy (already tracked)

Three categories exist on the site with real, distinct names but currently carry zero products —
**not duplicates**, genuinely just not stocked yet: `wiring-harnesses`, `linkage-triangles`,
`belt-drive-kits`. `keyword-map.md` has qualitative keyword estimates ready for two of them
(wiring-harnesses, belt-drive-kits) for whenever they're stocked. **`linkage-triangles` returned zero
data even at broad scope** — neither real CSV rows nor a plausible qualitative estimate (it's an
obscure suspension-linkage part name with no measurable AU search presence either way) — flagged
`NEEDS MANUAL REVIEW` in `keyword-map.md` rather than guessed at. No action needed on any of the
three until there's inventory to put on those pages; `linkage-triangles` additionally needs a manual
keyword check whenever it's stocked, since the automated pipeline found nothing to work from.

**Kuberg** is a real, stocked bike brand that happened to return zero rows in this keyword export
(the seed file may not have been pulled, or the brand's search volume in AU is genuinely too low to
register) — this is a **data gap**, not a product gap. Its brand hub got a qualitative estimate in
`keyword-map.md`; worth a dedicated re-pull once there's traffic to justify it.

## Priority summary

| Gap | Volume | Action | Batch |
|---|---|---|---|
| Alpinestars brand hub | 45,860 | Build hub page (same template as bike brands) | 6 (pending approval) |
| Fox Racing brand hub | 60 | Build hub page, bundle with above | 6 (pending approval) |
| Hydration pack visibility | 1,680 | Covered by blog post #24 + existing product | already planned |
| Empty parts categories | — | No action — wait for stock | n/a |
| `linkage-triangles` data gap | — | Manual keyword check once stocked (broad-scope pipeline found nothing) | n/a |
| Kuberg keyword data | — | Re-pull export later | n/a |
