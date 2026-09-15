'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAdminPasscode } from '@/lib/useAdminPasscode';
import { PasscodeGate } from '@/components/admin/PasscodeGate';
import type { StoredOrder } from '@/lib/orderStore';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('en-AU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrdersDashboardPage() {
  const { unlocked, passcode, unlock, lock } = useAdminPasscode();
  const [orders, setOrders] = useState<StoredOrder[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!passcode) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/orders/', { headers: { 'X-Admin-Passcode': passcode } });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders);
      } else {
        if (res.status === 401) lock();
        throw new Error(data?.message || 'Failed to load orders');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong loading orders.');
    } finally {
      setLoading(false);
    }
  }, [passcode, lock]);

  useEffect(() => {
    if (unlocked) fetchOrders();
  }, [unlocked, fetchOrders]);

  if (!unlocked) {
    return <PasscodeGate title="Orders" onUnlock={unlock} />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black uppercase text-white tracking-tight">Orders</h1>
        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="text-xs font-mono text-amber-400 hover:text-amber-300 disabled:text-stone-600"
        >
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}

      {orders === null && !error && <p className="text-sm text-stone-400">Loading…</p>}

      {orders !== null && orders.length === 0 && !error && (
        <p className="text-sm text-stone-400">No orders yet — they'll show up here as customers check out.</p>
      )}

      <div className="space-y-2">
        {orders?.map((o) => (
          <Link
            key={o.orderNumber}
            href={`/admin/send-payment-email/?id=${encodeURIComponent(o.orderNumber)}`}
            className="block bg-[#17191C] border border-[#2B2F36] hover:border-amber-500/40 rounded-2xl p-4 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-amber-400">{o.orderNumber}</span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                      o.status === 'payment-sent'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {o.status === 'payment-sent' ? 'Sent' : 'Pending'}
                  </span>
                </div>
                <p className="text-sm text-stone-200 font-semibold truncate mt-1">{o.customerName}</p>
                <p className="text-xs text-stone-500 truncate">{o.customerEmail}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-mono font-bold text-white">{o.amountDue}</div>
                <div className="text-[10px] text-stone-500 mt-1">{formatDate(o.createdAt)}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/admin/send-payment-email/"
        className="block text-center text-xs font-mono text-stone-400 hover:text-white border border-[#2B2F36] hover:border-stone-600 rounded-xl py-3 transition"
      >
        Compose without an order →
      </Link>
    </div>
  );
}
