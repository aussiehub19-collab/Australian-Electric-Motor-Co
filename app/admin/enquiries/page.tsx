'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useAdminPasscode } from '@/lib/useAdminPasscode';
import { PasscodeGate } from '@/components/admin/PasscodeGate';
import type { StoredEnquiry } from '@/lib/enquiryStore';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('en-AU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const FILTERS = ['all', 'contact', 'wholesale'] as const;
type Filter = (typeof FILTERS)[number];

export default function EnquiriesDashboardPage() {
  const { unlocked, passcode, unlock, lock } = useAdminPasscode();
  const [enquiries, setEnquiries] = useState<StoredEnquiry[] | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState('');

  const fetchEnquiries = useCallback(async () => {
    if (!passcode) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/enquiries/', { headers: { 'X-Admin-Passcode': passcode } });
      const data = await res.json();
      if (res.ok && data.success) {
        setEnquiries(data.enquiries);
      } else {
        if (res.status === 401) lock();
        throw new Error(data?.message || 'Failed to load enquiries');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong loading enquiries.');
    } finally {
      setLoading(false);
    }
  }, [passcode, lock]);

  useEffect(() => {
    if (unlocked) fetchEnquiries();
  }, [unlocked, fetchEnquiries]);

  const handleDelete = async (id: string) => {
    if (!passcode) return;
    if (!window.confirm("Delete this enquiry? This can't be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${encodeURIComponent(id)}/`, {
        method: 'DELETE',
        headers: { 'X-Admin-Passcode': passcode },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEnquiries((prev) => prev?.filter((e) => e.id !== id) ?? prev);
      } else {
        if (res.status === 401) lock();
        setError(data?.message || 'Could not delete that enquiry.');
      }
    } catch {
      setError('Could not delete that enquiry.');
    } finally {
      setDeletingId('');
    }
  };

  const visible = useMemo(
    () => (enquiries ?? []).filter((e) => filter === 'all' || e.type === filter),
    [enquiries, filter],
  );

  if (!unlocked) {
    return <PasscodeGate title="Enquiries" onUnlock={unlock} />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-black uppercase text-white tracking-tight">Enquiries</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/orders/" className="text-xs font-mono text-stone-400 hover:text-white">
            Orders →
          </Link>
          <button
            type="button"
            onClick={fetchEnquiries}
            disabled={loading}
            className="text-xs font-mono text-amber-400 hover:text-amber-300 disabled:text-stone-600"
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="flex gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`text-[10px] font-mono font-bold uppercase px-3 py-1.5 rounded-lg border transition ${
              filter === f
                ? 'bg-[#8C4A2F] border-[#8C4A2F] text-white'
                : 'bg-[#17191C] border-[#2B2F36] text-stone-400 hover:text-stone-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}

      {enquiries === null && !error && <p className="text-sm text-stone-400">Loading…</p>}

      {enquiries !== null && visible.length === 0 && !error && (
        <p className="text-sm text-stone-400">No enquiries yet — contact and wholesale form submissions will show up here.</p>
      )}

      <div className="space-y-2">
        {visible.map((e) => (
          <div
            key={e.id}
            className="bg-[#17191C] border border-[#2B2F36] hover:border-amber-500/40 rounded-2xl p-4 transition flex items-start gap-2"
          >
            <Link href={`/admin/reply-enquiry/?id=${encodeURIComponent(e.id)}`} className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                        e.type === 'wholesale'
                          ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                          : 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                      }`}
                    >
                      {e.type}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                        e.status === 'replied'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {e.status === 'replied' ? 'Replied' : 'New'}
                    </span>
                  </div>
                  <p className="text-sm text-stone-200 font-semibold truncate mt-1">{e.name}</p>
                  <p className="text-xs text-stone-500 truncate">{e.email}</p>
                  <p className="text-xs text-stone-400 truncate mt-1">{e.message}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-stone-500">{formatDate(e.createdAt)}</div>
                </div>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(e.id)}
              disabled={deletingId === e.id}
              title="Delete enquiry"
              aria-label="Delete enquiry"
              className="shrink-0 text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-40 rounded-lg p-2 transition"
            >
              {deletingId === e.id ? (
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
    </div>
  );
}
