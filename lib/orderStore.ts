import { Redis } from '@upstash/redis';

/**
 * Order "database" for the admin dashboard — Upstash Redis (free tier, REST
 * API, no persistent connections needed so it works fine from a serverless
 * function). There is deliberately no other data store in this project (see
 * CLAUDE.md) — this exists only so the business can see recent orders in one
 * place and open one to send payment details, instead of hunting through
 * email. Every function degrades to a no-op / empty result when no
 * recognised credential pair is set, so the rest of checkout keeps working
 * (email + WhatsApp) even before this is wired up.
 */

// Vercel's "Connect a Project" flow lets you pick any custom prefix for the
// auto-created env vars (defaults to STORAGE_*, matching its generic KV/Blob
// naming — not Upstash's own UPSTASH_REDIS_* convention). Rather than making
// the setup depend on typing the prefix exactly right, check every name
// Vercel is realistically going to produce.
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

export interface StoredOrder {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  itemsSummary: string;
  amountDue: string;
  grandTotal: string;
  paymentMethodCode: 'bank' | 'payid' | 'crypto' | 'payin4';
  paymentLabel: string;
  createdAt: number;
  status: 'pending' | 'payment-sent';
}

let redis: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const creds = resolveCredentials();
  if (!creds) {
    redis = null;
    return null;
  }
  redis = new Redis({ url: creds.url, token: creds.token });
  return redis;
}

const INDEX_KEY = 'aemc:orders:index';
const orderKey = (orderNumber: string) => `aemc:orders:${orderNumber}`;

export function isOrderStoreConfigured(): boolean {
  return getRedis() !== null;
}

export async function saveOrder(order: StoredOrder): Promise<boolean> {
  const r = getRedis();
  if (!r) return false;
  await r.set(orderKey(order.orderNumber), order);
  await r.zadd(INDEX_KEY, { score: order.createdAt, member: order.orderNumber });
  return true;
}

export async function listOrders(limit = 30): Promise<StoredOrder[]> {
  const r = getRedis();
  if (!r) return [];
  const numbers = await r.zrange<string[]>(INDEX_KEY, 0, limit - 1, { rev: true });
  if (!numbers.length) return [];
  const orders = await Promise.all(numbers.map((n) => r.get<StoredOrder>(orderKey(n))));
  return orders.filter((o): o is StoredOrder => o !== null);
}

export async function getOrder(orderNumber: string): Promise<StoredOrder | null> {
  const r = getRedis();
  if (!r) return null;
  return r.get<StoredOrder>(orderKey(orderNumber));
}

export async function markOrderSent(orderNumber: string): Promise<void> {
  const r = getRedis();
  if (!r) return;
  const existing = await r.get<StoredOrder>(orderKey(orderNumber));
  if (existing) await r.set(orderKey(orderNumber), { ...existing, status: 'payment-sent' });
}
