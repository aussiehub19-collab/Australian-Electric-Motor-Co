import { Redis } from '@upstash/redis';

/**
 * Shared Upstash Redis client — used by both lib/orderStore.ts and
 * lib/enquiryStore.ts so there's one credential-resolution path and one
 * connection, not a copy per store. Vercel's "Connect a Project" flow lets
 * you pick any custom prefix for the auto-created env vars (defaults to
 * STORAGE_*, matching its generic KV/Blob naming — not Upstash's own
 * UPSTASH_REDIS_* convention), so this checks every name Vercel is
 * realistically going to produce instead of requiring one exact prefix.
 */
const CREDENTIAL_CANDIDATES: [string, string][] = [
  ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
  ['KV_REST_API_URL', 'KV_REST_API_TOKEN'],
  ['STORAGE_REST_API_URL', 'STORAGE_REST_API_TOKEN'],
  ['STORAGE_KV_REST_API_URL', 'STORAGE_KV_REST_API_TOKEN'],
];

function resolveCredentials(): { url: string; token: string } | null {
  for (const [urlKey, tokenKey] of CREDENTIAL_CANDIDATES) {
    const url = process.env[urlKey];
    const token = process.env[tokenKey];
    if (url && token) return { url, token };
  }
  return null;
}

let redis: Redis | null | undefined;

export function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const creds = resolveCredentials();
  if (!creds) {
    redis = null;
    return null;
  }
  redis = new Redis({ url: creds.url, token: creds.token });
  return redis;
}

export function isRedisConfigured(): boolean {
  return getRedis() !== null;
}
