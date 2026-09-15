'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { CONTACT } from '@/src/config/site';
import { buildEmailHtml } from '@/lib/emailTemplate';
import { useAdminPasscode } from '@/lib/useAdminPasscode';
import { PasscodeGate } from '@/components/admin/PasscodeGate';
import type { StoredEnquiry } from '@/lib/enquiryStore';

export default function ReplyEnquiryPage() {
  const { unlocked, passcode, unlock, lock } = useAdminPasscode();

  const [enquiry, setEnquiry] = useState<StoredEnquiry | null>(null);
  const [message, setMessage] = useState('');

  const [loadingEnquiry, setLoadingEnquiry] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!unlocked || !passcode) return;
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) {
      setLoadError('No enquiry selected — open this from the Enquiries dashboard.');
      return;
    }

    let cancelled = false;
    setLoadingEnquiry(true);
    setLoadError('');
    fetch(`/api/admin/enquiries/${encodeURIComponent(id)}/`, { headers: { 'X-Admin-Passcode': passcode } })
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.success) {
          setEnquiry(data.enquiry as StoredEnquiry);
        } else {
          if (res.status === 401) lock();
          setLoadError(data?.message || 'Could not load that enquiry.');
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError('Could not load that enquiry.');
      })
      .finally(() => {
        if (!cancelled) setLoadingEnquiry(false);
      });

    return () => {
      cancelled = true;
    };
  }, [unlocked, passcode, lock]);

  const subjectTopic = enquiry
    ? enquiry.type === 'wholesale'
      ? enquiry.meta['Business & ABN'] || enquiry.name
      : enquiry.meta['Interest'] || 'Your Inquiry'
    : '[subject]';

  const previewHtml = useMemo(
    () =>
      buildEmailHtml({
        heading: `Re: ${subjectTopic}`,
        intro: `Hi ${enquiry?.name || '[customer name]'},`,
        rows: [
          { label: 'Reply', value: message || '[your reply]' },
          { label: 'Your Original Message', value: enquiry?.message || '' },
        ],
        replyTo: CONTACT.email,
        ctaLabel: 'Reply to This Email →',
        ctaHref: `mailto:${CONTACT.email}`,
      }),
    [subjectTopic, enquiry, message],
  );

  const formValid = !!enquiry && !!message.trim();

  const handleSend = async () => {
    if (!enquiry || !formValid) {
      setError('Write a reply before sending.');
      return;
    }
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/admin/reply-enquiry/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Passcode': passcode },
        body: JSON.stringify({ id: enquiry.id, message }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('sent');
      } else {
        if (res.status === 401) lock();
        throw new Error(data?.message || 'Send failed');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong sending the reply.');
      setStatus('idle');
    }
  };

  const labelClass = 'block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5 font-mono';
  const inputClass =
    'w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500 focus:border-amber-500';

  if (!unlocked) {
    return <PasscodeGate title="Reply to Enquiry" onUnlock={unlock} />;
  }

  if (status === 'sent' && enquiry) {
    return (
      <div className="max-w-sm mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl">✓</div>
        <h1 className="text-lg font-bold text-white">Sent to {enquiry.email}</h1>
        <p className="text-xs text-stone-400">Your reply to {enquiry.name} is on its way.</p>
        <div className="flex flex-col gap-2 pt-2">
          <Link href="/admin/enquiries/" className="bg-[#8C4A2F] hover:bg-[#A35839] text-white font-bold py-3 px-6 rounded-xl text-sm transition inline-block">
            ← Back to Enquiries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <Link href="/admin/enquiries/" className="text-xs font-mono text-stone-400 hover:text-white inline-block">
        ← All Enquiries
      </Link>
      <h1 className="text-2xl font-black uppercase text-white tracking-tight">Reply to Enquiry</h1>
      <p className="text-xs text-stone-400">{loadingEnquiry ? 'Loading enquiry…' : 'Review their message, write your reply, then send.'}</p>
      {loadError && <p className="text-xs text-rose-400 font-semibold">{loadError}</p>}

      {enquiry && (
        <div className="bg-[#17191C] border border-[#2B2F36] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                enquiry.type === 'wholesale'
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                  : 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
              }`}
            >
              {enquiry.type}
            </span>
            <span className="text-sm font-bold text-white">{enquiry.name}</span>
          </div>
          <div className="text-xs text-stone-400 space-y-0.5">
            <p>{enquiry.email}</p>
            {enquiry.phone && <p>{enquiry.phone}</p>}
            {Object.entries(enquiry.meta)
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <p key={k}>
                  <span className="text-stone-500">{k}:</span> {v}
                </p>
              ))}
          </div>
          {enquiry.message && (
            <div className="bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1">Their Message</p>
              <p className="text-sm text-stone-200 whitespace-pre-wrap">{enquiry.message}</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-[#17191C] border border-[#2B2F36] rounded-2xl p-5 space-y-4">
        <div>
          <label className={labelClass}>Your Reply *</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={7}
            placeholder="Type your reply here — it's sent as a branded email, with their original message quoted underneath for context."
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono mb-2">Preview</h2>
        <div className="border border-[#2B2F36] rounded-2xl overflow-hidden bg-white">
          <iframe title="Email preview" srcDoc={previewHtml} className="w-full" style={{ height: 560, border: 0 }} />
        </div>
      </div>

      {error && <p className="text-xs text-rose-400 font-semibold text-center">{error}</p>}

      <button
        type="button"
        onClick={handleSend}
        disabled={status === 'sending' || !formValid}
        className={`w-full py-4 rounded-xl text-sm font-bold transition ${
          formValid ? 'bg-[#8C4A2F] hover:bg-[#A35839] text-white' : 'bg-[#8C4A2F]/40 text-white/60 cursor-not-allowed'
        }`}
      >
        {status === 'sending' ? 'Sending…' : `Send to ${enquiry?.email || 'customer'}`}
      </button>
    </div>
  );
}
