/**
 * Shared product search matching. Designed so a query matches from the first
 * characters typed — a prefix like "sur", "tal", "72v" surfaces results
 * immediately, before a full word is entered.
 */

export const normalizeText = (s: unknown): string =>
  (s == null ? '' : String(s)).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Build one normalized text blob from an item's searchable fields. */
export const buildHaystack = (parts: unknown[]): string =>
  normalizeText(parts.filter(Boolean).join(' '));

/**
 * True when `rawQuery` matches `text`:
 *  - substring match, or
 *  - punctuation-insensitive match ("surron" ↔ "sur ron"), or
 *  - every query token is a word-prefix ("sur bee" ↔ "Sur-Ron … Bee").
 */
export function textMatchesQuery(text: string, rawQuery: string): boolean {
  const q = normalizeText(rawQuery);
  if (!q) return true;
  if (text.includes(q)) return true;
  if (text.replace(/ /g, '').includes(q.replace(/ /g, ''))) return true;
  const words = text.split(' ');
  return q.split(' ').every((qw) => words.some((w) => w.startsWith(qw)));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function productMatchesQuery(p: any, rawQuery: string): boolean {
  const text = buildHaystack([
    p.name,
    p.brandName,
    p.brand,
    p.category,
    p.subcategoryName,
    p.shortDescription,
    p.description,
    p.badge,
    ...(Array.isArray(p.fitment) ? p.fitment : []),
    ...(p.specs ? Object.values(p.specs) : []),
  ]);
  return textMatchesQuery(text, rawQuery);
}
