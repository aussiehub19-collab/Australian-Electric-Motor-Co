/**
 * Shared title/description builders — keep every generated <title> in the
 * ~50-60 char band and every meta description free of a stray "..." when
 * the source text was never actually truncated.
 */

const BRAND_FULL = 'Australian Electric Motor Co';
const BRAND_SHORT = 'AEMC';
const TITLE_MAX = 60;

/**
 * `{name} | Australian Electric Motor Co`, falling back to the short brand
 * (`AEMC`) and finally the bare name, whichever first fits the 60-char band.
 */
export function buildSeoTitle(name: string): string {
  const full = `${name} | ${BRAND_FULL}`;
  if (full.length <= TITLE_MAX) return full;
  const short = `${name} | ${BRAND_SHORT}`;
  if (short.length <= TITLE_MAX) return short;
  return name;
}

/** Truncate to `max` chars on a word boundary — only appends an ellipsis when it actually cut something. */
export function truncateDescription(text: string, max = 155): string {
  const clean = (text || '').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).replace(/[.,;:\s]+$/, '')}…`;
}
