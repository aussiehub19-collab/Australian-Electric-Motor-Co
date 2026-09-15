'use client';

import React, { useState } from 'react';

/** One label/value row rendered as a single click-to-copy tag — for payment
 * details (account name, BSB, account number, PayID, order reference) where
 * a customer needs to copy each value exactly rather than retype it. The
 * whole pill is the click target, not just a small "Copy" link beside it. */
export function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-stone-400 shrink-0">{label}:</span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${label}: ${value}`}
        className={`flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-full border font-bold transition min-w-0 ${
          copied
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
            : 'bg-[#141619] border-[#2B2F36] text-white hover:border-amber-500/50 hover:bg-amber-500/10'
        }`}
      >
        <span className="truncate max-w-[150px]">{copied ? 'Copied!' : value}</span>
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 shrink-0">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 shrink-0">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}
