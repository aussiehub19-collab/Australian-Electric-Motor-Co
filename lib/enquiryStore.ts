import { getRedis, isRedisConfigured } from '@/lib/redis';

/**
 * Contact-form and wholesale-enquiry storage — same Redis-backed pattern as
 * lib/orderStore.ts, so the /admin/enquiries/ dashboard can list and reply to
 * them instead of the business only ever seeing them in an inbox. Degrades
 * to a no-op / empty result with no Redis configured; the form emails
 * (app/api/contact, app/api/wholesale) still send either way.
 */

export interface StoredEnquiry {
  id: string;
  type: 'contact' | 'wholesale';
  name: string;
  email: string;
  phone: string;
  message: string;
  /** Type-specific extra fields for display — e.g. Interest for contact,
   * Business & ABN / Est. Units for wholesale. Label -> value. */
  meta: Record<string, string>;
  createdAt: number;
  status: 'new' | 'replied';
}

const INDEX_KEY = 'aemc:enquiries:index';
const enquiryKey = (id: string) => `aemc:enquiries:${id}`;

export function isEnquiryStoreConfigured(): boolean {
  return isRedisConfigured();
}

/** A short, readable reference — same style as lib/order.ts#generateOrderNumber. */
export function generateEnquiryId(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ENQ-${rand}`;
}

export async function saveEnquiry(enquiry: StoredEnquiry): Promise<boolean> {
  const r = getRedis();
  if (!r) return false;
  await r.set(enquiryKey(enquiry.id), enquiry);
  await r.zadd(INDEX_KEY, { score: enquiry.createdAt, member: enquiry.id });
  return true;
}

export async function listEnquiries(limit = 50): Promise<StoredEnquiry[]> {
  const r = getRedis();
  if (!r) return [];
  const ids = await r.zrange<string[]>(INDEX_KEY, 0, limit - 1, { rev: true });
  if (!ids.length) return [];
  const enquiries = await Promise.all(ids.map((id) => r.get<StoredEnquiry>(enquiryKey(id))));
  return enquiries.filter((e): e is StoredEnquiry => e !== null);
}

export async function getEnquiry(id: string): Promise<StoredEnquiry | null> {
  const r = getRedis();
  if (!r) return null;
  return r.get<StoredEnquiry>(enquiryKey(id));
}

export async function markEnquiryReplied(id: string): Promise<void> {
  const r = getRedis();
  if (!r) return;
  const existing = await r.get<StoredEnquiry>(enquiryKey(id));
  if (existing) await r.set(enquiryKey(id), { ...existing, status: 'replied' });
}

/** Removes a test/spam enquiry from the dashboard permanently. */
export async function deleteEnquiry(id: string): Promise<void> {
  const r = getRedis();
  if (!r) return;
  await r.del(enquiryKey(id));
  await r.zrem(INDEX_KEY, id);
}
