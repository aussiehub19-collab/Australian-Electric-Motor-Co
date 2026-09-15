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
  const [deletingId, setDeletingId] = useState('');

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

  const handleDelete = async (orderNumber: string) => {
    if (!passcode) return;
    if (!window.confirm(`Delete order ${orderNumber}? This can't be undone.`)) return;
    setDeletingId(orderNumber);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderNumber)}/`, {
        method: 'DELETE',
        headers: { 'X-Admin-Passcode': passcode },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) => prev?.filter((o) => o.orderNumber !== orderNumber) ?? prev);
      } else {
        if (res.status === 401) lock();
        setError(data?.message || 'Could not delete that order.');
      }
    } catch {
      setError('Could not delete that order.');
    } finally {
      setDeletingId('');
    }
  };

  if (!unlocked) {
    return <PasscodeGate title="Orders" onUnlock={unlock} />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-black uppercase text-white tracking-tight">Orders</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/enquiries/" className="text-xs font-mono text-stone-400 hover:text-white">
            Enquiries →
          </Link>
          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="text-xs font-mono text-amber-400 hover:text-amber-300 disabled:text-stone-600"
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}

      {orders === null && !error && <p className="text-sm text-stone-400">Loading…</p>}

      {orders !== null && orders.length === 0 && !error && (
        <p className="text-sm text-stone-400">No orders yet — they'll show up here as customers check out.</p>
      )}

      <div className="space-y-2">
        {orders?.map((o) => (
          <div
            key={o.orderNumber}
            className="bg-[#17191C] border border-[#2B2F36] hover:border-amber-500/40 rounded-2xl p-4 transition flex items-start gap-2"
          >
            <Link href={`/admin/send-payment-email/?id=${encodeURIComponent(o.orderNumber)}`} className="min-w-0 flex-1">
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
            <button
              type="button"
              onClick={() => handleDelete(o.orderNumber)}
              disabled={deletingId === o.orderNumber}
              title={`Delete order ${o.orderNumber}`}
              aria-label={`Delete order ${o.orderNumber}`}
              className="shrink-0 text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-40 rounded-lg p-2 transition"
            >
              {deletingId === o.orderNumber ? (
                <span className="text-[10px] font-mono">…</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              )}
            </button>
          </div>
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
