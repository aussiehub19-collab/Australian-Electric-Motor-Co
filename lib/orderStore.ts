import { getRedis, isRedisConfigured } from '@/lib/redis';

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
  /** Which checkout button the customer used — lets the admin dashboard
   * hint which channel to reply on. Optional: orders saved before this
   * field existed simply don't have it. */
  channel?: 'whatsapp' | 'email';
  createdAt: number;
  status: 'pending' | 'payment-sent';
}

const INDEX_KEY = 'aemc:orders:index';
const orderKey = (orderNumber: string) => `aemc:orders:${orderNumber}`;

export function isOrderStoreConfigured(): boolean {
  return isRedisConfigured();
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

/** Removes a test/spam/duplicate order from the dashboard permanently. */
export async function deleteOrder(orderNumber: string): Promise<void> {
  const r = getRedis();
  if (!r) return;
  await r.del(orderKey(orderNumber));
  await r.zrem(INDEX_KEY, orderNumber);
}
