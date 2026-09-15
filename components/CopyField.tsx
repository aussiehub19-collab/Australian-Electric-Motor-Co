'use client';

import React, { useState } from 'react';

/** One label/value row with its own copy button — for payment details
 * (account name, BSB, account number, PayID, order reference) where a
 * customer needs to copy each value exactly rather than retype it. */
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
      <span className="flex items-center gap-2 min-w-0">
        <span className="font-bold text-white truncate">{value}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-amber-400 hover:underline font-mono text-[10px] font-bold shrink-0"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </span>
    </div>
  );
}
